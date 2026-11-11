export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'futes' | 'napelem' | 'ev';
  /** Nettó Ft (ÁFA nélkül) */
  priceFrom: number;
  /** Nettó Ft (ÁFA nélkül) */
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
    priceFrom: 44500,
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
    priceFrom: 59100,
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
    priceFrom: 72000,
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
    priceFrom: 12600,
    priceTo: 107500,
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
    priceFrom: 9800,
    priceTo: 105900,
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
    priceFrom: 18900,
    priceTo: 112200,
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
    priceFrom: 37800,
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
    priceFrom: 45300,
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
    priceFrom: 106700,
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
    priceFrom: 43700,
    priceTo: 65700,
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
    priceFrom: 24800,
    priceTo: 29900,
    unit: 'db',
    short: 'WiFi-s elektromos fűtőpanel 1000–2000 W.',
    description:
      'BVF CP1 WiFi elektromos fűtőpanel (1000 / 1500 / 2000 W). Partnerár: BVF Heating (−2,5%).',
    image: '/images/shop/bvf/cp1.webp',
    highlights: ['WiFi', '1000–2000 W', 'CP1'],
  },
  {
    id: 'cs-hiku6-420',
    slug: 'canadiansolar-hiku6-420w',
    name: 'CanadianSolar HiKu6 CS6R-420MS BF 420 W',
    category: 'napelem',
    priceFrom: 23200,
    unit: 'db',
    short: 'Fekete keretes 420 W panel — 35 db / raklap.',
    description:
      'CanadianSolar HiKu6 CS6R-420MS BF 420 W, fekete keret. Raklap: 35 db. Bruttó irányár kb. 29 500 Ft.',
    image: '/images/shop/pv/canadiansolar-420.webp',
    highlights: ['420 W', 'Fekete keret', '35 db/raklap'],
  },
  {
    id: 'dah-460',
    slug: 'dah-solar-460w',
    name: 'DAH Solar 460 W N-type',
    category: 'napelem',
    priceFrom: 24000,
    unit: 'db',
    short: 'DHN-48Z16/DG(BW) — bruttó kb. 30 500 Ft-tól.',
    description: 'DAH Solar 460 W N-type bifaciális panel. Bruttó irányár kb. 30 500 Ft.',
    image: '/images/shop/pv/dah-460.webp',
    highlights: ['460 W', 'N-type', 'Bifaciális'],
  },
  {
    id: 'astronergy-515',
    slug: 'astronergy-chsm54rn-515w',
    name: 'Astronergy CHSM54RN(DG)(BF)/F-BH 515 W',
    category: 'napelem',
    priceFrom: 27500,
    unit: 'db',
    short: 'N-type fekete keretes 515 W panel.',
    description:
      'Astronergy CHSM54RN(DG)(BF)/F-BH 515 W N-type, fekete keret. Bruttó irányár kb. 34 900 Ft.',
    image: '/images/shop/pv/astronergy-515.webp',
    highlights: ['515 W', 'N-type', 'Fekete keret'],
  },
  {
    id: 'deye-5k-1f',
    slug: 'deye-sun-5k-sg05lp1',
    name: 'Deye SUN-5K-SG05LP1-EU hibrid 5 kW',
    category: 'napelem',
    priceFrom: 365300,
    unit: 'db',
    short: '1 fázisú LV hibrid inverter — háztartási kedvenc.',
    description:
      'Deye SUN-5K-SG05LP1-EU, 5 kW, 1 fázis, alacsony feszültségű akkukompatibilitás. Ár: EPV Solar −2,5%.',
    image: '/images/shop/pv/deye-5k-1f.webp',
    highlights: ['5 kW', '1 fázis', 'LV hibrid'],
  },
  {
    id: 'deye-5k-3f',
    slug: 'deye-sun-5k-sg05lp3',
    name: 'Deye SUN-5K-SG05LP3-EU hibrid 5 kW',
    category: 'napelem',
    priceFrom: 495200,
    unit: 'db',
    short: '3 fázisú aszimmetrikus LV hibrid inverter.',
    description:
      'Deye SUN-5K-SG05LP3-EU, 5 kW, 3 fázis, LV. Ár: EPV Solar −2,5%.',
    image: '/images/shop/pv/deye-5k-3f.webp',
    highlights: ['5 kW', '3 fázis', 'Aszimmetrikus'],
  },
  {
    id: 'deye-10k-hv',
    slug: 'deye-sun-10k-sg02hp3',
    name: 'Deye SUN-10K-SG02HP3-EU-AM2 hibrid 10 kW',
    category: 'napelem',
    priceFrom: 492000,
    unit: 'db',
    short: '3 fázisú HV hibrid — nagyobb rendszerekhez.',
    description:
      'Deye SUN-10K-SG02HP3-EU-AM2, 10 kW, 3 fázis, magas feszültségű. Ár: EPV Solar −2,5%.',
    image: '/images/shop/pv/deye-10k.webp',
    highlights: ['10 kW', '3 fázis HV', 'Hibrid'],
  },
  {
    id: 'deye-se-f51',
    slug: 'deye-se-f-5-1-pro-c',
    name: 'Deye SE-F 5.1 Pro-C 5,12 kWh',
    category: 'napelem',
    priceFrom: 291300,
    unit: 'db',
    short: 'LV LiFePO4 energiatároló kijelzővel — stackelhető.',
    description:
      'Deye SE-F 5.1 Pro-C LV akkumulátor, 5,12 kWh, kijelzővel. Ár: EPV Solar −2,5%.',
    image: '/images/shop/pv/deye-se-f51.webp',
    highlights: ['5,12 kWh', 'LV', 'Pro-C'],
  },
  {
    id: 'deye-se-f12',
    slug: 'deye-se-f12-c',
    name: 'Deye SE-F12-C 11,8 kWh',
    category: 'napelem',
    priceFrom: 470800,
    unit: 'db',
    short: 'Lakossági LV energiatároló — egy egységben ~12 kWh.',
    description:
      'Deye SE-F12-C akkumulátor, 11,8 kWh LV. Ár: EPV Solar −2,5%.',
    image: '/images/shop/pv/deye-se-f12.webp',
    highlights: ['11,8 kWh', 'LV', 'Lakossági'],
  },
  {
    id: 'enerack-sin-36',
    slug: 'enerack-szerelosin-36',
    name: 'Enerack alumínium szerelősín 3,6 m',
    category: 'napelem',
    priceFrom: 5900,
    unit: 'db',
    short: 'Alumínium tartósín napelem rögzítéshez.',
    description:
      'Enerack 3,6 m alumínium szerelősín. Ár a kedvező HU kisker (Solarfutár) alapján, −2,5%.',
    image: '/images/shop/pv/enerack-sin.webp',
    highlights: ['3,6 m', 'Enerack', 'Alu sín'],
  },
  {
    id: 'enerack-kampo',
    slug: 'enerack-tetokampo-180',
    name: 'Enerack állítható tetőkampó 180 mm',
    category: 'napelem',
    priceFrom: 1400,
    unit: 'db',
    short: 'Cseréptetőhöz — állítható kampó.',
    description:
      'Enerack állítható tetőkampó 180 mm, cseréptetőhöz. Ár: Solarfutár −2,5%.',
    image: '/images/shop/pv/enerack-kampo.webp',
    highlights: ['180 mm', 'Cseréptető', 'Állítható'],
  },
  {
    id: 'enerack-leszorito',
    slug: 'enerack-leszorito-30-40',
    name: 'Enerack leszorító szett 30–40 mm',
    category: 'napelem',
    priceFrom: 400,
    unit: 'db',
    short: 'Köztes / szélső leszorító — fekete vagy ezüst.',
    description:
      'Enerack univerzális leszorító szett 30–40 mm kerethez. Ár: Solarfutár −2,5%.',
    image: '/images/shop/pv/enerack-leszorito.webp',
    highlights: ['30–40 mm', 'Köztes / szélső', 'Enerack'],
  },
  {
    id: 'mc4-par',
    slug: 'mc4-csatlakozo-par',
    name: 'MC4 csatlakozó pár (apa–anya)',
    category: 'napelem',
    priceFrom: 400,
    unit: 'pár',
    short: 'Szabványos MC4 csatlakozópár napelem kábelezéshez.',
    description: 'MC4 apa–anya csatlakozó pár. Ár: Solarfutár −2,5%.',
    image: '/images/shop/pv/mc4.webp',
    highlights: ['MC4', 'Apa–anya', 'PV kábelezés'],
  },
  {
    id: 'solar-kabel-6',
    slug: 'solar-kabel-6mm2',
    name: 'Solar kábel 6 mm² (fm)',
    category: 'napelem',
    priceFrom: 300,
    unit: 'fm',
    short: '6 mm² PV kábel — fekete vagy piros, méterre.',
    description:
      'Napelemes solar kábel 6 mm², méterre vágva (fekete/piros). Ár: Solarfutár −2,5%.',
    image: '/images/shop/pv/solar-kabel.webp',
    highlights: ['6 mm²', 'Méterre', 'PV'],
  },
  {
    id: 'pv-dc-doboz',
    slug: 'pv-csatlakozodoboz-2string',
    name: 'PV csatlakozódoboz 2 string + túlfeszvédelem',
    category: 'napelem',
    priceFrom: 36900,
    unit: 'db',
    short: '2 stringes DC doboz, 600 V DC, 32 A MCB.',
    description:
      'PV csatlakozódoboz túlfeszültség-védelemmel, 2 string, 600 V DC. Ár: Solarfutár −2,5%.',
    image: '/images/shop/pv/pv-doboz.webp',
    highlights: ['2 string', 'SPD', 'DC MCB'],
  },
  {
    id: 'besen-smart-74',
    slug: 'besen-smart-74kw',
    name: 'Besen SMART fali töltő 7,4 kW',
    category: 'ev',
    priceFrom: 160600,
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
    priceFrom: 172400,
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
    priceFrom: 185700,
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
    priceFrom: 176300,
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
    priceFrom: 207000,
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
    priceFrom: 229800,
    unit: 'db',
    short: 'Prémium Pulsar Plus + Power Boost + kábel dokk, 5 m Type 2.',
    description:
      'Wallbox Pulsar Plus 7,4 kW + Power Boost (1 fázis) + kábel dokk, fekete, 5 m Type 2. App, OCPP, napelem/DLB támogatással (mérővel), 36 hónap garancia. Partnerár: EVsOLUTION-hoz képest kb. 2,5%-kal kedvezőbb.',
    image: '/images/shop/ev/wallbox-pulsar-plus-74.webp',
    highlights: ['7,4 kW', 'Power Boost', 'OCPP / app'],
  },
];

/** Árak a katalógusban nettó Ft (ÁFA nélkül). */
export const VAT_RATE = 0.27;

export function formatHuf(value: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(value);
}

export function grossFromNet(net: number): number {
  return Math.round(net * (1 + VAT_RATE));
}

/** pl. 23 200 Ft-tól + ÁFA (29 464 Ft) */
export function formatNetVat(net: number, opts?: { from?: boolean }): string {
  const gross = grossFromNet(net);
  const suffix = opts?.from ? '-tól' : '';
  return `${formatHuf(net)}${suffix} + ÁFA (${formatHuf(gross)})`;
}

export function formatProductPrice(priceFrom: number, priceTo?: number): string {
  if (priceTo != null) {
    return `${formatHuf(priceFrom)} – ${formatHuf(priceTo)} + ÁFA (${formatHuf(grossFromNet(priceFrom))} – ${formatHuf(grossFromNet(priceTo))})`;
  }
  return formatNetVat(priceFrom, { from: true });
}

export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
