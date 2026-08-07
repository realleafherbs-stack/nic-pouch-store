import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/catalog/model";

export function GuideProductRail({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="guide-product-rail" aria-labelledby="guide-products-title">
      <div className="guide-product-heading">
        <div>
          <p className="guide-kicker">מהמדריך לקטלוג</p>
          <h2 id="guide-products-title">מוצרים להמשך השוואה</h2>
        </div>
        <Link href="/shop">לכל המוצרים</Link>
      </div>
      <div className="guide-product-grid">
        {products.slice(0, 4).map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
