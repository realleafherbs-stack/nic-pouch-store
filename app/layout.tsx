import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AgeGate } from "@/components/layout/age-gate";
import { CartProvider } from "@/components/commerce/cart-provider";
import { JsonLd } from "@/components/seo/json-ld";
import {
  absoluteUrl,
  defaultDescription,
  organizationSchema,
  siteName,
  siteUrl,
  websiteSchema,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NIC POUCH | פאוצ׳י ניקוטין ממותגים מובילים",
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  alternates: { canonical: "/" },
  keywords: [
    "פאוצ׳ ניקוטין",
    "פאוצ׳ים",
    "שקיקי ניקוטין",
    "NOIS",
    "PABLO",
    "KILLA",
    "CUBA",
    "HQD",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: "B2B MARKT LTD",
  formatDetection: { address: false, email: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: siteUrl,
    siteName,
    title: "NIC POUCH | פאוצ׳י ניקוטין ממותגים מובילים",
    description: defaultDescription,
    images: [
      {
        url: absoluteUrl("/generated/home-hero-nois-killa-desktop.webp"),
        width: 1536,
        height: 1024,
        alt: "מבחר פאוצ׳י ניקוטין ממותגים מובילים",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NIC POUCH | פאוצ׳י ניקוטין ממותגים מובילים",
    description: defaultDescription,
    images: [absoluteUrl("/generated/home-hero-nois-killa-desktop.webp")],
  },
  icons: { icon: "/figma/nic-pouch-logo.jpg", apple: "/figma/nic-pouch-logo.jpg" },
};

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
        </CartProvider>
      </body>
    </html>
  );
}
