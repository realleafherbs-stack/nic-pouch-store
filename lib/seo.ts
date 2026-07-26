const fallbackSiteUrl = "https://nicpouch.co.il";

function normalizeUrl(value: string) {
  const withProtocol = /^https?:\/\//.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

export const siteUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl,
);

export const siteName = "NIC POUCH";
export const organizationName = "B2B MARKT LTD";
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
