import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
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

/** Új seed tételek + hiányzó mezők (pl. extraGroup) frissítése meglévő katalógusban. */
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
    // Kiegészítő csoport mező pótlása / frissítése seedből
    if (item.extraGroup && existing.extraGroup !== item.extraGroup) {
      existing.extraGroup = item.extraGroup;
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
