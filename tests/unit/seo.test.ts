import { beforeAll, describe, expect, it } from "vitest";
import { articles } from "@/data/articles";
import { getAllProducts } from "@/lib/catalog/local-repository";
import type { Product } from "@/lib/catalog/model";
import {
  productFaq,
  productFlavorLabel,
  productSchema,
  productSeoDescription,
  productSeoTitle,
  productStrengthLabel,
} from "@/lib/catalog/product-seo";
import { mergePageSeo, siteUrl } from "@/lib/seo";
import sitemap from "@/app/sitemap";

describe("SEO foundations", () => {
  let products: Product[];

  // No CRM_* env vars in the test environment, so this resolves from the
  // checked-in fallback catalog (lib/catalog/local-repository.ts's
  // fetchLiveProducts) — same fixed dataset these tests always ran against.
  beforeAll(async () => {
    products = await getAllProducts();
  });

  it("uses the custom production domain", () => {
    expect(siteUrl).toBe("https://nicpouch.co.il");
  });

  it("uses page-level CRM copy while preserving factual fallbacks", () => {
    expect(mergePageSeo({
      metaTitle: "NOIS שקיקי ניקוטין",
      heading: "מוצרי NOIS",
      summary: "כל מוצרי NOIS הזמינים בחנות.",
    }, {
      metaTitle: "fallback title",
      metaDescription: "fallback description",
      heading: "fallback heading",
      summary: "fallback summary",
    })).toEqual({
      metaTitle: "NOIS שקיקי ניקוטין",
      metaDescription: "fallback description",
      heading: "מוצרי NOIS",
      summary: "כל מוצרי NOIS הזמינים בחנות.",
      ogImage: null,
    });
  });

  it("creates a unique Hebrew title and description inside the length window for every product", () => {
    const titles = products.map(productSeoTitle);
    const descriptions = products.map(productSeoDescription);

    expect(new Set(titles).size).toBe(products.length);
    expect(new Set(descriptions).size).toBe(products.length);

    products.forEach((product) => {
      const title = productSeoTitle(product);
      const description = productSeoDescription(product);
      const flavor = productFlavorLabel(product);

      expect(title.length).toBeGreaterThan(20);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(description.length).toBeGreaterThanOrEqual(120);
      expect(description.length).toBeLessThanOrEqual(155);
      expect(description).toContain(product.brand);
      expect(description).toContain(productStrengthLabel(product));
      expect(description).not.toMatch(/₪|גמילה|בריא|רפואי|מומלץ/);
      expect(title).not.toMatch(/גמילה|בריא|רפואי|מומלץ/);
      if (flavor) expect(description).toContain(flavor);
      expect(productFaq(product)).toHaveLength(4);

      const schema = productSchema(product);
      expect(schema.name).toBe(product.name);
      expect(schema.description).toBe(description);
      expect(schema).not.toHaveProperty("aggregateRating");
      expect(schema).not.toHaveProperty("review");
      expect(schema).not.toHaveProperty("gtin13");
      expect(schema).not.toHaveProperty("manufacturer");
      expect(schema.offers).toMatchObject({
        price: product.retailPrice.toFixed(2),
        priceCurrency: "ILS",
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      });
    });
  });

  it("builds metadata from catalog facts instead of stored CRM boilerplate", () => {
    const product = {
      ...products.find((item) => item.slug === "hqd-mint-6")!,
      metaTitle: "כותרת CRM ארוכה שלא אמורה להחליף את שם המוצר בתבנית",
      metaDescription: "קצר מדי",
    };

    expect(productSeoTitle(product)).toBe("HQD מנטה 6 מ״ג | שקיק ניקוטין ללא טבק");
    expect(productSeoDescription(product)).not.toBe("קצר מדי");
    expect(productSeoDescription(product)).toContain("בטעם מנטה");
    expect(productSeoDescription(product)).toContain("עוצמה עדינה");
  });

  it("does not turn a malformed flavor into a different taste", () => {
    const product = products.find((item) => item.slug === "nois-cool-strong-35");
    expect(product).toBeTruthy();
    expect(productFlavorLabel(product!)).toBeNull();
    expect(productSeoDescription(product!)).not.toContain("מנטה");
    expect(productSeoDescription(product!)).not.toContain("17.5");
    expect(productSeoDescription(product!)).not.toContain("27");
    expect(productSeoTitle(product!).length).toBeLessThanOrEqual(60);
  });

  it("keeps every article unique, useful and schema-ready", () => {
    expect(new Set(articles.map((article) => article.title)).size).toBe(articles.length);
    expect(new Set(articles.map((article) => article.excerpt)).size).toBe(articles.length);

    articles.forEach((article) => {
      expect(article.sections.length).toBeGreaterThanOrEqual(3);
      expect(article.faq.length).toBeGreaterThanOrEqual(3);
      expect(article.relatedLinks.length).toBeGreaterThanOrEqual(3);
      expect(article.primaryKeyword.length).toBeGreaterThan(3);
    });
  });

  it("keeps health-adjacent guides neutral and backed by authoritative sources", () => {
    const guideText = articles
      .flatMap((article) => article.sections.flatMap((section) => section.paragraphs))
      .join(" ");
    const sources = articles.flatMap((article) => article.sources);

    expect(guideText).not.toContain("התחילו בעוצמה נמוכה יותר");
    expect(sources.some((source) => source.includes("cdc.gov"))).toBe(true);
    expect(sources.some((source) => source.includes("fda.gov"))).toBe(true);
  });

  it("does not fabricate fresh last-modified dates for static and product URLs", async () => {
    const entries = await sitemap();
    const staticEntry = entries.find((entry) => entry.url === `${siteUrl}/terms`);
    const productEntry = entries.find((entry) => entry.url.includes("/shop/"));
    const articleEntry = entries.find((entry) => entry.url.includes("/blog/") && entry.url !== `${siteUrl}/blog`);

    expect(staticEntry?.lastModified).toBeUndefined();
    expect(productEntry?.lastModified).toBeUndefined();
    expect(articleEntry?.lastModified).toBeInstanceOf(Date);
  });
});
