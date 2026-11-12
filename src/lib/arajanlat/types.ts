/** Árajánlatkészítő — közös típusok */

export type TopicId = 'napelem' | 'villany' | 'futes';

export type CatalogCategory =
  | 'panel'
  | 'inverter'
  | 'tarolo'
  | 'tetotipus'
  | 'tartoszerkezet'
  | 'kabel'
  | 'csatlakozo'
  | 'vedelem'
  | 'munkadij'
  | 'fogyocikk'
  | 'foanyag'
  | 'kiegeszito'
  | 'egyeb';

/** Napelem kiegészítő főanyag-csoport (legördülő mező). */
export type SolarExtraGroup =
  | 'optimizer'
  | 'visszwatt'
  | 'tuzvedelmi'
  | 'tervezes'
  | 'hozott-jutalek';

export const SOLAR_EXTRA_GROUPS: Array<{
  id: SolarExtraGroup;
  label: string;
  /** Optimalizálónál a mennyiség mező megjelenik */
  qtyFollowsPanels?: boolean;
}> = [
  { id: 'optimizer', label: 'Optimalizálók', qtyFollowsPanels: true },
  { id: 'visszwatt', label: 'Visszwatt védelem' },
  { id: 'tuzvedelmi', label: 'Tűzvédelmi leválasztó' },
  { id: 'tervezes', label: 'Tervezés / engedélyeztetés' },
  { id: 'hozott-jutalek', label: 'Hozott munka — jutalék' },
];

/** Elektromos fűtés termékcsoport (BVF + szerelési anyagok legördülők). */
export type HeatGroup =
  | 'padlofutes'
  | 'termosztat'
  | 'futopanel'
  | 'torolkozoszarito'
  | 'gyorsfuto'
  | 'infrapanel'
  | 'kulteri-futokabel'
  | 'futheto-tukor'
  | 'infrasugarzo'
  | 'kiegeszitok'
  | 'szereles';

export const HEAT_GROUPS: Array<{ id: HeatGroup; label: string }> = [
  { id: 'padlofutes', label: 'Elektromos padlófűtés' },
  { id: 'termosztat', label: 'Termosztátok' },
  { id: 'futopanel', label: 'Fűtőpanelek' },
  { id: 'torolkozoszarito', label: 'Törölközőszárító radiátorok' },
  { id: 'gyorsfuto', label: 'Gyorsfűtő készülékek' },
  { id: 'infrapanel', label: 'Infrapanel' },
  { id: 'kulteri-futokabel', label: 'Kültéri fűtőkábelek' },
  { id: 'futheto-tukor', label: 'Fűthető tükör' },
  { id: 'infrasugarzo', label: 'Infrasugárzók' },
  { id: 'kiegeszitok', label: 'Kiegészítők, alkatrészek' },
  { id: 'szereles', label: 'Szerelési anyagok' },
];

export type CatalogItem = {
  id: string;
  name: string;
  topic: TopicId | 'all';
  category: CatalogCategory;
  unit: string;
  /** Beszerzési / vételár (nettó Ft) */
  buyPrice: number;
  notes?: string;
  /** Ha false, csak automatikusan kerülhet ajánlatba (nem választható főanyag) */
  selectable?: boolean;
  active: boolean;
  /** Napelem kiegészítő legördülő csoport */
  extraGroup?: SolarExtraGroup;
  /** Elektromos fűtés legördülő csoport */
  heatGroup?: HeatGroup;
  /** Villanyszerelés legördülő csoport (Onlinevill kategória) */
  villanyGroup?: string;
  /**
   * BVF webshop bruttó listaár (Ft). Ha megvan:
   * beszerzés nettó = bruttó × 0,85 / 1,27 (−15% a BVF bruttóhoz képest, nettóban),
   * eladás bruttó = bruttó × 0,98 (−2%).
   */
  bvfGross?: number;
  /** Fix eladási nettó (pl. rögzítéstechnika: 2000 Ft) — felülírja a szorzós árazást */
  sellPriceFixed?: number;
};

export type QuoteLine = {
  catalogId: string;
  name: string;
  unit: string;
  quantity: number;
  buyPrice: number;
  /** Eladási egységár (általában buy × 1,25; BVF fűtésnél listaár −2%) */
  sellPrice: number;
  auto: boolean;
  category: CatalogCategory;
};

export type SolarSelection = {
  panelId: string;
  panelCount: number;
  inverterId: string;
  storageId: string | null;
  roofTypeId: string;
  /** Opcionális főanyagok (optimalizáló, visszwatt, stb.) */
  extraItemIds?: string[];
  extraQuantities?: Record<string, number>;
};

export type ManualSelection = {
  /** Főanyagok, amiket a felhasználó választott */
  mainItemIds: string[];
  /** Opcionális mennyiségek főanyagonként (alapértelmezett 1) */
  quantities?: Record<string, number>;
};

export type Quote = {
  id: string;
  number: string;
  topic: TopicId;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'final';
  selection: SolarSelection | ManualSelection;
  lines: QuoteLine[];
  /** Összesített nettó beszerzés */
  totalBuy: number;
  /** Összesített nettó eladás (25% árrés); ÁFA / bruttó a megjelenítéskor számolódik */
  totalSell: number;
};

export type QuoteStore = {
  version: 1;
  catalog: CatalogItem[];
  quotes: Quote[];
  nextQuoteSeq: number;
};

export const MARGIN_MULTIPLIER = 1.25;

/** BVF fűtés: eladási bruttó = BVF bruttó listaár × 0,98 (2%-kal olcsóbb). */
export const BVF_HEAT_SELL_FACTOR = 0.98;

/** BVF fűtés: beszerzés kedvezmény a BVF bruttó listaárhoz képest (15%). */
export const BVF_HEAT_BUY_FACTOR = 0.85;

export const TOPIC_LABELS: Record<TopicId, string> = {
  napelem: 'Napelemes rendszer',
  villany: 'Villanyszerelés',
  futes: 'Elektromos fűtés',
};

export const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  panel: 'Napelem panel',
  inverter: 'Inverter',
  tarolo: 'Energiatároló',
  tetotipus: 'Tetőfelület',
  tartoszerkezet: 'Tartószerkezet',
  kabel: 'Kábel',
  csatlakozo: 'Csatlakozó',
  vedelem: 'Védelem / biztosíték',
  munkadij: 'Munkadíj',
  fogyocikk: 'Fogyóanyag',
  foanyag: 'Főanyag',
  kiegeszito: 'Kiegészítő főanyag',
  egyeb: 'Egyéb',
};

/** Napelem választható kiegészítők (nem auto-BOM). */
export const SOLAR_EXTRA_CATEGORIES: CatalogCategory[] = ['kiegeszito'];
