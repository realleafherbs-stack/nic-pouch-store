import { describe, expect, it } from "vitest";
import {
  articles,
  guideBySlug,
  guideCategoryLabels,
  relatedGuidesFor,
} from "@/data/articles";

describe("NIC GUIDE content model", () => {
  it("keeps every guide addressable with stable editorial metadata", () => {
    expect(articles).toHaveLength(3);
    expect(articles.map((guide) => guide.slug)).toEqual([
      "nicotine-pouch-guide",
      "strength-guide",
      "how-to-use",
    ]);

    for (const guide of articles) {
      expect(guide.number).toMatch(/^\d{2}$/);
      expect(guide.readingTime).toBeGreaterThan(0);
      expect(guide.takeaways.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("uses only the four guide categories exposed by the index", () => {
    expect(guideCategoryLabels).toEqual({
      beginner: "מתחילים כאן",
      strength: "עוצמות",
      "flavors-brands": "טעמים ומותגים",
      "use-storage": "שימוש ואחסון",
    });
    expect(articles.map((guide) => guide.category)).toEqual([
      "beginner",
      "strength",
      "use-storage",
    ]);
  });

  it("resolves guide and related-guide links without inventing content", () => {
    const guide = guideBySlug("strength-guide");

    expect(guide?.title).toBe("מה אומר מספר המ״ג בסנוס ובשקיקי ניקוטין?");
    expect(guideBySlug("not-a-guide")).toBeNull();
    expect(relatedGuidesFor(guide!)).toEqual([
      expect.objectContaining({ slug: "nicotine-pouch-guide" }),
      expect.objectContaining({ slug: "how-to-use" }),
    ]);
  });

  it("allows a guide to use the visual system when no raster image is supplied", () => {
    const guideWithoutImage = articles.find((guide) => guide.slug === "strength-guide");

    expect(guideWithoutImage?.image).toBeUndefined();
  });
});
