import type { Metadata } from "next";
import { ShopCatalog } from "@/components/commerce/shop-catalog";
import { listProducts } from "@/lib/catalog/local-repository";

export const metadata: Metadata = { title: "כל הפאוצ׳ים במקום אחד", description: "כל מותגי הפאוצ׳ים, הטעמים והעוצמות במקום אחד." };

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
