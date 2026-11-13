export const prerender = false;

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import { openThunderbirdCompose } from '../../../lib/arajanlat/open-thunderbird';
import {
  mailtoHref,
  quoteMailBody,
  quoteMailSubject,
  renderQuoteHtml,
  type QuoteMailInput,
} from '../../../lib/arajanlat/quote-mail';
import { getQuote } from '../../../lib/arajanlat/store';
import type { TopicId } from '../../../lib/arajanlat/types';

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function asQuote(value: unknown): QuoteMailInput | null {
  if (!value || typeof value !== 'object') return null;
  const quote = value as Partial<QuoteMailInput>;
  if (!quote.topic || !['napelem', 'villany', 'futes'].includes(quote.topic)) return null;
  if (!Array.isArray(quote.lines) || typeof quote.totalSell !== 'number') return null;
  return {
    number: String(quote.number || 'ELŐNÉZET'),
    topic: quote.topic as TopicId,
    customerName: String(quote.customerName || ''),
    customerAddress: String(quote.customerAddress || ''),
    customerPhone: String(quote.customerPhone || ''),
    customerEmail: String(quote.customerEmail || ''),
    createdAt: String(quote.createdAt || new Date().toISOString()),
    lines: quote.lines,
    totalSell: quote.totalSell,
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => null);
    const fromId = typeof body?.id === 'string' ? getQuote(body.id) : undefined;
    const quote = fromId
      ? {
          number: fromId.number,
          topic: fromId.topic,
          customerName: fromId.customerName,
          customerAddress: fromId.customerAddress,
          customerPhone: fromId.customerPhone,
          customerEmail: fromId.customerEmail,
          createdAt: fromId.createdAt,
          lines: fromId.lines,
          totalSell: fromId.totalSell,
        }
      : asQuote(body?.quote);
    if (!quote) return json({ error: 'Nincs ilyen ajánlat' }, 404);

    const safeName = quote.number.replace(/[^\w.-]+/g, '_') || 'ajanlat';
    const dir = join(process.cwd(), 'data', 'arajanlat', 'kimeno');
    mkdirSync(dir, { recursive: true });
    const filePath = join(dir, `${safeName}.html`);
    writeFileSync(filePath, renderQuoteHtml(quote), 'utf8');

    const subject = quoteMailSubject(quote.topic);
    const mailBody = quoteMailBody(quote.customerName, quote.topic);
    const to = quote.customerEmail.trim();
    try {
      openThunderbirdCompose({ to, subject, body: mailBody, attachment: filePath });
      return json({
        mode: 'thunderbird',
        filePath,
        message: `A Thunderbird megnyílt, a melléklet csatolva. Ha mégsem látszik, csatold kézzel: ${filePath}`,
      });
    } catch (error) {
      const mailto = mailtoHref(to, subject, mailBody);
      const reason = error instanceof Error ? error.message : 'A Thunderbird nem indult el.';
      return json({
        mode: 'mailto',
        filePath,
        mailto,
        message: `${reason} A levél melléklet nélkül nyílik meg. Csatold ezt a fájlt: ${filePath}`,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'A levél nem készült el.';
    return json({ error: message }, 500);
  }
};
