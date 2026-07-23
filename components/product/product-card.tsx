"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/lib/catalog/model";
import { useCart } from "@/components/commerce/cart-provider";

const strengthLabels = { mild: "עדין", medium: "בינוני", strong: "חזק", "extra-strong": "חזק מאוד" };

export function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<1 | 5 | 10>(1);
  const { dispatch } = useCart();

  function addProduct() {
    if (product.stock <= 0) return;
    dispatch({ type: "add", product, quantity: selectedQuantity });
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
        <div className="card-quantity" aria-label={`בחירת כמות עבור ${product.name}`}>
          <span>כמות</span>
          <div>{([1, 5, 10] as const).map((quantity) => <button key={quantity} className={selectedQuantity === quantity ? "active" : ""} onClick={() => setSelectedQuantity(quantity)} aria-pressed={selectedQuantity === quantity}>{quantity}</button>)}</div>
        </div>
        <div className="price-row">
          <div className="card-price"><small>{selectedQuantity > 1 ? `${product.retailPrice.toFixed(2)} ₪ ליח׳` : "מחיר"}</small><strong><bdi>₪ {(product.retailPrice * selectedQuantity).toFixed(2)}</bdi></strong></div>
          <button disabled={product.stock <= 0} className={added ? "card-add added" : "card-add"} onClick={addProduct} aria-label={product.stock <= 0 ? `${product.name} אזל מהמלאי` : `הוספת ${selectedQuantity} יחידות של ${product.name} לעגלה`}>{product.stock <= 0 ? null : added ? <Check /> : <Plus />}<span>{product.stock <= 0 ? "אזל מהמלאי" : added ? "נוסף" : "הוספה לעגלה"}</span></button>
        </div>
      </div>
    </article>
  );
}
