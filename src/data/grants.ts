/**
 * Pályázati programok — egyetlen forrás a bannerhez és a kártyákhoz.
 * status: nyitva | hamarosan | zarva  (manuálisan frissítendő)
 *
 * Jelenlegi tények a meglévő oldalszöveg alapján:
 * - OETP: új benyújtás zárva; megfelelteknek igazolási szakasz 2027.02.26-ig
 * - Wekerle+: Családi Ház Program várhatóan 2027. február
 */

export type GrantStatus = 'nyitva' | 'hamarosan' | 'zarva';

export type GrantProgram = {
  id: 'oetp' | 'wekerle';
  name: string;
  /** Rövid státuszcímke a badge-hez */
  label: string;
  status: GrantStatus;
  /** Opcionális határidő / várható indulás */
  deadline?: string;
  href: string;
  /** Egy mondat a bannerhez */
  bannerText: string;
};

export const grantStatusMeta: Record<
  GrantStatus,
  { badge: string; tone: 'active' | 'soft' | 'muted' }
> = {
  nyitva: { badge: 'Nyitva', tone: 'active' },
  hamarosan: { badge: 'Hamarosan', tone: 'soft' },
  zarva: { badge: 'Zárva', tone: 'muted' },
};

export const grants: GrantProgram[] = [
  {
    id: 'oetp',
    name: 'OETP',
    label: 'Benyújtás zárva',
    status: 'zarva',
    deadline: 'Igazolás (megfelelteknek): 2027. február 26.',
    href: '/palyazati-lehetosegek#oetp',
    bannerText: 'OETP: új kérelem nem adható be; megfelelteknek igazolási szakasz.',
  },
  {
    id: 'wekerle',
    name: 'Wekerle+',
    label: 'Hamarosan',
    status: 'hamarosan',
    deadline: 'Családi ház: várhatóan 2027. február',
    href: '/palyazati-lehetosegek#wekerle',
    bannerText: 'Wekerle+ energetikai felújítás: várhatóan 2027. február.',
  },
];

export function grantsForBanner(): GrantProgram[] {
  return grants.filter((g) => g.status !== 'zarva');
}

export function bannerMode(visible: GrantProgram[]): 'active' | 'soft' | 'quiet' {
  if (visible.length === 0) return 'quiet';
  if (visible.some((g) => g.status === 'nyitva')) return 'active';
  return 'soft';
}
