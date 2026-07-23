import type { Metadata } from "next";
import { ShopCatalog } from "@/components/commerce/shop-catalog";
import { listProducts } from "@/lib/catalog/local-repository";

export const metadata: Metadata = { title: "חנות פאוצ׳ים", description: "כל מותגי הפאוצ׳ים, הטעמים והעוצמות בחנות אחת." };

export default function ShopPage() {
  const items = listProducts();
  const heroProducts = [
    items.find((product) => product.brand === "NOIS" && product.images[0]),
    items.find((product) => product.brand === "PABLO" && product.images[0]),
  ].filter(Boolean);
  return (
    <>
      <section className="shop-hero">
        <div className="container shop-hero-grid">
          <div className="shop-hero-copy"><p className="eyebrow">{items.length} מוצרים פעילים</p><h1>החנות</h1><p>כל המותגים, הטעמים והעוצמות במקום אחד. מצאו בדיוק את מה שמתאים לכם.</p><div><span>7 מותגים</span><span>4 רמות עוצמה</span><span>משלוח חינם מעל 199 ₪</span></div></div>
          <div className="shop-hero-products" aria-hidden="true">{heroProducts.map((product) => product?.images[0] && <img key={product.id} src={product.images[0]} alt="" />)}</div>
        </div>
      </section>
      <div className="container"><ShopCatalog products={items} /></div>
    </>
  );
}
