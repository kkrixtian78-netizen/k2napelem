import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  CATEGORY_LABELS,
  HEAT_GROUPS,
  SOLAR_EXTRA_GROUPS,
  TOPIC_LABELS,
  type CatalogItem,
  type HeatGroup,
  type ManualSelection,
  type QuoteLine,
  type SolarExtraGroup,
  type SolarSelection,
  type TopicId,
} from '../../lib/arajanlat/types';
import { displaySellForItem, grossFromNet } from '../../lib/arajanlat/pricing';
import { formatHuf, vatFromNet, vatPercentLabel } from './format';

type Preview = {
  lines: QuoteLine[];
  totalBuy: number;
  totalSell: number;
  travel?: { oneWayKm: number; roundTripKm: number; method: string } | null;
  travelWarning?: string | null;
};

const TOPICS: TopicId[] = ['napelem', 'villany', 'futes'];

const EMPTY_EXTRA_IDS: Record<SolarExtraGroup, string> = {
  optimizer: '',
  visszwatt: '',
  tuzvedelmi: '',
  tervezes: '',
  'hozott-jutalek': '',
};

const EMPTY_HEAT_IDS: Record<HeatGroup, string> = {
  padlofutes: '',
  termosztat: '',
  futopanel: '',
  torolkozoszarito: '',
  gyorsfuto: '',
  infrapanel: '',
  'kulteri-futokabel': '',
  'futheto-tukor': '',
  infrasugarzo: '',
  kiegeszitok: '',
};

export default function QuoteWizard() {
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Solar
  const [panelId, setPanelId] = useState('');
  const [panelCount, setPanelCount] = useState(12);
  const [inverterId, setInverterId] = useState('');
  const [storageId, setStorageId] = useState('bat-none');
  const [roofTypeId, setRoofTypeId] = useState('roof-cserep');
  /** Csoportonként választott katalógus id ('' = nincs) */
  const [extraIds, setExtraIds] = useState<Record<SolarExtraGroup, string>>({ ...EMPTY_EXTRA_IDS });
  const [optimizerQty, setOptimizerQty] = useState(12);

  // Manual (villany checkbox)
  const [selectedMains, setSelectedMains] = useState<Record<string, number>>({});
  // Fűtés: csoportonként egy termék + mennyiség
  const [heatIds, setHeatIds] = useState<Record<HeatGroup, string>>({ ...EMPTY_HEAT_IDS });
  const [heatQtys, setHeatQtys] = useState<Record<string, number>>({});

  const [preview, setPreview] = useState<Preview | null>(null);

  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    setSavedId(null);
    setPreview(null);
    setSelectedMains({});
    setExtraIds({ ...EMPTY_EXTRA_IDS });
    setHeatIds({ ...EMPTY_HEAT_IDS });
    setHeatQtys({});
    fetch(`/api/arajanlat/catalog?topic=${topic}`)
      .then((r) => r.json())
      .then((data) => {
        const items = (data.items as CatalogItem[]).filter((c) => c.active);
        setCatalog(items);
        if (topic === 'napelem') {
          const panels = items.filter((c) => c.category === 'panel');
          const invs = items.filter((c) => c.category === 'inverter');
          const bats = items.filter((c) => c.category === 'tarolo');
          const roofs = items.filter((c) => c.category === 'tetotipus');
          setPanelId(panels[0]?.id ?? '');
          setInverterId(invs[0]?.id ?? '');
          setStorageId(bats.find((b) => b.id === 'bat-none')?.id ?? bats[0]?.id ?? '');
          setRoofTypeId(roofs[0]?.id ?? '');
          setOptimizerQty(12);
        }
      })
      .catch(() => setError('Nem sikerült betölteni a katalógust.'))
      .finally(() => setLoading(false));
  }, [topic]);

  function selectionPayload(): SolarSelection | ManualSelection | null {
    if (!topic) return null;
    if (topic === 'napelem') {
      if (!panelId || !inverterId || !roofTypeId) return null;
      const chosen = Object.values(extraIds).filter(Boolean);
      const extraQuantities: Record<string, number> = {};
      for (const id of chosen) {
        extraQuantities[id] = id === extraIds.optimizer ? Math.max(1, optimizerQty) : 1;
      }
      return {
        panelId,
        panelCount,
        inverterId,
        storageId: storageId === 'bat-none' ? null : storageId,
        roofTypeId,
        extraItemIds: chosen,
        extraQuantities,
      } satisfies SolarSelection;
    }
    if (topic === 'futes') {
      const mainItemIds = Object.values(heatIds).filter(Boolean);
      if (!mainItemIds.length) return null;
      const quantities: Record<string, number> = {};
      for (const id of mainItemIds) {
        quantities[id] = Math.max(1, heatQtys[id] ?? 1);
      }
      return { mainItemIds, quantities } satisfies ManualSelection;
    }
    const mainItemIds = Object.keys(selectedMains).filter((id) => (selectedMains[id] ?? 0) > 0);
    if (!mainItemIds.length) return null;
    return { mainItemIds, quantities: selectedMains } satisfies ManualSelection;
  }

  async function refreshPreview() {
    const selection = selectionPayload();
    if (!topic || !selection) {
      setPreview(null);
      return;
    }
    setError(null);
    try {
      const res = await fetch('/api/arajanlat/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, selection, customerAddress }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Előnézet hiba');
      setPreview(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Előnézet hiba');
    }
  }

  useEffect(() => {
    if (extraIds.optimizer) setOptimizerQty(Math.max(1, panelCount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelCount]);

  useEffect(() => {
    if (!topic) return;
    const t = setTimeout(() => {
      void refreshPreview();
    }, customerAddress.trim().length >= 5 ? 700 : 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    topic,
    panelId,
    panelCount,
    inverterId,
    storageId,
    roofTypeId,
    extraIds,
    optimizerQty,
    selectedMains,
    heatIds,
    heatQtys,
    customerAddress,
  ]);

  async function onSave(e: FormEvent, status: 'draft' | 'final') {
    e.preventDefault();
    const selection = selectionPayload();
    if (!topic || !selection) {
      setError('Válassz főanyagokat az ajánlathoz.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/arajanlat/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          selection,
          customerName,
          customerAddress,
          customerPhone,
          customerEmail,
          status,
          lines: preview?.lines,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Mentés sikertelen');
      setSavedId(data.quote.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mentés sikertelen');
    } finally {
      setLoading(false);
    }
  }

  function toggleMain(id: string) {
    setSelectedMains((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
  }

  function setMainQty(id: string, qty: number) {
    setSelectedMains((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  }

  function setExtraGroup(group: SolarExtraGroup, id: string) {
    setExtraIds((prev) => ({ ...prev, [group]: id }));
    if (group === 'optimizer' && id) {
      setOptimizerQty((q) => (q > 0 ? q : Math.max(1, panelCount)));
    }
  }

  function setHeatGroup(group: HeatGroup, id: string) {
    setHeatIds((prev) => {
      const prevId = prev[group];
      if (prevId && prevId !== id) {
        setHeatQtys((q) => {
          const next = { ...q };
          delete next[prevId];
          return next;
        });
      }
      return { ...prev, [group]: id };
    });
    if (id) {
      setHeatQtys((q) => ({ ...q, [id]: q[id] ?? 1 }));
    }
  }

  function setHeatQty(id: string, qty: number) {
    setHeatQtys((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  }

  if (!topic) {
    return (
      <div className="reveal">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Új árajánlat</h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          Válaszd ki a témakört. A főanyagok megadása után a rendszer automatikusan összeállítja a teljes tételsort
          (fogyóanyag, védelem, munkadíj).
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {TOPICS.map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => setTopic(id)}
              className="group rounded-xl border border-line bg-paper/70 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-deep/40 hover:shadow-md"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-deep">Témakör</span>
              <span className="mt-2 block font-display text-xl font-bold text-ink group-hover:text-sky-deep">
                {TOPIC_LABELS[id]}
              </span>
              <span className="mt-2 block text-sm text-ink-soft">
                {id === 'napelem' && 'Panel, inverter, tároló, tető — a többi automatikus.'}
                {id === 'villany' && 'Főanyagok kiválasztása → kapcsolódó szerelés és fogyóanyag.'}
                {id === 'futes' && 'BVF termékcsoportok legördülőből — szereléssel kiegészítve.'}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const panels = catalog.filter((c) => c.category === 'panel');
  const inverters = catalog.filter((c) => c.category === 'inverter');
  const storages = catalog.filter((c) => c.category === 'tarolo');
  const roofs = catalog.filter((c) => c.category === 'tetotipus');
  const mains = catalog.filter(
    (c) => c.selectable !== false && c.category === 'foanyag',
  );

  function extrasFor(group: SolarExtraGroup) {
    return catalog.filter(
      (c) => c.selectable !== false && c.category === 'kiegeszito' && c.extraGroup === group,
    );
  }

  function heatFor(group: HeatGroup) {
    return catalog.filter(
      (c) =>
        c.selectable !== false &&
        c.category === 'foanyag' &&
        c.heatGroup === group &&
        (c.topic === 'futes' || c.topic === 'all'),
    );
  }

  return (
    <form onSubmit={(e) => onSave(e, 'draft')} className="reveal space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => setTopic(null)}
            className="mb-2 text-sm text-sky-deep hover:underline"
          >
            ← Témakör váltása
          </button>
          <h1 className="font-display text-3xl font-bold text-ink">{TOPIC_LABELS[topic]}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {topic === 'futes'
              ? `BVF termékek: eladás bruttó = BVF − 2% (a sorokban nettó). Szerelés/fogyóanyag: ×1,25. ÁFA (${vatPercentLabel()}) az összesenél.`
              : `Minden tétel nettó. Eladás = beszerzés × 1,25 · ÁFA (${vatPercentLabel()}) csak az összesenél.`}
          </p>
        </div>
        {savedId && (
          <a
            href={`/arajanlat/ajanlat/${savedId}`}
            className="rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white no-underline"
          >
            Mentett ajánlat megnyitása →
          </a>
        )}
      </div>

      <section className="grid gap-4 rounded-xl border border-line bg-paper/60 p-4 sm:grid-cols-2 sm:p-5">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">Ügyfél neve</span>
          <input
            className="w-full rounded-md border border-line bg-white px-3 py-2"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="pl. Kovács János"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">Cím</span>
          <input
            className="w-full rounded-md border border-line bg-white px-3 py-2"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            placeholder="pl. 2000 Szentendre, Fő tér 1."
          />
          <span className="mt-1 block text-xs text-ink-soft">
            Ebből számolódik automatikusan a kiszállás: Pócsmegyer → ügyfél oda-vissza × 300 Ft/km.
          </span>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">Telefonszám</span>
          <input
            type="tel"
            className="w-full rounded-md border border-line bg-white px-3 py-2"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="pl. +36 30 123 4567"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">E-mail cím</span>
          <input
            type="email"
            className="w-full rounded-md border border-line bg-white px-3 py-2"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="pl. ugyfel@email.hu"
          />
        </label>
      </section>

      {topic === 'napelem' ? (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold">Főanyagok (csak ezeket válaszd)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Napelem panel">
              <select
                className="field"
                value={panelId}
                onChange={(e) => setPanelId(e.target.value)}
              >
                {panels.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatHuf(p.buyPrice)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Panelszám">
              <input
                type="number"
                min={1}
                max={200}
                className="field"
                value={panelCount}
                onChange={(e) => setPanelCount(Number(e.target.value) || 1)}
              />
            </Field>
            <Field label="Inverter">
              <select
                className="field"
                value={inverterId}
                onChange={(e) => setInverterId(e.target.value)}
              >
                {inverters.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatHuf(p.buyPrice)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Energiatároló">
              <select
                className="field"
                value={storageId}
                onChange={(e) => setStorageId(e.target.value)}
              >
                {storages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.buyPrice > 0 ? ` — ${formatHuf(p.buyPrice)}` : ''}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tetőfelület típusa">
              <select
                className="field"
                value={roofTypeId}
                onChange={(e) => setRoofTypeId(e.target.value)}
              >
                {roofs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>

            {SOLAR_EXTRA_GROUPS.map((group) => {
              const options = extrasFor(group.id);
              if (!options.length) return null;
              return (
                <Field key={group.id} label={group.label}>
                  <select
                    className="field"
                    value={extraIds[group.id]}
                    onChange={(e) => setExtraGroup(group.id, e.target.value)}
                  >
                    <option value="">Nincs</option>
                    {options.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatHuf(p.buyPrice)}
                      </option>
                    ))}
                  </select>
                </Field>
              );
            })}

            {extraIds.optimizer ? (
              <Field label="Optimalizálók száma">
                <input
                  type="number"
                  min={1}
                  max={500}
                  className="field"
                  value={optimizerQty}
                  onChange={(e) => setOptimizerQty(Number(e.target.value) || 1)}
                />
              </Field>
            ) : null}
          </div>
        </section>
      ) : topic === 'futes' ? (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold">Fűtés főanyagok (BVF)</h2>
          <p className="text-sm text-ink-soft">
            Csoportonként válassz terméket. A BVF termékeknél a listában a bruttó eladási ár látszik (BVF − 2%, pl.
            64&nbsp;000 → 62&nbsp;720). A tételsorban nettó van, az ÁFA / bruttó az összesenél. Csomagajánlatok és
            outlet nincsenek a listában.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {HEAT_GROUPS.map((group) => {
              const options = heatFor(group.id);
              if (!options.length) return null;
              const selectedId = heatIds[group.id];
              return (
                <div key={group.id} className="space-y-2">
                  <Field label={group.label}>
                    <select
                      className="field"
                      value={selectedId}
                      onChange={(e) => setHeatGroup(group.id, e.target.value)}
                    >
                      <option value="">Nincs</option>
                      {options.map((p) => {
                        const disp = displaySellForItem(p);
                        return (
                          <option key={p.id} value={p.id}>
                            {p.name} — {formatHuf(disp.amount)}
                            {disp.gross ? ' bruttó' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </Field>
                  {selectedId ? (
                    <Field label="Mennyiség">
                      <input
                        type="number"
                        min={1}
                        max={500}
                        className="field"
                        value={heatQtys[selectedId] ?? 1}
                        onChange={(e) => setHeatQty(selectedId, Number(e.target.value) || 1)}
                      />
                    </Field>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold">Főanyagok kiválasztása</h2>
          <p className="text-sm text-ink-soft">
            Jelöld a szükséges főanyagokat. A kapcsolódó fogyóanyagok és munkadíjak automatikusan hozzáadódnak.
          </p>
          <ul className="divide-y divide-line rounded-xl border border-line bg-paper/60">
            {mains.map((item) => {
              const on = selectedMains[item.id] != null;
              return (
                <li key={item.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleMain(item.id)}
                      className="size-4 accent-sky-deep"
                    />
                    <span className="min-w-0">
                      <span className="block font-medium text-ink">{item.name}</span>
                      <span className="text-xs text-ink-soft">
                        {CATEGORY_LABELS[item.category]} · beszerzés {formatHuf(item.buyPrice)} / {item.unit}
                      </span>
                    </span>
                  </label>
                  {on && (
                    <input
                      type="number"
                      min={1}
                      className="w-24 rounded-md border border-line bg-white px-2 py-1.5 text-sm"
                      value={selectedMains[item.id] ?? 1}
                      onChange={(e) => setMainQty(item.id, Number(e.target.value) || 1)}
                      aria-label="Mennyiség"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {error && (
        <p className="rounded-md border border-sun/40 bg-sun/10 px-3 py-2 text-sm text-sun-deep" role="alert">
          {error}
        </p>
      )}

      {preview?.travelWarning && (
        <p className="rounded-md border border-sun/40 bg-sun/10 px-3 py-2 text-sm text-sun-deep">
          {preview.travelWarning}
        </p>
      )}

      {preview && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold">Automatikus tételsor</h2>
              {preview.travel && (
                <p className="mt-1 text-xs text-ink-soft">
                  Kiszállás: {preview.travel.oneWayKm} km egy út · {preview.travel.roundTripKm} km
                  oda-vissza · 300 Ft/km
                </p>
              )}
            </div>
            <div className="text-right text-sm">
              <div className="text-ink-soft">Beszerzés nettó: {formatHuf(preview.totalBuy)}</div>
              <div className="text-ink-soft">Ajánlati nettó: {formatHuf(preview.totalSell)}</div>
              <div className="text-ink-soft">
                ÁFA ({vatPercentLabel()}): {formatHuf(vatFromNet(preview.totalSell))}
              </div>
              <div className="text-lg font-bold text-sky-deep">
                Bruttó fizetendő: {formatHuf(grossFromNet(preview.totalSell))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-mist/80 text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-3 py-2 font-semibold">Tétel</th>
                  <th className="px-3 py-2 font-semibold">Menny.</th>
                  <th className="px-3 py-2 font-semibold">Beszerzés nettó</th>
                  <th className="px-3 py-2 font-semibold">Eladás nettó</th>
                  <th className="px-3 py-2 font-semibold">Sor nettó</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-paper/50">
                {preview.lines.map((line) => (
                  <tr key={`${line.catalogId}-${line.auto ? 'a' : 'm'}`} className={line.auto ? 'text-ink-soft' : ''}>
                    <td className="px-3 py-2">
                      {line.name}
                      {line.auto && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-sky-deep">auto</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {line.quantity} {line.unit}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatHuf(line.buyPrice)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatHuf(line.sellPrice)}</td>
                    <td className="px-3 py-2 whitespace-nowrap font-medium">
                      {formatHuf(line.sellPrice * line.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          type="submit"
          disabled={loading || !preview}
          className="rounded-md bg-sky-deep px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Mentés piszkozatként
        </button>
        <button
          type="button"
          disabled={loading || !preview}
          onClick={(e) => onSave(e, 'final')}
          className="rounded-md border border-sky-deep px-5 py-2.5 text-sm font-semibold text-sky-deep disabled:opacity-50"
        >
          Mentés véglegesként
        </button>
      </div>

      <style>{`
        .field {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid var(--color-line);
          background: white;
          padding: 0.5rem 0.75rem;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
