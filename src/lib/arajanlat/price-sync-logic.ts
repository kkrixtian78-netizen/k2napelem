type CatalogPriceItem = {
  id: string;
  buyPrice: number;
  bvfGross?: number;
  priceLocked?: boolean;
};

export type SupplierPriceUpdate = {
  id: string;
  buyPrice: number;
  bvfGross?: number;
};

export type SeedPrice = {
  buyPrice: number;
  bvfGross?: number;
};

export function syncMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** A hónap első indításakor kell frissíteni, ha ebben a hónapban még nem sikerült. */
export function priceSyncDue(lastMonth: string | undefined, now = new Date()): boolean {
  return lastMonth !== syncMonth(now);
}

function sameGross(left: number | undefined, right: number | undefined): boolean {
  return (left ?? undefined) === (right ?? undefined);
}

/**
 * Beszállítói árak beírása. A priceLocked tételeket és a seedtől már eltérő
 * (korábban kézzel átírt, de még nem jelölt) árakat békén hagyja, és megjelöli.
 */
export function applySupplierPriceUpdates(
  catalog: CatalogPriceItem[],
  seedById: Map<string, SeedPrice>,
  updates: SupplierPriceUpdate[],
  options?: { lockSeedDivergence?: boolean },
): { updated: number; preserved: number } {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  let updated = 0;
  let preserved = 0;
  for (const update of updates) {
    const item = byId.get(update.id);
    if (!item || update.buyPrice <= 0) continue;
    if (item.priceLocked) {
      preserved += 1;
      continue;
    }
    const seed = seedById.get(update.id);
    const diverged =
      options?.lockSeedDivergence === true &&
      seed != null &&
      (item.buyPrice !== seed.buyPrice || !sameGross(item.bvfGross, seed.bvfGross));
    if (diverged) {
      item.priceLocked = true;
      preserved += 1;
      continue;
    }
    const grossSame = update.bvfGross == null || item.bvfGross === update.bvfGross;
    if (item.buyPrice === update.buyPrice && grossSame) continue;
    item.buyPrice = update.buyPrice;
    if (update.bvfGross != null) item.bvfGross = update.bvfGross;
    updated += 1;
  }
  return { updated, preserved };
}
