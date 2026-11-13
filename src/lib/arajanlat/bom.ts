import { lineFromCatalog, sellFromBuy, sumLines } from './pricing';
import { buildSolarAutoLines, fireDisconnectQty } from './solar-bom';
import { SOLAR_INSTALL_LABOR_ID, solarInstallSell } from './solar-labor';
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

  const storage =
    selection.storageId && selection.storageId !== 'bat-none'
      ? tryById(catalog, selection.storageId)
      : undefined;
  if (storage) lines.push(lineFromCatalog(storage, 1, false));

  lines.push(
    ...buildSolarAutoLines(catalog, {
      panelCount: panels,
      inverterName: inverter.name,
      roofTypeId: selection.roofTypeId,
      withStorage: Boolean(storage),
    }),
  );

  lines.push({
    catalogId: SOLAR_INSTALL_LABOR_ID,
    name: 'Munkadíj',
    unit: '',
    quantity: 1,
    buyPrice: 0,
    sellPrice: solarInstallSell(panels, Boolean(storage)),
    auto: true,
    category: 'munkadij',
  });

  // Választható kiegészítő főanyagok (kiszállás nem ide tartozik — auto munkadíj)
  const extraIds = selection.extraItemIds ?? [];
  const extraQty = selection.extraQuantities ?? {};
  for (const id of extraIds) {
    if (id === 'opt-kiszallas' || id === TRAVEL_CATALOG_ID) continue;
    const item = tryById(catalog, id);
    if (!item || item.selectable === false) continue;
    if (
      item.extraGroup !== 'tuzvedelmi' &&
      ['tartoszerkezet', 'kabel', 'vedelem', 'csatlakozo'].includes(item.category)
    ) {
      continue;
    }
    const defaultQty =
      item.extraGroup === 'optimizer' ? panels : item.extraGroup === 'tuzvedelmi' ? fireDisconnectQty(panels) : 1;
    const q = Math.max(1, extraQty[id] ?? defaultQty);
    lines.push(lineFromCatalog(item, q, false));
  }

  return lines;
}

function isLaborLine(line: QuoteLine): boolean {
  return line.category === 'munkadij' && line.catalogId !== TRAVEL_CATALOG_ID;
}

/**
 * Az oda-vissza km díja a munkadíj sor összegébe kerül. Külön kiszállási tétel nincs.
 * A munkadíj sorok az ajánlat tetejére kerülnek, hogy ne vesszenek el az anyaglista alatt.
 * Ha nincs munkadíj sor, egy „Szerelési munkadíj” sor viszi az összeget.
 */
export function foldTravelIntoLabor(lines: QuoteLine[], travelRoundTripKm?: number): QuoteLine[] {
  const withoutTravel = lines.filter((line) => line.catalogId !== TRAVEL_CATALOG_ID);
  const km = Math.round(travelRoundTripKm ?? 0);
  const extraBuy = km > 0 ? km * TRAVEL_BUY_PER_KM : 0;
  const extraSell = km > 0 ? sellFromBuy(extraBuy) : 0;

  const heatingLabor = withoutTravel.find((line) => line.catalogId === 'f-labor-panel');
  const solarLabor = withoutTravel.find((line) => line.catalogId === SOLAR_INSTALL_LABOR_ID);
  const target = heatingLabor ?? solarLabor ?? withoutTravel.find((line) => isLaborLine(line));

  if (km > 0 && !target) {
    withoutTravel.push({
      catalogId: 'labor-included-travel',
      name: 'Szerelési munkadíj',
      unit: 'alkalom',
      quantity: 1,
      buyPrice: extraBuy,
      sellPrice: extraSell,
      auto: true,
      category: 'munkadij',
    });
  } else if (km > 0 && target) {
    const q = Math.max(1, Math.round(target.quantity) || 1);
    const totalBuy = target.buyPrice * q + extraBuy;
    const totalSell = target.sellPrice * q + extraSell;
    target.quantity = q;
    target.buyPrice = Math.round(totalBuy / q);
    target.sellPrice = Math.round(totalSell / q);
    if (!target.category) target.category = 'munkadij';
  }

  const labor = withoutTravel.filter((line) => isLaborLine(line));
  const rest = withoutTravel.filter((line) => !isLaborLine(line));
  const solarLaborLines = labor.filter((line) => line.catalogId === SOLAR_INSTALL_LABOR_ID);
  const otherLabor = labor.filter((line) => line.catalogId !== SOLAR_INSTALL_LABOR_ID);
  return [...otherLabor, ...rest, ...solarLaborLines];
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

  const laborLines: QuoteLine[] = [];
  const materialLines: QuoteLine[] = [];
  for (const item of mains) {
    const q = Math.max(1, qtyMap[item.id] ?? 1);
    const line = lineFromCatalog(item, q, false);
    if (item.category === 'munkadij') laborLines.push(line);
    else materialLines.push(line);
  }
  lines.push(...laborLines, ...materialLines);

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
  // Fűtés: szerelési munkadíj a lista végén, a km díj ebbe a sorba épül.
  if (topic === 'futes') {
    const laborId = 'f-labor-panel';
    const laborIdx = lines.findIndex((l) => l.catalogId === laborId);
    if (laborIdx >= 0) {
      const [labor] = lines.splice(laborIdx, 1);
      lines.push(labor);
    }
  }
  return foldTravelIntoLabor(lines, options?.travelRoundTripKm);
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
