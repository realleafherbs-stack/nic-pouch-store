import { describe, expect, it } from "vitest";
import { buildProductSeoPatch, buildProductSeoUpdate } from "../../scripts/enrich-agent-seo.mjs";

describe("agent SEO enrichment", () => {
  it("builds factual, unique Hebrew SEO fields without duplicating product boilerplate", () => {
    const patch = buildProductSeoPatch({
      name: 'פאוצ\' ניקוטין HQD מנגו 15 מ"ג -1 יח',
      brand: "HQD",
      attributes: { flavor: "מנגו", nicotineMg: 15 },
    }, "https://nicpouch.co.il/shop/hqd-mango-15-example");

    expect(patch).toEqual(expect.objectContaining({
      metaTitle: "HQD מנגו 15 מ״ג | שקיק ניקוטין ללא טבק",
      focusKeyword: "HQD מנגו 15 מ״ג",
      canonicalUrl: "https://nicpouch.co.il/shop/hqd-mango-15-example",
      indexable: true,
      brand: "HQD",
      cardFeatures: ["15 מ״ג", "ללא טבק"],
    }));
    expect(patch.description).toContain("המוצר מכיל ניקוטין — חומר ממכר");
    expect(patch.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it("derives a missing brand from the product name and cleans malformed flavor text", () => {
    const patch = buildProductSeoPatch({
      name: 'פאוצ\' ניקוטין BIT קולד מינט 30 מ"ג -1 יח',
      brand: null,
      attributes: { flavor: "BIT קולד מינט  -", nicotineMg: 30 },
    }, "https://nicpouch.co.il/shop/bit-cold-mint-example");

    expect(patch.brand).toBe("BIT");
    expect(patch.metaTitle).toBe("BIT קולד מינט 30 מ״ג | שקיק ניקוטין ללא טבק");
    expect(patch.metaTitle).not.toContain("  ");
    expect(patch.metaTitle).not.toContain("-1 יח");
  });

  it("removes the common פאוץ׳ ניקוטין prefix when it uses a final tsadi", () => {
    const patch = buildProductSeoPatch({
      name: "פאוץ׳ ניקוטין HQD בריזה טרופית 15 מ״ג",
      brand: "HQD",
      attributes: { nicotineMg: 15 },
    }, "https://nicpouch.co.il/shop/hqd-tropical-breeze-example");

    expect(patch.metaTitle).toBe("HQD בריזה טרופית 15 מ״ג | שקיק ניקוטין ללא טבק");
    expect(patch.focusKeyword).toBe("HQD בריזה טרופית 15 מ״ג");
  });

  it("uses a stable Latin brand and removes the pouch count from a NOIS search title", () => {
    const patch = buildProductSeoPatch({
      name: 'נויס מנטה אקסטרים 50 מ"ג 27 יח\'',
      brand: "NOIS",
      attributes: { nicotineMg: 50 },
    }, "https://nicpouch.co.il/shop/nois-mint-extreme-example");

    expect(patch.metaTitle).toBe("NOIS מנטה אקסטרים 50 מ״ג | שקיק ניקוטין ללא טבק");
    expect(patch.focusKeyword).toBe("NOIS מנטה אקסטרים 50 מ״ג");
  });

  it("replaces stale search fields while preserving existing editorial copy", () => {
    const product = {
      description: "תיאור ערוך שאסור לדרוס",
      metaTitle: "נויס מנטה 25 מ״ג 22 יח׳ | NOIS",
      focusKeyword: "נויס מנטה 25 מ״ג 22 יח׳",
    };
    const proposed = {
      description: "תיאור אוטומטי",
      metaTitle: "NOIS מנטה 25 מ״ג | שקיק ניקוטין ללא טבק",
      focusKeyword: "NOIS מנטה 25 מ״ג",
      canonicalUrl: "https://nicpouch.co.il/shop/nois-mint-25-product",
    };

    product.canonicalUrl = "https://nicpouch.co.il/shop/nois-25-product";

    expect(buildProductSeoUpdate(product, proposed)).toEqual({
      metaTitle: "NOIS מנטה 25 מ״ג | שקיק ניקוטין ללא טבק",
      focusKeyword: "NOIS מנטה 25 מ״ג",
      canonicalUrl: "https://nicpouch.co.il/shop/nois-mint-25-product",
    });
  });
});
