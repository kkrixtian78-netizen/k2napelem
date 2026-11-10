# K2Napelem — marketing website

Hungarian marketing site for **K2Napelem** (domain: [k2napelem.hu](https://k2napelem.hu)).  
Stack: **Astro** + **Tailwind CSS**. Content salvaged from the previous Webnode site; assets re-hosted under `public/images/`.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Environment variables

| Variable | Purpose |
|---|---|
| `PUBLIC_FORM_ENDPOINT` | Formspree / Basin / Getform (or similar) POST URL for the quote form. If empty, the form falls back to a `mailto:k2@k2napelem.hu` draft. |
| `PUBLIC_GTM_ID` | Google Tag Manager ID (default in code: `GTM-542MMSL`). |

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

Set `PUBLIC_FORM_ENDPOINT` (and optionally `PUBLIC_GTM_ID`) in the host’s env settings.

## Domain cutover (Webnode → new host)

1. Deploy preview, verify pages + form + redirects.
2. Lower DNS TTL ahead of time.
3. Point `k2napelem.hu` / `www` A/CNAME to Cloudflare Pages or Vercel.
4. Enforce one canonical host (apex **or** www) with HTTPS redirect.
5. Keep GTM (`GTM-542MMSL`) and confirm conversion events on form submit.
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
2. Set `PUBLIC_FORM_ENDPOINT` to the form’s POST URL.
3. Until then, submit opens a prefilled mailto draft (client-side fallback).

## License / ownership

Private business marketing site for Kántor Krisztián EV / K2Napelem. Photos and logo are the business’s own assets, exported from the previous Webnode CDN.
