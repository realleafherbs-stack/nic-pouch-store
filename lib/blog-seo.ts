import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogSitemapPost {
  slug: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
}

export function blogFaqSchema(faq: BlogFaqItem[] | null | undefined) {
  const items = (faq ?? []).filter(
    (item) => item.question.trim().length > 0 && item.answer.trim().length > 0,
  );
  if (items.length === 0) return null;

  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function blogSitemapEntries(posts: BlogSitemapPost[]): MetadataRoute.Sitemap {
  return posts.map((post) => {
    const lastModified = post.updatedAt ?? post.publishedAt;
    return {
      url: absoluteUrl(`/blog/${post.slug}`),
      priority: 0.6,
      changeFrequency: "monthly" as const,
      ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
    };
  });
}
