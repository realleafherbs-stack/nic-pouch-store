import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const catalogPath = path.resolve("data/catalog.generated.json");
const outputDir = path.resolve("public/products");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));

await mkdir(outputDir, { recursive: true });

for (const product of catalog) {
  const localImages = [];

  for (const [index, source] of product.images.entries()) {
    const filename = `${product.sku || product.id}-${index + 1}.webp`
      .replaceAll(/[^a-zA-Z0-9._-]/g, "-");
    const destination = path.join(outputDir, filename);
    const input = source.startsWith("/")
      ? await readFile(path.resolve("public", source.slice(1)))
      : Buffer.from(await (await fetch(source)).arrayBuffer());
    await sharp(input)
      .rotate()
      .flatten({ background: "#ffffff" })
      .trim({ background: "#ffffff", threshold: 8 })
      .resize(900, 900, {
        fit: "contain",
        background: "#ffffff",
      })
      .extend({
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
        background: "#ffffff",
      })
      .resize(1000, 1000, { fit: "contain", background: "#ffffff" })
      .webp({ quality: 88, effort: 5 })
      .toFile(destination);

    localImages.push(`/products/${filename}`);
  }

  product.images = localImages;
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Normalized ${catalog.reduce((sum, product) => sum + product.images.length, 0)} images.`);
