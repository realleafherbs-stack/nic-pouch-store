import type { MetadataRoute } from "next";
import { getAllProducts, getBrands } from "@/lib/catalog/local-repository";
import { articles } from "@/data/articles";
import { absoluteUrl } from "@/lib/seo";
import { flavorCategories, strengthCategories } from "@/lib/catalog/seo-categories";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, brands] = await Promise.all([getAllProducts(), getBrands()]);
  return [
    { url: absoluteUrl("/"), priority: 1, changeFrequency: "weekly" },
    { url: absoluteUrl("/shop"), priority: .9, changeFrequency: "daily" },
    { url: absoluteUrl("/blog"), priority: .7, changeFrequency: "weekly" },
    { url: absoluteUrl("/snus"), priority: .8, changeFrequency: "monthly" },
    { url: absoluteUrl("/shipping"), priority: .4, changeFrequency: "monthly" },
    { url: absoluteUrl("/accessibility"), priority: .3, changeFrequency: "yearly" },
    { url: absoluteUrl("/privacy"), priority: .2, changeFrequency: "yearly" },
    { url: absoluteUrl("/terms"), priority: .2, changeFrequency: "yearly" },
    ...["about", "contact", "returns", "faq", "age-policy", "authenticity", "nicotine-information"].map((path) => ({
      url: absoluteUrl(`/${path}`),
      priority: .4,
      changeFrequency: "yearly" as const,
    })),
    ...Object.keys(flavorCategories).map((slug) => ({
      url: absoluteUrl(`/flavors/${slug}`),
      priority: .7,
      changeFrequency: "weekly" as const,
    })),
    ...Object.keys(strengthCategories).map((slug) => ({
      url: absoluteUrl(`/strength/${slug}`),
      priority: .7,
      changeFrequency: "weekly" as const,
    })),
    ...brands.map((brand) => ({
      url: absoluteUrl(`/brands/${brand.toLowerCase()}`),
      priority: .7,
      changeFrequency: "weekly" as const,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/shop/${product.slug}`),
      priority: .8,
      changeFrequency: "weekly" as const,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/blog/${article.slug}`),
      priority: .6,
      changeFrequency: "monthly" as const,
      lastModified: new Date(article.modified),
    }))
  ];
}
