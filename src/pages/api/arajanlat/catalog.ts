export const prerender = false;

import type { APIRoute } from 'astro';
import type { CatalogItem } from '../../../lib/arajanlat/types';
import {
  deleteCatalogItem,
  listCatalog,
  resetCatalogFromSeed,
  upsertCatalogItem,
} from '../../../lib/arajanlat/store';

export const GET: APIRoute = async ({ url }) => {
  const topic = url.searchParams.get('topic');
  let items = listCatalog();
  if (topic) {
    items = items.filter((c) => c.topic === topic || c.topic === 'all');
  }
  return Response.json({ items });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  if (body?.action === 'reset') {
    const items = resetCatalogFromSeed();
    return Response.json({ items, reset: true });
  }

  const item = body as CatalogItem;
  if (!item?.id || !item?.name || typeof item.buyPrice !== 'number') {
    return Response.json({ error: 'Hiányos tételadat' }, { status: 400 });
  }
  const saved = upsertCatalogItem({
    id: item.id,
    name: item.name,
    topic: item.topic ?? 'all',
    category: item.category ?? 'egyeb',
    unit: item.unit || 'db',
    buyPrice: item.buyPrice,
    notes: item.notes,
    selectable: item.selectable ?? true,
    active: item.active ?? true,
    extraGroup: item.extraGroup,
    heatGroup: item.heatGroup,
    bvfGross: item.bvfGross,
    sellPriceFixed: item.sellPriceFixed,
  });
  return Response.json({ item: saved });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id kötelező' }, { status: 400 });
  const ok = deleteCatalogItem(id);
  return Response.json({ deleted: ok });
};
