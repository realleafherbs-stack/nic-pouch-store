const fallbackSiteUrl = "https://nicpouch.co.il";

function normalizeUrl(value: string) {
  const withProtocol = /^https?:\/\//.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

export const siteUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl,
);

export const siteName = "NIC POUCH";
export const organizationName = "NIC POUCH";
export const defaultDescription =
  "מבחר ענק של סנוס ושקיקי ניקוטין ללא טבק ממותגים מובילים, במגוון טעמים וחוזקים, עם בחירה פשוטה ומשלוח מהיר בישראל.";

export const defaultKeywords = [
  "סנוס",
  "שקיקי ניקוטין",
  "פאוצ׳ ניקוטין",
  "פאוצ׳ים ניקוטין",
  "סנוס ללא טבק",
  "סנוס בישראל",
];

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}

export const organizationSchema = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: organizationName,
  alternateName: siteName,
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/figma/nic-pouch-logo.jpg"),
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "המרכבה 25",
    addressLocality: "חולון",
    addressCountry: "IL",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+972-58-799-1094",
    contactType: "customer service",
    availableLanguage: ["he"],
  },
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  description: defaultDescription,
  inLanguage: "he-IL",
  publisher: { "@id": `${siteUrl}/#organization` },
};

export interface SiteSeo {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
}

export interface PageSeo {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  indexable: boolean | null;
  directAnswer: string | null;
  heading: string | null;
  summary: string | null;
  schemaType: string | null;
}

type ResolvedPageCopy = {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  summary: string;
  ogImage: string | null;
};

export function mergePageSeo(
  override: Partial<PageSeo>,
  fallback: { metaTitle: string; metaDescription: string; heading: string; summary: string; ogImage?: string | null },
): ResolvedPageCopy {
  return {
    metaTitle: override.metaTitle || fallback.metaTitle,
    metaDescription: override.metaDescription || fallback.metaDescription,
    heading: override.heading || fallback.heading,
    summary: override.summary || fallback.summary,
    ogImage: override.ogImage || fallback.ogImage || null,
  };
}

const CRM_URL = process.env.CRM_API_BASE_URL;
const CRM_API_KEY = process.env.CRM_API_KEY;
const CRM_SITE_SLUG = process.env.CRM_SITE_SLUG;

function isJson(res: Response) {
  return (res.headers.get("content-type") ?? "").includes("application/json");
}

// CRM-driven overrides, layered over the hardcoded defaults above — every
// caller falls back to the existing static value when the CRM has nothing
// set, so this is purely additive and never regresses SEO if unused.
export async function getSiteSeo(): Promise<Partial<SiteSeo>> {
  if (!CRM_URL || !CRM_API_KEY || !CRM_SITE_SLUG) return {};
  try {
    const res = await fetch(`${CRM_URL}/${CRM_SITE_SLUG}/seo`, {
      headers: { "x-api-key": CRM_API_KEY },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok || !isJson(res)) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export async function getPageSeo(page: string): Promise<Partial<PageSeo>> {
  if (!CRM_URL || !CRM_API_KEY || !CRM_SITE_SLUG) return {};
  try {
    const res = await fetch(`${CRM_URL}/${CRM_SITE_SLUG}/seo/pages/${encodeURIComponent(page)}`, {
      headers: { "x-api-key": CRM_API_KEY },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok || !isJson(res)) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
