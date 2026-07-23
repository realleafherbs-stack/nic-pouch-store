import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { getBrands, listProducts } from "@/lib/catalog/local-repository";

export const metadata: Metadata = { title: "חנות פאוצ׳ים", description: "כל מותגי הפאוצ׳ים, הטעמים והעוצמות בחנות אחת." };

export default function ShopPage() {
  const items = listProducts();
  return (
    <>
      <div className="page-hero"><div className="container"><p className="eyebrow">58 מוצרים פעילים</p><h1>החנות</h1><p>סננו לפי מותג, עוצמה או חפשו טעם שאתם אוהבים.</p></div></div>
      <div className="container shop-layout">
        <form className="filters">
          <input name="q" placeholder="חיפוש מוצר או טעם" aria-label="חיפוש" />
          <select name="brand" aria-label="מותג"><option value="">כל המותגים</option>{getBrands().map((brand) => <option key={brand}>{brand}</option>)}</select>
          <select name="strength" aria-label="עוצמה"><option value="">כל העוצמות</option><option value="mild">עדין</option><option value="medium">בינוני</option><option value="strong">חזק</option><option value="extra-strong">חזק מאוד</option></select>
          <select name="sort" aria-label="מיון"><option value="">מומלצים</option><option value="price-asc">מחיר: נמוך לגבוה</option><option value="price-desc">מחיר: גבוה לנמוך</option></select>
          <button className="button">הצגת תוצאות</button>
        </form>
        <div><div className="results-bar"><span>{items.length} מוצרים</span><span>המחירים כוללים מע״מ</span></div><div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div></div>
      </div>
    </>
  );
}
