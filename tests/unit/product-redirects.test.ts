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
});
