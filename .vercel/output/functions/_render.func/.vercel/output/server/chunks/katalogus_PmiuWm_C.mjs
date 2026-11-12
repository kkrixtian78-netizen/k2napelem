import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { l as renderTemplate, r as renderComponent } from "./server_CW7YRyya.mjs";
import "./compiler_22lG7MY0.mjs";
import { a as createComponent, n as formatHuf, r as $$QuoteAppLayout } from "./format_BFO4UerF.mjs";
import { r as TOPIC_LABELS, t as CATEGORY_LABELS } from "./types_CV60844x.mjs";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/components/arajanlat/CatalogManager.tsx
var TOPICS = [
	"napelem",
	"villany",
	"futes",
	"all"
];
var CATEGORIES = Object.keys(CATEGORY_LABELS);
var emptyForm = () => ({
	id: "",
	name: "",
	topic: "napelem",
	category: "foanyag",
	unit: "db",
	buyPrice: 0,
	selectable: true,
	active: true,
	notes: ""
});
function CatalogManager() {
	const [items, setItems] = useState([]);
	const [filterTopic, setFilterTopic] = useState("");
	const [q, setQ] = useState("");
	const [form, setForm] = useState(emptyForm());
	const [editing, setEditing] = useState(false);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);
	async function load() {
		const data = await (await fetch("/api/arajanlat/catalog")).json();
		setItems(data.items ?? []);
	}
	useEffect(() => {
		load();
	}, []);
	const filtered = useMemo(() => {
		return items.filter((item) => {
			if (filterTopic && item.topic !== filterTopic) return false;
			if (q) {
				if (!`${item.name} ${item.id}`.toLowerCase().includes(q.toLowerCase())) return false;
			}
			return true;
		});
	}, [
		items,
		filterTopic,
		q
	]);
	function startEdit(item) {
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
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!form.id.trim() || !form.name.trim()) {
			setError("Az azonosító és a név kötelező.");
			return;
		}
		const res = await fetch("/api/arajanlat/catalog", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...form,
				buyPrice: Number(form.buyPrice) || 0
			})
		});
		const data = await res.json();
		if (!res.ok) {
			setError(data.error || "Mentés sikertelen");
			return;
		}
		setMessage("Katalógustétel mentve.");
		setEditing(false);
		await load();
	}
	async function onDelete(id) {
		if (!confirm(`Törlöd: ${id}?`)) return;
		await fetch(`/api/arajanlat/catalog?id=${encodeURIComponent(id)}`, { method: "DELETE" });
		await load();
	}
	async function onReset() {
		if (!confirm("Visszaállítod a katalógust a seed adatokra? A saját módosítások elvesznek.")) return;
		await fetch("/api/arajanlat/catalog", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "reset" })
		});
		setMessage("Katalógus visszaállítva a seed adatokról.");
		await load();
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-bold text-ink",
					children: "Anyagkatalógus"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-ink-soft",
					children: "Beszerzési árak szerkesztése. Eladási ár automatikusan × 1,25."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: startNew,
						className: "rounded-md bg-sky-deep px-4 py-2 text-sm font-semibold text-white",
						children: "Új tétel"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => void onReset(),
						className: "rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-soft",
						children: "Seed visszaállítás"
					})]
				})]
			}),
			message && /* @__PURE__ */ jsx("p", {
				className: "text-sm text-leaf",
				children: message
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "text-sm text-sun-deep",
				children: error
			}),
			editing && /* @__PURE__ */ jsxs("form", {
				onSubmit,
				className: "grid gap-3 rounded-xl border border-line bg-paper/70 p-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "font-display text-lg font-bold sm:col-span-2",
						children: form.id && items.some((i) => i.id === form.id) ? "Tétel szerkesztése" : "Új tétel"
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block font-medium",
							children: "Azonosító (id)"
						}), /* @__PURE__ */ jsx("input", {
							className: "w-full rounded-md border border-line bg-white px-3 py-2",
							value: form.id,
							onChange: (e) => setForm({
								...form,
								id: e.target.value.trim()
							}),
							required: true
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block font-medium",
							children: "Név"
						}), /* @__PURE__ */ jsx("input", {
							className: "w-full rounded-md border border-line bg-white px-3 py-2",
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value
							}),
							required: true
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block font-medium",
							children: "Témakör"
						}), /* @__PURE__ */ jsx("select", {
							className: "w-full rounded-md border border-line bg-white px-3 py-2",
							value: form.topic,
							onChange: (e) => setForm({
								...form,
								topic: e.target.value
							}),
							children: TOPICS.map((t) => /* @__PURE__ */ jsx("option", {
								value: t,
								children: t === "all" ? "Összes" : TOPIC_LABELS[t]
							}, t))
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block font-medium",
							children: "Kategória"
						}), /* @__PURE__ */ jsx("select", {
							className: "w-full rounded-md border border-line bg-white px-3 py-2",
							value: form.category,
							onChange: (e) => setForm({
								...form,
								category: e.target.value
							}),
							children: CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", {
								value: c,
								children: CATEGORY_LABELS[c]
							}, c))
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block font-medium",
							children: "Egység"
						}), /* @__PURE__ */ jsx("input", {
							className: "w-full rounded-md border border-line bg-white px-3 py-2",
							value: form.unit,
							onChange: (e) => setForm({
								...form,
								unit: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "mb-1 block font-medium",
								children: "Beszerzési ár (Ft)"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "number",
								min: 0,
								className: "w-full rounded-md border border-line bg-white px-3 py-2",
								value: form.buyPrice,
								onChange: (e) => setForm({
									...form,
									buyPrice: Number(e.target.value)
								})
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "mt-1 block text-xs text-ink-soft",
								children: ["Eladás: ", formatHuf(Math.round(form.buyPrice * 1.25))]
							})
						]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-sm sm:col-span-1",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: form.selectable !== false,
							onChange: (e) => setForm({
								...form,
								selectable: e.target.checked
							})
						}), "Választható főanyag"]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: form.active,
							onChange: (e) => setForm({
								...form,
								active: e.target.checked
							})
						}), "Aktív"]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm sm:col-span-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block font-medium",
							children: "Megjegyzés"
						}), /* @__PURE__ */ jsx("input", {
							className: "w-full rounded-md border border-line bg-white px-3 py-2",
							value: form.notes ?? "",
							onChange: (e) => setForm({
								...form,
								notes: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2 sm:col-span-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "rounded-md bg-sky-deep px-4 py-2 text-sm font-semibold text-white",
							children: "Mentés"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setEditing(false),
							className: "rounded-md border border-line px-4 py-2 text-sm",
							children: "Mégse"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-3",
				children: [/* @__PURE__ */ jsx("input", {
					className: "min-w-[12rem] flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm",
					placeholder: "Keresés név / id…",
					value: q,
					onChange: (e) => setQ(e.target.value)
				}), /* @__PURE__ */ jsxs("select", {
					className: "rounded-md border border-line bg-white px-3 py-2 text-sm",
					value: filterTopic,
					onChange: (e) => setFilterTopic(e.target.value),
					children: [/* @__PURE__ */ jsx("option", {
						value: "",
						children: "Minden témakör"
					}), TOPICS.map((t) => /* @__PURE__ */ jsx("option", {
						value: t,
						children: t === "all" ? "Összes (shared)" : TOPIC_LABELS[t]
					}, t))]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto rounded-xl border border-line",
				children: /* @__PURE__ */ jsxs("table", {
					className: "min-w-full text-left text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-mist/80 text-xs uppercase tracking-wide text-ink-soft",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Név"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Téma"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Kat."
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Beszerzés"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2",
								children: "Eladás"
							}),
							/* @__PURE__ */ jsx("th", { className: "px-3 py-2" })
						] })
					}), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-line bg-paper/50",
						children: filtered.map((item) => /* @__PURE__ */ jsxs("tr", {
							className: !item.active ? "opacity-50" : void 0,
							children: [
								/* @__PURE__ */ jsxs("td", {
									className: "px-3 py-2",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-medium",
										children: item.name
									}), /* @__PURE__ */ jsx("div", {
										className: "text-xs text-ink-soft",
										children: item.id
									})]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-3 py-2 whitespace-nowrap",
									children: item.topic === "all" ? "mind" : TOPIC_LABELS[item.topic]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-3 py-2 whitespace-nowrap",
									children: CATEGORY_LABELS[item.category]
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-3 py-2 whitespace-nowrap",
									children: [
										formatHuf(item.buyPrice),
										" / ",
										item.unit
									]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-3 py-2 whitespace-nowrap font-medium text-sky-deep",
									children: formatHuf(Math.round(item.buyPrice * 1.25))
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-3 py-2 whitespace-nowrap text-right",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										className: "text-sky-deep hover:underline",
										onClick: () => startEdit(item),
										children: "Szerkeszt"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										className: "ml-3 text-sun-deep hover:underline",
										onClick: () => void onDelete(item.id),
										children: "Töröl"
									})]
								})
							]
						}, item.id))
					})]
				})
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-xs text-ink-soft",
				children: [filtered.length, " tétel"]
			})
		]
	});
}
// src/pages/arajanlat/katalogus.astro
var katalogus_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Katalogus,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Katalogus = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "QuoteAppLayout", $$QuoteAppLayout, { "title": "Katalógus" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "CatalogManager", CatalogManager, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/workspace/src/components/arajanlat/CatalogManager.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "/workspace/src/pages/arajanlat/katalogus.astro", void 0);
var $$file = "/workspace/src/pages/arajanlat/katalogus.astro";
var $$url = "/arajanlat/katalogus";
// \0virtual:astro:page:src/pages/arajanlat/katalogus@_@astro
var page = () => katalogus_exports;
export { page };
