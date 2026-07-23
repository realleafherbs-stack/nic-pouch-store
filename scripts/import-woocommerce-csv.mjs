import fs from "node:fs";
import Papa from "papaparse";

const input = process.argv[2];
if (!input) throw new Error("Usage: pnpm import:catalog <csv-path>");

const text = fs.readFileSync(input, "utf8").replace(/^\uFEFF/, "");
const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
const previous = fs.existsSync("data/catalog.generated.json")
  ? JSON.parse(fs.readFileSync("data/catalog.generated.json", "utf8"))
  : [];
const previousBySku = new Map(previous.map((product) => [String(product.sku), product]));
const brands = ["HQD", "PABLO", "KILLA", "CUBA", "NOIS", "QWEET", "ZYN", "VELO"];
const slugify = (value) => value.normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").toLowerCase();
const products = data
  .filter((row) => row["פורסם"] === "1" && /פאוצ|טבק הרחה/i.test(row["קטגוריות"] || ""))
  .map((row) => {
    const name = row["שם"].trim();
    const haystack = `${name} ${row["קטגוריות"]}`.toUpperCase();
    const brand = brands.find((item) => haystack.includes(item)) || (/נויס/.test(name) ? "NOIS" : /שמעק/.test(name) ? "SHMEK" : "NIC POUCH");
    const mgMatch = name.match(/(\d+(?:\.\d+)?)\s*מ["״]?ג/);
    const nicotineMg = mgMatch ? Number(mgMatch[1]) : null;
    const packMatch = name.match(/מארז\s*(\d+)/);
    const packSize = packMatch ? Number(packMatch[1]) : 1;
    const unit = brand === "HQD" ? 29.9 : nicotineMg >= 43 ? 39.9 : 34.9;
    const flavor = name.replace(/פאוצ['׳]?\s*ניקוטין/gi, "").replace(new RegExp(brand, "gi"), "").replace(/נויס/gi, "").replace(/\d+(?:\.\d+)?\s*מ["״]?ג/g, "").replace(/-?\s*מארז\s*\d+\s*יח['׳]?/g, "").replace(/\d+\s*יח['׳]?/g, "").trim() || null;
    const sku = row['מק"ט'] || row["מזהה"];
    const existing = previousBySku.get(String(sku));
    return {
      id: row["מזהה"], slug: `${slugify(brand)}-${slugify(flavor || name)}-${row["מזהה"]}`,
      sku, name, brand, flavor, nicotineMg,
      strengthLevel: nicotineMg === null ? null : nicotineMg <= 8 ? "mild" : nicotineMg <= 16 ? "medium" : nicotineMg <= 30 ? "strong" : "extra-strong",
      retailPrice: existing?.retailPrice ?? Number((unit * (packSize === 1 ? 1 : packSize * .9)).toFixed(1)),
      sourcePrice: Number(row["מחיר רגיל"] || row["מחיר מבצע"] || 0),
      stock: Number(row["מלאי"] || (row["במלאי?"] === "1" ? 50 : 0)), active: true, packSize,
      images: existing?.images?.length
        ? existing.images
        : (row["תמונות"] || "").split(",").map((item) => item.trim()).filter(Boolean),
      categories: (row["קטגוריות"] || "").split(",").map((item) => item.trim()).filter(Boolean)
    };
  });
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/catalog.generated.json", `${JSON.stringify(products, null, 2)}\n`);
console.log(`Imported ${products.length} active products`);
