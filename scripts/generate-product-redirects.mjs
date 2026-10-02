import { readFile, writeFile } from "node:fs/promises";
import { buildProductRedirects } from "../lib/catalog/product-redirects.mjs";

const catalogUrl = new URL("../data/catalog.generated.json", import.meta.url);
const redirectsUrl = new URL("../redirects.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const redirects = buildProductRedirects(catalog);

// Keep the redirect map in the deployment so the Edge proxy can resolve exact
// historical paths without sending Unicode route patterns to Vercel redirects.
await writeFile(redirectsUrl, `${JSON.stringify(redirects, null, 2)}\n`);
console.log(`Generated ${redirects.length} permanent product redirects.`);
