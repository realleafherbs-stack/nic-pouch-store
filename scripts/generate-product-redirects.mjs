import { readFile, writeFile } from "node:fs/promises";
import { buildProductRedirects } from "../lib/catalog/product-redirects.mjs";

const catalogUrl = new URL("../data/catalog.generated.json", import.meta.url);
const vercelConfigUrl = new URL("../vercel.json", import.meta.url);
const redirectsUrl = new URL("../redirects.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const redirects = buildProductRedirects(catalog);

// Vercel's bulk redirect engine treats UTF-8 paths as literal URLs. Inline
// `redirects` rules are parsed as route patterns and can return 500 for old
// Hebrew product slugs, so keep the exact migration map in the bulk file.
await writeFile(redirectsUrl, `${JSON.stringify(redirects, null, 2)}\n`);
await writeFile(vercelConfigUrl, `${JSON.stringify({ bulkRedirectsPath: "redirects.json" }, null, 2)}\n`);
console.log(`Generated ${redirects.length} permanent product redirects.`);
