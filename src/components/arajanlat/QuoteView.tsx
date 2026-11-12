import { useEffect, useState } from 'react';
import { TOPIC_LABELS, type Quote } from '../../lib/arajanlat/types';
import { formatDate, formatHuf, grossFromNet, vatFromNet, vatPercentLabel } from './format';

export type BrandInfo = {
  name: string;
  legalName: string;
  address: string;
  phone: string;
  email: string;
};

export default function QuoteView({ quoteId, brand }: { quoteId: string; brand: BrandInfo }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/arajanlat/quotes?id=${encodeURIComponent(quoteId)}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Hiba');
        setQuote(data.quote);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Betöltési hiba'));
  }, [quoteId]);

  if (error) return <p className="text-sun-deep">{error}</p>;
  if (!quote) return <p className="text-ink-soft">Betöltés…</p>;

  const margin = quote.totalSell - quote.totalBuy;
  const vat = vatFromNet(quote.totalSell);
  const gross = grossFromNet(quote.totalSell);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 print:hidden">
        <div>
          <a href="/arajanlat/lista" className="text-sm text-sky-deep hover:underline">
            ← Ajánlatok
          </a>
          <h1 className="mt-1 font-display text-3xl font-bold">{quote.number}</h1>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-sky-deep px-4 py-2 text-sm font-semibold text-white"
        >
          Nyomtatás / PDF
        </button>
      </div>

      <article className="rounded-xl border border-line bg-paper/80 p-5 sm:p-8 print:border-0 print:bg-white print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <div className="font-brand text-3xl text-sky-deep">{brand.name}</div>
            <p className="mt-1 text-sm text-ink-soft">
              {brand.legalName}
              <br />
              {brand.address}
              <br />
              {brand.phone} · {brand.email}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Árajánlat</div>
            <div className="font-display text-2xl font-bold">{quote.number}</div>
            <div className="mt-1 text-sm text-ink-soft">{formatDate(quote.createdAt)}</div>
            <div className="mt-1 text-sm">{TOPIC_LABELS[quote.topic]}</div>
          </div>
        </header>

        <section className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Ügyfél</div>
            <div className="font-medium">{quote.customerName || '—'}</div>
            <div className="text-ink-soft">{quote.customerAddress || ''}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Kapcsolat</div>
            <div>{quote.customerPhone?.trim() || '—'}</div>
            <div className="text-ink-soft">{quote.customerEmail?.trim() || ''}</div>
          </div>
        </section>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="py-2 pr-2 font-semibold">Megnevezés</th>
                <th className="py-2 px-2 font-semibold">Menny.</th>
                <th className="py-2 px-2 font-semibold">Egységár (nettó)</th>
                <th className="py-2 pl-2 font-semibold text-right">Összesen (nettó)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {quote.lines.map((line) => (
                <tr key={`${line.catalogId}-${line.name}`}>
                  <td className="py-2 pr-2">{line.name}</td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    {line.quantity} {line.unit}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap">{formatHuf(line.sellPrice)}</td>
                  <td className="py-2 pl-2 whitespace-nowrap text-right font-medium">
                    {formatHuf(line.sellPrice * line.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-6 flex flex-col items-end gap-1 border-t border-line pt-4 text-sm">
          <div className="text-ink-soft print:hidden">
            Beszerzés nettó (belső): {formatHuf(quote.totalBuy)} · Árrés: {formatHuf(margin)}
          </div>
          <div className="text-ink-soft">Nettó összesen: {formatHuf(quote.totalSell)}</div>
          <div className="text-ink-soft">
            ÁFA ({vatPercentLabel()}): {formatHuf(vat)}
          </div>
          <div className="font-display text-2xl font-bold text-sky-deep">
            Bruttó fizetendő: {formatHuf(gross)}
          </div>
          <p className="max-w-md text-right text-xs text-ink-soft">
            A tételsor árak nettó Ft-ban értendők. Az árajánlat a {brand.name} belső kalkulációja alapján készült
            (25% árrés a nettó beszerzési áron).
          </p>
        </section>
      </article>
    </div>
  );
}
