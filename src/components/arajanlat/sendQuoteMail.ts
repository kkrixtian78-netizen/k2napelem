export type QuoteMailPayload = {
  id?: string;
  quote?: {
    number: string;
    topic: 'napelem' | 'villany' | 'futes';
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    customerEmail: string;
    createdAt: string;
    lines: unknown[];
    totalSell: number;
  };
};

/** Mentett vagy előnézeti ajánlat: Thunderbird melléklettel, különben mailto. */
export async function requestQuoteEmail(payload: QuoteMailPayload): Promise<string> {
  const res = await fetch('/api/arajanlat/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'A levél nem nyílt meg');
  if (data.mode === 'mailto' && typeof data.mailto === 'string') {
    window.location.href = data.mailto;
  }
  return String(data.message || 'A levél megnyílt.');
}
