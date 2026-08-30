import { describe, expect, it } from "vitest";
import { buildCanonicalUpdates, buildProductRedirects } from "@/lib/catalog/product-redirects.mjs";

describe("product redirects", () => {
  it("builds literal 301 redirects from every legacy product slug", () => {
    const redirects = buildProductRedirects([{
      slug: "nois-blueberry-extreme-50-mg",
      legacySlugs: ["50-zrcoow46", "older-nois-blueberry"],
    }]);

    expect(redirects).toEqual([
      {
        source: "/shop/50-zrcoow46",
        destination: "/shop/nois-blueberry-extreme-50-mg",
        statusCode: 301,
      },
      {
        source: "/shop/older-nois-blueberry",
        destination: "/shop/nois-blueberry-extreme-50-mg",
        statusCode: 301,
      },
    ]);
  });

  it("drops self redirects and duplicate legacy slugs", () => {
    const redirects = buildProductRedirects([
      { slug: "current", legacySlugs: ["current", "legacy"] },
      { slug: "another", legacySlugs: ["legacy"] },
    ]);

    expect(redirects).toEqual([{
      source: "/shop/legacy",
      destination: "/shop/current",
      statusCode: 301,
    }]);
  });

  it("percent-encodes non-ASCII legacy paths for Vercel's exact-match engine", () => {
    expect(buildProductRedirects([{
      slug: "nois-blueberry-25",
      legacySlugs: ["נויס-בלוברי-25-מג"],
    }])).toEqual([{
      source: "/shop/%D7%A0%D7%95%D7%99%D7%A1-%D7%91%D7%9C%D7%95%D7%91%D7%A8%D7%99-25-%D7%9E%D7%92",
      destination: "/shop/nois-blueberry-25",
      statusCode: 301,
    }]);
  });

  it("prepares canonical CRM updates only when the saved URL is stale", () => {
    expect(buildCanonicalUpdates([
      { id: "one", handle: "new-handle", canonicalUrl: "https://nicpouch.co.il/shop/old" },
      { id: "two", handle: "current", canonicalUrl: "https://nicpouch.co.il/shop/current" },
    ], [
      { id: "one", slug: "nois-new-handle-one" },
      { id: "two", slug: "current" },
    ])).toEqual([{
      id: "one",
      canonicalUrl: "https://nicpouch.co.il/shop/nois-new-handle-one",
    }]);
  });

  it("uses CRM handle history when the storefront catalog is mapped", async () => {
    const { mapCrmProducts } = await import("@/lib/catalog/crm-adapter.mjs");
    const [product] = mapCrmProducts([{
      id: "p1",
      handle: "hqd-דובדבן-15-מג",
      previousHandles: ["50-zrcoow46", "hqd-cherry-old"],
      name: "HQD דובדבן 15 מ״ג",
      price: 30,
      stockQuantity: 5,
      attributes: { packSize: 1 },
    }]);

    expect(product.legacySlugs).toEqual(["50-zrcoow46", "hqd-cherry-old"]);
  });
});
