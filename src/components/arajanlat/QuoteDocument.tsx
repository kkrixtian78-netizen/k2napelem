import { solarYieldFromLines } from '../../lib/arajanlat/solar-yield';
import { TOPIC_LABELS, type QuoteLine, type TopicId } from '../../lib/arajanlat/types';
import { formatDate, formatHuf, grossFromNet, vatFromNet, vatPercentLabel } from './format';

function formatKwp(kwp: number): string {
  return `${new Intl.NumberFormat('hu-HU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(kwp)} kWp`;
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(value);
}

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
  const solarYield = quote.topic === 'napelem' ? solarYieldFromLines(quote.lines) : null;
  const laborLines = quote.lines.filter((line) => line.category === 'munkadij');
  const productLines = quote.lines.filter((line) => line.category !== 'munkadij');
  const solarLaborAtEnd = quote.topic === 'napelem';
  const tableLines = solarLaborAtEnd ? [...productLines, ...laborLines] : productLines;

  return (
    <article className="rounded-xl border border-line bg-paper/80 p-5 sm:p-8 print:border-0 print:bg-white print:p-0">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <img
            src="/images/brand/k2napelem-logo.png"
            alt={brand.name}
            className="h-14 w-auto max-w-[15rem] object-contain object-left sm:h-16"
          />
          <p className="mt-2 text-sm text-ink-soft">
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

      {solarYield ? (
        <section className="mt-5 rounded-lg border border-line bg-white/80 p-4 print:bg-white">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Névleges teljesítmény
              </div>
              <div className="mt-1 font-display text-xl font-bold text-ink">{formatKwp(solarYield.kwp)}</div>
              <div className="text-xs text-ink-soft">
                {formatCount(solarYield.panelCount)} db
                {solarYield.panelWatts ? ` × ${formatCount(solarYield.panelWatts)} W` : ''}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Várható éves termelés
              </div>
              <div className="mt-1 font-display text-xl font-bold text-ink">
                {formatCount(solarYield.annualKwh)} kWh
              </div>
              <div className="text-xs text-ink-soft">
                {formatCount(solarYield.yieldKwhPerKwpYear)} kWh/kWp/év
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                A termelés értéke
              </div>
              <div className="mt-1 font-display text-xl font-bold text-sky-deep">
                {formatHuf(solarYield.annualValueHuf)}
                <span className="text-base font-semibold"> / év</span>
              </div>
              <div className="text-xs text-ink-soft">{formatCount(solarYield.priceHufPerKwh)} Ft/kWh</div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft">
            Tervezési becslés, nem helyszíni felmérés. Fajlagos termelés:{' '}
            {formatCount(solarYield.yieldKwhPerKwpYear)} kWh/kWp/év (Magyarország, déli tájolás, kb. 35°
            dőlés, árnyék nélkül). Az áram értéke: {formatCount(solarYield.priceHufPerKwh)} Ft/kWh (lakossági,
            átlagfogyasztás feletti ár nagyságrendje).
          </p>
        </section>
      ) : null}

      {!solarLaborAtEnd && laborLines.length > 0 ? (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Munkadíj</h2>
          <div className="mt-2 overflow-x-auto">
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
                {laborLines.map((line) => (
                  <tr key={`${line.catalogId}-${line.name}`}>
                    <td className="py-2 pr-2">{line.name}</td>
                    <td className="py-2 px-2 whitespace-nowrap">
                      {line.unit ? `${line.quantity} ${line.unit}` : line.quantity}
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
        </section>
      ) : null}

      {tableLines.length > 0 ? (
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
            {tableLines.map((line) => (
              <tr key={`${line.catalogId}-${line.name}-${line.auto ? 'a' : 'm'}`}>
                <td className="py-2 pr-2">{line.name}</td>
                <td className="py-2 px-2 whitespace-nowrap">
                  {line.unit ? `${line.quantity} ${line.unit}` : line.quantity}
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
      ) : null}

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

      <footer className="mt-6 space-y-2 border-t border-line pt-4 text-xs leading-relaxed text-ink-soft">
        <p>
          A beépített eszközökre a gyártói garancia vonatkozik. A kivitelezés a vonatkozó szabványok szerint
          készül.
        </p>
        {quote.topic === 'napelem' ? (
          <>
            <p>
              Az árajánlatban szereplő eszközök megfelelnek a vonatkozó európai irányelveknek valamint a magyar
              jogszabályoknak, szabványoknak és környezetvédelmi előírásoknak.
            </p>
            <p>Az árajánlat a kiállítástól 10 napig vagy jelentős HUF/EUR árfolyam változásig érvényes!</p>
            <p>
              Az árajánlat nem tartalmazza a kivitelezéshez esetlegesen szükséges magasemelő gép bérlésének
              költségét!
            </p>
            <p>Az árajánlat nem tartalmazza az áramszolgáltató felé fizetendő esetleges egyéb díjakat!</p>
          </>
        ) : null}
        <p className="pt-2 text-center text-base font-bold leading-snug text-ink">
          300+ lakossági rendszer · több tucat céges kivitelezés hiba nélkül sok ajánlással! 15+ év tapasztalat
        </p>
        <p className="text-center text-base font-bold leading-snug text-ink">
          Magyar családi vállalkozás vagyunk, akiknek fontos a minőségi anyagokból kivitelezett megbízható, precíz
          munka - mert mi a tovább ajánlásokból élünk!
        </p>
        <p>
          <a href="https://k2napelem.hu" className="font-semibold text-sky-deep">
            k2napelem.hu
          </a>
          {' · '}
          <a href={`mailto:${brand.email}`} className="text-sky-deep">
            {brand.email}
          </a>
          {' · '}
          <a href={`tel:${brand.phone.replace(/\s/g, '')}`} className="text-sky-deep">
            {brand.phone}
          </a>
        </p>
      </footer>
    </article>
  );
}
