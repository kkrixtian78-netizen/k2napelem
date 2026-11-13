import assert from 'node:assert/strict';
import test from 'node:test';
import { readEmailResponse } from './email-response.ts';
import { applySupplierPriceUpdates, priceSyncDue, syncMonth } from './price-sync-logic.ts';
import { quoteMailBody, quoteMailSubject, thunderbirdComposeArg } from './quote-mail-text.ts';
import { parseBvfSimplePrice, parseBvfVariationPrices, parseOnlinevillPage } from './supplier-prices.ts';

function item(partial: { id: string; buyPrice: number; bvfGross?: number; priceLocked?: boolean }) {
  return partial;
}

test('price sync is due once per calendar month', () => {
  assert.equal(syncMonth(new Date('2026-11-01T00:00:00')), '2026-11');
  assert.equal(priceSyncDue(undefined, new Date('2026-11-13T12:00:00')), true);
  assert.equal(priceSyncDue('2026-11', new Date('2026-11-20T12:00:00')), false);
  assert.equal(priceSyncDue('2026-11', new Date('2026-12-01T08:00:00')), true);
});

test('supplier updates skip locked prices and remember untagged manual edits on the first sync', () => {
  const catalog = [
    item({ id: 'locked', buyPrice: 10, bvfGross: 20, priceLocked: true }),
    item({ id: 'manual', buyPrice: 99, bvfGross: 100 }),
    item({ id: 'fresh', buyPrice: 50, bvfGross: 80 }),
  ];
  const seed = new Map([
    ['locked', { buyPrice: 10, bvfGross: 20 }],
    ['manual', { buyPrice: 40, bvfGross: 70 }],
    ['fresh', { buyPrice: 50, bvfGross: 80 }],
  ]);
  const first = applySupplierPriceUpdates(
    catalog,
    seed,
    [
      { id: 'locked', buyPrice: 11, bvfGross: 21 },
      { id: 'manual', buyPrice: 41, bvfGross: 71 },
      { id: 'fresh', buyPrice: 55, bvfGross: 90 },
    ],
    { lockSeedDivergence: true },
  );
  assert.equal(first.updated, 1);
  assert.equal(first.preserved, 2);
  assert.equal(catalog[0]?.buyPrice, 10);
  assert.equal(catalog[1]?.priceLocked, true);
  assert.equal(catalog[1]?.buyPrice, 99);
  assert.equal(catalog[2]?.buyPrice, 55);
  assert.equal(catalog[2]?.bvfGross, 90);

  const second = applySupplierPriceUpdates(
    catalog,
    seed,
    [{ id: 'fresh', buyPrice: 60, bvfGross: 100 }],
    { lockSeedDivergence: false },
  );
  assert.equal(second.updated, 1);
  assert.equal(catalog[2]?.buyPrice, 60);
  assert.equal(catalog[1]?.buyPrice, 99);
});

test('parsers read BVF variation gross and Onlinevill shelf price', () => {
  const html =
    'data-product_variations="[{&quot;display_price&quot;:16500,&quot;variation_id&quot;:1045}]"';
  assert.equal(parseBvfVariationPrices(html).get(1045), 16500);
  assert.equal(
    parseBvfSimplePrice(
      '<p class="price"><span class="woocommerce-Price-amount amount"><bdi>40&nbsp;000&nbsp;<span>Ft</span></bdi></span></p>',
    ),
    40000,
  );
  const page = parseOnlinevillPage(`
    <a href="/adatvedelem">adat</a>
    <div class="product-box"><a href="/commel-kismegszakito-1p-b-16a-6ka-commel-465-116">
      <p class="pt-2 text-center text-3xl text-bl text-cyan">650 Ft / db</p></a></div>
    <a href="?page=3">3</a>`);
  assert.equal(page.prices.get('commel-kismegszakito-1p-b-16a-6ka-commel-465-116'), 650);
  assert.equal(page.maxPage, 3);
});

test('email client accepts JSON and rejects an empty body', () => {
  assert.equal(readEmailResponse('{"message":"Megnyílt."}', true).message, 'Megnyílt.');
  assert.throws(() => readEmailResponse('', false), /üres választ/);
  assert.throws(() => readEmailResponse('<title>TypeError</title>', false), /nem adott érvényes választ/);
  assert.throws(() => readEmailResponse('{"error":"Nincs ilyen ajánlat"}', false), /Nincs ilyen ajánlat/);
});

test('solar mail keeps the requested wording and Thunderbird gets the attachment', () => {
  assert.equal(quoteMailSubject('napelem'), 'K2 napelemes árajánlat');
  const body = quoteMailBody('Kiss Anna', 'napelem');
  assert.match(body, /^Kedves Kiss Anna\n\nElőzetes egyeztetésünk alapján mellékelve küldöm a leendő napelemes rendszere árajánlatát\./);
  assert.match(body, /Kántor Krisztián/);
  assert.match(body, /k2@k2napelem\.hu/);
  assert.match(body, /\+36 30 2677 665/);
  const arg = thunderbirdComposeArg({
    to: 'a@b.hu',
    subject: "K2 napelemes árajánlat",
    body: 'Sor 1\nSor 2',
    attachment: 'C:\\ajanlat\\K2.html',
  });
  assert.match(arg, /attachment='C:\\ajanlat\\K2\.html'/);
  assert.match(arg, /body='Sor 1\nSor 2'/);
  assert.equal(quoteMailSubject('villany'), 'K2 villanyszerelési árajánlat');
  assert.match(quoteMailBody('Béla', 'futes'), /elektromos fűtés árajánlatát/);
});
