import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog/local-repository";
import { articles } from "@/data/articles";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nicpouch.co.il";
  return [
    { url: base, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/shop`, priority: .9, changeFrequency: "daily" },
    { url: `${base}/blog`, priority: .7, changeFrequency: "weekly" },
    ...products.map((product) => ({ url: `${base}/shop/${product.slug}`, priority: .8, changeFrequency: "weekly" as const })),
    ...articles.map((article) => ({ url: `${base}/blog/${article.slug}`, priority: .6, changeFrequency: "monthly" as const }))
  ];
}
