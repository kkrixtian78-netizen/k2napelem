import type { CatalogItem, HeatGroup } from './types';
import bvfHeatingProducts from './bvf-heating-products.json';

type BvfProduct = {
  group: HeatGroup;
  name: string;
  slug: string;
  href: string;
  priceGross: number;
  buyPrice: number;
  sellNetHint: number;
};

/** BVF webshopból betöltött fűtés főanyagok (csomagajánlatok és outlet nélkül). */
export function buildHeatingCatalogFromBvf(): CatalogItem[] {
  return (bvfHeatingProducts as BvfProduct[]).map((p) => ({
    id: `f-${p.slug}`.slice(0, 80),
    name: p.name,
    topic: 'futes' as const,
    category: 'foanyag' as const,
    unit: 'db',
    buyPrice: Math.max(0, Math.round(p.buyPrice)),
    selectable: true,
    active: true,
    heatGroup: p.group,
    notes: p.href ? `Forrás: ${p.href}` : undefined,
  }));
}

/** Régi, kézzel seedelt fűtés főanyagok — új BVF tételek javára kikapcsoljuk. */
export const LEGACY_HEATING_MAIN_IDS = [
  'f-bvf-ng-300',
  'f-bvf-ng-450',
  'f-bvf-ng-600',
  'f-bvf-hmat-100',
  'f-bvf-hmat-150',
  'f-bvf-wfd',
  'f-intuis-tactic',
  'f-intuis-ezybain',
  'f-termosztat',
] as const;
