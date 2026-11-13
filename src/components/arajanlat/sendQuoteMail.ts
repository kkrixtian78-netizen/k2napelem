import { readEmailResponse } from '../../lib/arajanlat/email-response';

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
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = readEmailResponse(await res.text(), res.ok);
  if (data.mode === 'mailto' && data.mailto) {
    window.location.href = data.mailto;
  }
  return data.message;
}
