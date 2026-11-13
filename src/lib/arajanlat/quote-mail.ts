import { readFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { mailtoHref, quoteMailBody, quoteMailSubject, thunderbirdComposeArg } from './quote-mail-text';
import { grossFromNet, VAT_RATE, vatFromNet } from './pricing';
import { TOPIC_LABELS, type QuoteLine, type TopicId } from './types';

export { mailtoHref, quoteMailBody, quoteMailSubject, thunderbirdComposeArg };

export type QuoteMailInput = {
  number: string;
  topic: TopicId;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  createdAt: string;
  lines: QuoteLine[];
  totalSell: number;
};

export function thunderbirdCandidates(): string[] {
  const fromPath = (process.env.PATH || '').split(delimiter).flatMap((dir) => {
    if (!dir) return [];
    return process.platform === 'win32'
      ? [join(dir, 'thunderbird.exe'), join(dir, 'thunderbird')]
      : [join(dir, 'thunderbird')];
  });
  return [
    process.env.THUNDERBIRD_PATH || '',
    'C:\\Program Files\\Mozilla Thunderbird\\thunderbird.exe',
    'C:\\Program Files (x86)\\Mozilla Thunderbird\\thunderbird.exe',
    ...fromPath,
  ].filter((path) => path.length > 0);
}

function huf(amount: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(amount);
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function logoDataUri(): string | null {
  try {
    const file = readFileSync(join(process.cwd(), 'public', 'images', 'brand', 'k2napelem-logo.png'));
    return `data:image/png;base64,${file.toString('base64')}`;
  } catch {
    return null;
  }
}

/** Ügyfélnek szóló, önálló HTML. A belső beszerzési árak nincsenek benne. */
export function renderQuoteHtml(quote: QuoteMailInput): string {
  const logo = logoDataUri();
  const vat = vatFromNet(quote.totalSell);
  const gross = grossFromNet(quote.totalSell);
  const rows = quote.lines
    .map(
      (line) => `<tr>
        <td>${escapeHtml(line.name)}</td>
        <td>${escapeHtml(String(line.quantity))}${line.unit ? ` ${escapeHtml(line.unit)}` : ''}</td>
        <td>${escapeHtml(huf(line.sellPrice))}</td>
        <td>${escapeHtml(huf(line.sellPrice * line.quantity))}</td>
      </tr>`,
    )
    .join('\n');
  const solarNotes =
    quote.topic === 'napelem'
      ? `<p>Az árajánlatban szereplő eszközök megfelelnek a vonatkozó európai irányelveknek valamint a magyar jogszabályoknak, szabványoknak és környezetvédelmi előírásoknak.</p>
      <p>Az árajánlat a kiállítástól 10 napig vagy jelentős HUF/EUR árfolyam változásig érvényes!</p>
      <p>Az árajánlat nem tartalmazza a kivitelezéshez esetlegesen szükséges magasemelő gép bérlésének költségét!</p>
      <p>Az árajánlat nem tartalmazza az áramszolgáltató felé fizetendő esetleges egyéb díjakat!</p>`
      : '';
  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(quote.number)} — ${escapeHtml(TOPIC_LABELS[quote.topic])}</title>
  <style>
    body { font-family: "Segoe UI", sans-serif; color: #1c2430; margin: 2rem auto; max-width: 800px; }
    h1 { font-size: 1.4rem; margin: 0.2rem 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
    th, td { border-bottom: 1px solid #d5dbe3; text-align: left; padding: 0.4rem 0.3rem; vertical-align: top; }
    th { font-size: 0.8rem; }
    td:nth-child(n+2), th:nth-child(n+2) { text-align: right; white-space: nowrap; }
    .totals { margin-top: 1rem; text-align: right; }
    .trust { text-align: center; font-weight: 700; margin: 0.4rem 0; }
    footer { margin-top: 2rem; font-size: 0.85rem; color: #4b5563; }
    img.logo { height: 64px; }
  </style>
</head>
<body>
  ${logo ? `<img class="logo" alt="K2Napelem" src="${logo}" />` : '<h1>K2Napelem</h1>'}
  <p>Kántor Krisztián EV<br />2017 Pócsmegyer, Táncsics út 10.<br />+36 30 2677 665 · k2@k2napelem.hu</p>
  <h1>${escapeHtml(quote.number)}</h1>
  <p>${escapeHtml(TOPIC_LABELS[quote.topic])}</p>
  <p><strong>Ügyfél:</strong> ${escapeHtml(quote.customerName || '—')}<br />
  ${escapeHtml(quote.customerAddress || '')}<br />
  ${escapeHtml(quote.customerPhone || '')} ${escapeHtml(quote.customerEmail || '')}</p>
  <table>
    <thead><tr><th>Tétel</th><th>Mennyiség</th><th>Nettó egységár</th><th>Nettó összesen</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <div>Nettó összesen: ${escapeHtml(huf(quote.totalSell))}</div>
    <div>ÁFA ${Math.round(VAT_RATE * 100)}%: ${escapeHtml(huf(vat))}</div>
    <div><strong>Bruttó fizetendő: ${escapeHtml(huf(gross))}</strong></div>
  </div>
  <footer>
    <p>A beépített eszközökre a gyártói garancia vonatkozik. A kivitelezés a vonatkozó szabványok szerint készül.</p>
    ${solarNotes}
    <p class="trust">300+ lakossági rendszer · több tucat céges kivitelezés hiba nélkül sok ajánlással!</p>
    <p class="trust">15+ év tapasztalat.</p>
    <p class="trust">Magyar családi vállalkozás vagyunk, akiknek fontos a minőségi anyagokból kivitelezett megbízható, precíz munka - mert mi a tovább ajánlásokból élünk!</p>
    <p class="trust">k2napelem.hu · k2@k2napelem.hu · +36 30 2677 665</p>
  </footer>
</body>
</html>`;
}
