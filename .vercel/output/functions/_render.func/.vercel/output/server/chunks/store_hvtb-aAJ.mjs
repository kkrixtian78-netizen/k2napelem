import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
// src/lib/arajanlat/seed.ts
/** Realisztikus induló katalógus — magyar megnevezések, nettó beszerzési árak (Ft). */
var SEED_CATALOG = [
	{
		id: "panel-cs-hiku6-420",
		name: "Canadian Solar HiKu6 420 W mono panel",
		topic: "napelem",
		category: "panel",
		unit: "db",
		buyPrice: 38500,
		selectable: true,
		active: true,
		notes: "Főanyag — panel típus"
	},
	{
		id: "panel-astro-515",
		name: "Astronergy CHSM54N-HC 515 W panel",
		topic: "napelem",
		category: "panel",
		unit: "db",
		buyPrice: 44200,
		selectable: true,
		active: true
	},
	{
		id: "panel-ja-570",
		name: "JA Solar JAM72S30 570 W panel",
		topic: "napelem",
		category: "panel",
		unit: "db",
		buyPrice: 49800,
		selectable: true,
		active: true
	},
	{
		id: "inv-deye-5k",
		name: "Deye SUN-5K-SG06LP3-EU hibrid inverter 5 kW",
		topic: "napelem",
		category: "inverter",
		unit: "db",
		buyPrice: 485e3,
		selectable: true,
		active: true
	},
	{
		id: "inv-deye-8k",
		name: "Deye SUN-8K-SG05LP3-EU hibrid inverter 8 kW",
		topic: "napelem",
		category: "inverter",
		unit: "db",
		buyPrice: 62e4,
		selectable: true,
		active: true
	},
	{
		id: "inv-deye-10k",
		name: "Deye SUN-10K-SG05LP3-SM2 hibrid inverter 10 kW",
		topic: "napelem",
		category: "inverter",
		unit: "db",
		buyPrice: 745e3,
		selectable: true,
		active: true
	},
	{
		id: "inv-huawei-6k",
		name: "Huawei SUN2000-6KTL-L1 string inverter 6 kW",
		topic: "napelem",
		category: "inverter",
		unit: "db",
		buyPrice: 312e3,
		selectable: true,
		active: true
	},
	{
		id: "bat-none",
		name: "Energiatároló nélkül",
		topic: "napelem",
		category: "tarolo",
		unit: "db",
		buyPrice: 0,
		selectable: true,
		active: true,
		notes: "Választási opció — nincs akkumulátor"
	},
	{
		id: "bat-deye-5",
		name: "Deye SE-G5.1 Pro akkumulátor 5,1 kWh",
		topic: "napelem",
		category: "tarolo",
		unit: "db",
		buyPrice: 68e4,
		selectable: true,
		active: true
	},
	{
		id: "bat-deye-12",
		name: "Deye SE-F12 akkumulátor 12,2 kWh",
		topic: "napelem",
		category: "tarolo",
		unit: "db",
		buyPrice: 145e4,
		selectable: true,
		active: true
	},
	{
		id: "roof-cserep",
		name: "Cseréptető (hornyolt / beton)",
		topic: "napelem",
		category: "tetotipus",
		unit: "rendszer",
		buyPrice: 0,
		selectable: true,
		active: true,
		notes: "Tetőfelület típus — tartószerkezet BOM választó"
	},
	{
		id: "roof-lemezes",
		name: "Lemeztető (trapéz / cserepeslemez)",
		topic: "napelem",
		category: "tetotipus",
		unit: "rendszer",
		buyPrice: 0,
		selectable: true,
		active: true
	},
	{
		id: "roof-lapos",
		name: "Lapostető (ballasztos / dőltszög)",
		topic: "napelem",
		category: "tetotipus",
		unit: "rendszer",
		buyPrice: 0,
		selectable: true,
		active: true
	},
	{
		id: "roof-fold",
		name: "Földtelepítés (cölöp / TreeSystem)",
		topic: "napelem",
		category: "tetotipus",
		unit: "rendszer",
		buyPrice: 0,
		selectable: true,
		active: true
	},
	{
		id: "mount-cserep-set",
		name: "Cseréptető tartószerkezet készlet (sín + kampó)",
		topic: "napelem",
		category: "tartoszerkezet",
		unit: "panel",
		buyPrice: 6200,
		selectable: false,
		active: true
	},
	{
		id: "mount-lemez-set",
		name: "Lemeztető tartószerkezet készlet (sín + bilincs)",
		topic: "napelem",
		category: "tartoszerkezet",
		unit: "panel",
		buyPrice: 5400,
		selectable: false,
		active: true
	},
	{
		id: "mount-lapos-set",
		name: "Lapostető ballasztos tartószerkezet",
		topic: "napelem",
		category: "tartoszerkezet",
		unit: "panel",
		buyPrice: 9800,
		selectable: false,
		active: true
	},
	{
		id: "mount-fold-set",
		name: "Földi tartószerkezet (cölöp + sín)",
		topic: "napelem",
		category: "tartoszerkezet",
		unit: "panel",
		buyPrice: 11200,
		selectable: false,
		active: true
	},
	{
		id: "cable-dc-6",
		name: "DC napelem kábel 6 mm² (fekete/piros)",
		topic: "napelem",
		category: "kabel",
		unit: "m",
		buyPrice: 420,
		selectable: false,
		active: true
	},
	{
		id: "cable-ac-5x6",
		name: "AC kábel 5×6 mm² (inverter–elosztó)",
		topic: "napelem",
		category: "kabel",
		unit: "m",
		buyPrice: 980,
		selectable: false,
		active: true
	},
	{
		id: "conn-mc4",
		name: "MC4 csatlakozó pár",
		topic: "napelem",
		category: "csatlakozo",
		unit: "pár",
		buyPrice: 650,
		selectable: false,
		active: true
	},
	{
		id: "prot-dc-spd",
		name: "DC túlfeszültség-védelem (SPD T2)",
		topic: "napelem",
		category: "vedelem",
		unit: "db",
		buyPrice: 18500,
		selectable: false,
		active: true
	},
	{
		id: "prot-ac-spd",
		name: "AC túlfeszültség-védelem (SPD T2)",
		topic: "napelem",
		category: "vedelem",
		unit: "db",
		buyPrice: 16200,
		selectable: false,
		active: true
	},
	{
		id: "prot-dc-breaker",
		name: "DC megszakító / string biztosíték",
		topic: "napelem",
		category: "vedelem",
		unit: "db",
		buyPrice: 9800,
		selectable: false,
		active: true
	},
	{
		id: "prot-ac-breaker",
		name: "AC kismegszakító + FI-relé készlet",
		topic: "napelem",
		category: "vedelem",
		unit: "készlet",
		buyPrice: 22400,
		selectable: false,
		active: true
	},
	{
		id: "box-ac",
		name: "AC csatlakozó szekrény / elosztó",
		topic: "napelem",
		category: "egyeb",
		unit: "db",
		buyPrice: 28500,
		selectable: false,
		active: true
	},
	{
		id: "cons-solar-misc",
		name: "Napelem fogyóanyag csomag (csavar, tömítés, kábelkötöző)",
		topic: "napelem",
		category: "fogyocikk",
		unit: "készlet",
		buyPrice: 12e3,
		selectable: false,
		active: true
	},
	{
		id: "labor-solar-panel",
		name: "Szerelési munkadíj — panel",
		topic: "napelem",
		category: "munkadij",
		unit: "panel",
		buyPrice: 8500,
		selectable: false,
		active: true
	},
	{
		id: "labor-solar-inv",
		name: "Szerelési munkadíj — inverter + AC oldal",
		topic: "napelem",
		category: "munkadij",
		unit: "db",
		buyPrice: 95e3,
		selectable: false,
		active: true
	},
	{
		id: "labor-solar-bat",
		name: "Szerelési munkadíj — energiatároló",
		topic: "napelem",
		category: "munkadij",
		unit: "db",
		buyPrice: 45e3,
		selectable: false,
		active: true
	},
	{
		id: "labor-solar-comm",
		name: "Ügyintézés, bejelentés, készre jelentés",
		topic: "napelem",
		category: "munkadij",
		unit: "db",
		buyPrice: 65e3,
		selectable: false,
		active: true
	},
	{
		id: "v-kazetta",
		name: "Mérőhely / kazetta felújítás (anyag)",
		topic: "villany",
		category: "foanyag",
		unit: "db",
		buyPrice: 85e3,
		selectable: true,
		active: true
	},
	{
		id: "v-eloszto-24",
		name: "Lakáselosztó 24 modul",
		topic: "villany",
		category: "foanyag",
		unit: "db",
		buyPrice: 42e3,
		selectable: true,
		active: true
	},
	{
		id: "v-eloszto-36",
		name: "Lakáselosztó 36 modul",
		topic: "villany",
		category: "foanyag",
		unit: "db",
		buyPrice: 58e3,
		selectable: true,
		active: true
	},
	{
		id: "v-vezetek-3x15",
		name: "NYM-J 3×1,5 mm² vezeték",
		topic: "villany",
		category: "foanyag",
		unit: "m",
		buyPrice: 280,
		selectable: true,
		active: true
	},
	{
		id: "v-vezetek-3x25",
		name: "NYM-J 3×2,5 mm² vezeték",
		topic: "villany",
		category: "foanyag",
		unit: "m",
		buyPrice: 420,
		selectable: true,
		active: true
	},
	{
		id: "v-vezetek-5x25",
		name: "NYM-J 5×2,5 mm² vezeték",
		topic: "villany",
		category: "foanyag",
		unit: "m",
		buyPrice: 680,
		selectable: true,
		active: true
	},
	{
		id: "v-kapcsolo-csalad",
		name: "Kapcsoló / dugalj készlet (Legrand / Schneider jellegű)",
		topic: "villany",
		category: "foanyag",
		unit: "db",
		buyPrice: 1850,
		selectable: true,
		active: true
	},
	{
		id: "v-led-panel",
		name: "LED panel / lámpatest szereléshez",
		topic: "villany",
		category: "foanyag",
		unit: "db",
		buyPrice: 6500,
		selectable: true,
		active: true
	},
	{
		id: "v-fi-rele",
		name: "FI-relé 40 A / 30 mA",
		topic: "villany",
		category: "foanyag",
		unit: "db",
		buyPrice: 12500,
		selectable: true,
		active: true
	},
	{
		id: "v-kismegszakito",
		name: "Kismegszakító B16 / B20",
		topic: "villany",
		category: "foanyag",
		unit: "db",
		buyPrice: 2200,
		selectable: true,
		active: true
	},
	{
		id: "v-auto-doboz",
		name: "Szerelvénydoboz / kötődoboz",
		topic: "villany",
		category: "fogyocikk",
		unit: "db",
		buyPrice: 180,
		selectable: false,
		active: true
	},
	{
		id: "v-auto-szigetelo",
		name: "Szigetelőszalag + WAGO / érvéghüvely csomag",
		topic: "villany",
		category: "fogyocikk",
		unit: "készlet",
		buyPrice: 4500,
		selectable: false,
		active: true
	},
	{
		id: "v-auto-csatorna",
		name: "Kábelcsatorna / védőcső (átlag)",
		topic: "villany",
		category: "fogyocikk",
		unit: "m",
		buyPrice: 320,
		selectable: false,
		active: true
	},
	{
		id: "v-labor-pont",
		name: "Villanyszerelői munkadíj — pont",
		topic: "villany",
		category: "munkadij",
		unit: "pont",
		buyPrice: 4500,
		selectable: false,
		active: true
	},
	{
		id: "v-labor-eloszto",
		name: "Villanyszerelői munkadíj — elosztó / mérőhely",
		topic: "villany",
		category: "munkadij",
		unit: "db",
		buyPrice: 55e3,
		selectable: false,
		active: true
	},
	{
		id: "f-bvf-ng-300",
		name: "BVF NG infrapanel 300 W",
		topic: "futes",
		category: "foanyag",
		unit: "db",
		buyPrice: 35600,
		selectable: true,
		active: true
	},
	{
		id: "f-bvf-ng-450",
		name: "BVF NG infrapanel 450 W",
		topic: "futes",
		category: "foanyag",
		unit: "db",
		buyPrice: 47280,
		selectable: true,
		active: true
	},
	{
		id: "f-bvf-ng-600",
		name: "BVF NG infrapanel 600 W",
		topic: "futes",
		category: "foanyag",
		unit: "db",
		buyPrice: 57600,
		selectable: true,
		active: true
	},
	{
		id: "f-bvf-hmat-100",
		name: "BVF H-MAT fűtőszőnyeg 100 W/m²",
		topic: "futes",
		category: "foanyag",
		unit: "m²",
		buyPrice: 9800,
		selectable: true,
		active: true
	},
	{
		id: "f-bvf-hmat-150",
		name: "BVF H-MAT fűtőszőnyeg 150 W/m²",
		topic: "futes",
		category: "foanyag",
		unit: "m²",
		buyPrice: 11200,
		selectable: true,
		active: true
	},
	{
		id: "f-bvf-wfd",
		name: "BVF WFD fűtőkábel 10 W/m",
		topic: "futes",
		category: "foanyag",
		unit: "m",
		buyPrice: 890,
		selectable: true,
		active: true
	},
	{
		id: "f-intuis-tactic",
		name: "Intuis Tactic elektromos konvektor",
		topic: "futes",
		category: "foanyag",
		unit: "db",
		buyPrice: 68500,
		selectable: true,
		active: true
	},
	{
		id: "f-intuis-ezybain",
		name: "Intuis Ezybain törölközőszárító 500 W",
		topic: "futes",
		category: "foanyag",
		unit: "db",
		buyPrice: 74200,
		selectable: true,
		active: true
	},
	{
		id: "f-termosztat",
		name: "Digitális termosztát / szobatermosztát",
		topic: "futes",
		category: "foanyag",
		unit: "db",
		buyPrice: 18500,
		selectable: true,
		active: true
	},
	{
		id: "f-auto-tarto",
		name: "Infrapanel tartókonzol / rögzítőkészlet",
		topic: "futes",
		category: "fogyocikk",
		unit: "db",
		buyPrice: 3200,
		selectable: false,
		active: true
	},
	{
		id: "f-auto-kabel",
		name: "Fűtés tápkábel 3×2,5 mm²",
		topic: "futes",
		category: "kabel",
		unit: "m",
		buyPrice: 420,
		selectable: false,
		active: true
	},
	{
		id: "f-auto-vedelem",
		name: "Kismegszakító fűtési körhöz",
		topic: "futes",
		category: "vedelem",
		unit: "db",
		buyPrice: 2400,
		selectable: false,
		active: true
	},
	{
		id: "f-auto-fogyo",
		name: "Fűtés fogyóanyag (dugó, doboz, szigetelés)",
		topic: "futes",
		category: "fogyocikk",
		unit: "készlet",
		buyPrice: 5500,
		selectable: false,
		active: true
	},
	{
		id: "f-labor-panel",
		name: "Szerelési munkadíj — infrapanel / konvektor",
		topic: "futes",
		category: "munkadij",
		unit: "db",
		buyPrice: 12e3,
		selectable: false,
		active: true
	},
	{
		id: "f-labor-padlo",
		name: "Szerelési munkadíj — padlófűtés / fűtőkábel",
		topic: "futes",
		category: "munkadij",
		unit: "m²",
		buyPrice: 4500,
		selectable: false,
		active: true
	}
];
var ROOF_MOUNT_MAP = {
	"roof-cserep": "mount-cserep-set",
	"roof-lemezes": "mount-lemez-set",
	"roof-lapos": "mount-lapos-set",
	"roof-fold": "mount-fold-set"
};
// src/lib/arajanlat/store.ts
var DATA_DIR = join(process.cwd(), "data", "arajanlat");
var STORE_PATH = join(DATA_DIR, "store.json");
/** Serverless (Vercel) fallback — process lifetime only. */
var memoryStore = null;
var preferMemory = false;
function emptyStore() {
	return {
		version: 1,
		catalog: structuredClone(SEED_CATALOG),
		quotes: [],
		nextQuoteSeq: 1
	};
}
function atomicWrite(path, data) {
	mkdirSync(dirname(path), { recursive: true });
	const tmp = `${path}.tmp`;
	writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
	renameSync(tmp, path);
}
function ensureStore() {
	if (preferMemory) {
		if (!memoryStore) memoryStore = emptyStore();
		return memoryStore;
	}
	try {
		if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
		if (!existsSync(STORE_PATH)) {
			const seed = emptyStore();
			atomicWrite(STORE_PATH, seed);
			memoryStore = seed;
			return seed;
		}
		const raw = readFileSync(STORE_PATH, "utf8");
		const parsed = JSON.parse(raw);
		if (!parsed.catalog?.length) {
			parsed.catalog = structuredClone(SEED_CATALOG);
			atomicWrite(STORE_PATH, parsed);
		}
		memoryStore = parsed;
		return parsed;
	} catch {
		preferMemory = true;
		if (!memoryStore) memoryStore = emptyStore();
		return memoryStore;
	}
}
function readStore() {
	return ensureStore();
}
function writeStore(store) {
	memoryStore = store;
	if (preferMemory) return;
	try {
		atomicWrite(STORE_PATH, store);
	} catch {
		preferMemory = true;
	}
}
function listCatalog() {
	return readStore().catalog;
}
function upsertCatalogItem(item) {
	const store = readStore();
	const idx = store.catalog.findIndex((c) => c.id === item.id);
	if (idx >= 0) store.catalog[idx] = item;
	else store.catalog.push(item);
	writeStore(store);
	return item;
}
function deleteCatalogItem(id) {
	const store = readStore();
	const before = store.catalog.length;
	store.catalog = store.catalog.filter((c) => c.id !== id);
	writeStore(store);
	return store.catalog.length < before;
}
function resetCatalogFromSeed() {
	const store = readStore();
	store.catalog = structuredClone(SEED_CATALOG);
	writeStore(store);
	return store.catalog;
}
function listQuotes() {
	return readStore().quotes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
function getQuote(id) {
	return readStore().quotes.find((q) => q.id === id);
}
function saveQuote(quote) {
	const store = readStore();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	if (quote.id) {
		const idx = store.quotes.findIndex((q) => q.id === quote.id);
		if (idx < 0) throw new Error("Ajánlat nem található");
		const existing = store.quotes[idx];
		const updated = {
			...existing,
			...quote,
			id: existing.id,
			number: existing.number,
			createdAt: existing.createdAt,
			updatedAt: now
		};
		store.quotes[idx] = updated;
		writeStore(store);
		return updated;
	}
	const seq = store.nextQuoteSeq++;
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const created = {
		...quote,
		id: crypto.randomUUID(),
		number: `K2-${year}-${String(seq).padStart(4, "0")}`,
		createdAt: now,
		updatedAt: now
	};
	store.quotes.unshift(created);
	writeStore(store);
	return created;
}
function deleteQuote(id) {
	const store = readStore();
	const before = store.quotes.length;
	store.quotes = store.quotes.filter((q) => q.id !== id);
	writeStore(store);
	return store.quotes.length < before;
}
export { listQuotes as a, upsertCatalogItem as c, listCatalog as i, ROOF_MOUNT_MAP as l, deleteQuote as n, resetCatalogFromSeed as o, getQuote as r, saveQuote as s, deleteCatalogItem as t };
