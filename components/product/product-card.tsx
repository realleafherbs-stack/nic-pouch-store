"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/lib/catalog/model";
import { useCart } from "@/components/commerce/cart-provider";

const strengthLabels = { mild: "עדין", medium: "בינוני", strong: "חזק", "extra-strong": "חזק מאוד" };

export function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { dispatch } = useCart();

  function addProduct() {
    dispatch({ type: "add", product, quantity: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="product-card" data-testid="product-card">
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
          <button className={added ? "card-add added" : "card-add"} onClick={addProduct} aria-label={`הוספת ${product.name} לעגלה`}>{added ? <Check /> : <Plus />}<span>{added ? "נוסף" : "הוספה"}</span></button>
        </div>
      </div>
    </article>
  );
}
