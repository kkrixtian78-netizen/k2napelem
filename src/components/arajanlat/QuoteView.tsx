import { useEffect, useState } from 'react';
import type { Quote } from '../../lib/arajanlat/types';
import QuoteDocument, { type BrandInfo } from './QuoteDocument';

export type { BrandInfo };

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

      <QuoteDocument quote={quote} brand={brand} showInternalCosts />
    </div>
  );
}
