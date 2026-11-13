import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { SOLAR_ROOFS, fireDisconnectQty } from '../../lib/arajanlat/solar-bom';
import {
  HEAT_GROUPS,
  TOPIC_LABELS,
  type CatalogItem,
  type HeatGroup,
  type ManualSelection,
  type QuoteLine,
  type SolarSelection,
  type TopicId,
} from '../../lib/arajanlat/types';
import { VILLANY_GROUPS } from '../../lib/arajanlat/onlinevill-catalog';
import { displaySellForItem, grossFromNet, sellPriceForItem } from '../../lib/arajanlat/pricing';
import QuoteDocument, { type BrandInfo } from './QuoteDocument';
import { formatHuf, vatFromNet, vatPercentLabel } from './format';

type Preview = {
  lines: QuoteLine[];
  totalBuy: number;
  totalSell: number;
  travel?: { oneWayKm: number; roundTripKm: number; method: string } | null;
  travelWarning?: string | null;
};

const TOPICS: TopicId[] = ['napelem', 'villany', 'futes'];

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
  szereles: '',
};

const DEFAULT_BRAND: BrandInfo = {
  name: 'K2Napelem',
  legalName: 'Kántor Krisztián EV',
  address: '2017 Pócsmegyer, Táncsics út 10.',
  phone: '+36 30 2677 665',
  email: 'k2@k2napelem.hu',
};

export default function QuoteWizard({ brand = DEFAULT_BRAND }: { brand?: BrandInfo }) {
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showQuotePreview, setShowQuotePreview] = useState(false);

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
  const [fireId, setFireId] = useState('');
  const [designId, setDesignId] = useState('');
  const [optimizerId, setOptimizerId] = useState('');
  const [optimizerQty, setOptimizerQty] = useState(12);
  const [chargerId, setChargerId] = useState('');
  const [villanyQuery, setVillanyQuery] = useState<Record<string, string>>({});

  // Manual (villany checkbox)
  const [selectedMains, setSelectedMains] = useState<Record<string, number>>({});
  /** Fűtés BVF termékek: több tétel / csoport (id → mennyiség) */
  const [heatSelected, setHeatSelected] = useState<Record<string, number>>({});
  /** Csoportonkénti „hozzáadás” legördülő ideiglenes értéke */
  const [heatPicker, setHeatPicker] = useState<Record<HeatGroup, string>>({ ...EMPTY_HEAT_IDS });
  /** Szerelési anyagok: több tétel egyszerre (tartó / kábel / kismegszakító) */
  const [szerelesQty, setSzerelesQty] = useState<Record<string, number>>({});

  const [preview, setPreview] = useState<Preview | null>(null);

  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    setSavedId(null);
    setPreview(null);
    setSelectedMains({});
    setHeatSelected({});
    setHeatPicker({ ...EMPTY_HEAT_IDS });
    setSzerelesQty({});
    setFireId('');
    setDesignId('');
    setOptimizerId('');
    setChargerId('');
    setVillanyQuery({});
    fetch(`/api/arajanlat/catalog?topic=${topic}`)
      .then((r) => r.json())
      .then((data) => {
        const items = (data.items as CatalogItem[]).filter((c) => c.active);
        setCatalog(items);
        if (topic === 'napelem') {
          const panels = items.filter((c) => c.category === 'panel');
          const invs = items.filter((c) => c.category === 'inverter');
          const bats = items.filter((c) => c.category === 'tarolo');
          setPanelId(panels[0]?.id ?? '');
          setInverterId(invs[0]?.id ?? '');
          setStorageId('bat-none');
          setRoofTypeId('roof-cserep');
          setOptimizerQty(12);
        }
      })
      .catch(() => setError('Nem sikerült betölteni a katalógust.'))
      .finally(() => setLoading(false));
  }, [topic]);

  function selectionPayload(): SolarSelection | ManualSelection | null {
    if (!topic) return null;
    if (topic === 'napelem') {
      if (!panelId || !inverterId) return null;
      const extraItemIds = [fireId, optimizerId, chargerId, designId].filter(Boolean);
      const extraQuantities: Record<string, number> = {};
      if (fireId) extraQuantities[fireId] = fireDisconnectQty(panelCount);
      if (optimizerId) extraQuantities[optimizerId] = Math.max(1, optimizerQty);
      if (chargerId) extraQuantities[chargerId] = 1;
      return {
        panelId,
        panelCount,
        inverterId,
        storageId: storageId === 'bat-none' ? null : storageId,
        roofTypeId,
        extraItemIds,
        extraQuantities,
      } satisfies SolarSelection;
    }
    if (topic === 'futes') {
      const fromGroups = Object.keys(heatSelected).filter((id) => (heatSelected[id] ?? 0) > 0);
      const fromSzereles = Object.keys(szerelesQty).filter((id) => (szerelesQty[id] ?? 0) > 0);
      const mainItemIds = [...fromGroups, ...fromSzereles];
      if (!mainItemIds.length) return null;
      const quantities: Record<string, number> = {};
      for (const id of fromGroups) {
        quantities[id] = Math.max(1, heatSelected[id] ?? 1);
      }
      for (const id of fromSzereles) {
        quantities[id] = Math.max(1, szerelesQty[id] ?? 1);
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
    if (optimizerId) setOptimizerQty(Math.max(1, panelCount));
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
    fireId,
    designId,
    optimizerId,
    optimizerQty,
    chargerId,
    selectedMains,
    heatSelected,
    szerelesQty,
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

  function addHeatProduct(group: HeatGroup, id: string) {
    if (!id) return;
    setHeatSelected((prev) => ({ ...prev, [id]: prev[id] ?? 1 }));
    setHeatPicker((prev) => ({ ...prev, [group]: '' }));
  }

  function removeHeatProduct(id: string) {
    setHeatSelected((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function setHeatProductQty(id: string, qty: number) {
    setHeatSelected((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
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
                {id === 'napelem' && 'Panel, darabszám, tető, inverter és tároló. A többi anyag automatikus.'}
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
  const fireSwitches = catalog.filter(
    (c) => c.selectable !== false && c.extraGroup === 'tuzvedelmi',
  );
  const optimizers = catalog.filter(
    (c) => c.selectable !== false && c.extraGroup === 'optimizer',
  );
  const chargers = catalog.filter((c) => c.selectable !== false && c.category === 'egyeb');

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
              ? `BVF termékek: beszerzés nettó = BVF bruttó −15% (/ÁFA), eladás bruttó = BVF −2%. Szerelés/fogyóanyag: ×1,25. ÁFA (${vatPercentLabel()}) az összesenél.`
              : topic === 'villany'
                ? `Anyag: eladás = beszerzés × 1,25. Munkadíj: rögzített nettó, beszerzés 0. ÁFA (${vatPercentLabel()}) csak az összesenél.`
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
            A munkadíjba beleszámít a kiszállás: Pócsmegyer → ügyfél oda-vissza, beszerzés 150 Ft/km, eladás × 1,25. Külön tételként nem jelenik meg.
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
          <h2 className="font-display text-xl font-bold">Napelemes rendszer</h2>
          <p className="text-sm text-ink-soft">
            A tető és a panelszám adja a tartószerkezetet, a DC és AC védelmet, a kábeleket és a kiegészítőket.
            A tűzeseti leválasztó csak akkor kerül be, ha kiválasztod. A munkadíj a tételek végén van:
            panelszám × 25 000 Ft + 150 000 Ft, tárolóval + 50 000 Ft, a kiszállással együtt.
          </p>
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
                <option value="bat-none">Energiatároló nélkül</option>
                {storages
                  .filter((p) => p.id !== 'bat-none')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                      {p.buyPrice > 0 ? ` — ${formatHuf(p.buyPrice)}` : ''}
                    </option>
                  ))}
              </select>
            </Field>
            {fireSwitches.length > 0 ? (
              <Field label="Tűzeseti leválasztó">
                <select className="field" value={fireId} onChange={(e) => setFireId(e.target.value)}>
                  <option value="">Nincs</option>
                  {fireSwitches.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatHuf(p.buyPrice)}
                    </option>
                  ))}
                </select>
              </Field>
            ) : null}
            <Field label="Tervezés/engedélyeztetés">
              <select className="field" value={designId} onChange={(e) => setDesignId(e.target.value)}>
                <option value="">Nincs</option>
                {catalog
                  .filter((c) => c.selectable !== false && c.extraGroup === 'tervezes')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatHuf(displaySellForItem(p).amount)}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Tető">
              <select
                className="field"
                value={roofTypeId}
                onChange={(e) => setRoofTypeId(e.target.value)}
              >
                {SOLAR_ROOFS.map((roof) => (
                  <option key={roof.id} value={roof.id}>
                    {roof.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {optimizers.length > 0 || chargers.length > 0 ? (
            <details className="rounded-lg border border-line bg-white/60 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-ink">
                Opcionális kiegészítők
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {optimizers.length > 0 ? (
                  <Field label="Optimalizáló">
                    <select
                      className="field"
                      value={optimizerId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setOptimizerId(id);
                        if (id) setOptimizerQty((q) => (q > 0 ? q : Math.max(1, panelCount)));
                      }}
                    >
                      <option value="">Nincs</option>
                      {optimizers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatHuf(p.buyPrice)}
                        </option>
                      ))}
                    </select>
                  </Field>
                ) : null}
                {optimizerId ? (
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
                {chargers.length > 0 ? (
                  <Field label="Autótöltő">
                    <select
                      className="field"
                      value={chargerId}
                      onChange={(e) => setChargerId(e.target.value)}
                    >
                      <option value="">Nincs</option>
                      {chargers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatHuf(p.buyPrice)}
                        </option>
                      ))}
                    </select>
                  </Field>
                ) : null}
              </div>
            </details>
          ) : null}
        </section>
      ) : topic === 'futes' ? (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold">Fűtés főanyagok (BVF)</h2>
          <p className="text-sm text-ink-soft">
            Csoportonként több termék is hozzáadható (pl. többféle fűtőpanel). A BVF listában bruttó eladási ár
            látszik (BVF − 2%). A tételsorban nettó van; ÁFA / bruttó az összesenél.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {HEAT_GROUPS.map((group) => {
              const options = heatFor(group.id);
              if (!options.length) return null;

              // Szerelési anyagok: több tétel is választható, mindegyik saját legördülővel
              if (group.id === 'szereles') {
                return (
                  <div key={group.id} className="space-y-3 sm:col-span-2">
                    <h3 className="text-sm font-semibold text-ink">{group.label}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {options.map((p) => {
                        const on = (szerelesQty[p.id] ?? 0) > 0;
                        const disp = displaySellForItem(p);
                        return (
                          <div key={p.id} className="space-y-2">
                            <Field label={p.name}>
                              <select
                                className="field"
                                value={on ? p.id : ''}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setSzerelesQty((prev) => {
                                    const next = { ...prev };
                                    if (!v) delete next[p.id];
                                    else next[p.id] = prev[p.id] ?? (p.unit === 'm' ? 8 : 1);
                                    return next;
                                  });
                                }}
                              >
                                <option value="">Nincs</option>
                                <option value={p.id}>
                                  {p.name} — {formatHuf(disp.amount)}
                                  {disp.gross ? ' bruttó' : ''}
                                </option>
                              </select>
                            </Field>
                            {on ? (
                              <Field label={`Mennyiség (${p.unit})`}>
                                <input
                                  type="number"
                                  min={1}
                                  max={500}
                                  className="field"
                                  value={szerelesQty[p.id] ?? 1}
                                  onChange={(e) =>
                                    setSzerelesQty((prev) => ({
                                      ...prev,
                                      [p.id]: Math.max(1, Number(e.target.value) || 1),
                                    }))
                                  }
                                />
                              </Field>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const selectedInGroup = options.filter((p) => (heatSelected[p.id] ?? 0) > 0);
              const available = options.filter((p) => !(heatSelected[p.id] ?? 0));
              return (
                <div key={group.id} className="space-y-2">
                  <Field label={group.label}>
                    <select
                      className="field"
                      value={heatPicker[group.id] ?? ''}
                      onChange={(e) => addHeatProduct(group.id, e.target.value)}
                      disabled={!available.length}
                    >
                      <option value="">
                        {available.length ? 'Termék hozzáadása…' : 'Minden termék hozzáadva'}
                      </option>
                      {available.map((p) => {
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
                  {selectedInGroup.length > 0 ? (
                    <ul className="space-y-2 rounded-md border border-line bg-white/70 p-2">
                      {selectedInGroup.map((p) => {
                        const disp = displaySellForItem(p);
                        return (
                          <li key={p.id} className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="min-w-0 flex-1">
                              <span className="block font-medium text-ink">{p.name}</span>
                              <span className="text-xs text-ink-soft">
                                {formatHuf(disp.amount)}
                                {disp.gross ? ' bruttó' : ''}
                              </span>
                            </span>
                            <input
                              type="number"
                              min={1}
                              max={500}
                              className="w-20 rounded-md border border-line px-2 py-1"
                              value={heatSelected[p.id] ?? 1}
                              onChange={(e) => setHeatProductQty(p.id, Number(e.target.value) || 1)}
                              aria-label="Mennyiség"
                            />
                            <button
                              type="button"
                              className="text-xs font-semibold text-sun-deep hover:underline"
                              onClick={() => removeHeatProduct(p.id)}
                            >
                              Eltávolít
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <details className="rounded-md border border-line bg-white">
            <summary className="cursor-pointer list-none px-3 py-2 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                <span>
                  Munkadíj
                  {catalog.filter(
                    (c) =>
                      c.topic === 'villany' &&
                      c.category === 'munkadij' &&
                      c.selectable !== false &&
                      (selectedMains[c.id] ?? 0) > 0,
                  ).length > 0 ? (
                    <span className="ml-2 text-xs font-semibold text-sky-deep">
                      {
                        catalog.filter(
                          (c) =>
                            c.topic === 'villany' &&
                            c.category === 'munkadij' &&
                            c.selectable !== false &&
                            (selectedMains[c.id] ?? 0) > 0,
                        ).length
                      }{' '}
                      kiválasztva
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-xs text-ink-soft">
                  {
                    catalog.filter(
                      (c) => c.topic === 'villany' && c.category === 'munkadij' && c.selectable !== false,
                    ).length
                  }
                </span>
              </span>
            </summary>
            <div className="border-t border-line p-2">
              <p className="mb-2 text-sm text-ink-soft">
                Több tétel is hozzáadható, saját mennyiséggel. A kiszállás (oda-vissza km × 150 Ft beszerzés) a munkadíj összegébe épül, külön sor nincs.
              </p>
              <ul className="max-h-64 overflow-y-auto rounded-md border border-line bg-white">
                {catalog
                  .filter((c) => c.topic === 'villany' && c.category === 'munkadij' && c.selectable !== false)
                  .map((p) => (
                    <li key={p.id} className="border-b border-line last:border-b-0">
                      <button
                        type="button"
                        className="flex w-full items-start justify-between gap-2 px-2 py-1.5 text-left text-sm hover:bg-mist"
                        onClick={() =>
                          setSelectedMains((prev) => ({
                            ...prev,
                            [p.id]: prev[p.id] ?? 1,
                          }))
                        }
                      >
                        <span>{p.name}</span>
                        <span className="shrink-0 text-xs text-ink-soft">
                          {formatHuf(sellPriceForItem(p))} / {p.unit}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </details>
          {catalog.some(
            (c) =>
              c.topic === 'villany' &&
              c.category === 'munkadij' &&
              c.selectable !== false &&
              (selectedMains[c.id] ?? 0) > 0,
          ) ? (
            <ul className="space-y-2 rounded-md border border-line bg-white/70 p-2">
              {catalog
                .filter(
                  (c) =>
                    c.topic === 'villany' &&
                    c.category === 'munkadij' &&
                    c.selectable !== false &&
                    (selectedMains[c.id] ?? 0) > 0,
                )
                .map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="min-w-0 flex-1 font-medium">{p.name}</span>
                    <input
                      type="number"
                      min={1}
                      max={5000}
                      className="w-24 rounded-md border border-line px-2 py-1"
                      value={selectedMains[p.id] ?? 1}
                      aria-label={`Mennyiség (${p.unit})`}
                      onChange={(e) => setMainQty(p.id, Number(e.target.value) || 1)}
                    />
                    <span className="text-xs text-ink-soft">{p.unit}</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-sun-deep hover:underline"
                      onClick={() => toggleMain(p.id)}
                    >
                      Eltávolít
                    </button>
                  </li>
                ))}
            </ul>
          ) : null}
          <h2 className="font-display text-xl font-bold">Villanyszerelés anyagok (Onlinevill)</h2>
          <p className="text-sm text-ink-soft">
            Nyisd le a csoportot, és görgesd a termékeket. A szűrő nem kötelező. Az ár a boltban kiírt online
            ár.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {VILLANY_GROUPS.map((group) => {
              const options = catalog.filter(
                (c) => c.selectable !== false && c.villanyGroup === group.id,
              );
              if (!options.length) return null;
              const q = (villanyQuery[group.id] ?? '').trim().toLowerCase();
              const matches = q
                ? options.filter((p) => `${p.name} ${p.notes ?? ''}`.toLowerCase().includes(q))
                : options;
              const selected = options.filter((p) => (selectedMains[p.id] ?? 0) > 0);
              return (
                <div key={group.id} className="space-y-2">
                  <details className="rounded-md border border-line bg-white">
                    <summary className="cursor-pointer list-none px-3 py-2 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between gap-2">
                        <span>
                          {group.label}
                          {selected.length > 0 ? (
                            <span className="ml-2 text-xs font-semibold text-sky-deep">
                              {selected.length} kiválasztva
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-xs text-ink-soft">{options.length}</span>
                      </span>
                    </summary>
                    <div className="border-t border-line p-2">
                      <input
                        className="field"
                        placeholder="Szűrés névre…"
                        value={villanyQuery[group.id] ?? ''}
                        onChange={(e) =>
                          setVillanyQuery((prev) => ({ ...prev, [group.id]: e.target.value }))
                        }
                      />
                      <ul className="mt-2 max-h-64 overflow-y-auto rounded-md border border-line bg-white">
                        {matches.map((p) => (
                          <li key={p.id} className="border-b border-line last:border-b-0">
                            <button
                              type="button"
                              className="flex w-full items-start justify-between gap-2 px-2 py-1.5 text-left text-sm hover:bg-mist"
                              onClick={() =>
                                setSelectedMains((prev) => ({
                                  ...prev,
                                  [p.id]: prev[p.id] ?? (p.unit === 'm' ? 10 : 1),
                                }))
                              }
                            >
                              <span>{p.name}</span>
                              <span className="shrink-0 text-xs text-ink-soft">
                                {formatHuf(p.buyPrice)} / {p.unit}
                              </span>
                            </button>
                          </li>
                        ))}
                        {matches.length === 0 ? (
                          <li className="px-2 py-2 text-sm text-ink-soft">Nincs találat</li>
                        ) : null}
                      </ul>
                    </div>
                  </details>
                  {selected.length > 0 ? (
                    <ul className="space-y-2 rounded-md border border-line bg-white/70 p-2">
                      {selected.map((p) => (
                        <li key={p.id} className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="min-w-0 flex-1 font-medium">{p.name}</span>
                          <input
                            type="number"
                            min={1}
                            max={5000}
                            className="w-20 rounded-md border border-line px-2 py-1"
                            value={selectedMains[p.id] ?? 1}
                            aria-label={`Mennyiség (${p.unit})`}
                            onChange={(e) => setMainQty(p.id, Number(e.target.value) || 1)}
                          />
                          <span className="text-xs text-ink-soft">{p.unit}</span>
                          <button
                            type="button"
                            className="text-xs font-semibold text-sun-deep hover:underline"
                            onClick={() => toggleMain(p.id)}
                          >
                            Eltávolít
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
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
                  A munkadíj tartalmazza a kiszállást: {preview.travel.oneWayKm} km egy út ·{' '}
                  {preview.travel.roundTripKm} km oda-vissza · beszerzés 150 Ft/km
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
                      {line.unit ? `${line.quantity} ${line.unit}` : line.quantity}
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
          type="button"
          disabled={loading || !preview || !topic}
          onClick={() => setShowQuotePreview(true)}
          className="rounded-md border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink disabled:opacity-50"
        >
          Ajánlat előnézete
        </button>
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

      {showQuotePreview && preview && topic ? (
        <div
          className="quote-preview-modal fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 print:static print:bg-transparent print:p-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-preview-title"
          onClick={() => setShowQuotePreview(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowQuotePreview(false);
          }}
        >
          <div
            className="my-4 w-full max-w-3xl rounded-xl bg-mist p-4 shadow-lg sm:p-6 print:my-0 print:max-w-none print:bg-white print:p-0 print:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <h2 id="quote-preview-title" className="font-display text-xl font-bold text-ink">
                Ajánlat előnézete
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-md border border-line bg-white px-3 py-1.5 text-sm font-semibold"
                >
                  Nyomtatás
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={(e) => {
                    void onSave(e, 'draft');
                    setShowQuotePreview(false);
                  }}
                  className="rounded-md bg-sky-deep px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Mentés piszkozatként
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuotePreview(false)}
                  className="rounded-md border border-line px-3 py-1.5 text-sm font-semibold"
                >
                  Bezárás
                </button>
              </div>
            </div>
            <QuoteDocument
              brand={brand}
              showInternalCosts={false}
              quote={{
                number: 'ELŐNÉZET',
                topic,
                customerName,
                customerAddress,
                customerPhone,
                customerEmail,
                createdAt: new Date().toISOString(),
                lines: preview.lines,
                totalBuy: preview.totalBuy,
                totalSell: preview.totalSell,
                draftPreview: true,
              }}
            />
          </div>
        </div>
      ) : null}

      <style>{`
        .field {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid var(--color-line);
          background: white;
          padding: 0.5rem 0.75rem;
        }
        @media print {
          body * {
            visibility: hidden !important;
          }
          .quote-preview-modal,
          .quote-preview-modal * {
            visibility: visible !important;
          }
          .quote-preview-modal {
            position: static !important;
            background: transparent !important;
            inset: auto !important;
          }
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
