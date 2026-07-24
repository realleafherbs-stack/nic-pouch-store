"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/catalog/model";
import { linePrice, PURCHASE_QUANTITIES, unitPriceForQuantity } from "@/lib/catalog/pricing";
import { useCart } from "@/components/commerce/cart-provider";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [addedQuantity, setAddedQuantity] = useState<number | null>(null);
  const { dispatch } = useCart();
  const inStock = product.stock > 0;
  const unitPrice = unitPriceForQuantity(product, quantity);

  function selectQuantity(value: number) {
    setQuantity(value);
    setAddedQuantity(null);
  }

  function addToCart() {
    if (!inStock) return;
    dispatch({ type: "add", product, quantity });
    setAddedQuantity(quantity);
  }

  return (
    <div className="pd-purchase-box">
      <fieldset className="pd-pack-choice">
        <legend>בחרו כמות</legend>
        <div>
          {PURCHASE_QUANTITIES.map((amount) => {
            const tierUnitPrice = unitPriceForQuantity(product, amount);
            return (
              <button
                type="button"
                key={amount}
                className={quantity === amount ? "active" : ""}
                onClick={() => selectQuantity(amount)}
                aria-pressed={quantity === amount}
                aria-label={`${amount} יחידות, ${tierUnitPrice.toFixed(2)} ₪ ליחידה`}
              >
                <strong>{amount}</strong>
                <small>{tierUnitPrice.toFixed(2)} ₪ ליחידה</small>
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="pd-purchase-row">
        <span>כמות</span>
        <div className="pd-quantity" aria-label="בחירת כמות">
          <button type="button" onClick={() => selectQuantity(Math.max(1, quantity - 1))} aria-label="הקטנת כמות"><Minus /></button>
          <output aria-live="polite">{quantity}</output>
          <button type="button" onClick={() => selectQuantity(quantity + 1)} aria-label="הגדלת כמות"><Plus /></button>
        </div>
      </div>
      <p className="pd-purchase-total">
        <span>{unitPrice.toFixed(2)} ₪ ליח׳</span>
        <strong>{linePrice(product, quantity).toFixed(2)} ₪</strong>
      </p>
      <button
        type="button"
        disabled={!inStock}
        className="pd-add"
        onClick={addToCart}
        aria-label={addedQuantity ? `נוספו ${addedQuantity} יחידות לעגלה` : `הוסף לעגלה · ${quantity}`}
      >
        <ShoppingBag />
        {!inStock ? "אזל מהמלאי" : addedQuantity ? `נוספו ${addedQuantity} יחידות` : `הוסף לעגלה · ${quantity}`}
      </button>
    </div>
  );
}
