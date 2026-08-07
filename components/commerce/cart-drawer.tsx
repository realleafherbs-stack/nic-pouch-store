"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/commerce/cart-provider";
import { linePrice, unitPriceForQuantity } from "@/lib/catalog/pricing";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, totals, dispatch } = useCart();
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    drawer?.querySelector<HTMLElement>("a[href],button:not([disabled])")?.focus();

    function trapFocus(event: KeyboardEvent) {
      const focusable = drawer?.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focusOutside = !drawer?.contains(document.activeElement);
      if (focusOutside) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [open]);

  if (!open) return null;

  return (
    <div className="drawer-layer">
      <button className="drawer-scrim" aria-label="סגירת עגלה" onClick={onClose} />
      <aside ref={drawerRef} className="cart-drawer" role="dialog" aria-modal="true" aria-label="עגלה מהירה">
        <header>
          <div><ShoppingBag /><strong>העגלה שלי</strong><span>{totals.itemCount} פריטים</span></div>
          <button className="icon-button" aria-label="סגירת עגלה" onClick={onClose}><X /></button>
        </header>

        {state.lines.length === 0 ? (
          <div className="drawer-empty">
            <ShoppingBag />
            <h2>העגלה עדיין ריקה</h2>
            <p>מצאו את המותג, הטעם והעוצמה שמתאימים לכם.</p>
            <Link className="button" href="/shop" onClick={onClose}>לכל המוצרים</Link>
          </div>
        ) : (
          <>
            <div className="drawer-lines">
              {state.lines.map(({ product, quantity }) => (
                <article className="drawer-line" key={product.id}>
                  <Link href={`/shop/${product.slug}`} onClick={onClose}>
                    {product.images?.[0] && <img src={product.images[0]} alt="" />}
                  </Link>
                  <div>
                    <strong>{product.flavor || product.name || "מוצר"}</strong>
                    <small>{product.brand || ""}</small>
                    <div className="line-stepper">
                      <button aria-label={`הפחתת כמות של ${product.name || "מוצר"}`} onClick={() => dispatch({ type: "setQuantity", productId: product.id, quantity: quantity - 1 })}><Minus /></button>
                      <span>{quantity}</span>
                      <button aria-label={`הגדלת כמות של ${product.name || "מוצר"}`} onClick={() => dispatch({ type: "setQuantity", productId: product.id, quantity: quantity + 1 })}><Plus /></button>
                    </div>
                  </div>
                  <div className="drawer-line-end">
                    <strong>{linePrice(product, quantity).toFixed(2)} ₪</strong>
                    <small>{unitPriceForQuantity(product, quantity).toFixed(2)} ₪ ליח׳</small>
                    <button aria-label={`הסרת ${product.name || "מוצר"} מהעגלה`} onClick={() => dispatch({ type: "remove", productId: product.id })}><Trash2 /></button>
                  </div>
                </article>
              ))}
            </div>

            <div className="drawer-summary">
              {totals.remainingForFreeShipping > 0 ? <p>עוד <strong>{totals.remainingForFreeShipping.toFixed(2)} ₪</strong> למשלוח חינם</p> : <p className="free-shipping">המשלוח שלכם חינם</p>}
              <div className="shipping-progress"><span style={{ width: `${Math.min(100, (totals.subtotal / 199) * 100)}%` }} /></div>
              <div><span>סכום ביניים</span><strong>{totals.subtotal.toFixed(2)} ₪</strong></div>
              <Link className="button" href="/cart" onClick={onClose}>מעבר לעגלה</Link>
              <Link className="button secondary" href="/checkout" onClick={onClose}>המשך לקופה</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
