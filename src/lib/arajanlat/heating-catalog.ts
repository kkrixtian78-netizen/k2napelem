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
    const id = heatingCatalogId(p.slug);
    const bvfGross = Math.max(0, Math.round(p.priceGross));
    // Beszerzés nettó = BVF bruttó × 0,85 / 1,27; eladás bruttó = BVF × 0,98
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
        ? `Forrás: ${p.href} · Beszerzés nettó: BVF bruttó −15% / 1,27 · Eladás bruttó: BVF −2%`
        : 'Beszerzés nettó: BVF bruttó −15% / 1,27 · Eladás bruttó: BVF −2%',
    };
  });
}

export function heatingCatalogId(slug: string): string {
  return `f-${slug}`.slice(0, 80);
}

export type BvfSyncTarget = {
  hrefs: string[];
  variationToId: Map<number, string>;
  simpleByHref: Map<string, string[]>;
};

function normHref(href: string): string {
  return href.trim().replace(/\/+$/, '');
}

/** A havi árfrissítés ezekről a BVF oldalakról olvassa a bruttó árat. */
export function bvfSyncTargets(): BvfSyncTarget {
  const variationToId = new Map<number, string>();
  const simpleByHref = new Map<string, string[]>();
  const hrefs = new Set<string>();
  for (const product of bvfHeatingProducts as BvfProduct[]) {
    if (!product.href) continue;
    const href = normHref(product.href);
    hrefs.add(href);
    const id = heatingCatalogId(product.slug);
    if (product.variationId) {
      variationToId.set(product.variationId, id);
    } else {
      const list = simpleByHref.get(href) ?? [];
      list.push(id);
      simpleByHref.set(href, list);
    }
  }
  return { hrefs: [...hrefs], variationToId, simpleByHref };
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
