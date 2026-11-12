import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { l as renderTemplate, r as renderComponent } from "./server_CW7YRyya.mjs";
import { t as createAstro } from "./compiler_22lG7MY0.mjs";
import { a as createComponent, i as site, n as formatHuf, r as $$QuoteAppLayout, t as formatDate } from "./format_BFO4UerF.mjs";
import { r as TOPIC_LABELS } from "./types_CV60844x.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/components/arajanlat/QuoteView.tsx
function QuoteView({ quoteId, brand }) {
	const [quote, setQuote] = useState(null);
	const [error, setError] = useState(null);
	useEffect(() => {
		fetch(`/api/arajanlat/quotes?id=${encodeURIComponent(quoteId)}`).then(async (r) => {
			const data = await r.json();
			if (!r.ok) throw new Error(data.error || "Hiba");
			setQuote(data.quote);
		}).catch((e) => setError(e instanceof Error ? e.message : "Betöltési hiba"));
	}, [quoteId]);
	if (error) return /* @__PURE__ */ jsx("p", {
		className: "text-sun-deep",
		children: error
	});
	if (!quote) return /* @__PURE__ */ jsx("p", {
		className: "text-ink-soft",
		children: "Betöltés…"
	});
	const margin = quote.totalSell - quote.totalBuy;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-start justify-between gap-3 print:hidden",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("a", {
				href: "/arajanlat/lista",
				className: "text-sm text-sky-deep hover:underline",
				children: "← Ajánlatok"
			}), /* @__PURE__ */ jsx("h1", {
				className: "mt-1 font-display text-3xl font-bold",
				children: quote.number
			})] }), /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => window.print(),
				className: "rounded-md bg-sky-deep px-4 py-2 text-sm font-semibold text-white",
				children: "Nyomtatás / PDF"
			})]
		}), /* @__PURE__ */ jsxs("article", {
			className: "rounded-xl border border-line bg-paper/80 p-5 sm:p-8 print:border-0 print:bg-white print:p-0",
			children: [
				/* @__PURE__ */ jsxs("header", {
					className: "flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "font-brand text-3xl text-sky-deep",
						children: brand.name
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: [
							brand.legalName,
							/* @__PURE__ */ jsx("br", {}),
							brand.address,
							/* @__PURE__ */ jsx("br", {}),
							brand.phone,
							" · ",
							brand.email
						]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "text-right",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-ink-soft",
								children: "Árajánlat"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "font-display text-2xl font-bold",
								children: quote.number
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 text-sm text-ink-soft",
								children: formatDate(quote.createdAt)
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 text-sm",
								children: TOPIC_LABELS[quote.topic]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "mt-5 grid gap-2 text-sm sm:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-xs font-semibold uppercase tracking-wide text-ink-soft",
							children: "Ügyfél"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "font-medium",
							children: quote.customerName || "—"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-ink-soft",
							children: quote.customerAddress || ""
						})
					] }), quote.customerNote && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-semibold uppercase tracking-wide text-ink-soft",
						children: "Megjegyzés"
					}), /* @__PURE__ */ jsx("div", { children: quote.customerNote })] })]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "min-w-full text-left text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "border-b border-line text-xs uppercase tracking-wide text-ink-soft",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "py-2 pr-2 font-semibold",
									children: "Megnevezés"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2 px-2 font-semibold",
									children: "Menny."
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2 px-2 font-semibold",
									children: "Egységár"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2 pl-2 font-semibold text-right",
									children: "Összesen"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-line",
							children: quote.lines.map((line) => /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-2 pr-2",
									children: line.name
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "py-2 px-2 whitespace-nowrap",
									children: [
										line.quantity,
										" ",
										line.unit
									]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-2 px-2 whitespace-nowrap",
									children: formatHuf(line.sellPrice)
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-2 pl-2 whitespace-nowrap text-right font-medium",
									children: formatHuf(line.sellPrice * line.quantity)
								})
							] }, `${line.catalogId}-${line.name}`))
						})]
					})
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "mt-6 flex flex-col items-end gap-1 border-t border-line pt-4 text-sm",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "text-ink-soft print:hidden",
							children: [
								"Beszerzés (belső): ",
								formatHuf(quote.totalBuy),
								" · Árrés: ",
								formatHuf(margin)
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "font-display text-2xl font-bold text-sky-deep",
							children: ["Ajánlati összesen (nettó): ", formatHuf(quote.totalSell)]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "max-w-md text-right text-xs text-ink-soft",
							children: [
								"Az árak tájékoztató jellegűek, nettó forintban. Az árajánlat a ",
								brand.name,
								" belső kalkulációja alapján készült (25% árrés a beszerzési áron)."
							]
						})
					]
				})
			]
		})]
	});
}
// src/pages/arajanlat/ajanlat/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://k2napelem.hu");
var $$Id = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	if (!id) return Astro.redirect("/arajanlat/lista");
	const brand = {
		name: site.name,
		legalName: site.legalName,
		address: site.address,
		phone: site.phone,
		email: site.email
	};
	return renderTemplate`${renderComponent($$result, "QuoteAppLayout", $$QuoteAppLayout, { "title": `Ajánlat ${id}` }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "QuoteView", QuoteView, {
		"client:load": true,
		"quoteId": id,
		"brand": brand,
		"client:component-hydration": "load",
		"client:component-path": "/workspace/src/components/arajanlat/QuoteView.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "/workspace/src/pages/arajanlat/ajanlat/[id].astro", void 0);
var $$file = "/workspace/src/pages/arajanlat/ajanlat/[id].astro";
var $$url = "/arajanlat/ajanlat/[id]";
// \0virtual:astro:page:src/pages/arajanlat/ajanlat/[id]@_@astro
var page = () => _id__exports;
export { page };
