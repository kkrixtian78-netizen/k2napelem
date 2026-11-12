import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { c as upsertCatalogItem, i as listCatalog, o as resetCatalogFromSeed, t as deleteCatalogItem } from "./store_hvtb-aAJ.mjs";
// src/pages/api/arajanlat/catalog.ts
var catalog_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ url }) => {
	const topic = url.searchParams.get("topic");
	let items = listCatalog();
	if (topic) items = items.filter((c) => c.topic === topic || c.topic === "all");
	return Response.json({ items });
};
var POST = async ({ request }) => {
	const body = await request.json();
	if (body?.action === "reset") {
		const items = resetCatalogFromSeed();
		return Response.json({
			items,
			reset: true
		});
	}
	const item = body;
	if (!item?.id || !item?.name || typeof item.buyPrice !== "number") return Response.json({ error: "Hiányos tételadat" }, { status: 400 });
	const saved = upsertCatalogItem({
		id: item.id,
		name: item.name,
		topic: item.topic ?? "all",
		category: item.category ?? "egyeb",
		unit: item.unit || "db",
		buyPrice: item.buyPrice,
		notes: item.notes,
		selectable: item.selectable ?? true,
		active: item.active ?? true
	});
	return Response.json({ item: saved });
};
var DELETE = async ({ url }) => {
	const id = url.searchParams.get("id");
	if (!id) return Response.json({ error: "id kötelező" }, { status: 400 });
	const ok = deleteCatalogItem(id);
	return Response.json({ deleted: ok });
};
// \0virtual:astro:page:src/pages/api/arajanlat/catalog@_@ts
var page = () => catalog_exports;
export { page };
