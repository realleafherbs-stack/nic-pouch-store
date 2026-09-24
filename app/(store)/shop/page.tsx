import type { Metadata } from "next";
import Link from "next/link";
import { ShopCatalog } from "@/components/commerce/shop-catalog";
import { listProducts } from "@/lib/catalog/local-repository";
import { getPageSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("shop");
  const title = seo.metaTitle || "סנוס ושקיקי ניקוטין למכירה | מחיר ומלאי";
  const description = seo.metaDescription || "סנוס ושקיקי ניקוטין למכירה באתר: בחרו לפי מותג, טעם ועוצמה, ובדקו מחיר, כמות ומלאי לפני התשלום.";
  return {
    title,
    description,
    alternates: { canonical: "/shop" },
    openGraph: {
      title: seo.metaTitle || "סנוס ושקיקי ניקוטין למכירה",
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
          <div className="shop-hero-copy"><p className="eyebrow">סנוס ושקיקי ניקוטין למכירה</p><h1>סנוס ושקיקי ניקוטין – מוצרים זמינים</h1><p>בחרו שקיקי ניקוטין ללא טבק לפי מותג, טעם, עוצמה וכמות. בדקו מחיר ומלאי בסל לפני התשלום. כל המוצרים מכילים ניקוטין ומיועדים למבוגרים בלבד.</p><div><span>לפי מותג</span><span>לפי טעם</span><span>לפי עוצמה</span></div></div>
        </div>
      </section>
      <div className="container"><ShopCatalog products={items} /></div>
      <section className="container info-cta" aria-label="עזרה בבחירת מוצר">
        <div>
          <p>לא בטוחים מה לבדוק לפני הזמנה?</p>
          <span>קראו את המדריך לשקיקי ניקוטין ללא טבק, ואז חזרו לקטלוג עם שם הטעם והסימון המדויקים.</span>
        </div>
        <Link className="button" href="/snus">מה זה סנוס?</Link>
      </section>
    </>
  );
}
