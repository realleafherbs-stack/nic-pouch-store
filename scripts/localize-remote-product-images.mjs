import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const catalogPath = path.resolve("data/catalog.generated.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
let localized = 0;

for (const product of catalog) {
  const images = [];

  for (const [index, source] of product.images.entries()) {
    if (source.startsWith("/")) {
      images.push(source);
      continue;
    }

    const response = await fetch(source);
    if (!response.ok) throw new Error(`Failed ${response.status}: ${source}`);
    const input = Buffer.from(await response.arrayBuffer());
    const filename = `${product.sku}-${index + 1}-commerce.webp`.replaceAll(/[^a-zA-Z0-9._-]/g, "-");
    const destination = path.resolve("public/products", filename);

    await sharp(input)
      .rotate()
      .flatten({ background: "#faf9f6" })
      .trim({ background: "#faf9f6", threshold: 12 })
      .resize(1080, 1080, { fit: "contain", background: "#faf9f6" })
      .sharpen({ sigma: 0.65, m1: 0.65, m2: 1.5 })
      .extend({ top: 60, bottom: 60, left: 60, right: 60, background: "#faf9f6" })
      .resize(1200, 1200, { fit: "contain", background: "#faf9f6" })
      .webp({ quality: 92, effort: 6 })
      .toFile(destination);

    images.push(`/products/${filename}`);
    localized += 1;
  }

  product.images = images;
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Localized ${localized} remote product images.`);
