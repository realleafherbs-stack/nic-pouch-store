import type { Product, StrengthLevel } from "@/lib/catalog/model";

type CsvRow = Record<string, string>;

const brands = ["HQD", "PABLO", "KILLA", "CUBA", "NOIS", "QWEET", "ZYN", "VELO"];

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function inferBrand(name: string, categories: string) {
  const haystack = `${name} ${categories}`.toUpperCase();
  const brand = brands.find((candidate) => haystack.includes(candidate));
  if (brand) return brand;
  if (/נויס/.test(name)) return "NOIS";
  if (/שמעק/.test(name)) return "SHMEK";
  return "NIC POUCH";
}

function inferStrength(mg: number | null): StrengthLevel | null {
  if (mg === null) return null;
  if (mg <= 8) return "mild";
  if (mg <= 16) return "medium";
  if (mg <= 30) return "strong";
  return "extra-strong";
}

function retailPrice(brand: string, mg: number | null, packSize: number) {
  const unit = brand === "HQD" ? 29.9 : mg && mg >= 43 ? 39.9 : 34.9;
  if (packSize === 1) return unit;
  return Number((unit * packSize * 0.9).toFixed(1));
}

export function importCatalogRows(rows: CsvRow[]): Product[] {
  return rows
    .filter((row) => row["פורסם"] === "1")
    .filter((row) => /פאוצ|טבק הרחה/i.test(row["קטגוריות"] ?? ""))
    .filter((row) => !/מארז\s*\d+\s*יח?/i.test(row["שם"] ?? ""))
    .map((row) => {
      const name = row["שם"].trim();
      const categories = row["קטגוריות"] ?? "";
      const brand = inferBrand(name, categories);
      const nicotineMatch = name.match(/(\d+(?:\.\d+)?)\s*מ["״]?ג/);
      const nicotineMg = nicotineMatch ? Number(nicotineMatch[1]) : null;
      const packMatch = name.match(/מארז\s*(\d+)/);
      const packSize = packMatch ? Number(packMatch[1]) : 1;
      const flavor = name
        .replace(/פאוצ['׳]?\s*ניקוטין/gi, "")
        .replace(new RegExp(brand, "gi"), "")
        .replace(/נויס/gi, "")
        .replace(/\d+(?:\.\d+)?\s*מ["״]?ג/g, "")
        .replace(/-?\s*מארז\s*\d+\s*יח['׳]?/g, "")
        .replace(/\d+\s*יח['׳]?/g, "")
        .trim() || null;
      const sourcePrice = Number(row["מחיר רגיל"] || row["מחיר מבצע"] || 0);
      return {
        id: row["מזהה"],
        slug: `${slugify(brand)}-${slugify(flavor || name)}-${row["מזהה"]}`,
        sku: row['מק"ט'] || row["מזהה"],
        name,
        brand,
        flavor,
        nicotineMg,
        strengthLevel: inferStrength(nicotineMg),
        retailPrice: retailPrice(brand, nicotineMg, packSize),
        sourcePrice,
        stock: Number(row["מלאי"] || (row["במלאי?"] === "1" ? 50 : 0)),
        active: true,
        packSize,
        images: (row["תמונות"] || "").split(",").map((item) => item.trim()).filter(Boolean),
        categories: categories.split(",").map((item) => item.trim()).filter(Boolean)
      } satisfies Product;
    });
}
