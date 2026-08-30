function productSlugFromUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value, "https://nicpouch.co.il");
    const match = url.pathname.match(/^\/shop\/([^/]+)\/?$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function productSlugsFromSitemap(sitemapXml) {
  return new Set(
    [...String(sitemapXml).matchAll(/<loc>([^<]+\/shop\/[^<]+)<\/loc>/g)]
      .map((match) => productSlugFromUrl(match[1]))
      .filter(Boolean),
  );
}

export function selectProductsInSitemap(products, sitemapXml) {
  const slugs = productSlugsFromSitemap(sitemapXml);
  return products.filter((product) => {
    if (product?.active === false) return false;
    const handle = typeof product?.handle === "string" ? product.handle.trim() : "";
    const canonicalSlug = productSlugFromUrl(product?.canonicalUrl);
    if ((handle && slugs.has(handle)) || (canonicalSlug && slugs.has(canonicalSlug))) return true;

    // Compatibility for a previously generated URL that ended in the final
    // eight characters of the CRM id. New URLs must not depend on this.
    const legacySuffix = typeof product?.id === "string" ? product.id.slice(-8) : "";
    return Boolean(legacySuffix && [...slugs].some((slug) => slug.endsWith(`-${legacySuffix}`)));
  });
}
