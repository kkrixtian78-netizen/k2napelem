# K2Napelem — marketing website + belső árajánlatkészítő

Hungarian marketing site for **K2Napelem** (domain: [k2napelem.hu](https://k2napelem.hu)).  
Stack: **Astro** + **Tailwind CSS** + **React** (árajánlat UI) + **Node adapter** (API + JSON tárolás).

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Nyisd meg:

- Marketing: [http://localhost:4321](http://localhost:4321)
- **Árajánlatkészítő (belső):** [http://localhost:4321/arajanlat](http://localhost:4321/arajanlat)

### Windows, saját gépen

A program a gépen fut, az ajánlatok a `data/arajanlat/store.json` fájlban maradnak. Kell hozzá a [Node.js 22](https://nodejs.org) vagy újabb.

1. Töltsd le a ZIP-et, és bontsd ki. Ne a ZIP belsejéből indítsd.
2. A `k2napelem-cursor-arajanlat-keszito-640b` mappában kattints duplán az `Inditas.bat` fájlra.
3. A fekete ablak nyitva marad. Az első indítás 2–5 perc, közben sorok jelennek meg. Utána megnyílik a böngésző: [http://127.0.0.1:4321/arajanlat](http://127.0.0.1:4321/arajanlat).

Leállításhoz zárd be a fekete ablakot. A nyilvános weboldalra ezt ne tedd ki.

A folytatáshoz elmentett állapot: [docs/arajanlat-folytatas.md](docs/arajanlat-folytatas.md).

Build:

```bash
npm run build
```

Az `/arajanlat` oldalak SSR-rel futnak (**Vercel adapter**). Helyben: `npm run dev`.

## Árajánlatkészítő (MVP)

Belső eszköz három témakörre:

1. **Napelemes rendszer** — felhasználó csak panelt, inverttert, energiatárolót és tetőfelületet választ; a BOM (tartószerkezet, kábel, MC4, DC/AC védelem, munkadíj) automatikus.
2. **Villanyszerelés** — főanyagok pipálása → fogyóanyag + munkadíj.
3. **Elektromos fűtés** — főanyagok pipálása → rögzítés, kábel, védelem, munkadíj.

**Árazás:** eladási ár = beszerzési ár × **1,25** (25% árrés). A tételsoron és az összesen megjelenik.

**Adattárolás:** `data/arajanlat/store.json` (helyi JSON). Első indításkor a seed katalógus kitöltődik. A fájl gitignore-olt; a seed forrás: `src/lib/arajanlat/seed.ts`.

| Útvonal | Funkció |
|---|---|
| `/arajanlat` | Új ajánlat (témakör → főanyagok → auto tételsor → mentés) |
| `/arajanlat/lista` | Mentett ajánlatok |
| `/arajanlat/ajanlat/:id` | Megtekintés / nyomtatás (PDF a böngésző Nyomtatás dialógusából) |
| `/arajanlat/katalogus` | Katalógus szerkesztés (beszerzési ár, új tétel, seed reset) |

API: `/api/arajanlat/catalog`, `/api/arajanlat/quotes`, `/api/arajanlat/preview`.

**Megjegyzés:** helyi `npm run dev` alatt a store fájlba ír (`data/arajanlat/store.json`). Vercel preview/production alatt memóriában fut (a mentések a cold startig élnek) — demózáshoz elég, tartós belső használathoz később DB kell.

## Environment variables

| Variable | Purpose |
|---|---|
| `FORM_ENDPOINT` | Recommended on Vercel. Formspree / Basin / Getform POST URL for the quote form. |
| `PUBLIC_FORM_ENDPOINT` | Optional fallback (same purpose as `FORM_ENDPOINT`). If both empty, the form falls back to a `mailto:k2@k2napelem.hu` draft. |
| `PUBLIC_GTM_ID` | Google Tag Manager ID (default in code: `GTM-M6LP3FTV`). |

## Contact (from live site)

- Phone: **+36 30 2677 665**
- Email: **k2@k2napelem.hu**
- Address: **2017 Pócsmegyer, Táncsics út 10.**
- Legal name: Kántor Krisztián EV

## Pages

| Path | Content |
|---|---|
| `/` | Homepage (hero, services, trust, gallery preview, form) |
| `/napelemes-rendszerek` | Solar systems |
| `/hibrid-sziget` | Hybrid / off-grid |
| `/villanyszereles` | Electrical work |
| `/elektromos-futes` | Electric heating |
| `/palyazatiras` | Grant writing |
| `/otthoni-energiatarolo` | Home energy storage programme |
| `/munkaink` | Gallery |
| `/rolunk` | About |
| `/gyik` | FAQ |
| `/kapcsolat` | Contact + quote form |
| `/adatvedelem` | Privacy stub (lawyer text needed) |
| `/sutik` | Cookie stub (lawyer text needed) |

## Deploy suggestions

### Cloudflare Pages

1. Connect this GitHub repo.
2. Build command: `npm run build`
3. Output directory: `dist`
4. `_redirects` in `public/` is copied to `dist/` for 301s.

### Vercel

1. Import the repo.
2. Framework preset: Astro (or static).
3. `vercel.json` holds the same 301 map.

Set `FORM_ENDPOINT` (and optionally `PUBLIC_GTM_ID`) in the host’s env settings.

## Domain cutover (Webnode → new host)

1. Deploy preview, verify pages + form + redirects.
2. Lower DNS TTL ahead of time.
3. Point `k2napelem.hu` / `www` A/CNAME to Cloudflare Pages or Vercel.
4. Enforce one canonical host (apex **or** www) with HTTPS redirect.
5. Keep GTM (`GTM-M6LP3FTV`) and confirm conversion events on form submit.
6. Submit the new sitemap (`/sitemap-index.xml`) in Google Search Console.
7. Replace privacy/cookie stubs with lawyer-approved text before heavy ads traffic.

## Old Webnode URL → new path (301)

| Old URL | New path |
|---|---|
| `/masolat-villanyszereles2/` | `/napelemes-rendszerek` |
| `/masolat-napelemes-rendszerek2/` | `/hibrid-sziget` |
| `/masolat-villanyszereles/` | `/elektromos-futes` |
| `/masolat-elektromos-futesi-megoldasok/` | `/palyazatiras` |
| `/masolat-palyazatiras/` | `/gyik` |
| `/masolat-napelemes-rendszerek/` | `/munkaink` |
| `/napenergia-plusz-program/` | `/otthoni-energiatarolo` |
| `/adatvedelmi-szabalyzat/` | `/adatvedelem` |
| `/felhasznalasi-feltetelek/` | `/adatvedelem` |
| `/kapcsolat/` | `/kapcsolat` (same) |

**IA note:** On Webnode, `/rolunk/` incorrectly contained *villanyszerelés* content while the nav label said Villanyszerelés. On this site `/rolunk` is the real About page and `/villanyszereles` is electrical work. We deliberately **do not** 301 `/rolunk` → `/villanyszereles`, so About stays reachable.

## Form backend

1. Create a Formspree (or Basin/Getform) form that delivers to `k2@k2napelem.hu`.
2. Set `FORM_ENDPOINT` to the form’s POST URL (Vercel → Settings → Environment Variables).
3. Until then, submit opens a prefilled mailto draft (client-side fallback).

## GTM — form conversion

Consent: events fire **only** if `localStorage.k2-cookie-consent === 'accepted'` (same gate as GTM load).

| Event | When | Params |
|---|---|---|
| `form_submit` | Successful Formspree AJAX submit, **before** redirect to `/koszonjuk` | `form_id`, `page_path`, `intent` |
| `form_submit_thanks` | `/koszonjuk` page load (fallback) | `form_id`, `page_path`, `from_form_submit` |

### GTM setup (pick **one** as conversion to avoid double-counting)

1. **Trigger:** Custom Event → Event name `form_submit` (primary).
2. Optional fallback trigger: Custom Event → `form_submit_thanks`.
3. **Tag:** GA4 Event (or Conversion linker / Ads conversion) on that trigger; mark as conversion in GA4 if needed.
4. Preview in GTM, submit a test quote with cookies accepted, confirm `dataLayer` push.

## License / ownership

Private business marketing site for Kántor Krisztián EV / K2Napelem. Photos and logo are the business’s own assets, exported from the previous Webnode CDN.
