import { pathToFileURL } from "node:url";

const defaultApiBase = "https://www.ducks.co.il/api/nic-pouch/agent";
const defaultSiteUrl = "https://nicpouch.co.il";
const editableFields = [
  "brand",
  "description",
  "features",
  "cardFeatures",
  "metaTitle",
  "metaDescription",
  "usageInstructions",
  "focusKeyword",
  "canonicalUrl",
  "indexable",
];

function compact(value) {
  return value.replace(/\s+/g, " ").replace(/\s+-\s*$/, "").trim();
}

function typography(value) {
  return value.replace(/מ["׳']ג/g, "מ״ג").replace(/["׳'](?=\s|$)/g, "׳");
}

function inferBrand(product) {
  if (typeof product.brand === "string" && product.brand.trim()) return product.brand.trim().toUpperCase();
  const name = String(product.name ?? "").toUpperCase();
  return ["NOIS", "PABLO", "KILLA", "CUBA", "HQD", "BIT"].find((brand) => name.includes(brand)) ?? "NIC POUCH";
}

function nicotineMg(product) {
  const fromAttributes = Number(product.attributes?.nicotineMg);
  if (Number.isFinite(fromAttributes) && fromAttributes > 0) return fromAttributes;
  const match = String(product.name ?? "").match(/(\d+(?:\.\d+)?)\s*מ[\"״׳']?ג/);
  return match ? Number(match[1]) : null;
}

function productLabel(product, brand) {
  const cleaned = typography(String(product.name ?? ""))
    .replace(/^פא[ו]?[צץ][׳']?\s*ניקוטין\s*/i, "")
    .replace(/\s*-?\s*1\s*יח(?:ידה)?[׳']?\s*$/i, "")
    .replace(/\s+\d+\s*יח[׳']?\s*$/i, "");
  const normalized = compact(cleaned);
  return normalized || brand;
}

function trimAtWord(value, maxLength) {
  if (value.length <= maxLength) return value;
  const cut = value.slice(0, maxLength + 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), maxLength - 12)).trim()}…`;
}

export function buildProductSeoPatch(product, canonicalUrl) {
  const brand = inferBrand(product);
  const mg = nicotineMg(product);
  const label = productLabel(product, brand);
  const focusKeyword = label;
  const mgText = mg ? `${mg} מ״ג` : "עוצמה לפי סימון האריזה";
  const metaTitle = trimAtWord(`${label} | שקיק ניקוטין ללא טבק`, 60);
  const description = `${label} מבית ${brand} הוא שקיק ניקוטין ללא טבק למבוגרים בלבד. ${mgText} לפי סימון האריזה. המחיר והזמינות מוצגים בעמוד המוצר. המוצר מכיל ניקוטין — חומר ממכר.`;
  const metaDescription = trimAtWord(
    `${label}, שקיק ניקוטין ללא טבק למבוגרים בלבד. ${mgText}, מחיר וזמינות באתר NIC POUCH. המוצר מכיל ניקוטין — חומר ממכר.`,
    160,
  );

  return {
    brand,
    description,
    features: ["ללא טבק", `${mgText} לפי סימון האריזה`, "למבוגרים בלבד"],
    cardFeatures: [mg ? `${mg} מ״ג` : "לפי האריזה", "ללא טבק"],
    metaTitle,
    metaDescription,
    usageInstructions: "יש לפעול לפי הוראות היצרן שעל האריזה. אין לבלוע; יש להרחיק מילדים ומבעלי חיים. המוצר מיועד למבוגרים בלבד ומכיל ניקוטין — חומר ממכר.",
    focusKeyword,
    canonicalUrl,
    indexable: true,
  };
}

function missingPatch(product, proposed) {
  return Object.fromEntries(editableFields.flatMap((field) => {
    const current = product[field];
    const missing = current === null || current === undefined || current === "" || (Array.isArray(current) && current.length === 0);
    const redundantProductPrefix = (field === "metaTitle" || field === "focusKeyword")
      && typeof current === "string"
      && /^פא[ו]?[צץ][׳']?\s*ניקוטין\s*/i.test(current);
    return missing || redundantProductPrefix ? [[field, proposed[field]]] : [];
  }));
}

async function fetchJson(url, apiKey) {
  const response = await fetch(url, { headers: apiKey ? { "x-api-key": apiKey } : undefined });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}

async function run() {
  const apply = process.argv.includes("--apply");
  const apiKey = process.env.AGENT_API_KEY;
  const apiBase = (process.env.AGENT_API_BASE ?? defaultApiBase).replace(/\/$/, "");
  const siteUrl = (process.env.SITE_URL ?? defaultSiteUrl).replace(/\/$/, "");
  if (!apiKey) throw new Error("AGENT_API_KEY is required");

  const [products, sitemapXml] = await Promise.all([
    fetchJson(`${apiBase}/products`, apiKey),
    fetch(`${siteUrl}/sitemap.xml`).then((response) => {
      if (!response.ok) throw new Error(`sitemap returned HTTP ${response.status}`);
      return response.text();
    }),
  ]);
  const productUrls = [...sitemapXml.matchAll(/<loc>([^<]+\/shop\/[^<]+)<\/loc>/g)].map((match) => match[1]);
  const jobs = productUrls.flatMap((url) => {
    const suffix = decodeURIComponent(url.split("/").pop()).split("-").pop();
    const product = products.find((item) => item.id.endsWith(suffix));
    if (!product) return [];
    const patch = missingPatch(product, buildProductSeoPatch(product, url));
    return Object.keys(patch).length ? [{ product, patch }] : [];
  });

  console.log(JSON.stringify({ activeProducts: productUrls.length, productsToUpdate: jobs.length, apply }, null, 2));
  if (!apply) return;

  for (let index = 0; index < jobs.length; index += 5) {
    const batch = jobs.slice(index, index + 5);
    await Promise.all(batch.map(async ({ product, patch }) => {
      const response = await fetch(`${apiBase}/products/${product.id}`, {
        method: "PATCH",
        headers: { "x-api-key": apiKey, "content-type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!response.ok) throw new Error(`${product.id} returned HTTP ${response.status}`);
    }));
    console.log(`Updated ${Math.min(index + batch.length, jobs.length)}/${jobs.length}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
