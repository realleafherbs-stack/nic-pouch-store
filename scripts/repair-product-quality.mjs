import { readFile, writeFile } from "node:fs/promises";
import { normalizeProductDisplayName, selectCatalogForSync } from "../lib/catalog/crm-adapter.mjs";

const baseUrl = process.env.AGENT_API_BASE_URL ?? "https://www.ducks.co.il/api/nic-pouch/agent";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nicpouch.co.il").replace(/\/$/, "");
const apiKey = process.env.AGENT_API_KEY;
const apply = process.argv.includes("--apply");
if (!apiKey) throw new Error("AGENT_API_KEY is required");

const headers = { "x-api-key": apiKey, "content-type": "application/json" };
const response = await fetch(`${baseUrl}/products`, { headers });
if (!response.ok) throw new Error(`Products request failed: ${response.status}`);
const sourceProducts = await response.json();
const currentCatalog = JSON.parse(await readFile(new URL("../data/catalog.generated.json", import.meta.url), "utf8"));
const selectedById = new Map(selectCatalogForSync(currentCatalog, sourceProducts).map((product) => [product.id, product]));

const absoluteImage = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  return new URL(value, siteUrl).href;
};

const updates = sourceProducts.flatMap((source) => {
  if (!source.active) return [];
  const selected = selectedById.get(source.id);
  if (!selected?.active) {
    return [{ id: source.id, data: { active: false, indexable: false }, before: source }];
  }

  const data = {};
  if (!String(source.imageAlt ?? "").trim()) {
    const label = normalizeProductDisplayName(String(source.name ?? ""), source.brand) || String(source.name ?? "מוצר");
    data.imageAlt = `${label} – תמונת מוצר`;
  }

  if (!String(source.image ?? "").trim()) {
    const approvedImages = (selected.images ?? []).map(absoluteImage).filter(Boolean);
    if (approvedImages.length) {
      data.image = approvedImages[0];
      data.images = approvedImages;
      data.imageLocked = true;
    }
  }

  return Object.keys(data).length ? [{ id: source.id, data, before: source }] : [];
});

const backupPath = `/tmp/nicpouch-product-quality-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
await writeFile(backupPath, JSON.stringify({ generatedAt: new Date().toISOString(), updates }, null, 2));

const results = [];
for (let index = 0; index < updates.length; index += 50) {
  const batch = updates.slice(index, index + 50);
  const bulkResponse = await fetch(`${baseUrl}/products/bulk`, {
    method: "POST",
    headers,
    body: JSON.stringify({ dryRun: !apply, updates: batch.map(({ id, data }) => ({ id, data })) }),
  });
  const payload = await bulkResponse.json();
  if (!bulkResponse.ok) throw new Error(`Bulk request failed (${bulkResponse.status}): ${JSON.stringify(payload)}`);
  results.push(payload);
}

const counts = updates.reduce((summary, update) => {
  if (update.data.active === false) summary.deactivated += 1;
  if (update.data.imageAlt) summary.altText += 1;
  if (update.data.image) summary.restoredImages += 1;
  return summary;
}, { deactivated: 0, altText: 0, restoredImages: 0 });

console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", updates: updates.length, counts, backupPath, batches: results.length }, null, 2));
