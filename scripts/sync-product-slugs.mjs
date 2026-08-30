import { writeFile } from "node:fs/promises";
import { mapCrmProducts } from "../lib/catalog/crm-adapter.mjs";

const baseUrl = process.env.AGENT_API_BASE_URL ?? "https://www.ducks.co.il/api/nic-pouch/agent";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nicpouch.co.il").replace(/\/$/, "");
const apiKey = process.env.AGENT_API_KEY;
const apply = process.argv.includes("--apply");

if (!apiKey) throw new Error("AGENT_API_KEY is required");

const headers = { "x-api-key": apiKey, "content-type": "application/json" };
const response = await fetch(`${baseUrl}/products`, { headers });
if (!response.ok) throw new Error(`Products request failed: ${response.status}`);
const sourceProducts = await response.json();
const mappedById = new Map(mapCrmProducts(sourceProducts).map((product) => [product.id, product]));

const updates = sourceProducts.flatMap((source) => {
  const mapped = mappedById.get(source.id);
  if (!source.active || !mapped?.active) return [];
  const canonicalUrl = `${siteUrl}/shop/${mapped.slug}`;
  if (source.handle === mapped.slug && source.canonicalUrl === canonicalUrl) return [];
  return [{
    id: source.id,
    data: { handle: mapped.slug, canonicalUrl },
    before: { handle: source.handle, canonicalUrl: source.canonicalUrl },
  }];
});

const duplicateHandles = [...updates.reduce((counts, update) => {
  counts.set(update.data.handle, (counts.get(update.data.handle) ?? 0) + 1);
  return counts;
}, new Map())].filter(([, count]) => count > 1);
if (duplicateHandles.length) throw new Error(`Duplicate target handles: ${JSON.stringify(duplicateHandles)}`);

const backupPath = `/tmp/nicpouch-product-slug-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
await writeFile(backupPath, JSON.stringify({ generatedAt: new Date().toISOString(), updates }, null, 2));

const batches = [];
for (let index = 0; index < updates.length; index += 50) batches.push(updates.slice(index, index + 50));

const results = [];
for (const batch of batches) {
  const bulkResponse = await fetch(`${baseUrl}/products/bulk`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      dryRun: !apply,
      updates: batch.map(({ id, data }) => ({ id, data })),
    }),
  });
  const payload = await bulkResponse.json();
  if (!bulkResponse.ok) throw new Error(`Bulk request failed (${bulkResponse.status}): ${JSON.stringify(payload)}`);
  results.push(payload);
}

console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", sourceProducts: sourceProducts.length, updates: updates.length, batches: batches.length, backupPath, results }, null, 2));
