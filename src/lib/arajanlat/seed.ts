import type { CatalogItem } from './types';
import { buildHeatingCatalogFromBvf } from './heating-catalog';
import { SOLAR_MATERIAL_CATALOG } from './solar-catalog';
import { buildVillanyCatalogFromOnlinevill } from './onlinevill-catalog';

/** Realisztikus induló katalógus — magyar megnevezések, nettó beszerzési árak (Ft). */
export const SEED_CATALOG: CatalogItem[] = [
  ...SOLAR_MATERIAL_CATALOG,

  {
    id: 'labor-kiszallas-km',
    name: 'Kiszállás / szállítás (km × 300 Ft, oda-vissza)',
    topic: 'all',
    category: 'munkadij',
    unit: 'km',
    buyPrice: 300,
    selectable: false,
    active: true,
    notes: 'Automatikus: cégcím ↔ ügyfélcím oda-vissza km × 300 Ft',
  },
  // ——— Villanyszerelés: Onlinevill termékek ———
  ...buildVillanyCatalogFromOnlinevill(),

  // ——— Elektromos fűtés: BVF termékek (lásd heating-catalog / bvf-heating-products.json) ———
  ...buildHeatingCatalogFromBvf(),
  {
    id: 'f-auto-tarto',
    name: 'Infrapanel tartókonzol / rögzítőkészlet',
    topic: 'futes',
    category: 'foanyag',
    unit: 'db',
    buyPrice: 3200,
    selectable: true,
    active: true,
    heatGroup: 'szereles',
  },
  {
    id: 'f-auto-kabel',
    name: 'Fűtés tápkábel 3×2,5 mm²',
    topic: 'futes',
    category: 'foanyag',
    unit: 'm',
    buyPrice: 420,
    selectable: true,
    active: true,
    heatGroup: 'szereles',
  },
  {
    id: 'f-auto-vedelem',
    name: 'Kismegszakító fűtési körhöz',
    topic: 'futes',
    category: 'foanyag',
    unit: 'db',
    buyPrice: 2400,
    selectable: true,
    active: true,
    heatGroup: 'szereles',
  },
  {
    id: 'f-auto-fogyo',
    name: 'Rögzítéstechnikai eszközök (tipli, csavar)',
    topic: 'futes',
    category: 'fogyocikk',
    unit: 'készlet',
    buyPrice: 1000,
    sellPriceFixed: 2000,
    selectable: false,
    active: true,
  },
  {
    id: 'f-labor-panel',
    name: 'Szerelési munkadíj',
    topic: 'futes',
    category: 'munkadij',
    unit: 'db',
    buyPrice: 0,
    sellPriceFixed: 10000,
    selectable: false,
    active: true,
  },
  {
    id: 'f-labor-padlo',
    name: 'Szerelési munkadíj — padlófűtés / fűtőkábel',
    topic: 'futes',
    category: 'munkadij',
    unit: 'm²',
    buyPrice: 4500,
    selectable: false,
    active: false,
  },
];

export const ROOF_MOUNT_MAP: Record<string, string> = {
  'roof-cserep': 'mount-cserep-set',
  'roof-lemezes': 'mount-lemez-set',
  'roof-lapos': 'mount-lapos-set',
  'roof-fold': 'mount-fold-set',
};
