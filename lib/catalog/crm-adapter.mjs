const strengthLevels = new Set(["mild", "medium", "strong", "extra-strong"]);

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function finiteNumber(value) {
  // Number(null) is 0, not NaN — without this guard, a selected-but-unset
  // DB field (null) silently becomes a real 0 instead of "no data", which
  // broke the stock fallback below the moment `stockQuantity` was added to
  // the CRM API's select (previously undefined -> NaN -> correctly null).
  if (value === null || value === undefined) return null;
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

// The CRM's /products response has no structured attributes (no brand/flavor/
// nicotineMg columns exist there at all) — Payper-sourced product names carry
// this info as Hebrew free text, so derive it the same way the WooCommerce
// import scripts already do (scripts/catalog-import.ts, import-woocommerce-csv.mjs).
const KNOWN_BRANDS = ["HQD", "PABLO", "KILLA", "CUBA", "NOIS", "QWEET", "ZYN", "VELO"];

function inferBrandFromName(name) {
  const haystack = name.toUpperCase();
  const known = KNOWN_BRANDS.find((candidate) => haystack.includes(candidate));
  if (known) return known;
  if (/נויס/.test(name)) return "NOIS";
  if (/שמעק/.test(name)) return "SHMEK";
  return null;
}

function inferNicotineMgFromName(name) {
  const match = name.match(/(\d+(?:\.\d+)?)\s*מ["״]?ג/);
  return match ? Number(match[1]) : null;
}

export function normalizeProductDisplayName(name, brand) {
  const normalizedBrand = String(brand ?? "").trim().toUpperCase();
  let value = String(name ?? "")
    .replace(/^פא[ו]?[צץ][׳']?\s*ניקוטין\s*/i, "")
    .replace(/\s*-?\s*\d+\s*יח(?:ידה|ידות)?[׳']?\s*$/i, "")
    .replace(/(\d+(?:\.\d+)?)\s*מ["״]([גל])/g, "$1 מ״$2")
    .replace(/\s+/g, " ")
    .trim();
  if (normalizedBrand === "NOIS") value = value.replace(/^נויס(?=\s|$)/i, "NOIS");
  if (normalizedBrand && !value.toUpperCase().includes(normalizedBrand)) value = `${normalizedBrand} ${value}`.trim();
  return value;
}

// Mirrors B2BCRM/components/products-client.tsx's own encodings exactly —
// these are admin-authored free-text fields, not structured JSON, so the
// parsing has to match how that form serializes them or the content silently
// won't show up here.
function parseFeatures(values) {
  if (!Array.isArray(values)) return undefined;
  const features = values
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => {
      const [title = "", subtitle = ""] = value.split("::");
      return { title: title.trim(), subtitle: subtitle.trim() || undefined };
    })
    .filter((feature) => feature.title);
  return features.length ? features : undefined;
}

function parseStringList(values) {
  if (!Array.isArray(values)) return undefined;
  const list = values.filter((value) => typeof value === "string" && value.trim()).map((value) => value.trim());
  return list.length ? list : undefined;
}

function parseLineList(raw) {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const items = raw.split("\n").map((line) => line.trim()).filter(Boolean);
  return items.length ? items : undefined;
}

function parseSpecsRaw(raw) {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const specs = raw
    .split("\n")
    .map((line) => {
      const [label = "", value = ""] = line.split("|");
      return { label: label.trim(), value: value.trim() };
    })
    .filter((spec) => spec.label && spec.value);
  return specs.length ? specs : undefined;
}

function parseFaqRaw(raw) {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const faq = raw
    .split("\n")
    .map((line) => {
      const [question = "", answer = ""] = line.split("|");
      return { question: question.trim(), answer: answer.trim() };
    })
    .filter((item) => item.question && item.answer);
  return faq.length ? faq : undefined;
}

function inferFlavorFromName(name, brand) {
  const flavor = name
    .replace(/פאוצ['׳]?\s*ניקוטין/gi, "")
    .replace(new RegExp(brand, "gi"), "")
    .replace(/נויס/gi, "")
    .replace(/\d+(?:\.\d+)?\s*מ["״]?ג/g, "")
    .replace(/-?\s*מארז\s*\d+\s*יח['׳]?/g, "")
    .replace(/\d+\s*יח['׳]?/g, "")
    .trim();
  return flavor || null;
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
function safeSlug(handle, id, brand) {
  const normalized = typeof handle === "string"
    ? handle.trim().toLowerCase()
      .replace(/נויס/g, "nois")
      .replace(/פבלו/g, "pablo")
      .replace(/קילה/g, "killa")
      .replace(/קובה/g, "cuba")
    : "";
  const ascii = normalized
    ? normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    : "";
  // ASCII-stripping a Hebrew handle discards everything that isn't the brand
  // name or a bare number — for products that share a brand and nicotine mg,
  // that leaves an identical string (e.g. every "HQD ... 6 מ״ג" flavor
  // collapses to "hqd---6"). Always suffixing the id guarantees uniqueness
  // instead of only doing so when the ascii result happens to be empty.
  const brandSlug = typeof brand === "string" ? brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : "";
  const branded = brandSlug && !ascii.includes(brandSlug) ? `${brandSlug}-${ascii}`.replace(/-+$/g, "") : ascii;
  if (!branded) return id;
  return `${branded}-${id.slice(-8)}`;
}

function productSlugFromCanonical(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value, "https://nicpouch.co.il");
    const match = url.pathname.match(/^\/shop\/([^/]+)\/?$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function mapCrmProducts(records) {
  if (!Array.isArray(records)) return [];

  return records.flatMap((record) => {
    const item = asObject(record);
    const attributes = asObject(item.attributes);
    const id = typeof item.id === "string" ? item.id.trim() : "";
    const sourceName = typeof item.name === "string" ? item.name.trim() : "";
    const retailPrice = positiveNumber(item.price);
    const packSize = positiveNumber(attributes.packSize) ?? 1;
    const brand = typeof item.brand === "string" && item.brand.trim()
      ? item.brand.trim().toUpperCase()
      : typeof attributes.brand === "string" && attributes.brand.trim()
        ? attributes.brand.trim().toUpperCase()
        : inferBrandFromName(sourceName) ?? "NIC POUCH";
    const name = normalizeProductDisplayName(sourceName, brand);
    const slug = safeSlug(item.handle, id, brand);

    if (!id || !slug || !name || retailPrice === null || packSize !== 1) return [];
    const nicotineMg = positiveNumber(attributes.nicotineMg ?? attributes.nicotine ?? attributes.strengthMg)
      ?? inferNicotineMgFromName(sourceName);
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
    const skuCandidates = [item.payperSku, item.gtin, attributes.sku, id];
    const sku = skuCandidates.find((value) => typeof value === "string" && value.trim())?.trim() ?? id;
    const stock = finiteNumber(item.stockQuantity);
    const canonicalSlug = productSlugFromCanonical(item.canonicalUrl);
    const legacySlugs = canonicalSlug && canonicalSlug !== slug ? [canonicalSlug] : [];

    const optionalText = (value) => typeof value === "string" && value.trim() ? value.trim() : undefined;

    return [{
      id,
      slug,
      ...(legacySlugs.length ? { legacySlugs } : {}),
      sku,
      name,
      brand,
      flavor: typeof attributes.flavor === "string" && attributes.flavor.trim()
        ? attributes.flavor.trim()
        : inferFlavorFromName(sourceName, brand),
      nicotineMg,
      strengthLevel,
      retailPrice,
      ...(mapPriceTiers(item.priceTiers) ? { priceTiers: mapPriceTiers(item.priceTiers) } : {}),
      sourcePrice: finiteNumber(attributes.sourcePrice) ?? 0,
      // stockQuantity is populated for products Payper actively tracks (or
      // that an admin/agent sets directly) — but plenty of products still
      // have no value at all, so treat a genuinely missing count as
      // available rather than showing them as out of stock.
      stock: stock === null ? 999 : Math.max(0, Math.trunc(stock)),
      active: true,
      packSize: 1,
      images,
      ...(optionalText(item.imageAlt) ? { imageAlt: optionalText(item.imageAlt) } : {}),
      categories: uniqueStrings([categoryName, ...attributeCategories]),
      ...(optionalText(item.description) ? { description: optionalText(item.description) } : {}),
      ...(optionalText(item.metaTitle) ? { metaTitle: optionalText(item.metaTitle) } : {}),
      ...(optionalText(item.metaDescription) ? { metaDescription: optionalText(item.metaDescription) } : {}),
      ...(optionalText(item.ogImage) ? { ogImage: optionalText(item.ogImage) } : {}),
      ...(optionalText(item.focusKeyword) ? { focusKeyword: optionalText(item.focusKeyword) } : {}),
      canonicalUrl: `/shop/${slug}`,
      ...(typeof item.indexable === "boolean" ? { indexable: item.indexable } : {}),
      ...(optionalText(item.gtin) ? { gtin: optionalText(item.gtin) } : {}),
      ...(Array.isArray(item.relatedProductIds) && item.relatedProductIds.length
        ? { relatedProductIds: item.relatedProductIds.filter((value) => typeof value === "string" && value.trim()) }
        : {}),
      ...(optionalText(item.badge) ? { badge: optionalText(item.badge) } : {}),
      ...(parseStringList(item.cardFeatures) ? { cardFeatures: parseStringList(item.cardFeatures) } : {}),
      ...(parseFeatures(item.features) ? { features: parseFeatures(item.features) } : {}),
      ...(parseSpecsRaw(item.specsRaw) ? { specs: parseSpecsRaw(item.specsRaw) } : {}),
      ...(parseLineList(item.inTheBox) ? { inTheBox: parseLineList(item.inTheBox) } : {}),
      ...(parseLineList(item.usageInstructions) ? { usageInstructions: parseLineList(item.usageInstructions) } : {}),
      ...(parseLineList(item.warrantyInfo) ? { warrantyInfo: parseLineList(item.warrantyInfo) } : {}),
      ...(parseFaqRaw(item.faqRaw) ? { faq: parseFaqRaw(item.faqRaw) } : {}),
      ...(optionalText(item.videoUrl) ? { videoUrl: optionalText(item.videoUrl) } : {}),
      ...(optionalText(item.soldCount) ? { soldCount: optionalText(item.soldCount) } : {}),
      ...(positiveNumber(item.rating) ? { rating: positiveNumber(item.rating) } : {}),
      ...(positiveNumber(item.reviewCount) ? { reviewCount: Math.trunc(positiveNumber(item.reviewCount)) } : {}),
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
      ...(() => {
        const legacySlugs = uniqueStrings([
          ...(Array.isArray(previous.legacySlugs) ? previous.legacySlugs : []),
          ...(Array.isArray(product.legacySlugs) ? product.legacySlugs : []),
          ...(previous.slug !== product.slug ? [previous.slug] : []),
        ]).filter((slug) => slug !== product.slug);
        return legacySlugs.length ? { legacySlugs } : {};
      })(),
      images: product.images.length ? product.images : previous.images,
      sourcePrice: product.sourcePrice || previous.sourcePrice || 0,
    };
  });
}
