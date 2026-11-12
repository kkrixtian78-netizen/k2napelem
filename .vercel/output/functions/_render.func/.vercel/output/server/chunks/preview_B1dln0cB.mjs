import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { n as withTotals, t as buildQuoteLines } from "./bom_qfJ23o2e.mjs";
import { i as listCatalog } from "./store_hvtb-aAJ.mjs";
// src/pages/api/arajanlat/preview.ts
var preview_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
/** Élő előnézet mentés nélkül. */
var POST = async ({ request }) => {
	const body = await request.json();
	const topic = body.topic;
	if (!topic) return Response.json({ error: "topic hiányzik" }, { status: 400 });
	const catalog = listCatalog();
	const selection = body.selection;
	try {
		const result = withTotals(buildQuoteLines(catalog, topic, selection));
		return Response.json(result);
	} catch (e) {
		return Response.json({ error: e instanceof Error ? e.message : "BOM hiba" }, { status: 400 });
	}
};
// \0virtual:astro:page:src/pages/api/arajanlat/preview@_@ts
var page = () => preview_exports;
export { page };
