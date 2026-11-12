import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  CATEGORY_LABELS,
  HEAT_GROUPS,
  SOLAR_EXTRA_GROUPS,
  TOPIC_LABELS,
  type CatalogCategory,
  type CatalogItem,
  type HeatGroup,
  type SolarExtraGroup,
  type TopicId,
} from '../../lib/arajanlat/types';
import { formatHuf } from './format';

const TOPICS: Array<TopicId | 'all'> = ['napelem', 'villany', 'futes', 'all'];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as CatalogCategory[];

const emptyForm = (): CatalogItem => ({
  id: '',
  name: '',
  topic: 'napelem',
  category: 'foanyag',
  unit: 'db',
  buyPrice: 0,
  selectable: true,
  active: true,
  notes: '',
});

export default function CatalogManager() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [filterTopic, setFilterTopic] = useState<TopicId | 'all' | ''>('');
  const [q, setQ] = useState('');
  const [form, setForm] = useState<CatalogItem>(emptyForm());
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch('/api/arajanlat/catalog');
    const data = await res.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filterTopic && item.topic !== filterTopic) return false;
      if (q) {
        const hay = `${item.name} ${item.id}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [items, filterTopic, q]);

  function startEdit(item: CatalogItem) {
    setForm({ ...item });
    setEditing(true);
    setMessage(null);
    setError(null);
  }

  function startNew() {
    setForm(emptyForm());
    setEditing(true);
    setMessage(null);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.id.trim() || !form.name.trim()) {
      setError('Az azonosító és a név kötelező.');
      return;
    }
    const res = await fetch('/api/arajanlat/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        buyPrice: Number(form.buyPrice) || 0,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Mentés sikertelen');
      return;
    }
    setMessage('Katalógustétel mentve.');
    setEditing(false);
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm(`Törlöd: ${id}?`)) return;
    await fetch(`/api/arajanlat/catalog?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await load();
  }

  async function onReset() {
    if (!confirm('Visszaállítod a katalógust a seed adatokra? A saját módosítások elvesznek.')) return;
    await fetch('/api/arajanlat/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' }),
    });
    setMessage('Katalógus visszaállítva a seed adatokról.');
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Anyagkatalógus</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Nettó beszerzési árak. Eladás nettó = beszerzés × 1,25.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startNew}
            className="rounded-md bg-sky-deep px-4 py-2 text-sm font-semibold text-white"
          >
            Új tétel
          </button>
          <button
            type="button"
            onClick={() => void onReset()}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-soft"
          >
            Seed visszaállítás
          </button>
        </div>
      </div>

      {message && <p className="text-sm text-leaf">{message}</p>}
      {error && <p className="text-sm text-sun-deep">{error}</p>}

      {editing && (
        <form
          onSubmit={onSubmit}
          className="grid gap-3 rounded-xl border border-line bg-paper/70 p-4 sm:grid-cols-2"
        >
          <h2 className="font-display text-lg font-bold sm:col-span-2">
            {form.id && items.some((i) => i.id === form.id) ? 'Tétel szerkesztése' : 'Új tétel'}
          </h2>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Azonosító (id)</span>
            <input
              className="w-full rounded-md border border-line bg-white px-3 py-2"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value.trim() })}
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Név</span>
            <input
              className="w-full rounded-md border border-line bg-white px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Témakör</span>
            <select
              className="w-full rounded-md border border-line bg-white px-3 py-2"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value as CatalogItem['topic'] })}
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t === 'all' ? 'Összes' : TOPIC_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Kategória</span>
            <select
              className="w-full rounded-md border border-line bg-white px-3 py-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as CatalogCategory })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </label>
          {form.category === 'kiegeszito' && (
            <label className="text-sm">
              <span className="mb-1 block font-medium">Napelem legördülő csoport</span>
              <select
                className="w-full rounded-md border border-line bg-white px-3 py-2"
                value={form.extraGroup ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    extraGroup: (e.target.value || undefined) as SolarExtraGroup | undefined,
                  })
                }
              >
                <option value="">—</option>
                {SOLAR_EXTRA_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {(form.topic === 'futes' || form.topic === 'all') && form.category === 'foanyag' && (
            <label className="text-sm">
              <span className="mb-1 block font-medium">Fűtés legördülő csoport</span>
              <select
                className="w-full rounded-md border border-line bg-white px-3 py-2"
                value={form.heatGroup ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    heatGroup: (e.target.value || undefined) as HeatGroup | undefined,
                  })
                }
              >
                <option value="">—</option>
                {HEAT_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="text-sm">
            <span className="mb-1 block font-medium">Egység</span>
            <input
              className="w-full rounded-md border border-line bg-white px-3 py-2"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Beszerzési ár nettó (Ft)</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border border-line bg-white px-3 py-2"
              value={form.buyPrice}
              onChange={(e) => setForm({ ...form, buyPrice: Number(e.target.value) })}
            />
            <span className="mt-1 block text-xs text-ink-soft">
              Eladás nettó: {formatHuf(Math.round(form.buyPrice * 1.25))}
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-1">
            <input
              type="checkbox"
              checked={form.selectable !== false}
              onChange={(e) => setForm({ ...form, selectable: e.target.checked })}
            />
            Választható főanyag
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Aktív
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Megjegyzés</span>
            <input
              className="w-full rounded-md border border-line bg-white px-3 py-2"
              value={form.notes ?? ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="rounded-md bg-sky-deep px-4 py-2 text-sm font-semibold text-white">
              Mentés
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-line px-4 py-2 text-sm"
            >
              Mégse
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          className="min-w-[12rem] flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm"
          placeholder="Keresés név / id…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="rounded-md border border-line bg-white px-3 py-2 text-sm"
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value as TopicId | 'all' | '')}
        >
          <option value="">Minden témakör</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'Összes (shared)' : TOPIC_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-mist/80 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-3 py-2">Név</th>
              <th className="px-3 py-2">Téma</th>
              <th className="px-3 py-2">Kat.</th>
              <th className="px-3 py-2">Beszerzés nettó</th>
              <th className="px-3 py-2">Eladás nettó</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-paper/50">
            {filtered.map((item) => (
              <tr key={item.id} className={!item.active ? 'opacity-50' : undefined}>
                <td className="px-3 py-2">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-ink-soft">{item.id}</div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {item.topic === 'all' ? 'mind' : TOPIC_LABELS[item.topic]}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{CATEGORY_LABELS[item.category]}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatHuf(item.buyPrice)} / {item.unit}
                </td>
                <td className="px-3 py-2 whitespace-nowrap font-medium text-sky-deep">
                  {formatHuf(Math.round(item.buyPrice * 1.25))}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right">
                  <button type="button" className="text-sky-deep hover:underline" onClick={() => startEdit(item)}>
                    Szerkeszt
                  </button>
                  <button
                    type="button"
                    className="ml-3 text-sun-deep hover:underline"
                    onClick={() => void onDelete(item.id)}
                  >
                    Töröl
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-ink-soft">{filtered.length} tétel</p>
    </div>
  );
}
