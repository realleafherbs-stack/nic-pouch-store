import type { Metadata } from "next";
import { ShopCatalog } from "@/components/commerce/shop-catalog";
import { listProducts } from "@/lib/catalog/local-repository";

export const metadata: Metadata = { title: "חנות פאוצ׳ים", description: "כל מותגי הפאוצ׳ים, הטעמים והעוצמות בחנות אחת." };

export default function ShopPage() {
  const items = listProducts();
  return (
    <>
      <div className="page-hero"><div className="container"><p className="eyebrow">58 מוצרים פעילים</p><h1>החנות</h1><p>סננו לפי מותג, עוצמה או חפשו טעם שאתם אוהבים.</p></div></div>
      <div className="container"><ShopCatalog products={items} /></div>
    </>
  );
}
