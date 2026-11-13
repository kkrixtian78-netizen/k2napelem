# Árajánlatkészítő — folytatás

Állapot: 2026. november 12. A program a saját Windows gépen fut, az `Inditas.bat` indítja.

## Hol van a munka

- Tároló: https://github.com/kkrixtian78-netizen/k2napelem
- Ág: `cursor/arajanlat-keszito-640b`
- Pull request: https://github.com/kkrixtian78-netizen/k2napelem/pull/1
- A nyilvános k2napelem.hu oldalra ez az eszköz nem való. Ott a mentések nem maradnak meg.

## Saját gépen

1. Node.js 22 vagy újabb.
2. Dupla kattintás: `Inditas.bat`.
3. A fekete ablak nyitva marad. Cím: http://127.0.0.1:4321/arajanlat
4. Leállítás: a fekete ablak bezárása.

Az ajánlatok és a kézzel átírt katalógusárak itt vannak, és nincsenek a Gitben:

`data/arajanlat/store.json`

Új ZIP letöltésekor ezt a fájlt át kell másolni az új mappába, különben az eddigi ajánlatok és ármódosítások elvesznek.

## Árazás

- Napelem, villany, szerelés és fogyóanyag: eladás nettó = beszerzés × 1,25. Kód: `src/lib/arajanlat/pricing.ts`.
- BVF fűtés: beszerzés nettó = BVF bruttó × 0,85 / 1,27. Eladás bruttó = BVF bruttó × 0,98.
- ÁFA 27%. A tételsor nettó, a bruttó az összesenél jelenik meg.
- Fűtés szerelési munkadíj: 10 000 Ft, 2 db-enként −10%, minimum 7 000 Ft. Rögzítéstechnika: 1 készlet fő termékenként, beszerzés 1 000 Ft, eladás 2 000 Ft.

## Katalógusok

A fejléc **Katalógus** menüjéből nyílik. A `/arajanlat/katalogus` a napelem listára visz.

- Napelem: `content/Napelem-alapanyagok.xlsx` és `src/lib/arajanlat/solar-catalog.ts`. A katalógusban mentett ár megmarad, az Excel nem írja vissza.
- Villany: csak Onlinevill, `src/lib/arajanlat/onlinevill-catalog.ts`. A kihagyott csoportok az `EXCLUDED_GROUP_LABELS` halmazban vannak. A régi, Onlinevill előtti villanytételek kikerültek. A csoportok alapból csukva vannak; kattintásra nyílik a teljes, keresés nélkül görgethető lista.
- Villany munkadíj az anyagok előtt, több tétel, mennyiséggel, beszerzés 0, eladás nettó a katalógusban szerkeszthető. Kiszállás továbbra is km × 300. Új árak: kiállás 8 000 Ft/db (kb. 10 160 bruttó), villanyóra szabványosítás 150 000 Ft (kb. 190 500 bruttó), 3 fázis kiépítése 200 000 Ft (254 000 bruttó). Az 1 fázisú bővítés-ügyintézés nincs a listában.
- Fűtés: BVF termékek variánsokkal, `src/lib/arajanlat/heating-catalog.ts`. Egy csoportba többféle termék is tehető, saját mennyiséggel.

## Hol kell módosítani

- Ajánlat űrlap: `src/components/arajanlat/QuoteWizard.tsx`
- Nyomtatási kép és napelemes záradékok: `src/components/arajanlat/QuoteDocument.tsx`
- Automatikus tételek: `src/lib/arajanlat/bom.ts`
- Mentés és a seed összeolvasztása: `src/lib/arajanlat/store.ts`
- Menü: `src/layouts/QuoteAppLayout.astro`
- Windows indítás: `Inditas.bat`, `scripts/open-quote.js`, a `start` parancs a `package.json`-ban (`astro dev --port 4321 --host 127.0.0.1`)

## Napelemes záradék az ajánlat alján

Csak napelemes ajánlaton jelenik meg: EU és magyar megfelelőség, 10 napos vagy árfolyamhoz kötött érvényesség, magasemelő gép bérlése nélkül, áramszolgáltatói díjak nélkül.
