import { buildCanonicalUpdates } from "../lib/catalog/product-redirects.mjs";
import { readFile } from "node:fs/promises";

const apiBase = (process.env.AGENT_API_BASE_URL ?? "https://www.ducks.co.il/api/nic-pouch/agent").replace(/\/$/, "");
const apiKey = process.env.AGENT_API_KEY;
const apply = process.argv.includes("--apply");

if (!apiKey) throw new Error("AGENT_API_KEY is required.");

const headers = { "x-api-key": apiKey, accept: "application/json" };
const listResponse = await fetch(`${apiBase}/products`, { headers, signal: AbortSignal.timeout(30_000) });
if (!listResponse.ok) throw new Error(`Product list failed with HTTP ${listResponse.status}.`);
const payload = await listResponse.json();
const products = Array.isArray(payload) ? payload : payload.products ?? payload.data ?? [];
const catalog = JSON.parse(await readFile(new URL("../data/catalog.generated.json", import.meta.url), "utf8"));
const updates = buildCanonicalUpdates(products, catalog);

console.log(`${updates.length} of ${products.length} product canonicals need updating.`);
if (!apply) process.exit(0);

for (const update of updates) {
  const response = await fetch(`${apiBase}/products/${encodeURIComponent(update.id)}`, {
    method: "PATCH",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({ canonicalUrl: update.canonicalUrl }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Canonical update failed for ${update.id} with HTTP ${response.status}.`);
}

console.log(`Updated ${updates.length} product canonicals.`);
