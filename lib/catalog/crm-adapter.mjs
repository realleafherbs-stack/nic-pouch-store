const strengthLevels = new Set(["mild", "medium", "strong", "extra-strong"]);

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function finiteNumber(value) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function positiveNumber(value) {
  const parsed = finiteNumber(value);
  return parsed !== null && parsed > 0 ? parsed : null;
}

function deriveStrength(nicotineMg) {
  if (nicotineMg === null) return null;
  if (nicotineMg <= 8) return "mild";
  if (nicotineMg <= 16) return "medium";
  if (nicotineMg <= 30) return "strong";
  return "extra-strong";
}

function mapPriceTiers(value) {
  if (!Array.isArray(value)) return undefined;
  const tiers = value
    .map((tier) => {
      const item = asObject(tier);
      const minQuantity = positiveNumber(item.minQuantity);
      const unitPrice = positiveNumber(item.unitPrice);
      return minQuantity && unitPrice ? { minQuantity, unitPrice } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.minQuantity - b.minQuantity);
  return tiers.length ? tiers : undefined;
}

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.trim()).map((value) => value.trim()))];
}

// CRM handles aren't guaranteed to be URL-safe (e.g. Hebrew-only product names);
// non-ASCII slugs break Next.js static-export route matching, so fall back to the id.
function safeSlug(handle, id) {
  const ascii = typeof handle === "string"
    ? handle.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "")
    : "";
  return ascii || id;
}

export function mapCrmProducts(records) {
  if (!Array.isArray(records)) return [];

  return records.flatMap((record) => {
    const item = asObject(record);
    const attributes = asObject(item.attributes);
    const id = typeof item.id === "string" ? item.id.trim() : "";
    const slug = safeSlug(item.handle, id);
    const name = typeof item.name === "string" ? item.name.trim() : "";
    const retailPrice = positiveNumber(item.price);
    const packSize = positiveNumber(attributes.packSize) ?? 1;

    if (!id || !slug || !name || retailPrice === null || packSize !== 1) return [];

    const nicotineMg = positiveNumber(attributes.nicotineMg ?? attributes.nicotine ?? attributes.strengthMg);
    const requestedStrength = typeof attributes.strengthLevel === "string" ? attributes.strengthLevel : null;
    const strengthLevel = requestedStrength && strengthLevels.has(requestedStrength)
      ? requestedStrength
      : deriveStrength(nicotineMg);
    const category = asObject(item.category);
    const categoryName = typeof category.name === "string" ? category.name.trim() : "";
    const attributeCategories = Array.isArray(attributes.categories) ? attributes.categories : [];
    const images = uniqueStrings([
      item.image,
      ...(Array.isArray(item.images) ? item.images : []),
    ]);
    const brand = typeof item.brand === "string" && item.brand.trim()
      ? item.brand.trim().toUpperCase()
      : typeof attributes.brand === "string" && attributes.brand.trim()
        ? attributes.brand.trim().toUpperCase()
        : "NIC POUCH";
    const skuCandidates = [item.payperSku, item.gtin, attributes.sku, id];
    const sku = skuCandidates.find((value) => typeof value === "string" && value.trim())?.trim() ?? id;
    const stock = finiteNumber(item.stockQuantity);

    const optionalText = (value) => typeof value === "string" && value.trim() ? value.trim() : undefined;

    return [{
      id,
      slug,
      sku,
      name,
      brand,
      flavor: typeof attributes.flavor === "string" && attributes.flavor.trim() ? attributes.flavor.trim() : null,
      nicotineMg,
      strengthLevel,
      retailPrice,
      ...(mapPriceTiers(item.priceTiers) ? { priceTiers: mapPriceTiers(item.priceTiers) } : {}),
      sourcePrice: finiteNumber(attributes.sourcePrice) ?? 0,
      stock: stock === null ? 0 : Math.max(0, Math.trunc(stock)),
      active: true,
      packSize: 1,
      images,
      categories: uniqueStrings([categoryName, ...attributeCategories]),
      ...(optionalText(item.description) ? { description: optionalText(item.description) } : {}),
      ...(optionalText(item.metaTitle) ? { metaTitle: optionalText(item.metaTitle) } : {}),
      ...(optionalText(item.metaDescription) ? { metaDescription: optionalText(item.metaDescription) } : {}),
      ...(optionalText(item.ogImage) ? { ogImage: optionalText(item.ogImage) } : {}),
      ...(optionalText(item.focusKeyword) ? { focusKeyword: optionalText(item.focusKeyword) } : {}),
      ...(optionalText(item.canonicalUrl) ? { canonicalUrl: optionalText(item.canonicalUrl) } : {}),
      ...(typeof item.indexable === "boolean" ? { indexable: item.indexable } : {}),
      ...(optionalText(item.gtin) ? { gtin: optionalText(item.gtin) } : {}),
    }];
  });
}

export function selectCatalogForSync(currentCatalog, crmRecords) {
  const mapped = mapCrmProducts(crmRecords);
  if (!mapped.length) return currentCatalog;

  const currentBySku = new Map(currentCatalog.map((product) => [product.sku, product]));
  const currentBySlug = new Map(currentCatalog.map((product) => [product.slug, product]));

  return mapped.map((product) => {
    const previous = currentBySku.get(product.sku) ?? currentBySlug.get(product.slug);
    if (!previous) return product;
    return {
      ...product,
      images: product.images.length ? product.images : previous.images,
      sourcePrice: product.sourcePrice || previous.sourcePrice || 0,
    };
  });
}
