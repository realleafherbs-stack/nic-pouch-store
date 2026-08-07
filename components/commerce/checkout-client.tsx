"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, LockKeyhole, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";
import { linePrice, unitPriceForQuantity } from "@/lib/catalog/pricing";

export function CheckoutClient() {
  const { state, totals } = useCart();
  const [submitted, setSubmitted] = useState(false);

  if (!state.lines.length) return <main className="container cart-empty-page"><ShoppingBag /><h1>אין מוצרים לתשלום</h1><p>הוסיפו מוצרים לעגלה כדי להמשיך לקופה.</p><Link className="button" href="/shop">לחנות</Link></main>;
  if (submitted) return <main className="container checkout-success"><CheckCircle2 /><h1>הפרטים נשמרו</h1><p>זהו אישור הדגמה בלבד. לא בוצע חיוב ולא נשלחו פרטי תשלום.</p><Link className="button" href="/">חזרה לדף הבית</Link></main>;

  return (
    <main className="container checkout-page">
      <header><p className="eyebrow">קופה מאובטחת</p><h1>השלמת הזמנה</h1><p><LockKeyhole /> הפרטים נשמרים בדפדפן בלבד עד לחיבור מאובטח ל‑CRM ולמסוף הסליקה.</p></header>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
          <fieldset><legend>פרטי קשר</legend><div className="checkout-grid">
            <label><span>שם פרטי</span><input name="firstName" autoComplete="given-name" required /></label>
            <label><span>שם משפחה</span><input name="lastName" autoComplete="family-name" required /></label>
            <label><span>טלפון</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+ -]{9,15}" required /></label>
            <label><span>אימייל</span><input name="email" type="email" autoComplete="email" required /></label>
          </div></fieldset>
          <fieldset><legend>משלוח</legend><div className="checkout-grid">
            <label className="wide"><span>רחוב ומספר</span><input name="street" autoComplete="street-address" required /></label>
            <label><span>עיר</span><input name="city" autoComplete="address-level2" required /></label>
            <label><span>מיקוד</span><input name="postalCode" inputMode="numeric" autoComplete="postal-code" /></label>
            <label className="wide"><span>הערות לשליח</span><textarea name="notes" rows={3} /></label>
          </div></fieldset>
          <label className="checkout-consent"><input type="checkbox" required /><span>אני מאשר/ת שגילי מעל 18, קראתי את <Link href="/terms">התקנון</Link> ואת <Link href="/privacy">מדיניות הפרטיות</Link>.</span></label>
          <button className="button checkout-submit" type="submit"><LockKeyhole /> שמירת הזמנה — {totals.total.toFixed(2)} ₪</button>
          <div className="warning"><strong>חשוב:</strong> בשלב זה לא מתבצע חיוב. התשלום יופעל רק לאחר חיבור מסוף הסליקה הייעודי.</div>
        </form>
        <aside className="checkout-summary"><h2>ההזמנה שלכם</h2>{state.lines.map(({ product, quantity }) => <div className="checkout-line" key={product.id}><span>{quantity}×</span>{product.images?.[0] && <img src={product.images[0]} alt="" />}<div><strong>{product.flavor || product.name}</strong><small>{product.brand} · {unitPriceForQuantity(product, quantity).toFixed(2)} ₪ ליח׳</small></div><b>{linePrice(product, quantity).toFixed(2)} ₪</b></div>)}<dl><div><dt>מוצרים</dt><dd>{totals.subtotal.toFixed(2)} ₪</dd></div><div><dt>משלוח</dt><dd>{totals.shipping ? `${totals.shipping.toFixed(2)} ₪` : "חינם"}</dd></div><div><dt>סה״כ</dt><dd>{totals.total.toFixed(2)} ₪</dd></div></dl></aside>
      </div>
    </main>
  );
}
