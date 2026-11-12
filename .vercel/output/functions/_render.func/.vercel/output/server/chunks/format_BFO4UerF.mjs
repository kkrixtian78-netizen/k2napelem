import { h as InvalidComponentArgs, q as AstroError } from "./errors-data_D8O-YH_F.mjs";
import { l as renderTemplate, o as renderSlot, p as addAttribute, u as renderHead } from "./server_CW7YRyya.mjs";
import { t as createAstro } from "./compiler_22lG7MY0.mjs";
// node_modules/@astrojs/runtime/dist/internal/server/astro-component.js
function validateArgs(args) {
	if (args.length !== 3) return false;
	if (!args[0] || typeof args[0] !== "object") return false;
	return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
	const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
	const fn = (...args) => {
		if (!validateArgs(args)) throw new AstroError({
			...InvalidComponentArgs,
			message: InvalidComponentArgs.message(name)
		});
		return cb(...args);
	};
	Object.defineProperty(fn, "name", {
		value: name,
		writable: false
	});
	fn.isAstroComponentFactory = true;
	fn.moduleId = moduleId;
	fn.propagation = propagation;
	return fn;
}
function createComponentWithOptions(opts) {
	return baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
}
function createComponent(arg1, moduleId, propagation) {
	if (typeof arg1 === "function") return baseCreateComponent(arg1, moduleId, propagation);
	else return createComponentWithOptions(arg1);
}
// src/data/site.ts
var site = {
	name: "K2Napelem",
	legalName: "Kántor Krisztián EV",
	tagline: "Napelem, villanyszerelés és pályázat — Pócsmegyerről, országosan.",
	url: "https://k2napelem.hu",
	phone: "+36 30 2677 665",
	phoneHref: "tel:+36302677665",
	email: "k2@k2napelem.hu",
	emailHref: "mailto:k2@k2napelem.hu",
	address: "2017 Pócsmegyer, Táncsics út 10.",
	hours: "Telefon: hétköznap 9–16 · írásban bármikor",
	/** Google Cégem / Maps profil URL — ha megvan, a schema sameAs és a kapcsolat oldal használja */
	googleBusinessUrl: "https://share.google/WkhDZrxtdrCk8DQZV",
	whatsapp: "+36 30 2677 665",
	whatsappHref: "https://wa.me/36302677665",
	serviceArea: "Országos lefedettség — központ: Pócsmegyer",
	gtmId: "GTM-M6LP3FTV",
	formEndpoint: typeof process !== "undefined" && process.env.FORM_ENDPOINT || "https://formspree.io/f/meagjleq"
};
// src/layouts/QuoteAppLayout.astro
createAstro("https://k2napelem.hu");
var $$QuoteAppLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$QuoteAppLayout;
	const { title, description = "Belső árajánlatkészítő — K2Napelem" } = Astro.props;
	const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
	const path = Astro.url.pathname.replace(/\/$/, "") || "/arajanlat";
	return renderTemplate`<html lang="hu"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"${addAttribute(description, "content")}><meta name="robots" content="noindex,nofollow"><link rel="icon" type="image/png" href="/images/favicon.png"><title>${fullTitle}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Patrick+Hand&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">${renderHead($$result)}</head><body class="min-h-screen"><div class="relative z-10 min-h-screen"><header class="border-b border-line bg-paper/80 backdrop-blur-md print:hidden"><div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6"><a href="/arajanlat" class="group flex items-baseline gap-2 no-underline"><span class="font-brand text-2xl text-sky-deep sm:text-3xl">${site.name}</span><span class="text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">Árajánlat</span></a><nav class="flex flex-wrap items-center gap-1 text-sm font-medium"><a href="/arajanlat"${addAttribute(["rounded-md px-3 py-1.5 no-underline transition-colors", path === "/arajanlat" || path.startsWith("/arajanlat/uj") ? "bg-sky-deep text-white" : "text-ink-soft hover:bg-mist hover:text-ink"], "class:list")}>Új ajánlat</a><a href="/arajanlat/lista"${addAttribute(["rounded-md px-3 py-1.5 no-underline transition-colors", path.startsWith("/arajanlat/lista") || path.startsWith("/arajanlat/ajanlat") ? "bg-sky-deep text-white" : "text-ink-soft hover:bg-mist hover:text-ink"], "class:list")}>Ajánlatok</a><a href="/arajanlat/katalogus"${addAttribute(["rounded-md px-3 py-1.5 no-underline transition-colors", path.startsWith("/arajanlat/katalogus") ? "bg-sky-deep text-white" : "text-ink-soft hover:bg-mist hover:text-ink"], "class:list")}>Katalógus</a></nav></div></header><main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">${renderSlot($$result, $$slots["default"])}</main><footer class="print:hidden border-t border-line py-4 text-center text-xs text-ink-soft">Belső eszköz · ${site.name} · Árrés: beszerzés × 1,25</footer></div></body></html>`;
}, "/workspace/src/layouts/QuoteAppLayout.astro", void 0);
// src/components/arajanlat/format.ts
function formatHuf(amount) {
	return new Intl.NumberFormat("hu-HU", {
		style: "currency",
		currency: "HUF",
		maximumFractionDigits: 0
	}).format(amount);
}
function formatDate(iso) {
	try {
		return new Intl.DateTimeFormat("hu-HU", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		}).format(new Date(iso));
	} catch {
		return iso;
	}
}
export { createComponent as a, site as i, formatHuf as n, $$QuoteAppLayout as r, formatDate as t };
