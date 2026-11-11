export const site = {
  name: 'K2Napelem',
  legalName: 'Kántor Krisztián EV',
  tagline: 'Napelem, villanyszerelés és pályázat — Pócsmegyerről, országosan.',
  url: 'https://k2napelem.hu',
  phone: '+36 30 2677 665',
  phoneHref: 'tel:+36302677665',
  email: 'k2@k2napelem.hu',
  emailHref: 'mailto:k2@k2napelem.hu',
  address: '2017 Pócsmegyer, Táncsics út 10.',
  hours: 'Telefon: hétköznap 9–16 · írásban bármikor',
  /** Google Cégem / Maps profil URL — ha megvan, a schema sameAs és a kapcsolat oldal használja */
  googleBusinessUrl: 'https://share.google/WkhDZrxtdrCk8DQZV',
  whatsapp: '+36 30 2677 665',
  whatsappHref: 'https://wa.me/36302677665',
  serviceArea: 'Országos lefedettség — központ: Pócsmegyer',
  gtmId: import.meta.env.PUBLIC_GTM_ID || 'GTM-542MMSL',
  // Formspree AJAX endpoint (overridable on Vercel via FORM_ENDPOINT).
  formEndpoint:
    (typeof process !== 'undefined' && process.env.FORM_ENDPOINT) ||
    import.meta.env.FORM_ENDPOINT ||
    import.meta.env.PUBLIC_FORM_ENDPOINT ||
    'https://formspree.io/f/meagjleq',
} as const;

/** Primary nav — short and logical */
export const nav = [
  { href: '/napelemes-rendszerek', label: 'Napelem' },
  { href: '/kalkulator', label: 'Kalkulátor' },
  { href: '/bolt', label: 'Bolt' },
  { href: '/szolgaltatasok', label: 'Szolgáltatások' },
  { href: '/palyazati-lehetosegek', label: 'Pályázatok' },
  { href: '/munkaink', label: 'Munkáink' },
  { href: '/kapcsolat', label: 'Kapcsolat' },
] as const;

export const footerNav = [
  { href: '/rolunk', label: 'Rólunk' },
  { href: '/gyik', label: 'GYIK' },
  { href: '/hibrid-sziget', label: 'Hibrid / sziget' },
  { href: '/villanyszereles', label: 'Villanyszerelés' },
  { href: '/elektromos-futes', label: 'E-fűtés' },
  { href: '/palyazati-lehetosegek', label: 'Pályázati lehetőségek' },
  { href: '/palyazatiras', label: 'Pályázatírás' },
  { href: '/otthoni-energiatarolo', label: 'OETP' },
  { href: '/adatvedelem', label: 'Adatvédelem' },
  { href: '/sutik', label: 'Sütik' },
] as const;

export const services = [
  {
    href: '/napelemes-rendszerek',
    title: 'Napelemes rendszerek',
    lead: 'Felméréstől a készre jelentésig — tetőre vagy földre, teljes ügyintézéssel.',
    image: '/images/hero-roof.webp',
  },
  {
    href: '/hibrid-sziget',
    title: 'Hibrid és szigetüzem',
    lead: 'Energiatárolóval: a napközben megtermelt áram este is otthon marad.',
    image: '/images/services/hybrid.webp',
  },
  {
    href: '/villanyszereles',
    title: 'Villanyszerelés',
    lead: 'Új építés, felújítás, mérőhely, hibakeresés — tapasztalt szakemberekkel.',
    image: '/images/services/electrical.webp',
  },
  {
    href: '/elektromos-futes',
    title: 'Elektromos fűtés',
    lead: 'Hőszivattyú, infrapanel, fűtőszőnyeg és okos megoldások egy helyen.',
    image: '/images/services/heating.webp',
  },
  {
    href: '/palyazatiras',
    title: 'Pályázatírás',
    lead: 'Lakossági és céges energetikai támogatások — előkészítéstől a zárásig.',
    image: '/images/services/grants.webp',
  },
] as const;

export const gallery = [
  { src: '/images/gallery/20200612_191349.webp', alt: 'Napelemes tetőtelepítés — saját kivitelezés' },
  { src: '/images/gallery/20210703_170213.webp', alt: 'Napelemsor családi ház tetején' },
  { src: '/images/gallery/20210806_123554.webp', alt: 'Napelemes rendszer telepítés közben' },
  { src: '/images/gallery/20220215_151858.webp', alt: 'Kész napelemes tető' },
  { src: '/images/gallery/20220301_154013.webp', alt: 'Napelem panel rögzítés' },
  { src: '/images/gallery/20220303_163044.webp', alt: 'Napelemes rendszer átadás után' },
  { src: '/images/gallery/20220404_170059.webp', alt: 'Tetőre szerelt napelemek' },
  { src: '/images/gallery/20220411_171504.webp', alt: 'Lakossági napelemes kivitelezés' },
  { src: '/images/gallery/20220504_190923.webp', alt: 'Napelem telepítés alkonyatkor' },
  { src: '/images/gallery/20220511_123952.webp', alt: 'Napelemsor részlete' },
  { src: '/images/gallery/20220517_110519.webp', alt: 'Napelemes rendszer családi házon' },
  { src: '/images/gallery/20220727_122309.webp', alt: 'Nagyobb napelemes telepítés' },
  { src: '/images/gallery/20230130.webp', alt: 'Napelem kivitelezés 2023' },
  { src: '/images/gallery/20230529_115424.webp', alt: 'Napelemszerelés tetőn' },
  { src: '/images/gallery/Felix2.webp', alt: 'Napelemes rendszer — referenciamunka' },
  { src: '/images/gallery/Felix3.webp', alt: 'Napelem telepítés közeli részlet' },
  { src: '/images/gallery/TreeSystem8.webp', alt: 'Földre telepített napelemes rendszer' },
  { src: '/images/gallery/MAHART.webp', alt: 'Céges / különleges napelemes telepítés' },
  { src: '/images/gallery/IMG_1647.webp', alt: 'Napelem kivitelezés' },
  { src: '/images/gallery/received1.webp', alt: 'Elkészült napelemes rendszer' },
] as const;

/** Rövid, számokkal alátámasztott referenciapéldák (tájékoztató) */
export const references = [
  {
    title: 'Családi ház — tető',
    place: 'Pest megye',
    stats: [
      { label: 'Méret', value: '10 kWp' },
      { label: 'Panelek', value: '~24 db' },
      { label: 'Havi számla előtte', value: '~60 000 Ft' },
    ],
    note: 'Villany + fűtés áram kiváltására méretezve, teljes ügyintézéssel.',
  },
  {
    title: 'Földtelepítés',
    place: 'TreeSystem tartószerkezet',
    stats: [
      { label: 'Méret', value: '12,3 kWp' },
      { label: 'Típus', value: 'N-cellás' },
      { label: 'Helyszín', value: 'udvar / telek' },
    ],
    note: 'Ahol a tető nem volt ideális — földre telepített, saját kivitelezés.',
  },
  {
    title: 'Céges rendszer',
    place: 'Lapostető',
    stats: [
      { label: 'Méret', value: '50 kWp' },
      { label: 'Ügyfél', value: 'vállalkozás' },
      { label: 'Kivitelezés', value: 'egy kézből' },
    ],
    note: 'Nagyobb teljesítmény, engedélyeztetéssel és átadással.',
  },
] as const;

export const faqs = [
  {
    q: 'Valóban 25 év a garancia a napelemekhez?',
    a: 'A gyártók általában 10 év termék- és 20–25 év teljesítménygaranciát adnak. A teljesítménygarancia tipikusan 10 év után legalább 90%, 25 év után legalább 80% termelést biztosít. Az inverterekre jellemzően 5–10 év a gyári jótállás, ami bővíthető. A hosszú távú működéshez azonban a pontos telepítés a kulcs.',
  },
  {
    q: 'Napelemes rendszerek után is kell adót fizetni?',
    a: 'Létezik napelemadó jogszabályi keret, de a gyakorlatban a releváns tétel jelenleg 0 Ft. A háztartási méretű rendszerek mellett a megújulók támogatása a kormányzati szándék része — a pontos aktuális szabályokról érdeklődéskor tájékoztatunk.',
  },
  {
    q: 'Kell-e engedély a napelemek felszereléséhez?',
    a: 'A háztartási méretű, hálózatra csatlakozó rendszerek általában nem építési engedélykötelesek, de be kell jelenteni őket a területileg illetékes áramszolgáltatónál. A nagyobb, 50 kW feletti vagy speciális rendszerekhez további hatósági lépések tartozhatnak — ebben is segítünk.',
  },
  {
    q: '0 Ft-os villanyszámla lehetséges napelemekkel?',
    a: 'Ideális méretezés és elszámolás mellett a villamosenergia-számla jelentősen csökkenthető, akár közel nullázható a fogyasztás fedezésével. A fűtés, a háztartási szokások és az elszámolási mód befolyásolja az eredményt — ezért készítünk egyedi kalkulációt.',
  },
  {
    q: 'Milyen karbantartást igényel a rendszer?',
    a: 'A napelemeknek nincs mozgó alkatrésze; az eső általában elegendő tisztítást biztosít. Érdemes időnként ellenőrizni a termelési adatokat, és ha rendellenességet tapasztal, jelezze felénk.',
  },
  {
    q: 'A szélsőséges időjárás (pl. jégeső) kárt tehet a panelekben?',
    a: 'A minősített panelek edzett üveggel készülnek, és bírják a szokásos időjárási terhelést (a gyári tesztek jégesőt is szimulálnak). Extrém esetben — ha a tető is komoly kárt szenved — a panelek is sérülhetnek.',
  },
  {
    q: 'Mi történik éjszaka a napelemekkel?',
    a: 'Éjszaka a panelek nem termelnek. Hálózatos rendszernél a fogyasztást a hálózat fedezi; hibrid vagy szigetüzemű rendszerben az akkumulátorban tárolt nappali energia használható.',
  },
  {
    q: 'Napelem vagy napkollektor?',
    a: 'A napkollektor hőt (meleg vizet) állít elő, a napelem villamos energiát. Otthoni áramtermeléshez napelem kell; melegvíz-készítéshez napkollektor vagy hőszivattyús megoldás jöhet szóba.',
  },
  {
    q: 'Mennyi a hálózatra csatlakozás költsége?',
    a: 'A rendelkezésre álló teljesítményig általában nincs külön csatlakozási díj a napelemes termelő berendezés miatt. A mérőcsere / átprogramozás az elosztó feladata saját költségén — az aktuális szolgáltatói feltételeket mindig egyeztetjük.',
  },
  {
    q: 'Mennyi idő a megtérülés?',
    a: 'A megtérülés azt mutatja, hány év alatt jön vissza a beruházás a megspórolt áramon. Függ a fogyasztástól, a saját felhasználás arányától, a tájolástól, az elszámolási módtól, az energiaáraktól és attól, van-e támogatás. Hagyományos hálózatos rendszereknél jó feltételek mellett gyakran kb. 8–10 évről beszélünk; a panelek viszont 20–25+ évig termelnek. Hibrid + tároló esetén a beruházás nagyobb, a szimpla megtérülés hosszabb lehet — cserébe több saját áramot használ fel, és kevésbé függ a hálózattól. Pályázattal a saját rész csökkenhet. Pontos számot felmérés és egyedi kalkuláció után adunk.',
  },
] as const;
