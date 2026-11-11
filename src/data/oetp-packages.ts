export type OetpPackage = {
  id: string;
  category: string;
  title: string;
  items: string[];
  total: number;
  grant: number;
  own: number;
};

/** Publikus OETP csomagok — forrás: K2 OETP Csomagok publikus.xlsx */
export const oetpPackages: OetpPackage[] = [
  {
    id: 'storage-deye-12',
    category: 'Csak energiatároló',
    title: 'Deye 11,8 kWh tároló',
    items: [
      'Deye SE-F12-C 11,8 kWh LV energiatároló',
      'Teljes pályázati és engedélyeztetési ügyintézés',
    ],
    total: 2_000_000,
    grant: 1_800_000,
    own: 200_000,
  },
  {
    id: 'storage-huawei-10',
    category: 'Csak energiatároló',
    title: 'Huawei 10 kWh tároló',
    items: [
      'Huawei LUNA2000-5-E0 akkumulátor 5 kWh — 2 db',
      'Huawei Power Modul LUNA2000-5KW-C0',
      'Teljes pályázati és engedélyeztetési ügyintézés',
    ],
    total: 2_900_000,
    grant: 1_800_000,
    own: 1_100_000,
  },
  {
    id: 'inv-storage-10',
    category: 'Inverter + energiatároló',
    title: 'Inverter + tároló 10 kWh-ig',
    items: [
      'Deye SE-F12-C 11,8 kWh LV energiatároló',
      'DEYE SUN-5-12K-SG05LP3-EU-SM2',
      'Teljes pályázati és engedélyeztetési ügyintézés',
    ],
    total: 2_500_000,
    grant: 1_800_000,
    own: 700_000,
  },
  {
    id: 'inv-storage-16',
    category: 'Inverter + energiatároló',
    title: 'Inverter + tároló 16 kWh-ig',
    items: [
      'Deye SE-F16-C 16 kWh LV energiatároló',
      'DEYE SUN-5-12K-SG05LP3-EU-SM2',
      'Teljes pályázati és engedélyeztetési ügyintézés',
    ],
    total: 2_650_000,
    grant: 1_800_000,
    own: 850_000,
  },
  {
    id: 'inv-storage-20',
    category: 'Inverter + energiatároló',
    title: 'Inverter + tároló 20 kWh-ig',
    items: [
      'Deye SE-F12-C 11,8 kWh LV energiatároló — 2 db',
      'DEYE SUN-5-12K-SG05LP3-EU-SM2',
      'Teljes pályázati és engedélyeztetési ügyintézés',
    ],
    total: 3_000_000,
    grant: 1_800_000,
    own: 1_200_000,
  },
  {
    id: 'pv-inv-storage-10',
    category: 'Napelem + inverter + tároló',
    title: '6 kWp + inverter + 10 kWh',
    items: [
      'Deye SE-F12-C 11,8 kWh LV energiatároló',
      'DEYE SUN-5-12K-SG05LP3-EU-SM2',
      '12–13 db 450–500 W napelem',
      'Teljes pályázati és engedélyeztetési ügyintézés',
    ],
    total: 3_100_000,
    grant: 2_500_000,
    own: 600_000,
  },
  {
    id: 'pv-inv-storage-16',
    category: 'Napelem + inverter + tároló',
    title: '6 kWp + inverter + 16 kWh',
    items: [
      'Deye SE-F16-C 16 kWh LV energiatároló',
      'DEYE SUN-5-12K-SG05LP3-EU-SM2',
      '12–13 db 450–500 W napelem',
      'Teljes pályázati és engedélyeztetési ügyintézés',
    ],
    total: 3_300_000,
    grant: 2_500_000,
    own: 800_000,
  },
  {
    id: 'pv-inv-storage-20',
    category: 'Napelem + inverter + tároló',
    title: '6 kWp + inverter + 20 kWh',
    items: [
      'Deye SE-F12-C 11,8 kWh LV energiatároló — 2 db',
      'DEYE SUN-5-12K-SG05LP3-EU-SM2',
      '12–13 db 450–500 W napelem',
      'Teljes pályázati és engedélyeztetési ügyintézés',
    ],
    total: 3_700_000,
    grant: 2_500_000,
    own: 1_200_000,
  },
];

export const oetpExtras = [
  'Deye rendszereknél kérhető kültéri, saját fűtéssel rendelkező tároló az alap helyett (+100 000 Ft): Deye SE-F12 Max 11,8 kWh vagy SE-F16 Max 16 kWh.',
  'Áramszünetes üzem kiépítése nincs benne az árakban: elosztódoboz 3 konnektorral (+50 000 Ft), vagy teljes ház backup az inverteren keresztül (+100 000 Ft).',
];
