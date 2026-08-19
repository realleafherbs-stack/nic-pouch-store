import type { Metadata } from "next";
import { ShopCatalog } from "@/components/commerce/shop-catalog";
import { listProducts } from "@/lib/catalog/local-repository";

export const metadata: Metadata = {
  title: "קניית סנוס ושקיקי ניקוטין אונליין",
  description: "קנו סנוס ושקיקי ניקוטין ללא טבק לפי מותג, טעם, עוצמה וכמות. מבחר NOIS, PABLO, KILLA, CUBA ו־HQD ומשלוח מהיר.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "סנוס ושקיקי ניקוטין – כל המוצרים",
    description: "בחרו שקיקי ניקוטין ללא טבק לפי מותג, טעם, עוצמה וכמות.",
    url: "/shop",
    images: [{ url: "/generated/shop-hero-fronts-only.png", alt: "מבחר פאוצ׳י ניקוטין בחנות NIC POUCH" }],
  },
};

export default async function ShopPage() {
  const items = await listProducts();
  return (
    <>
      <section className="shop-hero">
        <div className="container shop-hero-grid">
          <div className="shop-hero-copy"><p className="eyebrow">מצאו את הפאוץ׳ שמתאים לכם</p><h1>סנוס ושקיקי ניקוטין – כל המוצרים</h1><p>בחרו שקיקי ניקוטין ללא טבק לפי מותג, טעם, עוצמה וכמות. כל המוצרים מכילים ניקוטין ומיועדים למבוגרים בלבד.</p><div><span>לפי מותג</span><span>לפי טעם</span><span>לפי עוצמה</span></div></div>
        </div>
      </section>
      <div className="container"><ShopCatalog products={items} /></div>
    </>
  );
}
