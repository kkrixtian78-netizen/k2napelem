import { buyFromBvfGross } from './pricing';
import type { CatalogItem, HeatGroup } from './types';
import bvfHeatingProducts from './bvf-heating-products.json';

type BvfProduct = {
  group: HeatGroup;
  name: string;
  slug: string;
  href: string;
  priceGross: number;
  buyPrice: number;
  sellNetHint?: number;
  sellNet?: number;
  sellGross?: number;
  variantLabel?: string;
  parentSlug?: string;
  variationId?: number;
};

/** BVF webshopból betöltött fűtés főanyagok (csomagajánlatok és outlet nélkül). */
export function buildHeatingCatalogFromBvf(): CatalogItem[] {
  return (bvfHeatingProducts as BvfProduct[]).map((p) => {
    const id = `f-${p.slug}`.slice(0, 80);
    const bvfGross = Math.max(0, Math.round(p.priceGross));
    // Beszerzés: Tactic 1000 W kalibráció (54 000 / 64 000 × BVF bruttó)
    const buyPrice = bvfGross > 0 ? buyFromBvfGross(bvfGross) : Math.max(0, Math.round(p.buyPrice));
    return {
      id,
      name: p.name,
      topic: 'futes' as const,
      category: 'foanyag' as const,
      unit: 'db',
      buyPrice,
      selectable: true,
      active: true,
      heatGroup: p.group,
      bvfGross,
      notes: p.href
        ? `Forrás: ${p.href} · Eladás bruttó: BVF −2% · Beszerzés: BVF×(54k/64k)`
        : 'Eladás bruttó: BVF −2% · Beszerzés: BVF×(54k/64k)',
    };
  });
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
