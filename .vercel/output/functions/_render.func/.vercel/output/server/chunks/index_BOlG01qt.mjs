import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { l as renderTemplate, r as renderComponent } from "./server_CW7YRyya.mjs";
import "./compiler_22lG7MY0.mjs";
import { a as createComponent, n as formatHuf, r as $$QuoteAppLayout } from "./format_BFO4UerF.mjs";
import { r as TOPIC_LABELS, t as CATEGORY_LABELS } from "./types_CV60844x.mjs";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/components/arajanlat/QuoteWizard.tsx
var TOPICS = [
	"napelem",
	"villany",
	"futes"
];
function QuoteWizard() {
	const [topic, setTopic] = useState(null);
	const [catalog, setCatalog] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [savedId, setSavedId] = useState(null);
	const [customerName, setCustomerName] = useState("");
	const [customerAddress, setCustomerAddress] = useState("");
	const [customerNote, setCustomerNote] = useState("");
	const [panelId, setPanelId] = useState("");
	const [panelCount, setPanelCount] = useState(12);
	const [inverterId, setInverterId] = useState("");
	const [storageId, setStorageId] = useState("bat-none");
	const [roofTypeId, setRoofTypeId] = useState("roof-cserep");
	const [selectedMains, setSelectedMains] = useState({});
	const [preview, setPreview] = useState(null);
	useEffect(() => {
		if (!topic) return;
		setLoading(true);
		setError(null);
		setSavedId(null);
		setPreview(null);
		setSelectedMains({});
		fetch(`/api/arajanlat/catalog?topic=${topic}`).then((r) => r.json()).then((data) => {
			const items = data.items.filter((c) => c.active);
			setCatalog(items);
			if (topic === "napelem") {
				const panels = items.filter((c) => c.category === "panel");
				const invs = items.filter((c) => c.category === "inverter");
				const bats = items.filter((c) => c.category === "tarolo");
				const roofs = items.filter((c) => c.category === "tetotipus");
				setPanelId(panels[0]?.id ?? "");
				setInverterId(invs[0]?.id ?? "");
				setStorageId(bats.find((b) => b.id === "bat-none")?.id ?? bats[0]?.id ?? "");
				setRoofTypeId(roofs[0]?.id ?? "");
			}
		}).catch(() => setError("Nem sikerült betölteni a katalógust.")).finally(() => setLoading(false));
	}, [topic]);
	function selectionPayload() {
		if (!topic) return null;
		if (topic === "napelem") {
			if (!panelId || !inverterId || !roofTypeId) return null;
			return {
				panelId,
				panelCount,
				inverterId,
				storageId: storageId === "bat-none" ? null : storageId,
				roofTypeId
			};
		}
		const mainItemIds = Object.keys(selectedMains).filter((id) => (selectedMains[id] ?? 0) > 0);
		if (!mainItemIds.length) return null;
		return {
			mainItemIds,
			quantities: selectedMains
		};
	}
	async function refreshPreview() {
		const selection = selectionPayload();
		if (!topic || !selection) {
			setPreview(null);
			return;
		}
		setError(null);
		try {
			const res = await fetch("/api/arajanlat/preview", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					topic,
					selection
				})
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Előnézet hiba");
			setPreview(data);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Előnézet hiba");
		}
	}
	useEffect(() => {
		if (!topic) return;
		const t = setTimeout(() => {
			refreshPreview();
		}, 200);
		return () => clearTimeout(t);
	}, [
		topic,
		panelId,
		panelCount,
		inverterId,
		storageId,
		roofTypeId,
		selectedMains
	]);
	async function onSave(e, status) {
		e.preventDefault();
		const selection = selectionPayload();
		if (!topic || !selection) {
			setError("Válassz főanyagokat az ajánlathoz.");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/arajanlat/quotes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					topic,
					selection,
					customerName,
					customerAddress,
					customerNote,
					status,
					lines: preview?.lines
				})
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Mentés sikertelen");
			setSavedId(data.quote.id);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Mentés sikertelen");
		} finally {
			setLoading(false);
		}
	}
	function toggleMain(id) {
		setSelectedMains((prev) => {
			const next = { ...prev };
			if (next[id]) delete next[id];
			else next[id] = 1;
			return next;
		});
	}
	function setMainQty(id, qty) {
		setSelectedMains((prev) => ({
			...prev,
			[id]: Math.max(1, qty)
		}));
	}
	if (!topic) return /* @__PURE__ */ jsxs("div", {
		className: "reveal",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-bold text-ink sm:text-4xl",
				children: "Új árajánlat"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 max-w-xl text-ink-soft",
				children: "Válaszd ki a témakört. A főanyagok megadása után a rendszer automatikusan összeállítja a teljes tételsort (fogyóanyag, védelem, munkadíj)."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-3",
				children: TOPICS.map((id, i) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setTopic(id),
					className: "group rounded-xl border border-line bg-paper/70 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-deep/40 hover:shadow-md",
					style: { animationDelay: `${i * .08}s` },
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-sky-deep",
							children: "Témakör"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "mt-2 block font-display text-xl font-bold text-ink group-hover:text-sky-deep",
							children: TOPIC_LABELS[id]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "mt-2 block text-sm text-ink-soft",
							children: [
								id === "napelem" && "Panel, inverter, tároló, tető — a többi automatikus.",
								id === "villany" && "Főanyagok kiválasztása → kapcsolódó szerelés és fogyóanyag.",
								id === "futes" && "Infrapanel, fűtőszőnyeg, konvektor — szereléssel kiegészítve."
							]
						})
					]
				}, id))
			})
		]
	});
	const panels = catalog.filter((c) => c.category === "panel");
	const inverters = catalog.filter((c) => c.category === "inverter");
	const storages = catalog.filter((c) => c.category === "tarolo");
	const roofs = catalog.filter((c) => c.category === "tetotipus");
	const mains = catalog.filter((c) => c.selectable !== false && c.category === "foanyag");
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: (e) => onSave(e, "draft"),
		className: "reveal space-y-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setTopic(null),
						className: "mb-2 text-sm text-sky-deep hover:underline",
						children: "← Témakör váltása"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-display text-3xl font-bold text-ink",
						children: TOPIC_LABELS[topic]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: "Eladási ár = beszerzés × 1,25 (25% árrés)"
					})
				] }), savedId && /* @__PURE__ */ jsx("a", {
					href: `/arajanlat/ajanlat/${savedId}`,
					className: "rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white no-underline",
					children: "Mentett ajánlat megnyitása →"
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-4 rounded-xl border border-line bg-paper/60 p-4 sm:grid-cols-3 sm:p-5",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "block text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block font-medium text-ink",
							children: "Ügyfél neve"
						}), /* @__PURE__ */ jsx("input", {
							className: "w-full rounded-md border border-line bg-white px-3 py-2",
							value: customerName,
							onChange: (e) => setCustomerName(e.target.value),
							placeholder: "pl. Kovács János"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block text-sm sm:col-span-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block font-medium text-ink",
							children: "Cím"
						}), /* @__PURE__ */ jsx("input", {
							className: "w-full rounded-md border border-line bg-white px-3 py-2",
							value: customerAddress,
							onChange: (e) => setCustomerAddress(e.target.value),
							placeholder: "Település, utca"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "block text-sm sm:col-span-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block font-medium text-ink",
							children: "Megjegyzés"
						}), /* @__PURE__ */ jsx("textarea", {
							className: "w-full rounded-md border border-line bg-white px-3 py-2",
							rows: 2,
							value: customerNote,
							onChange: (e) => setCustomerNote(e.target.value),
							placeholder: "Opcionális belső / ügyfél megjegyzés"
						})]
					})
				]
			}),
			topic === "napelem" ? /* @__PURE__ */ jsxs("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-xl font-bold",
					children: "Főanyagok (csak ezeket válaszd)"
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: "Napelem panel",
							children: /* @__PURE__ */ jsx("select", {
								className: "field",
								value: panelId,
								onChange: (e) => setPanelId(e.target.value),
								children: panels.map((p) => /* @__PURE__ */ jsxs("option", {
									value: p.id,
									children: [
										p.name,
										" — ",
										formatHuf(p.buyPrice)
									]
								}, p.id))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Panelszám",
							children: /* @__PURE__ */ jsx("input", {
								type: "number",
								min: 1,
								max: 200,
								className: "field",
								value: panelCount,
								onChange: (e) => setPanelCount(Number(e.target.value) || 1)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Inverter",
							children: /* @__PURE__ */ jsx("select", {
								className: "field",
								value: inverterId,
								onChange: (e) => setInverterId(e.target.value),
								children: inverters.map((p) => /* @__PURE__ */ jsxs("option", {
									value: p.id,
									children: [
										p.name,
										" — ",
										formatHuf(p.buyPrice)
									]
								}, p.id))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Energiatároló",
							children: /* @__PURE__ */ jsx("select", {
								className: "field",
								value: storageId,
								onChange: (e) => setStorageId(e.target.value),
								children: storages.map((p) => /* @__PURE__ */ jsxs("option", {
									value: p.id,
									children: [p.name, p.buyPrice > 0 ? ` — ${formatHuf(p.buyPrice)}` : ""]
								}, p.id))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Tetőfelület típusa",
							children: /* @__PURE__ */ jsx("select", {
								className: "field",
								value: roofTypeId,
								onChange: (e) => setRoofTypeId(e.target.value),
								children: roofs.map((p) => /* @__PURE__ */ jsx("option", {
									value: p.id,
									children: p.name
								}, p.id))
							})
						})
					]
				})]
			}) : /* @__PURE__ */ jsxs("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "font-display text-xl font-bold",
						children: "Főanyagok kiválasztása"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-ink-soft",
						children: "Jelöld a szükséges főanyagokat. A kapcsolódó fogyóanyagok és munkadíjak automatikusan hozzáadódnak."
					}),
					/* @__PURE__ */ jsx("ul", {
						className: "divide-y divide-line rounded-xl border border-line bg-paper/60",
						children: mains.map((item) => {
							const on = selectedMains[item.id] != null;
							return /* @__PURE__ */ jsxs("li", {
								className: "flex flex-wrap items-center gap-3 px-4 py-3",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "flex min-w-0 flex-1 cursor-pointer items-center gap-3",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: on,
										onChange: () => toggleMain(item.id),
										className: "size-4 accent-sky-deep"
									}), /* @__PURE__ */ jsxs("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ jsx("span", {
											className: "block font-medium text-ink",
											children: item.name
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-xs text-ink-soft",
											children: [
												CATEGORY_LABELS[item.category],
												" · beszerzés ",
												formatHuf(item.buyPrice),
												" / ",
												item.unit
											]
										})]
									})]
								}), on && /* @__PURE__ */ jsx("input", {
									type: "number",
									min: 1,
									className: "w-24 rounded-md border border-line bg-white px-2 py-1.5 text-sm",
									value: selectedMains[item.id] ?? 1,
									onChange: (e) => setMainQty(item.id, Number(e.target.value) || 1),
									"aria-label": "Mennyiség"
								})]
							}, item.id);
						})
					})
				]
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "rounded-md border border-sun/40 bg-sun/10 px-3 py-2 text-sm text-sun-deep",
				role: "alert",
				children: error
			}),
			preview && /* @__PURE__ */ jsxs("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-end justify-between gap-2",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-display text-xl font-bold",
						children: "Automatikus tételsor"
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-right text-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-ink-soft",
							children: ["Beszerzés összesen: ", formatHuf(preview.totalBuy)]
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-lg font-bold text-sky-deep",
							children: ["Ajánlati összesen: ", formatHuf(preview.totalSell)]
						})]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto rounded-xl border border-line",
					children: /* @__PURE__ */ jsxs("table", {
						className: "min-w-full text-left text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-mist/80 text-xs uppercase tracking-wide text-ink-soft",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 font-semibold",
									children: "Tétel"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 font-semibold",
									children: "Menny."
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 font-semibold",
									children: "Beszerzés"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 font-semibold",
									children: "Eladás"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 font-semibold",
									children: "Sor össz."
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-line bg-paper/50",
							children: preview.lines.map((line) => /* @__PURE__ */ jsxs("tr", {
								className: line.auto ? "text-ink-soft" : "",
								children: [
									/* @__PURE__ */ jsxs("td", {
										className: "px-3 py-2",
										children: [line.name, line.auto && /* @__PURE__ */ jsx("span", {
											className: "ml-2 text-[10px] uppercase tracking-wide text-sky-deep",
											children: "auto"
										})]
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "px-3 py-2 whitespace-nowrap",
										children: [
											line.quantity,
											" ",
											line.unit
										]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-3 py-2 whitespace-nowrap",
										children: formatHuf(line.buyPrice)
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-3 py-2 whitespace-nowrap",
										children: formatHuf(line.sellPrice)
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-3 py-2 whitespace-nowrap font-medium",
										children: formatHuf(line.sellPrice * line.quantity)
									})
								]
							}, `${line.catalogId}-${line.auto ? "a" : "m"}`))
						})]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-3 print:hidden",
				children: [/* @__PURE__ */ jsx("button", {
					type: "submit",
					disabled: loading || !preview,
					className: "rounded-md bg-sky-deep px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50",
					children: "Mentés piszkozatként"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					disabled: loading || !preview,
					onClick: (e) => onSave(e, "final"),
					className: "rounded-md border border-sky-deep px-5 py-2.5 text-sm font-semibold text-sky-deep disabled:opacity-50",
					children: "Mentés véglegesként"
				})]
			}),
			/* @__PURE__ */ jsx("style", { children: `
        .field {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid var(--color-line);
          background: white;
          padding: 0.5rem 0.75rem;
        }
      ` })
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block text-sm",
		children: [/* @__PURE__ */ jsx("span", {
			className: "mb-1 block font-medium text-ink",
			children: label
		}), children]
	});
}
// src/pages/arajanlat/index.astro
var arajanlat_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "QuoteAppLayout", $$QuoteAppLayout, { "title": "Új árajánlat" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "QuoteWizard", QuoteWizard, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/workspace/src/components/arajanlat/QuoteWizard.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "/workspace/src/pages/arajanlat/index.astro", void 0);
var $$file = "/workspace/src/pages/arajanlat/index.astro";
var $$url = "/arajanlat";
// \0virtual:astro:page:src/pages/arajanlat/index@_@astro
var page = () => arajanlat_exports;
export { page };
