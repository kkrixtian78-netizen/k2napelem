export const prerender = false;

import type { APIRoute } from 'astro';
import { buildQuoteLines, withTotals } from '../../../lib/arajanlat/bom';
import type { ManualSelection, SolarSelection, TopicId } from '../../../lib/arajanlat/types';
import { listCatalog } from '../../../lib/arajanlat/store';

/** Élő előnézet mentés nélkül. */
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const topic = body.topic as TopicId;
  if (!topic) return Response.json({ error: 'topic hiányzik' }, { status: 400 });
  const catalog = listCatalog();
  const selection = body.selection as SolarSelection | ManualSelection;
  try {
    const result = withTotals(buildQuoteLines(catalog, topic, selection));
    return Response.json(result);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'BOM hiba' },
      { status: 400 },
    );
  }
};
