import { describe, expect, it } from "vitest";
import {
  buildBlogAuthorityPatch,
  buildPageSeoPlan,
  buildProductFaqRaw,
} from "../../scripts/apply-seo-authority.mjs";

describe("SEO authority plan", () => {
  it("assigns one distinct search intent to every strategic page", () => {
    const pages = buildPageSeoPlan("https://nicpouch.co.il");
    const keywords = pages.map((entry) => entry.patch.focusKeyword);

    expect(pages).toEqual(expect.arrayContaining([
      expect.objectContaining({ page: "shop", patch: expect.objectContaining({ focusKeyword: "שקיקי ניקוטין ללא טבק", schemaType: "CollectionPage" }) }),
      expect.objectContaining({ page: "snus", patch: expect.objectContaining({ focusKeyword: "מה זה סנוס", schemaType: "Article" }) }),
      expect.objectContaining({ page: "brands/nois", patch: expect.objectContaining({ focusKeyword: "NOIS שקיקי ניקוטין", schemaType: "CollectionPage" }) }),
    ]));
    expect(new Set(keywords).size).toBe(keywords.length);
    expect(pages.every(({ page, patch }) => patch.canonicalUrl === `https://nicpouch.co.il/${page}`)).toBe(true);
    expect(pages.every(({ patch }) => !patch.metaTitle.endsWith("| NIC POUCH"))).toBe(true);
  });

  it("completes draft authority metadata without making the post indexable", () => {
    const patch = buildBlogAuthorityPatch({
      id: "post-1",
      slug: "snus-price-guide",
      status: "DRAFT",
      canonicalUrl: null,
      contentType: null,
      reviewedBy: null,
      relatedBlogIds: [],
    }, ["post-2", "post-3"]);

    expect(patch).toEqual({
      canonicalUrl: "https://nicpouch.co.il/blog/snus-price-guide",
      contentType: "GUIDE",
      reviewedBy: "ממתין לאישור",
      relatedBlogIds: ["post-2", "post-3"],
      indexable: false,
    });
  });

  it("builds factual product FAQs from catalog fields without dosage advice", () => {
    const faq = buildProductFaqRaw({
      name: "HQD לימון מנטה 15 מ״ג",
      brand: "HQD",
      attributes: { nicotineMg: 15 },
    });

    expect(faq).toContain("כמה ניקוטין יש ב־HQD לימון מנטה 15 מ״ג?|לפי סימון המוצר");
    expect(faq).toContain("האם המוצר מכיל טבק?|לא. זהו שקיק ניקוטין ללא טבק");
    expect(faq).toContain("כיצד שומרים את המוצר?|יש לשמור באריזה המקורית");
    expect(faq).not.toContain("מומלץ");
  });
});
