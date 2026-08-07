"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "./cart-provider";
import { linePrice, unitPriceForQuantity } from "@/lib/catalog/pricing";

export function CartPageClient() {
  const { state, totals, dispatch } = useCart();

  if (!state.lines.length) {
    return <main className="container cart-empty-page"><ShoppingBag /><p className="eyebrow">הקנייה שלכם</p><h1>העגלה עדיין ריקה</h1><p>מותגים מובילים ומגוון עוצמות מחכים לכם בחנות.</p><Link className="button" href="/shop">לכל המוצרים</Link></main>;
  }

  return (
    <main className="container cart-page">
      <header><p className="eyebrow">NIC POUCH / הקנייה שלכם</p><h1>עגלת קניות</h1><span>{totals.itemCount} פריטים בעגלה</span></header>
      <div className="cart-layout">
        <section className="cart-page-lines" aria-label="מוצרים בעגלה">
          {state.lines.map(({ product, quantity }) => (
            <article className="cart-page-line" key={product.id}>
              <Link className="cart-line-image" href={`/shop/${product.slug}`}>{product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <ShoppingBag />}</Link>
              <div className="cart-line-copy"><small>{product.brand}</small><Link href={`/shop/${product.slug}`}><strong>{product.flavor || product.name}</strong></Link><p>פאוצ׳ ניקוטין בטעם {product.flavor || "לפי היצרן"}, באריזה מקורית ובבחירת עוצמה ברורה.</p><span>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "עוצמה לפי היצרן"}</span>
                <div className="line-stepper">
                  <button aria-label={`הפחתת כמות של ${product.name}`} onClick={() => dispatch({ type: "setQuantity", productId: product.id, quantity: quantity - 1 })}><Minus /></button>
                  <span>{quantity}</span>
                  <button aria-label={`הגדלת כמות של ${product.name}`} onClick={() => dispatch({ type: "setQuantity", productId: product.id, quantity: quantity + 1 })}><Plus /></button>
                </div>
              </div>
              <div className="cart-line-total"><small>{unitPriceForQuantity(product, quantity).toFixed(2)} ₪ ליח׳</small><strong>{linePrice(product, quantity).toFixed(2)} ₪</strong><button aria-label={`הסרת ${product.name} מהעגלה`} onClick={() => dispatch({ type: "remove", productId: product.id })}><Trash2 /></button></div>
            </article>
          ))}
          <Link className="continue-shopping" href="/shop">המשך בקניות ←</Link>
        </section>
        <aside className="cart-page-summary">
          <h2>סיכום הזמנה</h2>
          <div className="cart-shipping-callout"><Truck />{totals.remainingForFreeShipping > 0 ? <span>עוד <strong>{totals.remainingForFreeShipping.toFixed(2)} ₪</strong> למשלוח חינם</span> : <strong>קיבלתם משלוח חינם</strong>}</div>
          <div className="shipping-progress"><span style={{ width: `${Math.min(100, (totals.subtotal / 199) * 100)}%` }} /></div>
          <dl><div><dt>סכום ביניים</dt><dd>{totals.subtotal.toFixed(2)} ₪</dd></div><div><dt>משלוח</dt><dd>{totals.shipping ? `${totals.shipping.toFixed(2)} ₪` : "חינם"}</dd></div><div className="cart-grand-total"><dt>סה״כ</dt><dd>{totals.total.toFixed(2)} ₪</dd></div></dl>
          <Link className="button" href="/checkout">עבור לקופה</Link>
          <small>התשלום מאובטח ופרטי ההזמנה מוצגים לפני החיוב.</small>
        </aside>
      </div>
    </main>
  );
}
