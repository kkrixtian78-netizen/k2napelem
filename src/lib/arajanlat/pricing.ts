import { MARGIN_MULTIPLIER, type CatalogItem, type QuoteLine } from './types';

export function sellFromBuy(buyPrice: number): number {
  return Math.round(buyPrice * MARGIN_MULTIPLIER);
}

export function lineFromCatalog(
  item: CatalogItem,
  quantity: number,
  auto: boolean,
): QuoteLine {
  const buy = item.buyPrice;
  const sell = sellFromBuy(buy);
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
