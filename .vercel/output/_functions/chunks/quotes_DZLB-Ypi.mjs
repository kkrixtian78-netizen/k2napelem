import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { n as withTotals, t as buildQuoteLines } from "./bom_qfJ23o2e.mjs";
import { a as listQuotes, i as listCatalog, n as deleteQuote, r as getQuote, s as saveQuote } from "./store_hvtb-aAJ.mjs";
// src/pages/api/arajanlat/quotes.ts
var quotes_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ url }) => {
	const id = url.searchParams.get("id");
	if (id) {
		const quote = getQuote(id);
		if (!quote) return Response.json({ error: "Nincs ilyen ajánlat" }, { status: 404 });
		return Response.json({ quote });
	}
	return Response.json({ quotes: listQuotes() });
};
var POST = async ({ request }) => {
	const body = await request.json();
	const topic = body.topic;
	if (!topic || ![
		"napelem",
		"villany",
		"futes"
	].includes(topic)) return Response.json({ error: "Érvénytelen témakör" }, { status: 400 });
	const catalog = listCatalog();
	const selection = body.selection;
	const built = withTotals(buildQuoteLines(catalog, topic, selection));
	const lines = Array.isArray(body.lines) && body.lines.length ? body.lines : built.lines;
	const totals = Array.isArray(body.lines) && body.lines.length ? withTotals(body.lines) : built;
	const quote = saveQuote({
		id: body.id,
		topic,
		customerName: body.customerName || "",
		customerAddress: body.customerAddress || "",
		customerNote: body.customerNote || "",
		status: body.status === "final" ? "final" : "draft",
		selection,
		lines,
		totalBuy: totals.totalBuy,
		totalSell: totals.totalSell
	});
	return Response.json({ quote });
};
var DELETE = async ({ url }) => {
	const id = url.searchParams.get("id");
	if (!id) return Response.json({ error: "id kötelező" }, { status: 400 });
	return Response.json({ deleted: deleteQuote(id) });
};
// \0virtual:astro:page:src/pages/api/arajanlat/quotes@_@ts
var page = () => quotes_exports;
export { page };
