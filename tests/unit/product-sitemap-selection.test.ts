import { describe, expect, it } from "vitest";
import { selectProductsInSitemap } from "../../scripts/product-sitemap-selection.mjs";

const sitemap = (...slugs: string[]) => `<urlset>${slugs.map((slug) => `<url><loc>https://nicpouch.co.il/shop/${slug}</loc></url>`).join("")}</urlset>`;

describe("product sitemap selection", () => {
  it("selects products by clean handle after random suffixes are removed", () => {
    const products = [
      { id: "cmsjejygc000r04jtkkume4oq", handle: "hqd-cherry-15", canonicalUrl: "https://nicpouch.co.il/shop/hqd-cherry-15", active: true },
      { id: "inactive", handle: "old-pack", active: false },
    ];
    expect(selectProductsInSitemap(products, sitemap("hqd-cherry-15"))).toEqual([products[0]]);
  });

  it("keeps backwards compatibility with the former id suffix", () => {
    const product = { id: "cmsjejygc000r04jtkkume4oq", handle: "legacy-handle", active: true };
    expect(selectProductsInSitemap([product], sitemap("hqd-cherry-15-kkume4oq"))).toEqual([product]);
  });
});
