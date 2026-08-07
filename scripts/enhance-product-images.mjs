import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const catalogPath = path.resolve("data/catalog.generated.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
let enhanced = 0;

for (const product of catalog) {
  const nextImages = [];

  for (const source of product.images) {
    const sourcePath = path.resolve("public", source.replace(/^\//, ""));
    const extension = path.extname(sourcePath);
    const destinationPath = sourcePath.slice(0, -extension.length) + "-commerce.webp";

    const trimmed = await sharp(sourcePath)
      .rotate()
      .flatten({ background: "#faf9f6" })
      .trim({ background: "#faf9f6", threshold: 12 })
      .resize(1080, 1080, {
        fit: "contain",
        background: "#faf9f6",
        withoutEnlargement: false,
      })
      .sharpen({ sigma: 0.65, m1: 0.65, m2: 1.5 })
      .extend({
        top: 60,
        bottom: 60,
        left: 60,
        right: 60,
        background: "#faf9f6",
      })
      .resize(1200, 1200, { fit: "contain", background: "#faf9f6" })
      .webp({ quality: 92, effort: 6 })
      .toBuffer();

    await sharp(trimmed).toFile(destinationPath);
    nextImages.push(`/products/${path.basename(destinationPath)}`);
    enhanced += 1;
  }

  product.images = nextImages;
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Enhanced ${enhanced} catalog images for ${catalog.length} products.`);
