/**
 * Napelemes automatikus anyaglista a katalógusból.
 *
 * Kézi választás: panel típusa, panelszám, inverter, tároló (vagy nincs), tető.
 * A tűzeseti leválasztó külön választható, nem kerül be magától.
 * Ebből jön a tartószerkezet, a DC/AC védelem,
 * valamint egy összegzett villanyszerelési és egy egyéb kiegészítő sor.
 *
 * Feltételezések (itt módosítható):
 * - Egy sorban legfeljebb 8 panel, panel szélessége 1,15 m, soronként 2 sín.
 * - Cserép / zsindely / hódfarkú: 2 kampó panelenként, kampónként 2 facsavar.
 * - Lemez / trapéz: 4 minisín panelenként (a csavar a minisínhez jár).
 * - Lapostető: panelenként 1 első láb, 1 hátsó láb, 1 tálca, 2 EPDM.
 * - Szorítók: soronként 4 vég + 2 köztes minden panelközben, 4 végzáró kupak.
 * - Sztring: 10 panelenként egy, DC kábel 6 mm², 6 m / panel.
 * - AC kábel az inverter és az elosztó között: 15 m. Gégecső: 3 m / panel. Csatorna: 5 m.
 * - MC4: 2 pár / sztring. Az előreszerelt DC/AC doboz tartalmazza a T2 levezetőt,
 *   ezért külön SPD és kismegszakító nem kerül a listára.
 * - Tárolóval együtt egy backup AC doboz is bekerül.
 * - Engedélyeztetés nincs a katalógusban, ezért nem kerül automatikus sorba.
 */
import { lineFromCatalog, sellFromBuy } from './pricing';
import type { CatalogItem, QuoteLine } from './types';

export const SOLAR_ROOFS: Array<{ id: string; label: string }> = [
  { id: 'roof-cserep', label: 'Cserép' },
  { id: 'roof-hodfarku', label: 'Hódfarkú cserép' },
  { id: 'roof-zsindely', label: 'Zsindely' },
  { id: 'roof-lemez', label: 'Lemez / trapéz' },
  { id: 'roof-lapos', label: 'Lapostető' },
];

const PANEL_WIDTH_M = 1.15;
const MAX_PANELS_PER_ROW = 8;
const PANELS_PER_STRING = 10;
const DC_CABLE_M_PER_PANEL = 6;
const AC_CABLE_M = 15;
const CONDUIT_M_PER_PANEL = 3;
const TRUNKING_M = 5;
const EARTH_M = 15;

const ID = {
  rail35: 'np-rogzito-sin-3-5m-40x40',
  splice40: 'np-sintoldo-40x40-40db',
  hookTile: 'np-2-helyen-allithato-kampo-20db',
  hookShingle: 'np-zsindely-kampo',
  rail36: 'np-enerack-rogzito-sin-3-6m-l-tetos-52mm',
  hookBeaver: 'np-enerack-hodfarku-kampo-15db',
  spliceEnerack: 'np-enerack-sintoldo-70db',
  mini: 'np-enerack-minisin-60x385mm-30db-4db-csavar-jar-hozza',
  mid: 'np-enerack-univerzalis-koztes-fekete-30-40mm-125db',
  end: 'np-enerack-fekete-veg-27-5-35mm-150db',
  cap: 'np-enerack-vegzaro-kupak-fekete-250db',
  screw: 'np-facsavar-6x100-100db',
  railFlat: 'np-enerack-rogzito-sin-2-6m-l-lapostetos-41mm',
  spliceFlat: 'np-enerack-sintoldo-lapostetos-4-db-csavar',
  legRear: 'np-enerack-hatso-lab-klt-10-fok-lapostetos-2-ibusz-2-horony',
  legFront: 'np-enerack-elso-lab-klt-10-fok-lapostetos',
  tray: 'np-enerack-sulytarto-talca-lapostetos',
  epdm: 'np-enerack-epdm-alatet-lapostetos',
  dc2: 'np-wattkit-eloreszerelt-dc-doboz-2-string-t2',
  dc4: 'np-wattkit-eloreszerelt-dc-doboz-4-string-t2',
  ac16: 'np-wattkit-eloszerelt-ac-doboz-16a-t2',
  ac25: 'np-wattkit-eloszerelt-ac-doboz-25a-t2',
  ac32: 'np-wattkit-eloszerelt-ac-doboz-32a-t2',
  backup: 'np-wattkit-yradb-1-3-16a-3-fazisu-backup-ac-vedelmi-doboz-f',
  dc6: 'np-szolarkabel-6-mm2',
  ac4: 'np-mt-54-mm',
  ac6: 'np-mt-56-mm',
  ac10: 'np-mt-510-mm',
  earth6: 'np-mkh-z-s-6-mm',
  earth10: 'np-mkh-z-s-10-mm',
  conduit: 'np-gegecso-25',
  trunk: 'np-vezetekcsatorna-6040-mm-m-energiakapu',
  mc4: 'np-mc4-csatlakozo-par-uj-evo2',
  lug: 'np-szemessaru-6mm-38mm-szigeteletlen-sz35-6-furat-metszet',
  ferrule: 'np-erveghuvely-6-0mm2-l-12mm-rovid-szigetelt',
  ferruleTwin: 'np-erveghuvely-iker-6-0mm2-l-14mm-szigetelt',
  terminal: 'np-fovezeteki-elagazo-sorkapocs-25-16mm2',
} as const;

export function normalizeRoofId(roofTypeId: string | undefined): string {
  if (roofTypeId === 'roof-lemezes' || roofTypeId === 'roof-fold') return 'roof-lemez';
  if (SOLAR_ROOFS.some((roof) => roof.id === roofTypeId)) return roofTypeId as string;
  return 'roof-cserep';
}

export function solarStringCount(panelCount: number): number {
  const panels = Math.max(1, Math.floor(panelCount) || 1);
  return Math.max(1, Math.ceil(panels / PANELS_PER_STRING));
}

/** A ThinkWe leválasztó 2 sztringet fed le. Csak akkor kerül az ajánlatra, ha a felhasználó kiválasztja. */
export function fireDisconnectQty(panelCount: number): number {
  return Math.ceil(solarStringCount(panelCount) / 2);
}

function rowSizes(panels: number): number[] {
  const rows = Math.max(1, Math.ceil(panels / MAX_PANELS_PER_ROW));
  const base = Math.floor(panels / rows);
  const extra = panels % rows;
  return Array.from({ length: rows }, (_, index) => base + (index < extra ? 1 : 0));
}

function railNeed(rows: number[], railLengthM: number): { rails: number; splices: number; endClamps: number; midClamps: number; caps: number } {
  let rails = 0;
  let splices = 0;
  let midClamps = 0;
  for (const count of rows) {
    const perLine = Math.max(1, Math.ceil((count * PANEL_WIDTH_M) / railLengthM));
    rails += perLine * 2;
    splices += Math.max(0, perLine - 1) * 2;
    midClamps += Math.max(0, count - 1) * 2;
  }
  return { rails, splices, endClamps: rows.length * 4, midClamps, caps: rows.length * 4 };
}

function inverterKw(name: string): number {
  const labeled = name.match(/(\d+(?:[.,]\d+)?)\s*kW/i);
  if (labeled) return Number(labeled[1].replace(',', '.'));
  const sun = name.match(/SUN-(\d+(?:[.,]\d+)?)K/i) ?? name.match(/(\d+(?:[.,]\d+)?)K-/i);
  if (sun) return Number(sun[1].replace(',', '.'));
  return 5;
}

function inverterPhases(name: string): 1 | 3 {
  if (/3\s*f[aá]zis/i.test(name) || /LP3/i.test(name)) return 3;
  return 1;
}

function acAmps(kw: number, phases: 1 | 3): number {
  if (phases === 3) return (kw * 1000) / (400 * Math.sqrt(3));
  return (kw * 1000) / 230;
}

type Part = { id: string; qty: number };

function mountingParts(roofId: string, panels: number): Part[] {
  const rows = rowSizes(panels);
  const pitched = roofId === 'roof-hodfarku' ? railNeed(rows, 3.6) : railNeed(rows, roofId === 'roof-lapos' ? 2.6 : 3.5);
  const clamps: Part[] = [
    { id: ID.mid, qty: pitched.midClamps },
    { id: ID.end, qty: pitched.endClamps },
    { id: ID.cap, qty: pitched.caps },
  ];

  if (roofId === 'roof-lapos') {
    return [
      { id: ID.railFlat, qty: pitched.rails },
      { id: ID.spliceFlat, qty: pitched.splices },
      { id: ID.legFront, qty: panels },
      { id: ID.legRear, qty: panels },
      { id: ID.tray, qty: panels },
      { id: ID.epdm, qty: panels * 2 },
      ...clamps,
    ];
  }

  if (roofId === 'roof-lemez') {
    return [{ id: ID.mini, qty: panels * 4 }, ...clamps];
  }

  const hooks = panels * 2;
  if (roofId === 'roof-hodfarku') {
    return [
      { id: ID.rail36, qty: pitched.rails },
      { id: ID.spliceEnerack, qty: pitched.splices },
      { id: ID.hookBeaver, qty: hooks },
      { id: ID.screw, qty: hooks * 2 },
      ...clamps,
    ];
  }

  return [
    { id: ID.rail35, qty: pitched.rails },
    { id: ID.splice40, qty: pitched.splices },
    { id: roofId === 'roof-zsindely' ? ID.hookShingle : ID.hookTile, qty: hooks },
    { id: ID.screw, qty: hooks * 2 },
    ...clamps,
  ];
}

function bundle(
  catalog: CatalogItem[],
  catalogId: string,
  name: string,
  category: QuoteLine['category'],
  parts: Part[],
): QuoteLine | null {
  let buy = 0;
  for (const part of parts) {
    if (part.qty <= 0) continue;
    const item = catalog.find((entry) => entry.id === part.id && entry.active);
    if (!item) continue;
    buy += item.buyPrice * part.qty;
  }
  const rounded = Math.round(buy);
  if (rounded <= 0) return null;
  return {
    catalogId,
    name,
    unit: 'készlet',
    quantity: 1,
    buyPrice: rounded,
    sellPrice: sellFromBuy(rounded),
    auto: true,
    category,
  };
}

function pushItem(catalog: CatalogItem[], lines: QuoteLine[], id: string, qty: number) {
  const item = catalog.find((entry) => entry.id === id && entry.active);
  if (!item || qty <= 0) return;
  lines.push(lineFromCatalog(item, qty, true));
}

export function buildSolarAutoLines(
  catalog: CatalogItem[],
  input: { panelCount: number; inverterName: string; roofTypeId?: string; withStorage: boolean },
): QuoteLine[] {
  const panels = Math.max(1, Math.floor(input.panelCount) || 1);
  const roofId = normalizeRoofId(input.roofTypeId);
  const strings = solarStringCount(panels);
  const lines: QuoteLine[] = [];

  const mount = bundle(catalog, 'auto-solar-mount', 'Tartószerkezet', 'tartoszerkezet', mountingParts(roofId, panels));
  if (mount) lines.push(mount);

  const dcId = strings <= 2 ? ID.dc2 : ID.dc4;
  const dcQty = strings <= 2 ? 1 : Math.ceil(strings / 4);
  pushItem(catalog, lines, dcId, dcQty);

  const amps = acAmps(inverterKw(input.inverterName), inverterPhases(input.inverterName));
  const acId = amps <= 16 ? ID.ac16 : amps <= 25 ? ID.ac25 : ID.ac32;
  pushItem(catalog, lines, acId, 1);
  if (input.withStorage) pushItem(catalog, lines, ID.backup, 1);

  const heavy = amps > 32;
  const villany = bundle(
    catalog,
    'auto-solar-villany',
    'Villanyszerelési anyagok (vezetékek, MC4 csatl., gégecső, vez.csatorna)',
    'kabel',
    [
      { id: ID.dc6, qty: panels * DC_CABLE_M_PER_PANEL },
      { id: heavy ? ID.ac10 : amps > 20 ? ID.ac6 : ID.ac4, qty: AC_CABLE_M },
      { id: heavy ? ID.earth10 : ID.earth6, qty: EARTH_M },
      { id: ID.conduit, qty: panels * CONDUIT_M_PER_PANEL },
      { id: ID.trunk, qty: TRUNKING_M },
      { id: ID.mc4, qty: strings * 2 },
    ],
  );
  if (villany) lines.push(villany);

  const misc = bundle(catalog, 'auto-solar-misc', 'Egyéb kiegészítő anyagok', 'egyeb', [
    { id: ID.terminal, qty: 5 },
    { id: ID.lug, qty: 10 },
    { id: ID.ferrule, qty: 20 },
    { id: ID.ferruleTwin, qty: 6 },
  ]);
  if (misc) lines.push(misc);

  return lines;
}
