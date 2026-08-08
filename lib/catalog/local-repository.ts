import catalog from "@/data/catalog.generated.json";
import type { CatalogQuery, Product } from "./model";

const importedProducts = catalog as Product[];

// Multipacks are purchase quantities, not separate storefront products.
export const products = importedProducts.filter((product) => product.packSize === 1);

export function listProducts(query: CatalogQuery = {}) {
  let result = [...products];
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

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}

export function getProductsByIds(ids: string[]) {
  const byId = new Map(products.map((product) => [product.id, product]));
  return ids.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product));
}

export function getBrands() {
  return [...new Set(products.map((product) => product.brand))];
}
