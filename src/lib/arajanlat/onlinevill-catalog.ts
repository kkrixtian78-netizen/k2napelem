import type { CatalogItem } from './types';
import onlinevillProducts from './onlinevill-products.json';

type OnlinevillItem = {
  slug: string;
  name: string;
  sku: string;
  price: number;
  unit: string;
  group: string;
  groupLabel: string;
  leaf: string;
};

type OnlinevillFile = {
  groups: Array<{ id: string; label: string }>;
  items: OnlinevillItem[];
};

const data = onlinevillProducts as OnlinevillFile;

/** Onlinevill kategóriák, a kért kihagyottak nélkül. */
export const VILLANY_GROUPS: Array<{ id: string; label: string }> = data.groups;

function catalogId(slug: string, used: Set<string>): string {
  const base = `ov-${slug}`.slice(0, 78).replace(/-+$/, '');
  let id = base;
  let n = 2;
  while (used.has(id)) {
    const suffix = `-${n}`;
    id = `${base.slice(0, 78 - suffix.length)}${suffix}`;
    n += 1;
  }
  used.add(id);
  return id;
}

function unitOf(unit: string): string {
  const u = unit.trim().toLowerCase();
  if (u === 'fm' || u === 'm') return 'm';
  return u || 'db';
}

/** Onlinevill.hu termékek a villanyszerelés katalógusba. Az ár a boltban kiírt online ár. */
export function buildVillanyCatalogFromOnlinevill(): CatalogItem[] {
  const used = new Set<string>();
  return data.items
    .filter((p) => p.leaf !== 'feliratozok-es-jelolok')
    .map((p) => ({
      id: catalogId(p.slug, used),
      name: p.name,
      topic: 'villany' as const,
      category: 'foanyag' as const,
      unit: unitOf(p.unit),
      buyPrice: Math.max(0, Math.round(p.price)),
      selectable: true,
      active: true,
      villanyGroup: p.group,
      notes: p.sku ? `Onlinevill online ár · cikkszám ${p.sku}` : 'Onlinevill online ár',
    }));
}
