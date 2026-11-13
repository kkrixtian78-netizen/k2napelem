import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { buyFromBvfGross } from './pricing';
import { bvfSyncTargets } from './heating-catalog';
import { onlinevillIdBySlug, onlinevillSyncLeaves } from './onlinevill-catalog';
import { applySupplierPriceUpdates, priceSyncDue, syncMonth, type SupplierPriceUpdate } from './price-sync-logic';
import { parseBvfSimplePrice, parseBvfVariationPrices, parseOnlinevillPage } from './supplier-prices';
import { SEED_CATALOG } from './seed';
import { readStore, writeStore } from './store';
import type { PriceSyncInfo } from './types';

const USER_AGENT = 'K2NapelemQuoteApp/1.0 (internal price sync; k2@k2napelem.hu)';
const LOCK_PATH = join(process.cwd(), 'data', 'arajanlat', 'price-sync.lock');
let running = false;

function lockHeld(): boolean {
  if (!existsSync(LOCK_PATH)) return false;
  const started = Number(readFileSync(LOCK_PATH, 'utf8'));
  return Number.isFinite(started) && Date.now() - started < 20 * 60 * 1000;
}

function takeLock(): boolean {
  if (running || lockHeld()) return false;
  running = true;
  mkdirSync(dirname(LOCK_PATH), { recursive: true });
  writeFileSync(LOCK_PATH, String(Date.now()), 'utf8');
  return true;
}

function releaseLock() {
  running = false;
  rmSync(LOCK_PATH, { force: true });
}

async function fetchText(url: string): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25_000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/json' },
    });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function mapPool<T>(items: T[], limit: number, task: (item: T) => Promise<void>) {
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      if (current !== undefined) await task(current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
}

async function collectBvfUpdates(): Promise<{ updates: SupplierPriceUpdate[]; failed: number; pages: number }> {
  const targets = bvfSyncTargets();
  const updates: SupplierPriceUpdate[] = [];
  let failed = 0;
  await mapPool(targets.hrefs, 3, async (href) => {
    try {
      const html = await fetchText(href);
      const variations = parseBvfVariationPrices(html);
      if (variations.size > 0) {
        for (const [variationId, gross] of variations) {
          const id = targets.variationToId.get(variationId);
          if (!id) continue;
          updates.push({ id, buyPrice: buyFromBvfGross(gross), bvfGross: gross });
        }
        return;
      }
      const simple = parseBvfSimplePrice(html);
      if (!simple) return;
      for (const id of targets.simpleByHref.get(href) ?? []) {
        updates.push({ id, buyPrice: buyFromBvfGross(simple), bvfGross: simple });
      }
    } catch (error) {
      failed += 1;
      console.warn('[árfrissítés] BVF oldal kihagyva:', href, error instanceof Error ? error.message : error);
    }
  });
  return { updates, failed, pages: targets.hrefs.length };
}

async function collectVillanyUpdates(): Promise<{ updates: SupplierPriceUpdate[]; failed: number; pages: number }> {
  const idBySlug = onlinevillIdBySlug();
  const updates: SupplierPriceUpdate[] = [];
  let failed = 0;
  let pages = 0;
  for (const leaf of onlinevillSyncLeaves()) {
    let page = 1;
    let maxPage = 1;
    while (page <= maxPage && page <= 40) {
      const url = `https://www.onlinevill.hu/termekkategoria/${leaf}?page=${page}`;
      pages += 1;
      try {
        const html = await fetchText(url);
        const parsed = parseOnlinevillPage(html);
        maxPage = Math.max(maxPage, parsed.maxPage);
        if (parsed.prices.size === 0) break;
        for (const [slug, price] of parsed.prices) {
          const id = idBySlug.get(slug);
          if (id) updates.push({ id, buyPrice: price });
        }
      } catch (error) {
        failed += 1;
        console.warn('[árfrissítés] Onlinevill oldal kihagyva:', url, error instanceof Error ? error.message : error);
        break;
      }
      page += 1;
    }
  }
  return { updates, failed, pages };
}

export async function runMonthlyPriceSyncIfDue(now = new Date()): Promise<PriceSyncInfo | null> {
  const store = readStore();
  if (!priceSyncDue(store.priceSync?.month, now)) return store.priceSync ?? null;
  if (!takeLock()) return store.priceSync ?? null;
  console.log(`[árfrissítés] BVF és Onlinevill árak ellenőrzése (${syncMonth(now)})…`);
  try {
    const [bvf, villany] = await Promise.all([collectBvfUpdates(), collectVillanyUpdates()]);
    const bvfOk = bvf.pages > 0 && bvf.failed / bvf.pages < 0.25 && bvf.updates.length >= 50;
    const villanyOk = villany.pages > 0 && villany.failed / villany.pages < 0.25 && villany.updates.length >= 500;
    const fresh = readStore();
    const seedById = new Map(
      SEED_CATALOG.map((item) => [item.id, { buyPrice: item.buyPrice, bvfGross: item.bvfGross }]),
    );
    const applied = applySupplierPriceUpdates(fresh.catalog, seedById, [...bvf.updates, ...villany.updates], {
      lockSeedDivergence: !fresh.priceSync?.month,
    });
    const info: PriceSyncInfo = {
      at: new Date().toISOString(),
      bvfUpdated: bvf.updates.length,
      villanyUpdated: villany.updates.length,
      preserved: applied.preserved,
      status: bvfOk && villanyOk ? 'ok' : 'error',
      message:
        bvfOk && villanyOk
          ? `BVF ár beolvasva: ${bvf.updates.length}. Onlinevill ár beolvasva: ${villany.updates.length}. Megváltozott tétel: ${applied.updated}. Kézi ár kihagyva: ${applied.preserved}.`
          : 'A boltok egy része nem válaszolt, a következő indításkor újra próbáljuk.',
    };
    if (bvfOk && villanyOk) info.month = syncMonth(now);
    fresh.priceSync = info;
    writeStore(fresh);
    console.log(`[árfrissítés] ${info.message}`);
    return info;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Árfrissítési hiba';
    console.warn('[árfrissítés]', message);
    const fresh = readStore();
    fresh.priceSync = { ...fresh.priceSync, at: new Date().toISOString(), status: 'error', message };
    writeStore(fresh);
    return fresh.priceSync;
  } finally {
    releaseLock();
  }
}
