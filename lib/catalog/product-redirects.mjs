export function buildProductRedirects(products) {
  const claimed = new Set();
  const redirects = [];

  for (const product of products) {
    if (!product || typeof product.slug !== "string") continue;
    for (const legacySlug of Array.isArray(product.legacySlugs) ? product.legacySlugs : []) {
      if (typeof legacySlug !== "string" || !legacySlug || legacySlug === product.slug || claimed.has(legacySlug)) continue;
      claimed.add(legacySlug);
      redirects.push({
        // Vercel's bulk redirect service receives the percent-encoded path.
        source: encodeURI(`/shop/${legacySlug}`),
        destination: `/shop/${product.slug}`,
        // Vercel's bulk redirect format uses `permanent`, rather than the
        // `statusCode` field accepted by inline redirects.
        permanent: true,
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
