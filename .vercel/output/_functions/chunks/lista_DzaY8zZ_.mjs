import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { l as renderTemplate, r as renderComponent } from "./server_CW7YRyya.mjs";
import "./compiler_22lG7MY0.mjs";
import { a as createComponent, n as formatHuf, r as $$QuoteAppLayout, t as formatDate } from "./format_BFO4UerF.mjs";
import { r as TOPIC_LABELS } from "./types_CV60844x.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/components/arajanlat/QuoteList.tsx
function QuoteList() {
	const [quotes, setQuotes] = useState([]);
	const [error, setError] = useState(null);
	async function load() {
		try {
			const data = await (await fetch("/api/arajanlat/quotes")).json();
			setQuotes(data.quotes ?? []);
		} catch {
			setError("Nem sikerült betölteni az ajánlatokat.");
		}
	}
	useEffect(() => {
		load();
	}, []);
	async function onDelete(id) {
		if (!confirm("Törlöd az ajánlatot?")) return;
		await fetch(`/api/arajanlat/quotes?id=${encodeURIComponent(id)}`, { method: "DELETE" });
		await load();
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-bold",
					children: "Mentett ajánlatok"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-ink-soft",
					children: "Megnyitás, nyomtatás, törlés."
				})] }), /* @__PURE__ */ jsx("a", {
					href: "/arajanlat",
					className: "rounded-md bg-sky-deep px-4 py-2 text-sm font-semibold text-white no-underline",
					children: "Új ajánlat"
				})]
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "text-sm text-sun-deep",
				children: error
			}),
			!quotes.length && !error ? /* @__PURE__ */ jsx("p", {
				className: "rounded-xl border border-dashed border-line bg-paper/50 px-4 py-10 text-center text-ink-soft",
				children: "Még nincs mentett ajánlat. Készíts egyet az Új ajánlat menüben."
			}) : /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto rounded-xl border border-line",
				children: /* @__PURE__ */ jsxs("table", {
					className: "min-w-full text-left text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-mist/80 text-xs uppercase tracking-wide text-ink-soft",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Szám"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Ügyfél"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Téma"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Összeg"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Státusz"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Dátum"
							}),
							/* @__PURE__ */ jsx("th", { className: "px-3 py-2" })
						] })
					}), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-line bg-paper/50",
						children: quotes.map((q) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2 font-medium",
								children: q.number
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2",
								children: q.customerName || "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2 whitespace-nowrap",
								children: TOPIC_LABELS[q.topic]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2 whitespace-nowrap font-semibold text-sky-deep",
								children: formatHuf(q.totalSell)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ jsx("span", {
									className: q.status === "final" ? "rounded bg-leaf/15 px-2 py-0.5 text-xs font-semibold text-leaf" : "rounded bg-mist px-2 py-0.5 text-xs font-semibold text-ink-soft",
									children: q.status === "final" ? "Végleges" : "Piszkozat"
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2 whitespace-nowrap text-ink-soft",
								children: formatDate(q.updatedAt)
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "px-3 py-2 whitespace-nowrap text-right",
								children: [/* @__PURE__ */ jsx("a", {
									href: `/arajanlat/ajanlat/${q.id}`,
									className: "text-sky-deep no-underline hover:underline",
									children: "Megnyit"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "ml-3 text-sun-deep hover:underline",
									onClick: () => void onDelete(q.id),
									children: "Töröl"
								})]
							})
						] }, q.id))
					})]
				})
			})
		]
	});
}
// src/pages/arajanlat/lista.astro
var lista_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Lista,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Lista = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "QuoteAppLayout", $$QuoteAppLayout, { "title": "Ajánlatok" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "QuoteList", QuoteList, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/workspace/src/components/arajanlat/QuoteList.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "/workspace/src/pages/arajanlat/lista.astro", void 0);
var $$file = "/workspace/src/pages/arajanlat/lista.astro";
var $$url = "/arajanlat/lista";
// \0virtual:astro:page:src/pages/arajanlat/lista@_@astro
var page = () => lista_exports;
export { page };
