import { ROOF_MOUNT_MAP } from './seed';
import { lineFromCatalog, sumLines } from './pricing';
import type {
  CatalogItem,
  ManualSelection,
  QuoteLine,
  SolarSelection,
  TopicId,
} from './types';

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

  // Tető típus megjelenik 0 Ft-tal a dokumentáció miatt
  const roof = byId(catalog, selection.roofTypeId);
  lines.push(lineFromCatalog(roof, 1, false));

  const mountId = ROOF_MOUNT_MAP[selection.roofTypeId];
  if (mountId) {
    const mount = byId(catalog, mountId);
    lines.push(lineFromCatalog(mount, panels, true));
  }

  // DC kábel: ~6 m / panel (string + tartalék)
  const dcCable = byId(catalog, 'cable-dc-6');
  lines.push(lineFromCatalog(dcCable, panels * 6, true));

  // AC kábel: fix 15 m alap
  const acCable = byId(catalog, 'cable-ac-5x6');
  lines.push(lineFromCatalog(acCable, 15, true));

  // MC4: ~1 pár / panel + 2 tartalék
  const mc4 = byId(catalog, 'conn-mc4');
  lines.push(lineFromCatalog(mc4, panels + 2, true));

  for (const id of ['prot-dc-spd', 'prot-ac-spd', 'prot-dc-breaker', 'prot-ac-breaker', 'box-ac', 'cons-solar-misc']) {
    lines.push(lineFromCatalog(byId(catalog, id), 1, true));
  }

  lines.push(lineFromCatalog(byId(catalog, 'labor-solar-panel'), panels, true));
  lines.push(lineFromCatalog(byId(catalog, 'labor-solar-inv'), 1, true));
  if (selection.storageId && selection.storageId !== 'bat-none') {
    lines.push(lineFromCatalog(byId(catalog, 'labor-solar-bat'), 1, true));
  }
  lines.push(lineFromCatalog(byId(catalog, 'labor-solar-comm'), 1, true));

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
    const panelLike = mains.filter((m) =>
      m.id.includes('ng-') || m.id.includes('intuis') || m.id.includes('termosztat'),
    );
    const floorLike = mains.filter((m) => m.id.includes('hmat') || m.id.includes('wfd'));
    const panelQty = panelLike.reduce((s, m) => s + (qtyMap[m.id] ?? 1), 0);
    const floorQty = floorLike.reduce((s, m) => s + (qtyMap[m.id] ?? 1), 0);

    if (panelQty > 0) {
      lines.push(lineFromCatalog(byId(catalog, 'f-auto-tarto'), panelQty, true));
      lines.push(lineFromCatalog(byId(catalog, 'f-labor-panel'), panelQty, true));
    }
    if (floorQty > 0) {
      lines.push(lineFromCatalog(byId(catalog, 'f-labor-padlo'), floorQty, true));
    }

    const circuitCount = Math.max(1, panelQty + (floorQty > 0 ? 1 : 0));
    lines.push(lineFromCatalog(byId(catalog, 'f-auto-kabel'), circuitCount * 8, true));
    lines.push(lineFromCatalog(byId(catalog, 'f-auto-vedelem'), circuitCount, true));
    lines.push(lineFromCatalog(byId(catalog, 'f-auto-fogyo'), 1, true));
  }

  return lines;
}

export function buildQuoteLines(
  catalog: CatalogItem[],
  topic: TopicId,
  selection: SolarSelection | ManualSelection,
): QuoteLine[] {
  if (topic === 'napelem') {
    return buildSolarBom(catalog, selection as SolarSelection);
  }
  return buildManualBom(catalog, topic, selection as ManualSelection);
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
      (topic !== 'napelem' || ['panel', 'inverter', 'tarolo', 'tetotipus'].includes(c.category)),
  );
}
