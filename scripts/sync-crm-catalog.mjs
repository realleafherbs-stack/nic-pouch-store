import { readFile, rename, writeFile } from "node:fs/promises";
import { mapCrmProducts, selectCatalogForSync } from "../lib/catalog/crm-adapter.mjs";

const catalogPath = new URL("../data/catalog.generated.json", import.meta.url);
const temporaryPath = new URL("../data/catalog.generated.next.json", import.meta.url);
const enabled = process.env.CRM_CATALOG_SYNC === "true";

if (!enabled) {
  console.log("CRM catalog sync is disabled; using the checked-in catalog.");
  process.exit(0);
}

const apiBaseUrl = process.env.CRM_API_BASE_URL?.replace(/\/$/, "");
const siteSlug = process.env.CRM_SITE_SLUG;
const apiKey = process.env.CRM_API_KEY;

if (!apiBaseUrl || !siteSlug || !apiKey) {
  throw new Error("CRM_CATALOG_SYNC requires CRM_API_BASE_URL, CRM_SITE_SLUG and CRM_API_KEY.");
}

const currentCatalog = JSON.parse(await readFile(catalogPath, "utf8"));
let crmRecords;

try {
  // The CRM's /products response is CDN-cached (s-maxage=60, stale-while-
  // revalidate=300) for storefront runtime reads, but a build-time sync must
  // see the current state, not a stale edge copy — bust it with a query param.
  const response = await fetch(`${apiBaseUrl}/${encodeURIComponent(siteSlug)}/products?t=${Date.now()}`, {
    headers: { "x-api-key": apiKey, accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    console.warn(`CRM catalog request returned HTTP ${response.status}; keeping the last known catalog.`);
    process.exit(0);
  }

  crmRecords = await response.json();
} catch (error) {
  const reason = error instanceof Error ? error.message : "unknown error";
  console.warn(`CRM catalog is unavailable (${reason}); keeping the last known catalog.`);
  process.exit(0);
}

const mappedProducts = mapCrmProducts(crmRecords);
const nextCatalog = selectCatalogForSync(currentCatalog, crmRecords);

if (!mappedProducts.length) {
  console.warn("CRM returned no usable active products; keeping the last known catalog.");
  process.exit(0);
}

await writeFile(temporaryPath, `${JSON.stringify(nextCatalog, null, 2)}\n`);
await rename(temporaryPath, catalogPath);
console.log(`CRM catalog sync complete: ${nextCatalog.length} products from site ${siteSlug}.`);
