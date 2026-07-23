import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AgeGate } from "@/components/layout/age-gate";
import { CartProvider } from "@/components/commerce/cart-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nicpouch.co.il"),
  title: { default: "NIC POUCH | כל מותגי הפאוצ׳ים במקום אחד", template: "%s | NIC POUCH" },
  description: "חנות פאוצ׳ים ישראלית עם מותגים מובילים, מידע ברור ומשלוח מהיר.",
  openGraph: { type: "website", locale: "he_IL", siteName: "NIC POUCH" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>
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
