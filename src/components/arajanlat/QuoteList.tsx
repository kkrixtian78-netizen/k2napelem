import { useEffect, useState } from 'react';
import { TOPIC_LABELS, type Quote } from '../../lib/arajanlat/types';
import { formatDate, formatHuf } from './format';

export default function QuoteList() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch('/api/arajanlat/quotes');
      const data = await res.json();
      setQuotes(data.quotes ?? []);
    } catch {
      setError('Nem sikerült betölteni az ajánlatokat.');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm('Törlöd az ajánlatot?')) return;
    await fetch(`/api/arajanlat/quotes?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Mentett ajánlatok</h1>
          <p className="mt-1 text-sm text-ink-soft">Megnyitás, nyomtatás, törlés.</p>
        </div>
        <a
          href="/arajanlat"
          className="rounded-md bg-sky-deep px-4 py-2 text-sm font-semibold text-white no-underline"
        >
          Új ajánlat
        </a>
      </div>

      {error && <p className="text-sm text-sun-deep">{error}</p>}

      {!quotes.length && !error ? (
        <p className="rounded-xl border border-dashed border-line bg-paper/50 px-4 py-10 text-center text-ink-soft">
          Még nincs mentett ajánlat. Készíts egyet az Új ajánlat menüben.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mist/80 text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-3 py-2">Szám</th>
                <th className="px-3 py-2">Ügyfél</th>
                <th className="px-3 py-2">Téma</th>
                <th className="px-3 py-2">Nettó</th>
                <th className="px-3 py-2">Státusz</th>
                <th className="px-3 py-2">Dátum</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-paper/50">
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td className="px-3 py-2 font-medium">{q.number}</td>
                  <td className="px-3 py-2">{q.customerName || '—'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{TOPIC_LABELS[q.topic]}</td>
                  <td className="px-3 py-2 whitespace-nowrap font-semibold text-sky-deep">
                    {formatHuf(q.totalSell)}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        q.status === 'final'
                          ? 'rounded bg-leaf/15 px-2 py-0.5 text-xs font-semibold text-leaf'
                          : 'rounded bg-mist px-2 py-0.5 text-xs font-semibold text-ink-soft'
                      }
                    >
                      {q.status === 'final' ? 'Végleges' : 'Piszkozat'}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-ink-soft">{formatDate(q.updatedAt)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <a href={`/arajanlat/ajanlat/${q.id}`} className="text-sky-deep no-underline hover:underline">
                      Megnyit
                    </a>
                    <button
                      type="button"
                      className="ml-3 text-sun-deep hover:underline"
                      onClick={() => void onDelete(q.id)}
                    >
                      Töröl
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
