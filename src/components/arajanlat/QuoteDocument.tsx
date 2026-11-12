import { TOPIC_LABELS, type QuoteLine, type TopicId } from '../../lib/arajanlat/types';
import { formatDate, formatHuf, grossFromNet, vatFromNet, vatPercentLabel } from './format';

export type BrandInfo = {
  name: string;
  legalName: string;
  address: string;
  phone: string;
  email: string;
};

export type QuoteDocumentData = {
  number: string;
  topic: TopicId;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  createdAt: string;
  lines: QuoteLine[];
  totalBuy: number;
  totalSell: number;
  /** Előnézetnél true — „Piszkozat előnézet” jelzés */
  draftPreview?: boolean;
};

export default function QuoteDocument({
  quote,
  brand,
  showInternalCosts = true,
}: {
  quote: QuoteDocumentData;
  brand: BrandInfo;
  showInternalCosts?: boolean;
}) {
  const margin = quote.totalSell - quote.totalBuy;
  const vat = vatFromNet(quote.totalSell);
  const gross = grossFromNet(quote.totalSell);

  return (
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
          {quote.draftPreview ? (
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-sun-deep">
              Előnézet — még nincs mentve
            </div>
          ) : null}
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
              <tr key={`${line.catalogId}-${line.name}-${line.auto ? 'a' : 'm'}`}>
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
        {showInternalCosts ? (
          <div className="text-ink-soft print:hidden">
            Beszerzés nettó (belső): {formatHuf(quote.totalBuy)} · Árrés: {formatHuf(margin)}
          </div>
        ) : null}
        <div className="text-ink-soft">Nettó összesen: {formatHuf(quote.totalSell)}</div>
        <div className="text-ink-soft">
          ÁFA ({vatPercentLabel()}): {formatHuf(vat)}
        </div>
        <div className="font-display text-2xl font-bold text-sky-deep">
          Bruttó fizetendő: {formatHuf(gross)}
        </div>
        <p className="max-w-md text-right text-xs text-ink-soft">A tételsor árak nettó Ft-ban értendők.</p>
      </section>
    </article>
  );
}
