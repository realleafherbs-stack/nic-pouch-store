"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/catalog/model";
import { linePrice, PURCHASE_QUANTITIES, savingsForQuantity, unitPriceForQuantity } from "@/lib/catalog/pricing";
import { useCart } from "@/components/commerce/cart-provider";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [addedQuantity, setAddedQuantity] = useState<number | null>(null);
  const { dispatch } = useCart();
  const router = useRouter();
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

  function buyNow() {
    if (!inStock) return;
    dispatch({ type: "add", product, quantity });
    router.push("/checkout");
  }

  return (
    <div className="pd-purchase-box">
      <fieldset className="pd-pack-choice">
        <legend>בחרו כמות</legend>
        <div>
          {PURCHASE_QUANTITIES.map((amount) => {
            const tierUnitPrice = unitPriceForQuantity(product, amount);
            const tierTotal = linePrice(product, amount);
            const tierSavings = savingsForQuantity(product, amount);
            const pricingLabel = `${amount} יחידות, ${tierUnitPrice.toFixed(2)} ₪ ליחידה, סה״כ ${tierTotal.toFixed(2)} ₪${tierSavings > 0 ? `, חיסכון ${tierSavings.toFixed(2)} ₪` : ""}`;
            return (
              <button
                type="button"
                key={amount}
                className={quantity === amount ? "active" : ""}
                onClick={() => selectQuantity(amount)}
                aria-pressed={quantity === amount}
                aria-label={pricingLabel}
              >
                <strong>{amount} יח׳</strong>
                <small>{tierUnitPrice.toFixed(2)} ₪ ליחידה</small>
                <small>סה״כ {tierTotal.toFixed(2)} ₪</small>
                {tierSavings > 0 && <span className="pd-tier-saving">חיסכון {tierSavings.toFixed(2)} ₪</span>}
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
        aria-label={!inStock ? "אזל מהמלאי" : addedQuantity ? `נוספו ${addedQuantity} יחידות לעגלה` : `הוסף לעגלה · ${quantity}`}
      >
        <ShoppingBag />
        {!inStock ? "אזל מהמלאי" : addedQuantity ? `נוספו ${addedQuantity} יחידות` : `הוסף לעגלה · ${quantity}`}
      </button>
      <button
        type="button"
        disabled={!inStock}
        className="pd-buy"
        onClick={buyNow}
        aria-label={`קנה עכשיו · ${quantity}`}
      >
        קנה עכשיו
      </button>
    </div>
  );
}
