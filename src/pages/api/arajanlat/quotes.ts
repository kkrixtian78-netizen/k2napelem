export const prerender = false;

import type { APIRoute } from 'astro';
import { buildQuoteLines, withTotals } from '../../../lib/arajanlat/bom';
import type { ManualSelection, SolarSelection, TopicId } from '../../../lib/arajanlat/types';
import {
  deleteQuote,
  getQuote,
  listCatalog,
  listQuotes,
  saveQuote,
} from '../../../lib/arajanlat/store';
import { roundTripTravelKm } from '../../../lib/arajanlat/travel';

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (id) {
    const quote = getQuote(id);
    if (!quote) return Response.json({ error: 'Nincs ilyen ajánlat' }, { status: 404 });
    return Response.json({ quote });
  }
  return Response.json({ quotes: listQuotes() });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const topic = body.topic as TopicId;
  if (!topic || !['napelem', 'villany', 'futes'].includes(topic)) {
    return Response.json({ error: 'Érvénytelen témakör' }, { status: 400 });
  }

  const catalog = listCatalog();
  const selection = body.selection as SolarSelection | ManualSelection;
  const customerAddress = String(body.customerAddress || '');
  const travel = customerAddress.trim().length >= 5 ? await roundTripTravelKm(customerAddress) : null;
  const built = withTotals(
    buildQuoteLines(catalog, topic, selection, {
      travelRoundTripKm: travel?.roundTripKm,
    }),
  );

  // Optional: allow line overrides from client (qty edits) — de ha nincs travel a client lines-ban, a szerverét használjuk
  let lines = Array.isArray(body.lines) && body.lines.length ? body.lines : built.lines;
  if (Array.isArray(body.lines) && body.lines.length && travel?.roundTripKm) {
    const hasTravel = body.lines.some(
      (l: { catalogId?: string }) => l.catalogId === 'labor-kiszallas-km',
    );
    if (!hasTravel) lines = built.lines;
  }
  const totals = withTotals(lines);

  const quote = saveQuote({
    id: body.id,
    topic,
    customerName: body.customerName || '',
    customerAddress,
    customerNote: body.customerNote || '',
    status: body.status === 'final' ? 'final' : 'draft',
    selection,
    lines,
    totalBuy: totals.totalBuy,
    totalSell: totals.totalSell,
  });

  return Response.json({ quote });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id kötelező' }, { status: 400 });
  return Response.json({ deleted: deleteQuote(id) });
};
