import {
  BVF_HEAT_BUY_FACTOR,
  BVF_HEAT_SELL_FACTOR,
  MARGIN_MULTIPLIER,
  type CatalogItem,
  type QuoteLine,
} from './types';

/** Magyar általános ÁFA-kulcs */
export const VAT_RATE = 0.27;

export function sellFromBuy(buyPrice: number): number {
  return Math.round(buyPrice * MARGIN_MULTIPLIER);
}

/** BVF fűtés eladási bruttó (listaár − 2%). */
export function sellGrossFromBvf(bvfGross: number): number {
  return Math.round(bvfGross * BVF_HEAT_SELL_FACTOR);
}

/** BVF fűtés beszerzés: BVF bruttó listaár − 15%. */
export function buyFromBvfGross(bvfGross: number): number {
  return Math.round(bvfGross * BVF_HEAT_BUY_FACTOR);
}

/**
 * Katalógustétel eladási nettója.
 * BVF fűtésnél: (bruttó listaár × 0,98) / 1,27 — sor bruttója = BVF − 2%.
 * Egyébként: beszerzés × 1,25.
 */
export function sellPriceForItem(item: CatalogItem): number {
  const gross = item.bvfGross;
  if (typeof gross === 'number' && gross > 0) {
    return Math.round(sellGrossFromBvf(gross) / (1 + VAT_RATE));
  }
  return sellFromBuy(item.buyPrice);
}

/** Megjelenítéshez: BVF fűtésnél bruttó eladási ár, egyébként nettó eladás. */
export function displaySellForItem(item: CatalogItem): { amount: number; gross: boolean } {
  const gross = item.bvfGross;
  if (typeof gross === 'number' && gross > 0) {
    return { amount: sellGrossFromBvf(gross), gross: true };
  }
  return { amount: sellFromBuy(item.buyPrice), gross: false };
}

/** Nettó eladási összeg → ÁFA Ft */
export function vatFromNet(netSell: number): number {
  return Math.round(netSell * VAT_RATE);
}

/** Nettó → bruttó (nettó + ÁFA) */
export function grossFromNet(netSell: number): number {
  return netSell + vatFromNet(netSell);
}

export function lineFromCatalog(
  item: CatalogItem,
  quantity: number,
  auto: boolean,
): QuoteLine {
  const buy = item.buyPrice;
  const sell = sellPriceForItem(item);
  return {
    catalogId: item.id,
    name: item.name,
    unit: item.unit,
    quantity,
    buyPrice: buy,
    sellPrice: sell,
    auto,
    category: item.category,
  };
}

export function sumLines(lines: QuoteLine[]): { totalBuy: number; totalSell: number } {
  let totalBuy = 0;
  let totalSell = 0;
  for (const line of lines) {
    totalBuy += line.buyPrice * line.quantity;
    totalSell += line.sellPrice * line.quantity;
  }
  return { totalBuy: Math.round(totalBuy), totalSell: Math.round(totalSell) };
}

export function formatHuf(amount: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(amount);
}
