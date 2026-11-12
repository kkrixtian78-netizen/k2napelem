export const prerender = false;

import type { APIRoute } from 'astro';
import { buildQuoteLines, withTotals } from '../../../lib/arajanlat/bom';
import type { ManualSelection, SolarSelection, TopicId } from '../../../lib/arajanlat/types';
import { listCatalog } from '../../../lib/arajanlat/store';
import { roundTripTravelKm } from '../../../lib/arajanlat/travel';

/** Élő előnézet mentés nélkül. */
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const topic = body.topic as TopicId;
  if (!topic) return Response.json({ error: 'topic hiányzik' }, { status: 400 });
  const catalog = listCatalog();
  const selection = body.selection as SolarSelection | ManualSelection;
  const customerAddress = String(body.customerAddress || '');

  let travel: Awaited<ReturnType<typeof roundTripTravelKm>> = null;
  let travelWarning: string | null = null;
  if (customerAddress.trim().length >= 5) {
    travel = await roundTripTravelKm(customerAddress);
    if (!travel) {
      travelWarning = 'A kiszállási km nem számolható ebből a címből — ellenőrizd az ügyfél címét.';
    }
  }

  try {
    const result = withTotals(
      buildQuoteLines(catalog, topic, selection, {
        travelRoundTripKm: travel?.roundTripKm,
      }),
    );
    return Response.json({
      ...result,
      travel: travel
        ? {
            oneWayKm: travel.oneWayKm,
            roundTripKm: travel.roundTripKm,
            method: travel.method,
          }
        : null,
      travelWarning,
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'BOM hiba' },
      { status: 400 },
    );
  }
};
