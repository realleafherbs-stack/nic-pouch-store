import { beforeAll, describe, expect, it } from "vitest";
import { articles } from "@/data/articles";
import { getAllProducts } from "@/lib/catalog/local-repository";
import type { Product } from "@/lib/catalog/model";
import {
  productFaq,
  productSeoDescription,
  productSeoTitle,
} from "@/lib/catalog/product-seo";
import { siteUrl } from "@/lib/seo";
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

  it("creates useful and differentiated metadata for every product", () => {
    const titles = products.map(productSeoTitle);
    const descriptions = products.map(productSeoDescription);

    expect(new Set(titles).size).toBe(products.length);
    expect(new Set(descriptions).size).toBe(products.length);

    products.forEach((product) => {
      expect(productSeoTitle(product).length).toBeGreaterThan(20);
      expect(productSeoDescription(product).length).toBeGreaterThan(70);
      expect(productFaq(product)).toHaveLength(4);
    });
  });

  it("prefers approved CRM metadata when it exists", () => {
    const product = {
      ...products[0],
      metaTitle: "כותרת SEO מאושרת מה־CRM",
      metaDescription: "תיאור SEO מאושר מה־CRM שנכתב במיוחד עבור עמוד המוצר.",
    };

    expect(productSeoTitle(product)).toBe(product.metaTitle);
    expect(productSeoDescription(product)).toBe(product.metaDescription);
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
