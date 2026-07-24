import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/seo";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/cart", "/*?search=", "/*?brand=", "/*?strength=", "/*?sort="],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
