import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AgeGate } from "@/components/layout/age-gate";
import { CartProvider } from "@/components/commerce/cart-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteUtilities } from "@/components/layout/site-utilities";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import {
  absoluteUrl,
  defaultDescription,
  defaultKeywords,
  getSiteSeo,
  organizationSchema,
  siteName,
  siteUrl,
  websiteSchema,
} from "@/lib/seo";
import "./globals.css";

const defaultTitle = "סנוס ושקיקי ניקוטין ללא טבק | NIC POUCH";
const defaultOgImage = absoluteUrl("/generated/home-hero-nois-killa-desktop.webp");

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteSeo();
  const title = seo.metaTitle || defaultTitle;
  const description = seo.metaDescription || defaultDescription;
  const ogImage = seo.ogImage || defaultOgImage;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${siteName}` },
    description,
    applicationName: siteName,
    alternates: { canonical: "/" },
    keywords: [
      ...defaultKeywords,
      "NOIS",
      "PABLO",
      "KILLA",
      "CUBA",
      "HQD",
    ],
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    formatDetection: { address: false, email: false, telephone: false },
    openGraph: {
      type: "website",
      locale: "he_IL",
      url: siteUrl,
      siteName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1536,
          height: 1024,
          alt: "מבחר סנוס ושקיקי ניקוטין ללא טבק ממותגים מובילים",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: { icon: "/figma/nic-pouch-logo.jpg", apple: "/figma/nic-pouch-logo.jpg" },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <CartProvider>
          <a className="skip-link" href="#main">דלגו לתוכן</a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <AgeGate />
          <SiteUtilities />
          <GoogleAnalytics />
        </CartProvider>
      </body>
    </html>
  );
}
