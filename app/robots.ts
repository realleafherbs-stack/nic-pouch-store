import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/checkout", "/cart"] }], sitemap: "https://nicpouch.co.il/sitemap.xml" };
}
