import { describe, expect, it } from "vitest";
import { buildCanonicalUpdates, buildProductRedirects } from "@/lib/catalog/product-redirects.mjs";

describe("product redirects", () => {
  it("builds literal permanent redirects from every legacy product slug", () => {
    const redirects = buildProductRedirects([{
      slug: "nois-blueberry-extreme-50-mg",
      legacySlugs: ["50-zrcoow46", "older-nois-blueberry"],
    }]);

    expect(redirects).toEqual([
      {
        source: "/shop/50-zrcoow46",
        destination: "/shop/nois-blueberry-extreme-50-mg",
        permanent: true,
      },
      {
        source: "/shop/older-nois-blueberry",
        destination: "/shop/nois-blueberry-extreme-50-mg",
        permanent: true,
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
      permanent: true,
    }]);
  });

  it("keeps non-ASCII legacy paths decoded for Vercel's exact-match engine", () => {
    expect(buildProductRedirects([{
      slug: "nois-blueberry-25",
      legacySlugs: ["נויס-בלוברי-25-מג"],
    }])).toEqual([{
      source: "/shop/נויס-בלוברי-25-מג",
      destination: "/shop/nois-blueberry-25",
      permanent: true,
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
