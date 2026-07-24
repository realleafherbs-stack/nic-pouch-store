import type { MetadataRoute } from "next";
import { getBrands, products } from "@/lib/catalog/local-repository";
import { articles } from "@/data/articles";
import { absoluteUrl } from "@/lib/seo";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), priority: 1, changeFrequency: "weekly", lastModified: now },
    { url: absoluteUrl("/shop"), priority: .9, changeFrequency: "daily", lastModified: now },
    { url: absoluteUrl("/blog"), priority: .7, changeFrequency: "weekly", lastModified: now },
    { url: absoluteUrl("/shipping"), priority: .4, changeFrequency: "monthly", lastModified: now },
    { url: absoluteUrl("/accessibility"), priority: .3, changeFrequency: "yearly", lastModified: now },
    { url: absoluteUrl("/privacy"), priority: .2, changeFrequency: "yearly", lastModified: now },
    { url: absoluteUrl("/terms"), priority: .2, changeFrequency: "yearly", lastModified: now },
    ...getBrands().map((brand) => ({
      url: absoluteUrl(`/brands/${brand.toLowerCase()}`),
      priority: .7,
      changeFrequency: "weekly" as const,
      lastModified: now,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/shop/${product.slug}`),
      priority: .8,
      changeFrequency: "weekly" as const,
      lastModified: now,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/blog/${article.slug}`),
      priority: .6,
      changeFrequency: "monthly" as const,
      lastModified: new Date(article.modified),
    }))
  ];
}
