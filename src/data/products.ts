export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'futes' | 'napelem' | 'ev';
  priceFrom: number;
  priceTo?: number;
  unit?: string;
  short: string;
  description: string;
  image: string;
  highlights: string[];
};

export const products: Product[] = [
  {
    id: 'bvf-ng-300',
    slug: 'bvf-ng-300',
    name: 'BVF NG infrapanel 300 W',
    category: 'futes',
    priceFrom: 56500,
    unit: 'db',
    short: 'Fali / mennyezeti NG infrapanel — partner: BVF Heating.',
    description:
      'BVF NG 300 W fali és mennyezeti infrapanel. Partnerár a bvfheating.hu kínálatához képest kb. 2,5%-kal kedvezőbb.',
    image: '/images/shop/bvf/ng-infrapanel.webp',
    highlights: ['300 W', 'Fali / mennyezeti', 'NG széria'],
  },
  {
    id: 'bvf-ng-450',
    slug: 'bvf-ng-450',
    name: 'BVF NG infrapanel 450 W',
    category: 'futes',
    priceFrom: 75000,
    unit: 'db',
    short: 'Népszerű NG teljesítmény átlagos helyiségekhez.',
    description:
      'BVF NG 450 W infrapanel fali vagy mennyezeti rögzítéssel. Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/ng-infrapanel.webp',
    highlights: ['450 W', 'NG széria', 'Beltéri'],
  },
  {
    id: 'bvf-ng-600',
    slug: 'bvf-ng-600',
    name: 'BVF NG infrapanel 600 W',
    category: 'futes',
    priceFrom: 91500,
    unit: 'db',
    short: 'Nagyobb terekhez ajánlott NG infrapanel.',
    description:
      'BVF NG 600 W fali/mennyezeti infrapanel. Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/ng-infrapanel.webp',
    highlights: ['600 W', 'NG széria', 'Nagyobb tér'],
  },
  {
    id: 'bvf-hmat-100',
    slug: 'bvf-h-mat-100',
    name: 'BVF H-MAT fűtőszőnyeg 100 W/m²',
    category: 'futes',
    priceFrom: 16000,
    priceTo: 136500,
    unit: 'csomag',
    short: 'Vékony padlófűtés járólap / ragasztott burkolat alá.',
    description:
      'BVF H-MAT 100 W/m² elektromos fűtőszőnyeg (mérettől függő ár). Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/h-mat.webp',
    highlights: ['100 W/m²', 'Vékony rétegrend', 'Burkolat alá'],
  },
  {
    id: 'bvf-hmat-150',
    slug: 'bvf-h-mat-150',
    name: 'BVF H-MAT fűtőszőnyeg 150 W/m²',
    category: 'futes',
    priceFrom: 12500,
    priceTo: 134500,
    unit: 'csomag',
    short: 'Átlagos hőszigeteléshez és fürdőszobába javasolt.',
    description:
      'BVF H-MAT 150 W/m² fűtőszőnyeg (mérettől függő ár). Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/h-mat.webp',
    highlights: ['150 W/m²', 'Fürdőszoba', 'Komfort / fűtés'],
  },
  {
    id: 'bvf-wfd-10',
    slug: 'bvf-wfd-10w',
    name: 'BVF WFD fűtőkábel 10 W/m',
    category: 'futes',
    priceFrom: 24000,
    priceTo: 142500,
    unit: 'csomag',
    short: 'Hőtároló padlófűtés aljzatbetonba — 20–200 m sáv.',
    description:
      'BVF WFD 10 W/m elektromos fűtőkábel (hosszúságtól függő ár). Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/wfd-cable.webp',
    highlights: ['10 W/m', 'Betonba ágyazható', 'WFD'],
  },
  {
    id: 'bvf-adelig-200',
    slug: 'bvf-adelig-200',
    name: 'BVF Adelig fűthető tükör 200 W',
    category: 'futes',
    priceFrom: 48000,
    unit: 'db',
    short: '60×60 cm Bluetooth hangszórós fűthető tükör.',
    description:
      'BVF ADELIG 60×60 cm, 200 W, Bluetooth hangszóróval. Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/adelig.webp',
    highlights: ['60×60 cm', '200 W', 'Bluetooth'],
  },
  {
    id: 'bvf-adelig-350',
    slug: 'bvf-adelig-350',
    name: 'BVF Adelig fűthető tükör 350 W',
    category: 'futes',
    priceFrom: 57500,
    unit: 'db',
    short: '100×60 cm Bluetooth hangszórós fűthető tükör.',
    description:
      'BVF ADELIG 100×60 cm, 350 W, Bluetooth hangszóróval. Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/adelig.webp',
    highlights: ['100×60 cm', '350 W', 'Fürdőszoba'],
  },
  {
    id: 'intuis-ezybain-500',
    slug: 'intuis-ezybain-500',
    name: 'Intuis Ezybain törölközőszárító 500 W',
    category: 'futes',
    priceFrom: 135500,
    unit: 'db',
    short: 'Elektromos törölközőszárító radiátor — fehér / fekete.',
    description:
      'Intuis Ezybain 500 W elektromos törölközőszárító. Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/ezybain.webp',
    highlights: ['500 W', 'Törölközőszárító', 'Intuis'],
  },
  {
    id: 'intuis-tactic',
    slug: 'intuis-tactic',
    name: 'Intuis Tactic fűtőpanel',
    category: 'futes',
    priceFrom: 55500,
    priceTo: 83500,
    unit: 'db',
    short: '500–2500 W elektromos fűtőpanel — népszerű Intuis széria.',
    description:
      'Intuis Tactic elektromos fűtőpanel (teljesítménytől függő ár, 500–2500 W). Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/tactic.webp',
    highlights: ['500–2500 W', 'Intuis Tactic', 'Fali panel'],
  },
  {
    id: 'bvf-cp1-wifi',
    slug: 'bvf-cp1-wifi',
    name: 'BVF CP1 WiFi fűtőpanel',
    category: 'futes',
    priceFrom: 31500,
    priceTo: 38000,
    unit: 'db',
    short: 'WiFi-s elektromos fűtőpanel 1000–2000 W.',
    description:
      'BVF CP1 WiFi elektromos fűtőpanel (1000 / 1500 / 2000 W). Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/cp1.webp',
    highlights: ['WiFi', '1000–2000 W', 'CP1'],
  },
  {
    id: 'hibrid-5',
    slug: 'hibrid-csomag-5kwp',
    name: 'Hibrid csomag 5 kWp + 5 kWh',
    category: 'napelem',
    priceFrom: 4450000,
    unit: 'rendszer',
    short: '5 kWp napelem + Sofar hybrid inverter + 5 kW akkupakk — tájékoztató ár.',
    description:
      'Orientáló csomagár a régi kínálat alapján. Pontos árajánlat felmérés után. A példák nem minősülnek ajánlatnak.',
    image: '/images/services/hybrid.webp',
    highlights: ['5 kWp', 'Sofar hybrid', '5 kWh tároló'],
  },
  {
    id: 'hibrid-10',
    slug: 'hibrid-csomag-10kwp',
    name: 'Hibrid csomag 10 kWp + 10 kWh',
    category: 'napelem',
    priceFrom: 6500000,
    unit: 'rendszer',
    short: '10 kWp napelem + Sofar hybrid + 10 kW akkupakk — tájékoztató ár.',
    description: 'Nagyobb háztartásokhoz / magasabb fogyasztáshoz. Felmérés után pontosítjuk.',
    image: '/images/services/hybrid.webp',
    highlights: ['10 kWp', 'Sofar hybrid', '10 kWh tároló'],
  },
  {
    id: 'besen-smart-74',
    slug: 'besen-smart-74kw',
    name: 'Besen SMART fali töltő 7,4 kW',
    category: 'ev',
    priceFrom: 203900,
    unit: 'db',
    short: 'Type 2, fix 6 m kábel, app + kijelző — partnerünk: EVsOLUTION.',
    description:
      'Besen Wallbox SMART, 7,4 kW, 1 fázis, Type 2, fix 6 m kábel. Bluetooth/Wi-Fi app, LCD kijelző, IP66, 24 hónap garancia. Telepítéssel együtt érdeklődhet. Partnerár: EVsOLUTION webshophoz képest kb. 2,5%-kal kedvezőbb.',
    image: '/images/shop/ev/besen-smart-74.webp',
    highlights: ['7,4 kW', 'Type 2 / 6 m', 'App + kijelző'],
  },
  {
    id: 'besen-smart-11',
    slug: 'besen-smart-11kw',
    name: 'Besen SMART fali töltő 11 kW',
    category: 'ev',
    priceFrom: 218900,
    unit: 'db',
    short: '3 fázis, Type 2, 6 m kábel, okos app — népszerű otthoni választás.',
    description:
      'Besen WALLBOX SMART 11 kW (3×16A), Type 2, fix 6 m kábel. Mobilapp (Bluetooth/Wi-Fi), kijelző, IP66, CE/TÜV, 24 hónap garancia. Telepítést vállalunk. Partnerár: EVsOLUTION-hoz képest kb. 2,5%-kal kedvezőbb.',
    image: '/images/shop/ev/besen-smart-11.webp',
    highlights: ['11 kW', '3 fázis', 'App vezérlés'],
  },
  {
    id: 'besen-smart-22',
    slug: 'besen-smart-22kw',
    name: 'Besen SMART fali töltő 22 kW',
    category: 'ev',
    priceFrom: 235900,
    unit: 'db',
    short: '22 kW Type 2, 6 m kábel — az EVsOLUTION kiemelt népszerű modellje.',
    description:
      'Besen wallbox SMART 22 kW, Type 2, fix 6 m kábel, 3 fázis. App + kijelző, 24 hónap garancia. Ideális nagyobb teljesítményű otthoni / telephelyi töltéshez. Partnerár: EVsOLUTION-hoz képest kb. 2,5%-kal kedvezőbb.',
    image: '/images/shop/ev/besen-smart-22.webp',
    highlights: ['22 kW', 'Type 2 / 6 m', 'SMART'],
  },
  {
    id: 'besen-basic-22',
    slug: 'besen-basic-22kw',
    name: 'Besen BASIC fali töltő 22 kW',
    category: 'ev',
    priceFrom: 223900,
    unit: 'db',
    short: 'Megbízható 22 kW BASIC wallbox fix 6 m kábellel — erős ár/érték.',
    description:
      'Besen Wallbox BASIC 22 kW, Type 2, fix 6 m, 3 fázis, kijelző, 24 hónap garancia. Egyszerű, strapabíró otthoni/telephelyi töltő. Partnerár: EVsOLUTION-hoz képest kb. 2,5%-kal kedvezőbb.',
    image: '/images/shop/ev/besen-basic-22.webp',
    highlights: ['22 kW', 'BASIC', '6 m kábel'],
  },
  {
    id: 'rheidon-11',
    slug: 'rheidon-11kw',
    name: 'Rheidon Wallbox 11 kW',
    category: 'ev',
    priceFrom: 262900,
    unit: 'db',
    short: 'Vékony Rheidon fali töltő 11 kW, app + RFID, 6 m Type 2.',
    description:
      'Rheidon Tech Wallbox 11 kW, Type 2, 6 m kábel, 3 fázis. App/RFID, kijelző, IP65, 24 hónap garancia. Kompakt kialakítás otthonra. Partnerár: EVsOLUTION-hoz képest kb. 2,5%-kal kedvezőbb.',
    image: '/images/shop/ev/rheidon-11.webp',
    highlights: ['11 kW', 'App + RFID', 'Kompakt'],
  },
  {
    id: 'wallbox-pulsar-plus-74',
    slug: 'wallbox-pulsar-plus-74kw',
    name: 'Wallbox Pulsar Plus 7,4 kW',
    category: 'ev',
    priceFrom: 291900,
    unit: 'db',
    short: 'Prémium Pulsar Plus + Power Boost + kábel dokk, 5 m Type 2.',
    description:
      'Wallbox Pulsar Plus 7,4 kW + Power Boost (1 fázis) + kábel dokk, fekete, 5 m Type 2. App, OCPP, napelem/DLB támogatással (mérővel), 36 hónap garancia. Partnerár: EVsOLUTION-hoz képest kb. 2,5%-kal kedvezőbb.',
    image: '/images/shop/ev/wallbox-pulsar-plus-74.webp',
    highlights: ['7,4 kW', 'Power Boost', 'OCPP / app'],
  },
];

export function formatHuf(value: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(value);
}

export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
