import { describe, expect, it } from "vitest";
import {
  blogFaqSchema,
  blogSitemapEntries,
} from "@/lib/blog-seo";

describe("CRM blog SEO", () => {
  it("adds every published CRM post to the sitemap with its real update date", () => {
    const entries = blogSitemapEntries([
      {
        slug: "safe-storage",
        publishedAt: "2026-08-30T10:00:00.000Z",
        updatedAt: "2026-08-31T12:00:00.000Z",
      },
    ]);

    expect(entries).toEqual([
      {
        url: "https://nicpouch.co.il/blog/safe-storage",
        priority: 0.6,
        changeFrequency: "monthly",
        lastModified: new Date("2026-08-31T12:00:00.000Z"),
      },
    ]);
  });

  it("creates FAQPage schema from CRM questions and answers", () => {
    expect(blogFaqSchema([
      { question: "איך שומרים?", answer: "באריזה המקורית והסגורה." },
    ])).toEqual({
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "איך שומרים?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "באריזה המקורית והסגורה.",
          },
        },
      ],
    });
  });

  it("does not emit an empty FAQ schema", () => {
    expect(blogFaqSchema([])).toBeNull();
  });
});
