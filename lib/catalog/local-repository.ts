import fallbackCatalog from "@/data/catalog.generated.json";
// @ts-expect-error — crm-adapter.mjs has a hand-written .d.ts alongside it (used by the build-time sync script too).
import { mapCrmProducts } from "./crm-adapter.mjs";
import type { CatalogQuery, Product } from "./model";

const apiBaseUrl = process.env.CRM_API_BASE_URL?.replace(/\/$/, "");
const siteSlug = process.env.CRM_SITE_SLUG;
const apiKey = process.env.CRM_API_KEY;

// Multipacks are purchase quantities, not separate storefront products.
const fallbackProducts = (fallbackCatalog as Product[]).filter((product) => product.packSize === 1);

// Live CRM-fetched catalog — mirrors polarizedx/xvape's product wiring
// (request-time fetch, ISR-cached) instead of this site's previous
// build-time-only sync to a checked-in JSON file. Falls back to that same
// checked-in snapshot if the CRM is unreachable or misconfigured, so the
// storefront never renders an empty catalog.
async function fetchLiveProducts(): Promise<Product[]> {
  if (!apiBaseUrl || !siteSlug || !apiKey) return fallbackProducts;
  try {
    const res = await fetch(`${apiBaseUrl}/${encodeURIComponent(siteSlug)}/products`, {
      headers: { "x-api-key": apiKey, accept: "application/json" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return fallbackProducts;
    const records = await res.json();
    const mapped = (mapCrmProducts(records) as Product[]).filter((product) => product.packSize === 1);
    return mapped.length ? mapped : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

/** All active storefront products (packSize === 1), live from the CRM. */
export async function getAllProducts(): Promise<Product[]> {
  return fetchLiveProducts();
}

export async function listProducts(query: CatalogQuery = {}) {
  let result = await fetchLiveProducts();
  const brands = typeof query.brand === "string" ? [query.brand] : query.brand;
  const strengths = typeof query.strength === "string" ? [query.strength] : query.strength;
  if (query.q) {
    const q = query.q.toLowerCase();
    result = result.filter((product) => `${product.name} ${product.brand} ${product.flavor}`.toLowerCase().includes(q));
  }
  if (brands?.length) result = result.filter((product) => brands.includes(product.brand));
  if (strengths?.length) result = result.filter((product) => product.strengthLevel && strengths.includes(product.strengthLevel));
  if (query.sort === "price-asc") result.sort((a, b) => a.retailPrice - b.retailPrice);
  if (query.sort === "price-desc") result.sort((a, b) => b.retailPrice - a.retailPrice);
  return result;
}

export async function getProduct(slug: string) {
  const products = await fetchLiveProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductsByIds(ids: string[]) {
  const products = await fetchLiveProducts();
  const byId = new Map(products.map((product) => [product.id, product]));
  return ids.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product));
}

export async function getBrands() {
  const products = await fetchLiveProducts();
  return [...new Set(products.map((product) => product.brand))];
}
