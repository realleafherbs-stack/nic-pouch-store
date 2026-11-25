import type { Product, StrengthLevel } from "./model";
import { linePrice, PURCHASE_QUANTITIES, unitPriceForQuantity } from "./pricing";
import { absoluteUrl, organizationName } from "@/lib/seo";

const strengthLabels: Record<StrengthLevel, string> = {
  mild: "עדינה",
  medium: "בינונית",
  strong: "חזקה",
  "extra-strong": "חזקה מאוד",
};

const TITLE_MAX = 60;
const DESCRIPTION_MIN = 120;
const DESCRIPTION_MAX = 155;

export function productStrengthLabel(product: Product) {
  return product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי סימון היצרן";
}

/**
 * Flavor text stored on some products repeats the product type, the brand, or a
 * trailing dash. Strip only that noise. A value that is not a flavor (for
 * example a מ״ל typo) is omitted rather than rewritten into a different taste.
 */
export function productFlavorLabel(product: Product) {
  const raw = product.flavor?.replace(/\s+/g, " ").trim();
  if (!raw) return null;

  let flavor = raw.replace(/^פאוץ['׳]?\s*ניקוטין\s+/i, "");
  flavor = flavor.replace(/\s*-\s*$/, "").trim();
  const brand = product.brand?.trim();
  if (brand && flavor.toLowerCase().startsWith(`${brand.toLowerCase()} `)) {
    flavor = flavor.slice(brand.length).trim();
  }
  flavor = flavor.replace(/\s+/g, " ").trim();

  if (!flavor || /מ["״׳']ל/.test(flavor) || !/[א-ת]/.test(flavor)) return null;
  return flavor;
}

export function productSeoTitle(product: Product) {
  const candidates = [
    `${product.name} | שקיק ניקוטין ללא טבק`,
    `${product.name} | שקיק ניקוטין`,
    product.name,
  ];
  return candidates.find((title) => title.length <= TITLE_MAX) ?? product.name.slice(0, TITLE_MAX);
}

export function productSeoDescription(product: Product) {
  const flavor = productFlavorLabel(product);
  const strength = productStrengthLabel(product);
  const taste = flavor ? ` בטעם ${flavor}` : "";
  const nicotine = product.nicotineMg ? `${product.nicotineMg} מ״ג` : null;
  const facts = nicotine ? `${nicotine} בעוצמה ${strength}` : `עוצמה ${strength}`;
  const warning = "למבוגרים בלבד. ניקוטין הוא חומר ממכר.";
  const withBrand = `${product.name} מבית ${product.brand}, שקיק ניקוטין ללא טבק${taste}, ${facts}.`;
  const standard = `${withBrand} ${warning}`;
  const labeled = `${withBrand} הנתונים לפי סימון האריזה. ${warning}`;
  const compact = `${product.name}, שקיק ניקוטין ללא טבק${taste}, ${facts}. ${warning}`;

  if (standard.length >= DESCRIPTION_MIN && standard.length <= DESCRIPTION_MAX) return standard;
  if (standard.length < DESCRIPTION_MIN && labeled.length <= DESCRIPTION_MAX) return labeled;
  if (compact.length >= DESCRIPTION_MIN && compact.length <= DESCRIPTION_MAX) return compact;
  if (labeled.length >= DESCRIPTION_MIN && labeled.length <= DESCRIPTION_MAX) return labeled;
  return (standard.length <= DESCRIPTION_MAX ? standard : compact).slice(0, DESCRIPTION_MAX).trim();
}

export function productSeoKeywords(product: Product) {
  const flavor = productFlavorLabel(product);
  return [
    product.name,
    product.brand,
    flavor ?? "",
    product.nicotineMg ? `${product.nicotineMg} מ״ג` : "",
    `עוצמה ${productStrengthLabel(product)}`,
    `שקיק ניקוטין ${product.brand}`,
    "שקיקי ניקוטין ללא טבק",
  ].filter(Boolean);
}

export function productSocialImages(product: Product) {
  if (product.images.length) return product.images;
  return product.ogImage ? [product.ogImage] : [];
}

export function productSchema(product: Product) {
  const url = absoluteUrl(`/shop/${product.slug}`);
  const images = productSocialImages(product).map((image) => absoluteUrl(image));
  const flavor = productFlavorLabel(product);
  const gtin = product.gtin?.replace(/\D/g, "") ?? "";
  const price = Number.isFinite(product.retailPrice) && product.retailPrice > 0
    ? product.retailPrice.toFixed(2)
    : null;

  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: productSeoDescription(product),
    ...(images.length ? { image: images } : {}),
    sku: product.sku,
    ...(gtin.length === 13 ? { gtin13: gtin } : {}),
    ...(gtin.length === 12 ? { gtin12: gtin } : {}),
    ...(gtin.length === 14 ? { gtin14: gtin } : {}),
    ...(gtin.length === 8 ? { gtin8: gtin } : {}),
    category: "שקיקי ניקוטין ללא טבק",
    brand: { "@type": "Brand", name: product.brand },
    additionalProperty: [
      ...(flavor ? [{ "@type": "PropertyValue", name: "טעם", value: flavor }] : []),
      ...(product.nicotineMg ? [{ "@type": "PropertyValue", name: "ניקוטין", value: `${product.nicotineMg} מ״ג` }] : []),
      { "@type": "PropertyValue", name: "עוצמה", value: productStrengthLabel(product) },
    ],
    ...(price ? {
      offers: {
        "@type": "Offer",
        url,
        price,
        priceCurrency: "ILS",
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: organizationName },
      },
    } : {}),
  };
}

export function productFaq(product: Product) {
  const strength = productStrengthLabel(product);
  const priceAnswer = PURCHASE_QUANTITIES.map((quantity) => {
    const unitPrice = unitPriceForQuantity(product, quantity);
    const total = linePrice(product, quantity);
    return `${quantity} יח׳: ${unitPrice.toFixed(2)} ₪ ליחידה, ${total.toFixed(2)} ₪ בסך הכול`;
  }).join("; ");

  return [
    {
      question: product.nicotineMg
        ? `מה משמעות ${product.nicotineMg} מ״ג במוצר?`
        : "מה משמעות רמת העוצמה במוצר?",
      answer: `${product.nicotineMg ? `${product.nicotineMg} מ״ג הם נתון הניקוטין לפי סימון המוצר. ` : ""}בסולם האתר רמת המוצר היא ${strength}.`,
    },
    {
      question: "כמה עולה יחידה בקנייה של 1, 5 או 10?",
      answer: `${priceAnswer}.`,
    },
    {
      question: "תוך כמה זמן המשלוח מגיע?",
      answer: "אספקה רגילה עד 3 ימי עסקים, בכפוף ליישוב ולחברת המשלוחים. משלוח חינם בקנייה מעל 199 ₪.",
    },
    {
      question: "כיצד שומרים את המוצר?",
      answer: "יש לשמור במקום קריר ויבש והרחק מהישג ידם של ילדים ובעלי חיים.",
    },
  ];
}
