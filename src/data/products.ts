export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'futes' | 'csomag';
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
    id: 'noirot-spot-d',
    slug: 'noirot-spot-d',
    name: 'Noirot Spot-D fűtőpanel',
    category: 'futes',
    priceFrom: 56000,
    priceTo: 84000,
    unit: 'db',
    short: '500–2500 W energiatakarékos fali panel RX Silence betéttel.',
    description:
      'Ablaknyitás-érzékelés, beépített digitális programozható termosztát, villásdugóval + 1,8 m kábel, fali konzol. 1+4 év garancia.',
    image: '/images/shop/noirot-heating.webp',
    highlights: ['Ablaknyitás érzékelés', 'Digitális termosztát', '1+4 év garancia'],
  },
  {
    id: 'bvf-kobe',
    slug: 'bvf-kobe-torolkozoszariito',
    name: 'BVF Kobe 500W törölközőszárító',
    category: 'futes',
    priceFrom: 68000,
    unit: 'db',
    short: 'Programozható, digitális 500 W — szárításra és önálló fűtésre is.',
    description:
      'Törölközőszárítás akár önálló fűtésre is alkalmas programozható, digitális 500 W fűtési teljesítménnyel.',
    image: '/images/shop/kobe.webp',
    highlights: ['500 W', 'Programozható', 'Fürdőszobába'],
  },
  {
    id: 'bvf-ng-300',
    slug: 'bvf-ng-300',
    name: 'BVF NG infrapanel 300 W',
    category: 'futes',
    priceFrom: 55000,
    unit: 'db',
    short: '90×30 cm fali/mennyezeti infrapanel Graphite fűtőbetéttel.',
    description: 'Innovatív energiatakarékos elektromos infra fűtőpanel fali és mennyezeti rögzítéssel.',
    image: '/images/shop/infrapanel.webp',
    highlights: ['90×30 cm', 'Graphite betét', 'Fali / mennyezeti'],
  },
  {
    id: 'bvf-ng-350',
    slug: 'bvf-ng-350',
    name: 'BVF NG infrapanel 350 W',
    category: 'futes',
    priceFrom: 57000,
    unit: 'db',
    short: '60×60 cm infrapanel beltéri használatra.',
    description: 'BVF NG 350 W (60×60 cm) — energiatakarékos infra fűtés Graphite betéttel.',
    image: '/images/shop/infrapanel.webp',
    highlights: ['60×60 cm', '350 W', 'Beltéri'],
  },
  {
    id: 'bvf-ng-500',
    slug: 'bvf-ng-500',
    name: 'BVF NG infrapanel 500 W',
    category: 'futes',
    priceFrom: 73500,
    unit: 'db',
    short: '90×60 cm — átlagos helyiségekhez ajánlott teljesítmény.',
    description: 'BVF NG 500 W (90×60 cm) infrapanel fali vagy mennyezeti rögzítéssel.',
    image: '/images/shop/infrapanel.webp',
    highlights: ['90×60 cm', '500 W', 'Nagyobb helyiség'],
  },
  {
    id: 'bvf-ng-700',
    slug: 'bvf-ng-700',
    name: 'BVF NG infrapanel 700 W',
    category: 'futes',
    priceFrom: 91500,
    unit: 'db',
    short: '120×60 cm — nagyobb terekhez, magasabb belmagassághoz.',
    description: 'BVF NG 700 W (120×60 cm). 2,7 m feletti belmagassághoz ajánlott tartomány.',
    image: '/images/shop/infrapanel.webp',
    highlights: ['120×60 cm', '700 W', 'Magasabb tér'],
  },
  {
    id: 'futoszonyeg-100',
    slug: 'futoszonyeg-100',
    name: 'Fűtőszőnyeg 100 W/m²',
    category: 'futes',
    priceFrom: 16200,
    priceTo: 138000,
    unit: 'csomag',
    short: 'Alacsony energiaigényű épületek padlófűtéséhez.',
    description:
      'Vékony rétegrendben kialakítható elektromos padlófűtés járólap, greslap, vinyl és egyéb ragasztott burkolatok alá. Fürdőben és épített zuhany alatt is használható.',
    image: '/images/shop/futoszonyeg.webp',
    highlights: ['100 W/m²', 'Vékony rétegrend', 'Burkolat alá'],
  },
  {
    id: 'futoszonyeg-150',
    slug: 'futoszonyeg-150',
    name: 'Fűtőszőnyeg 150 W/m²',
    category: 'futes',
    priceFrom: 12900,
    priceTo: 135000,
    unit: 'csomag',
    short: 'Átlagos hőszigeteléshez és fürdőszobába javasolt.',
    description: '150 W/m² fűtőszőnyeg átlagos hőszigetelésű helyiségekhez és fürdőszobába.',
    image: '/images/shop/futoszonyeg.webp',
    highlights: ['150 W/m²', 'Fürdőszoba', 'Komfort / fűtés'],
  },
  {
    id: 'futokabel-10',
    slug: 'futokabel-10w',
    name: 'BVF fűtőkábel 10 W/m',
    category: 'futes',
    priceFrom: 16000,
    priceTo: 142500,
    unit: 'csomag',
    short: 'Hőtároló padlófűtés aljzatbetonba ágyazva (10–200 m).',
    description: 'Költséghatékony megoldás hőtároló padlófűtésekhez az aljzatbeton rétegbe ágyazva.',
    image: '/images/shop/futokabel.webp',
    highlights: ['10 W/m', 'Betonba ágyazható', '10–200 m'],
  },
  {
    id: 'adelig-200',
    slug: 'bvf-adelig-200',
    name: 'BVF Adelig okostükör 200 W',
    category: 'futes',
    priceFrom: 92000,
    unit: 'db',
    short: '60×60 cm LED fürdőszobai tükör fűtéssel.',
    description:
      'Letisztult design, torzításmentes tükör, LED világítás és fűtés. Okos funkciók Android / iOS appban.',
    image: '/images/shop/adelig.webp',
    highlights: ['60×60 cm', 'LED + fűtés', 'Okos app'],
  },
  {
    id: 'adelig-350',
    slug: 'bvf-adelig-350',
    name: 'BVF Adelig okostükör 350 W',
    category: 'futes',
    priceFrom: 105600,
    unit: 'db',
    short: '100×60 cm LED fürdőszobai okostükör.',
    description: 'BVF Adelig 350 W — 100×60 cm, LED, fűtés, okos funkciók.',
    image: '/images/shop/adelig.webp',
    highlights: ['100×60 cm', '350 W', 'Fürdőszoba'],
  },
  {
    id: 'hibrid-5',
    slug: 'hibrid-csomag-5kwp',
    name: 'Hibrid csomag 5 kWp + 5 kWh',
    category: 'csomag',
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
    category: 'csomag',
    priceFrom: 6500000,
    unit: 'rendszer',
    short: '10 kWp napelem + Sofar hybrid + 10 kW akkupakk — tájékoztató ár.',
    description: 'Nagyobb háztartásokhoz / magasabb fogyasztáshoz. Felmérés után pontosítjuk.',
    image: '/images/services/hybrid.webp',
    highlights: ['10 kWp', 'Sofar hybrid', '10 kWh tároló'],
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
