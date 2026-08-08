"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/catalog/model";
import { linePrice, PURCHASE_QUANTITIES, type PurchaseQuantity, unitPriceForQuantity } from "@/lib/catalog/pricing";
import { useCart } from "@/components/commerce/cart-provider";

const strengthLabels = { mild: "עדין", medium: "בינוני", strong: "חזק", "extra-strong": "חזק מאוד" };

export function ProductCard({ product }: { product: Product }) {
  const [selectedQuantity, setSelectedQuantity] = useState<PurchaseQuantity>(1);
  const { state, dispatch } = useCart();
  const cartQuantity = state.lines.find((line) => line.product.id === product.id)?.quantity ?? 0;
  const displayedQuantity = cartQuantity || selectedQuantity;

  function addProduct() {
    if (product.stock <= 0) return;
    dispatch({ type: "add", product, quantity: selectedQuantity });
  }

  return (
    <article className="product-card" data-testid="product-card">
      <Link href={`/shop/${product.slug}`} className="product-image">
        {product.badge && <span className="product-badge">{product.badge}</span>}
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
        {cartQuantity === 0 && <div className="card-quantity" aria-label={`בחירת כמות עבור ${product.name}`}>
          <span>כמות</span>
          <div>{PURCHASE_QUANTITIES.map((quantity) => <button key={quantity} className={selectedQuantity === quantity ? "active" : ""} onClick={() => setSelectedQuantity(quantity)} aria-pressed={selectedQuantity === quantity}>{quantity}</button>)}</div>
        </div>}
        <div className="price-row">
          <div className="card-price"><small>{unitPriceForQuantity(product, displayedQuantity).toFixed(2)} ₪ ליח׳</small><strong><bdi>₪ {linePrice(product, displayedQuantity).toFixed(2)}</bdi></strong></div>
          {cartQuantity > 0 ? (
            <div className="card-cart-controls" aria-label={`עדכון כמות של ${product.name}`}>
              <button onClick={() => dispatch({ type: "setQuantity", productId: product.id, quantity: cartQuantity - 1 })} aria-label={`הפחתת יחידה של ${product.name}`}><Minus /></button>
              <span><strong>{cartQuantity} בעגלה</strong><small>{unitPriceForQuantity(product, cartQuantity).toFixed(2)} ₪ ליח׳</small></span>
              <button onClick={() => dispatch({ type: "add", product, quantity: 1 })} aria-label={`הוספת יחידה נוספת של ${product.name}`}><Plus /></button>
            </div>
          ) : (
            <button disabled={product.stock <= 0} className="card-add" onClick={addProduct} aria-label={product.stock <= 0 ? `${product.name} אזל מהמלאי` : `הוספת ${selectedQuantity} יחידות של ${product.name} לעגלה`}>{product.stock > 0 && <Plus />}<span>{product.stock <= 0 ? "אזל מהמלאי" : "הוספה לעגלה"}</span></button>
          )}
        </div>
      </div>
    </article>
  );
}
