import { ROOF_MOUNT_MAP } from './seed';
import { lineFromCatalog, sumLines } from './pricing';
import { TRAVEL_BUY_PER_KM, TRAVEL_CATALOG_ID } from './travel';
import type {
  CatalogItem,
  ManualSelection,
  QuoteLine,
  SolarSelection,
  TopicId,
} from './types';

export type BomOptions = {
  /** Oda-vissza kilométer (ügyfélcím alapján) */
  travelRoundTripKm?: number;
};

function byId(catalog: CatalogItem[], id: string): CatalogItem {
  const item = catalog.find((c) => c.id === id && c.active);
  if (!item) throw new Error(`Katalógustétel nem található: ${id}`);
  return item;
}

function tryById(catalog: CatalogItem[], id: string): CatalogItem | undefined {
  return catalog.find((c) => c.id === id && c.active);
}

/** Napelem: panel + inverter + tároló + tető → teljes BOM. */
export function buildSolarBom(
  catalog: CatalogItem[],
  selection: SolarSelection,
): QuoteLine[] {
  const lines: QuoteLine[] = [];
  const panels = Math.max(1, Math.floor(selection.panelCount) || 1);

  const panel = byId(catalog, selection.panelId);
  lines.push(lineFromCatalog(panel, panels, false));

  const inverter = byId(catalog, selection.inverterId);
  lines.push(lineFromCatalog(inverter, 1, false));

  if (selection.storageId && selection.storageId !== 'bat-none') {
    const bat = tryById(catalog, selection.storageId);
    if (bat) lines.push(lineFromCatalog(bat, 1, false));
  }

  // Tetőtípus és a régi összevont auto-tételek csak akkor kerülnek be, ha még a katalógusban vannak.
  if (selection.roofTypeId) {
    const roof = tryById(catalog, selection.roofTypeId);
    const mountId = roof ? ROOF_MOUNT_MAP[selection.roofTypeId] : undefined;
    if (mountId) {
      const mount = tryById(catalog, mountId);
      if (mount) lines.push(lineFromCatalog(mount, panels, true));
    }
  }

  const pushAuto = (id: string, qty: number) => {
    const item = tryById(catalog, id);
    if (item) lines.push(lineFromCatalog(item, qty, true));
  };

  pushAuto('prot-dc-box', 1);
  pushAuto('prot-ac-box', 1);

  const villanyMisc = tryById(catalog, 'cons-villany-misc');
  if (villanyMisc) {
    const dcCable = tryById(catalog, 'cable-dc-6');
    const acCable = tryById(catalog, 'cable-ac-5x6');
    const dcCableBuy = (dcCable?.buyPrice ?? 0) * panels * 6;
    const acCableBuy = (acCable?.buyPrice ?? 0) * 15;
    lines.push(
      lineFromCatalog(
        { ...villanyMisc, buyPrice: villanyMisc.buyPrice + dcCableBuy + acCableBuy },
        1,
        true,
      ),
    );
  }

  pushAuto('cons-solar-misc', 1);
  pushAuto('labor-solar-panel', panels);
  pushAuto('labor-solar-inv', 1);
  if (selection.storageId && selection.storageId !== 'bat-none') {
    pushAuto('labor-solar-bat', 1);
  }
  pushAuto('labor-solar-comm', 1);

  // Választható kiegészítő főanyagok (kiszállás nem ide tartozik — auto munkadíj)
  const extraIds = selection.extraItemIds ?? [];
  const extraQty = selection.extraQuantities ?? {};
  for (const id of extraIds) {
    if (id === 'opt-kiszallas' || id === TRAVEL_CATALOG_ID) continue;
    const item = tryById(catalog, id);
    if (!item || item.selectable === false) continue;
    const defaultQty = id === 'opt-optimizer' ? panels : 1;
    const q = Math.max(1, extraQty[id] ?? defaultQty);
    lines.push(lineFromCatalog(item, q, false));
  }

  return lines;
}

function appendTravelLine(
  catalog: CatalogItem[],
  lines: QuoteLine[],
  travelRoundTripKm?: number,
): QuoteLine[] {
  const km = Math.round(travelRoundTripKm ?? 0);
  if (km <= 0) return lines;
  const item =
    tryById(catalog, TRAVEL_CATALOG_ID) ??
    ({
      id: TRAVEL_CATALOG_ID,
      name: 'Kiszállás / szállítás (km × 300 Ft, oda-vissza)',
      topic: 'all',
      category: 'munkadij',
      unit: 'km',
      buyPrice: TRAVEL_BUY_PER_KM,
      selectable: false,
      active: true,
    } satisfies CatalogItem);
  const line = lineFromCatalog(item, km, true);
  line.name = `Kiszállás / szállítás (oda-vissza, ${km} km × ${item.buyPrice} Ft)`;
  lines.push(line);
  return lines;
}

/**
 * Villany / fűtés: főanyagok kiválasztása → kapcsolódó fogyóanyagok + munkadíj.
 */
export function buildManualBom(
  catalog: CatalogItem[],
  topic: Exclude<TopicId, 'napelem'>,
  selection: ManualSelection,
): QuoteLine[] {
  const lines: QuoteLine[] = [];
  const qtyMap = selection.quantities ?? {};
  const mains = selection.mainItemIds
    .map((id) => tryById(catalog, id))
    .filter((x): x is CatalogItem => !!x && (x.topic === topic || x.topic === 'all'));

  for (const item of mains) {
    const q = Math.max(1, qtyMap[item.id] ?? 1);
    lines.push(lineFromCatalog(item, q, false));
  }

  if (topic === 'futes') {
    // Tartókonzol / tápkábel / kismegszakító: felhasználó választja (szereles legördülő)
    // Rögzítéstechnika + munkadíj: 1 / fő termék; munkadíj 2 db-enként 10% olcsóbb
    const foTermekek = mains.filter((m) => m.heatGroup && m.heatGroup !== 'szereles');
    const foQty = foTermekek.reduce((s, m) => s + Math.max(1, qtyMap[m.id] ?? 1), 0);
    if (foQty > 0) {
      lines.push(lineFromCatalog(byId(catalog, 'f-auto-fogyo'), foQty, true));

      const laborBase = byId(catalog, 'f-labor-panel');
      const discountSteps = Math.floor(foQty / 2);
      const unitSell = Math.max(7000, Math.round(10000 * (1 - 0.1 * discountSteps)));
      lines.push(
        lineFromCatalog(
          { ...laborBase, buyPrice: 0, sellPriceFixed: unitSell },
          foQty,
          true,
        ),
      );
    }
  }

  return lines;
}

export function buildQuoteLines(
  catalog: CatalogItem[],
  topic: TopicId,
  selection: SolarSelection | ManualSelection,
  options?: BomOptions,
): QuoteLine[] {
  const lines =
    topic === 'napelem'
      ? buildSolarBom(catalog, selection as SolarSelection)
      : buildManualBom(catalog, topic, selection as ManualSelection);
  const withTravel = appendTravelLine(catalog, lines, options?.travelRoundTripKm);
  // Fűtés: szerelési munkadíj mindig a lista végén (kiszállás után is)
  if (topic === 'futes') {
    const laborId = 'f-labor-panel';
    const laborIdx = withTravel.findIndex((l) => l.catalogId === laborId);
    if (laborIdx >= 0) {
      const [labor] = withTravel.splice(laborIdx, 1);
      withTravel.push(labor);
    }
  }
  return withTravel;
}

export function withTotals(lines: QuoteLine[]) {
  return { lines, ...sumLines(lines) };
}

export function selectableMains(catalog: CatalogItem[], topic: TopicId): CatalogItem[] {
  return catalog.filter(
    (c) =>
      c.active &&
      c.selectable !== false &&
      (c.topic === topic || c.topic === 'all') &&
      (topic !== 'napelem' ||
        ['panel', 'inverter', 'tarolo', 'tetotipus', 'kiegeszito'].includes(c.category)),
  );
}

export function solarExtras(catalog: CatalogItem[]): CatalogItem[] {
  return catalog.filter(
    (c) =>
      c.active &&
      c.selectable !== false &&
      (c.topic === 'napelem' || c.topic === 'all') &&
      c.category === 'kiegeszito',
  );
}
