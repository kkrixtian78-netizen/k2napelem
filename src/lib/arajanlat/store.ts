import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { LEGACY_HEATING_MAIN_IDS } from './heating-catalog';
import { SEED_CATALOG } from './seed';
import type { CatalogItem, Quote, QuoteStore } from './types';

const DATA_DIR = join(process.cwd(), 'data', 'arajanlat');
const STORE_PATH = join(DATA_DIR, 'store.json');

/** Serverless (Vercel) fallback — process lifetime only. */
let memoryStore: QuoteStore | null = null;
let preferMemory = false;

function emptyStore(): QuoteStore {
  return {
    version: 1,
    catalog: structuredClone(SEED_CATALOG),
    quotes: [],
    nextQuoteSeq: 1,
  };
}

function atomicWrite(path: string, data: QuoteStore) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  renameSync(tmp, path);
}

/** Új seed tételek + auto-BOM / rendszer tételek névfrissítése. */
function mergeMissingSeedItems(store: QuoteStore): boolean {
  const byId = new Map(store.catalog.map((c) => [c.id, c]));
  let changed = false;
  for (const item of SEED_CATALOG) {
    const existing = byId.get(item.id);
    if (!existing) {
      store.catalog.push(structuredClone(item));
      changed = true;
      continue;
    }
    if (item.extraGroup && existing.extraGroup !== item.extraGroup) {
      existing.extraGroup = item.extraGroup;
      changed = true;
    }
    if (item.heatGroup && existing.heatGroup !== item.heatGroup) {
      existing.heatGroup = item.heatGroup;
      changed = true;
    }
    if (
      typeof item.bvfGross === 'number' &&
      existing.bvfGross !== item.bvfGross
    ) {
      existing.bvfGross = item.bvfGross;
      changed = true;
    }
    if (existing.sellPriceFixed !== item.sellPriceFixed && item.topic !== 'napelem') {
      existing.sellPriceFixed = item.sellPriceFixed;
      changed = true;
    }
    // BVF / szerelés fűtés főanyagok: név / ár / csoport frissítése a seedhez
    if (item.topic === 'futes' && item.heatGroup && item.selectable !== false) {
      if (existing.name !== item.name) {
        existing.name = item.name;
        changed = true;
      }
      if (existing.buyPrice !== item.buyPrice) {
        existing.buyPrice = item.buyPrice;
        changed = true;
      }
      if (existing.active !== item.active) {
        existing.active = item.active;
        changed = true;
      }
      if (existing.category !== item.category) {
        existing.category = item.category;
        changed = true;
      }
      if (existing.selectable !== item.selectable) {
        existing.selectable = item.selectable;
        changed = true;
      }
    }
    // Automatikus tételek neve / ára a seedhez igazodik
    // A napelemes Excel-tételek árát a felhasználó szerkesztheti, azt nem írjuk vissza.
    if (item.selectable === false && item.topic !== 'napelem') {
      if (existing.name !== item.name) {
        existing.name = item.name;
        changed = true;
      }
      if (existing.buyPrice !== item.buyPrice) {
        existing.buyPrice = item.buyPrice;
        changed = true;
      }
      if (existing.active !== item.active) {
        existing.active = item.active;
        changed = true;
      }
    }
  }
  // Régi tételek kikapcsolása
  for (const id of [
    'opt-kiszallas',
    'prot-dc-spd',
    'prot-ac-spd',
    'prot-dc-breaker',
    'prot-ac-breaker',
    'box-ac',
    'conn-mc4',
    ...LEGACY_HEATING_MAIN_IDS,
    'f-labor-padlo',
  ]) {
    const legacy = byId.get(id);
    if (legacy && legacy.active) {
      legacy.active = false;
      legacy.selectable = false;
      changed = true;
    }
  }
  const legacySolarIds = new Set([
    'panel-cs-hiku6-420',
    'panel-astro-515',
    'panel-ja-570',
    'inv-deye-5k',
    'inv-deye-8k',
    'inv-deye-10k',
    'inv-huawei-6k',
    'bat-none',
    'bat-deye-5',
    'bat-deye-12',
    'roof-cserep',
    'roof-lemezes',
    'roof-lapos',
    'roof-fold',
    'mount-cserep-set',
    'mount-lemez-set',
    'mount-lapos-set',
    'mount-fold-set',
    'cable-dc-6',
    'cable-ac-5x6',
    'prot-dc-box',
    'prot-ac-box',
    'cons-villany-misc',
    'cons-solar-misc',
    'labor-solar-panel',
    'labor-solar-inv',
    'labor-solar-bat',
    'labor-solar-comm',
    'opt-optimizer',
    'opt-visszwatt',
    'opt-tuzvedelmi',
    'opt-tervezes',
    'opt-hozott-jutalek',
  ]);
  const beforeSolar = store.catalog.length;
  store.catalog = store.catalog.filter((item) => !legacySolarIds.has(item.id));
  if (store.catalog.length !== beforeSolar) changed = true;

  // Elavult BVF fűtés főanyagok (régi, variáns nélküli / kiesett slugok)
  const seedHeatIds = new Set(
    SEED_CATALOG.filter((c) => c.topic === 'futes' && c.heatGroup).map((c) => c.id),
  );
  for (const item of store.catalog) {
    if (
      item.active &&
      item.topic === 'futes' &&
      item.heatGroup &&
      item.selectable !== false &&
      !seedHeatIds.has(item.id)
    ) {
      item.active = false;
      item.selectable = false;
      changed = true;
    }
  }
  return changed;
}

function ensureStore(): QuoteStore {
  if (preferMemory) {
    if (!memoryStore) memoryStore = emptyStore();
    else if (mergeMissingSeedItems(memoryStore)) {
      /* keep memory */
    }
    return memoryStore;
  }

  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!existsSync(STORE_PATH)) {
      const seed = emptyStore();
      atomicWrite(STORE_PATH, seed);
      memoryStore = seed;
      return seed;
    }
    const raw = readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as QuoteStore;
    if (!parsed.catalog?.length) {
      parsed.catalog = structuredClone(SEED_CATALOG);
      atomicWrite(STORE_PATH, parsed);
    } else if (mergeMissingSeedItems(parsed)) {
      atomicWrite(STORE_PATH, parsed);
    }
    memoryStore = parsed;
    return parsed;
  } catch {
    // Read-only / serverless filesystem — keep working in memory.
    preferMemory = true;
    if (!memoryStore) memoryStore = emptyStore();
    else mergeMissingSeedItems(memoryStore);
    return memoryStore;
  }
}

export function readStore(): QuoteStore {
  return ensureStore();
}

export function writeStore(store: QuoteStore) {
  memoryStore = store;
  if (preferMemory) return;
  try {
    atomicWrite(STORE_PATH, store);
  } catch {
    preferMemory = true;
  }
}

export function listCatalog(): CatalogItem[] {
  return readStore().catalog;
}

export function upsertCatalogItem(item: CatalogItem): CatalogItem {
  const store = readStore();
  const idx = store.catalog.findIndex((c) => c.id === item.id);
  if (idx >= 0) store.catalog[idx] = item;
  else store.catalog.push(item);
  writeStore(store);
  return item;
}

export function deleteCatalogItem(id: string): boolean {
  const store = readStore();
  const before = store.catalog.length;
  store.catalog = store.catalog.filter((c) => c.id !== id);
  writeStore(store);
  return store.catalog.length < before;
}

export function resetCatalogFromSeed(): CatalogItem[] {
  const store = readStore();
  store.catalog = structuredClone(SEED_CATALOG);
  writeStore(store);
  return store.catalog;
}

export function listQuotes(): Quote[] {
  return readStore().quotes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getQuote(id: string): Quote | undefined {
  return readStore().quotes.find((q) => q.id === id);
}

export function saveQuote(quote: Omit<Quote, 'id' | 'number' | 'createdAt' | 'updatedAt'> & { id?: string }): Quote {
  const store = readStore();
  const now = new Date().toISOString();

  if (quote.id) {
    const idx = store.quotes.findIndex((q) => q.id === quote.id);
    if (idx < 0) throw new Error('Ajánlat nem található');
    const existing = store.quotes[idx]!;
    const updated: Quote = {
      ...existing,
      ...quote,
      id: existing.id,
      number: existing.number,
      createdAt: existing.createdAt,
      updatedAt: now,
    };
    store.quotes[idx] = updated;
    writeStore(store);
    return updated;
  }

  const seq = store.nextQuoteSeq++;
  const year = new Date().getFullYear();
  const created: Quote = {
    ...quote,
    id: crypto.randomUUID(),
    number: `K2-${year}-${String(seq).padStart(4, '0')}`,
    createdAt: now,
    updatedAt: now,
  };
  store.quotes.unshift(created);
  writeStore(store);
  return created;
}

export function deleteQuote(id: string): boolean {
  const store = readStore();
  const before = store.quotes.length;
  store.quotes = store.quotes.filter((q) => q.id !== id);
  writeStore(store);
  return store.quotes.length < before;
}

export function storePath(): string {
  return preferMemory ? '(memory)' : STORE_PATH;
}
