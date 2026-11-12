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
};

export type QuoteLine = {
  catalogId: string;
  name: string;
  unit: string;
  quantity: number;
  buyPrice: number;
  /** Eladási egységár = buyPrice × 1.25 */
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
  customerNote: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'final';
  selection: SolarSelection | ManualSelection;
  lines: QuoteLine[];
  /** Összesített beszerzés */
  totalBuy: number;
  /** Összesített eladás (25% árrés) */
  totalSell: number;
};

export type QuoteStore = {
  version: 1;
  catalog: CatalogItem[];
  quotes: Quote[];
  nextQuoteSeq: number;
};

export const MARGIN_MULTIPLIER = 1.25;

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
