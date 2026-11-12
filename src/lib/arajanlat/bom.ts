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
    const bat = byId(catalog, selection.storageId);
    lines.push(lineFromCatalog(bat, 1, false));
  }

  // Tetőtípus csak a tartószerkezet-választáshoz kell (0 Ft-os sort nem írunk ki)
  byId(catalog, selection.roofTypeId);

  const mountId = ROOF_MOUNT_MAP[selection.roofTypeId];
  if (mountId) {
    const mount = byId(catalog, mountId);
    lines.push(lineFromCatalog(mount, panels, true));
  }

  lines.push(lineFromCatalog(byId(catalog, 'prot-dc-box'), 1, true));
  lines.push(lineFromCatalog(byId(catalog, 'prot-ac-box'), 1, true));

  // Vill. anyagok: alapcsomag + DC kábel (6 m/panel) + AC kábel (15 m) összevonva
  const villanyMisc = byId(catalog, 'cons-villany-misc');
  const dcCable = tryById(catalog, 'cable-dc-6');
  const acCable = tryById(catalog, 'cable-ac-5x6');
  const dcCableBuy = (dcCable?.buyPrice ?? 420) * panels * 6;
  const acCableBuy = (acCable?.buyPrice ?? 980) * 15;
  lines.push(
    lineFromCatalog(
      { ...villanyMisc, buyPrice: villanyMisc.buyPrice + dcCableBuy + acCableBuy },
      1,
      true,
    ),
  );

  lines.push(lineFromCatalog(byId(catalog, 'cons-solar-misc'), 1, true));

  lines.push(lineFromCatalog(byId(catalog, 'labor-solar-panel'), panels, true));
  lines.push(lineFromCatalog(byId(catalog, 'labor-solar-inv'), 1, true));
  if (selection.storageId && selection.storageId !== 'bat-none') {
    lines.push(lineFromCatalog(byId(catalog, 'labor-solar-bat'), 1, true));
  }
  lines.push(lineFromCatalog(byId(catalog, 'labor-solar-comm'), 1, true));

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

  if (topic === 'villany') {
    const pointLike = mains.filter((m) =>
      ['v-vezetek-3x15', 'v-vezetek-3x25', 'v-vezetek-5x25', 'v-kapcsolo-csalad', 'v-led-panel'].includes(m.id),
    );
    const pointCount = pointLike.reduce((s, m) => s + (qtyMap[m.id] ?? 1), 0) || mains.length;

    const eloszto = mains.some((m) => m.id.startsWith('v-eloszto') || m.id === 'v-kazetta');

    lines.push(lineFromCatalog(byId(catalog, 'v-auto-doboz'), Math.max(4, pointCount), true));
    lines.push(lineFromCatalog(byId(catalog, 'v-auto-szigetelo'), 1, true));
    lines.push(lineFromCatalog(byId(catalog, 'v-auto-csatorna'), Math.max(10, pointCount * 2), true));
    lines.push(lineFromCatalog(byId(catalog, 'v-labor-pont'), Math.max(1, pointCount), true));
    if (eloszto) {
      lines.push(lineFromCatalog(byId(catalog, 'v-labor-eloszto'), 1, true));
    }
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
