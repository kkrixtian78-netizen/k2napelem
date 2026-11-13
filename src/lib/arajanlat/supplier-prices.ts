/** BVF és Onlinevill árak kiolvasása a bolt HTML-jéből. */

export function parseBvfVariationPrices(html: string): Map<number, number> {
  const match = html.match(/data-product_variations="([^"]*)"/);
  if (!match?.[1]) return new Map();
  const decoded = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  let rows: Array<{ variation_id?: number; display_price?: number }> = [];
  try {
    rows = JSON.parse(decoded) as typeof rows;
  } catch {
    return new Map();
  }
  const prices = new Map<number, number>();
  for (const row of rows) {
    const id = Number(row.variation_id);
    const price = Number(row.display_price);
    if (id > 0 && price > 0) prices.set(id, Math.round(price));
  }
  return prices;
}

export function parseBvfSimplePrice(html: string): number | null {
  const match = html.match(/<p class="price"[\s\S]*?<\/p>/);
  if (!match?.[0]) return null;
  const text = match[0].replace(/&nbsp;/gi, ' ').replace(/<[^>]+>/g, ' ');
  const amount = Number(text.replace(/[^\d]/g, ''));
  return amount > 0 ? amount : null;
}

export function parseOnlinevillPage(html: string): { prices: Map<string, number>; maxPage: number } {
  const prices = new Map<string, number>();
  for (const box of html.split('<div class="product-box').slice(1)) {
    const slug = box.match(/href="\/([^"#?]+)"/)?.[1]?.replace(/\/+$/, '');
    const raw = box.match(/text-cyan">([^<]*)</)?.[1] ?? '';
    const amount = Number(raw.replace(/[^\d]/g, ''));
    if (slug && amount > 0) prices.set(slug, amount);
  }
  let maxPage = 1;
  for (const match of html.matchAll(/[?&]page=(\d+)/g)) {
    const page = Number(match[1]);
    if (page > maxPage) maxPage = page;
  }
  return { prices, maxPage };
}
