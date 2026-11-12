/** Kiszállás: cégcím → ügyfélcím, oda-vissza km. */

export const COMPANY_ADDRESS = '2017 Pócsmegyer, Táncsics út 10.';

/** Nominatim / OSM — Pócsmegyer, Táncsics út */
export const COMPANY_COORDS = { lat: 47.7144328, lon: 19.0972418 } as const;

/** Beszerzési (belső) km-díj — eladás = × 1,25 */
export const TRAVEL_BUY_PER_KM = 300;

export const TRAVEL_CATALOG_ID = 'labor-kiszallas-km';

const USER_AGENT = 'K2NapelemQuoteApp/1.0 (internal; k2@k2napelem.hu)';

type Coords = { lat: number; lon: number };

const geocodeCache = new Map<string, Coords | null>();

function haversineKm(a: Coords, b: Coords): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

async function geocode(query: string): Promise<Coords | null> {
  const key = query.trim().toLowerCase();
  if (!key) return null;
  if (geocodeCache.has(key)) return geocodeCache.get(key) ?? null;

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'hu');
  url.searchParams.set('q', query);

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    });
    if (!res.ok) {
      geocodeCache.set(key, null);
      return null;
    }
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data?.[0]) {
      geocodeCache.set(key, null);
      return null;
    }
    const coords = { lat: Number(data[0].lat), lon: Number(data[0].lon) };
    geocodeCache.set(key, coords);
    return coords;
  } catch {
    geocodeCache.set(key, null);
    return null;
  }
}

async function drivingOneWayKm(from: Coords, to: Coords): Promise<number | null> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      code?: string;
      routes?: Array<{ distance: number }>;
    };
    if (data.code !== 'Ok' || !data.routes?.[0]) return null;
    return data.routes[0].distance / 1000;
  } catch {
    return null;
  }
}

export type TravelResult = {
  oneWayKm: number;
  roundTripKm: number;
  method: 'driving' | 'straight';
};

/**
 * Oda-vissza km a cégcímtől az ügyfélcímig.
 * Preferált: OSRM útvonal; fallback: légvonal × 1,3.
 */
export async function roundTripTravelKm(
  customerAddress: string,
): Promise<TravelResult | null> {
  const addr = customerAddress.trim();
  if (addr.length < 5) return null;

  const dest = await geocode(addr);
  if (!dest) return null;

  const driving = await drivingOneWayKm(COMPANY_COORDS, dest);
  let oneWay: number;
  let method: TravelResult['method'];
  if (driving != null && driving > 0) {
    oneWay = driving;
    method = 'driving';
  } else {
    oneWay = haversineKm(COMPANY_COORDS, dest) * 1.3;
    method = 'straight';
  }

  const oneWayKm = Math.max(1, Math.round(oneWay));
  return {
    oneWayKm,
    roundTripKm: oneWayKm * 2,
    method,
  };
}
