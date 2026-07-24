import type { Metadata } from "next";
import { ShopCatalog } from "@/components/commerce/shop-catalog";
import { listProducts } from "@/lib/catalog/local-repository";

export const metadata: Metadata = {
  title: "פאוצ׳י ניקוטין – כל המותגים, הטעמים והעוצמות",
  description: "השוו פאוצ׳י ניקוטין לפי מותג, טעם ועוצמה. מבחר NOIS, PABLO, KILLA, CUBA ו־HQD עם מחירים ברורים ומשלוח מהיר.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "פאוצ׳י ניקוטין – כל המותגים במקום אחד",
    description: "בחרו פאוצ׳ ניקוטין לפי מותג, טעם או עוצמה.",
    url: "/shop",
    images: [{ url: "/generated/shop-hero-fronts-only.png", alt: "מבחר פאוצ׳י ניקוטין בחנות NIC POUCH" }],
  },
};

export default function ShopPage() {
  const items = listProducts();
  return (
    <>
      <section className="shop-hero">
        <div className="container shop-hero-grid">
          <div className="shop-hero-copy"><p className="eyebrow">כל המותגים. כל הטעמים. כל החוזקים.</p><h1>מצאו את הפאוצ׳ שמתאים לכם</h1><p>בחרו לפי מותג, טעם או עוצמה — במהירות ובדיוק.</p><div><span>לפי מותג</span><span>לפי טעם</span><span>לפי עוצמה</span></div></div>
        </div>
      </section>
      <div className="container"><ShopCatalog products={items} /></div>
    </>
  );
}
