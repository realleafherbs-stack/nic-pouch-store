import Link from "next/link";
import type { Product } from "@/lib/catalog/model";

const strengthLabels = { mild: "עדין", medium: "בינוני", strong: "חזק", "extra-strong": "חזק מאוד" };

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/shop/${product.slug}`} className="product-image">
        {product.nicotineMg && <span className="strength-pill">{product.nicotineMg} מ״ג</span>}
        {product.images[0] ? <img src={product.images[0]} alt={product.name} loading="lazy" /> : <span className="can-placeholder">{product.brand}</span>}
      </Link>
      <div className="product-copy">
        <p className="eyebrow">{product.brand}</p>
        <h3><Link href={`/shop/${product.slug}`}>{product.flavor || product.name}</Link></h3>
        <div className="product-meta">
          <span>{product.strengthLevel ? strengthLabels[product.strengthLevel] : "עוצמה לא צוינה"}</span>
          {product.packSize > 1 && <span>מארז {product.packSize}</span>}
        </div>
        <div className="price-row">
          <strong>{product.retailPrice.toFixed(2)} ₪</strong>
          <Link className="mini-button" href={`/shop/${product.slug}`}>לפרטים</Link>
        </div>
      </div>
    </article>
  );
}
