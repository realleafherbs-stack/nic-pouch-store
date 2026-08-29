import type { Metadata } from "next";
import { ShopCatalog } from "@/components/commerce/shop-catalog";
import { listProducts } from "@/lib/catalog/local-repository";
import { getPageSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("shop");
  const title = seo.metaTitle || "קניית סנוס ושקיקי ניקוטין אונליין";
  const description = seo.metaDescription || "קנו סנוס ושקיקי ניקוטין ללא טבק לפי מותג, טעם, עוצמה וכמות. מבחר NOIS, PABLO, KILLA, CUBA ו־HQD ומשלוח מהיר.";
  return {
    title,
    description,
    alternates: { canonical: "/shop" },
    openGraph: {
      title: seo.metaTitle || "סנוס ושקיקי ניקוטין – כל המוצרים",
      description: seo.metaDescription || "בחרו שקיקי ניקוטין ללא טבק לפי מותג, טעם, עוצמה וכמות.",
      url: "/shop",
      images: [{ url: seo.ogImage || "/generated/shop-hero-fronts-only.png", alt: "מבחר פאוצ׳י ניקוטין בחנות NIC POUCH" }],
    },
  };
}

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
