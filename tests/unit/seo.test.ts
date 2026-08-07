import { describe, expect, it } from "vitest";
import { articles } from "@/data/articles";
import { products } from "@/lib/catalog/local-repository";
import {
  productFaq,
  productSeoDescription,
  productSeoTitle,
} from "@/lib/catalog/product-seo";
import { siteUrl } from "@/lib/seo";

describe("SEO foundations", () => {
  it("uses the custom production domain", () => {
    expect(siteUrl).toBe("https://nicpouch.co.il");
  });

  it("creates useful and differentiated metadata for every product", () => {
    const titles = products.map(productSeoTitle);
    const descriptions = products.map(productSeoDescription);

    expect(new Set(titles).size).toBe(products.length);
    expect(new Set(descriptions).size).toBe(products.length);

    products.forEach((product) => {
      expect(productSeoTitle(product)).toContain(product.name);
      expect(productSeoDescription(product)).toContain(product.brand);
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
});
