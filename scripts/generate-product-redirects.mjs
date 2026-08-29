import { readFile, writeFile } from "node:fs/promises";
import { buildProductRedirects } from "../lib/catalog/product-redirects.mjs";

const catalogUrl = new URL("../data/catalog.generated.json", import.meta.url);
const vercelConfigUrl = new URL("../vercel.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const redirects = buildProductRedirects(catalog);

await writeFile(vercelConfigUrl, `${JSON.stringify({ redirects }, null, 2)}\n`);
console.log(`Generated ${redirects.length} permanent product redirects.`);
