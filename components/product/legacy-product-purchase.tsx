"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/commerce/cart-provider";
import type { Product } from "@/lib/catalog/model";
import { linePrice, PURCHASE_QUANTITIES, unitPriceForQuantity } from "@/lib/catalog/pricing";

export function LegacyProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { dispatch } = useCart();

  function addToCart() {
    if (product.stock <= 0) return;
    dispatch({ type: "add", product, quantity });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="pd-purchase-box">
      <div className="pd-pack-choice">
        <span>בחרו כמות</span>
        <div>
          {PURCHASE_QUANTITIES.map((amount) => (
            <button
              type="button"
              key={amount}
              className={quantity === amount ? "active" : ""}
              onClick={() => setQuantity(amount)}
              aria-pressed={quantity === amount}
            >
              <strong>{amount}</strong>
              <small>{unitPriceForQuantity(product, amount).toFixed(2)} ₪ ליח׳</small>
            </button>
          ))}
        </div>
      </div>
      <div className="pd-purchase-row">
        <label>כמות</label>
        <div className="pd-quantity" aria-label="בחירת כמות">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="הקטנת כמות"><Minus /></button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="הגדלת כמות"><Plus /></button>
        </div>
      </div>
      <p className="pd-purchase-total">
        <span>סה״כ · {unitPriceForQuantity(product, quantity).toFixed(2)} ₪ ליח׳</span>
        <strong>{linePrice(product, quantity).toFixed(2)} ₪</strong>
      </p>
      <button type="button" disabled={product.stock <= 0} className="pd-add" onClick={addToCart}>
        <ShoppingBag /> {product.stock <= 0 ? "אזל מהמלאי" : added ? "נוסף לעגלה" : `הוסף לעגלה · ${quantity}`}
      </button>
      <Link className="pd-buy" href="/checkout">קנה עכשיו</Link>
    </div>
  );
}
