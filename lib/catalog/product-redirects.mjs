export function buildProductRedirects(products) {
  const claimed = new Set();
  const redirects = [];

  for (const product of products) {
    if (!product || typeof product.slug !== "string") continue;
    for (const legacySlug of Array.isArray(product.legacySlugs) ? product.legacySlugs : []) {
      if (typeof legacySlug !== "string" || !legacySlug || legacySlug === product.slug || claimed.has(legacySlug)) continue;
      claimed.add(legacySlug);
      redirects.push({
        source: `/shop/${legacySlug}`,
        destination: `/shop/${product.slug}`,
        statusCode: 301,
      });
    }
  }

  return redirects;
}

export function buildCanonicalUpdates(products, catalog, siteUrl = "https://nicpouch.co.il") {
  const catalogById = new Map(catalog.map((product) => [product.id, product]));
  return products.flatMap((product) => {
    if (!product || typeof product.id !== "string") return [];
    const catalogProduct = catalogById.get(product.id);
    if (!catalogProduct || typeof catalogProduct.slug !== "string" || !catalogProduct.slug) return [];
    const canonicalUrl = `${siteUrl.replace(/\/$/, "")}/shop/${catalogProduct.slug}`;
    return product.canonicalUrl === canonicalUrl ? [] : [{ id: product.id, canonicalUrl }];
  });
}
