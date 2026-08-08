"use client";

import { useState } from "react";
import Link from "next/link";
import { LockKeyhole, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";
import { linePrice, unitPriceForQuantity } from "@/lib/catalog/pricing";

interface AppliedCoupon {
  code: string;
  type: string;
  value: number;
}

export function CheckoutClient() {
  const { state, totals } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const discount = appliedCoupon
    ? appliedCoupon.type === "PERCENT"
      ? Math.round(((totals.subtotal * appliedCoupon.value) / 100) * 100) / 100
      : Math.min(appliedCoupon.value, totals.subtotal)
    : 0;
  const finalTotal = Math.max(0, totals.total - discount);

  if (!state.lines.length) {
    return (
      <main className="container cart-empty-page">
        <ShoppingBag />
        <h1>אין מוצרים לתשלום</h1>
        <p>הוסיפו מוצרים לעגלה כדי להמשיך לקופה.</p>
        <Link className="button" href="/shop">לחנות</Link>
      </main>
    );
  }

  async function handleCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CRM_URL}/api/${process.env.NEXT_PUBLIC_CRM_SITE_SLUG}/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (!res.ok) setCouponError(data.error ?? "קוד קופון לא תקין");
      else { setAppliedCoupon(data); setCouponCode(""); }
    } catch {
      setCouponError("שגיאה באימות הקופון");
    }
    setCouponLoading(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/hyp-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.lines.map(({ product, quantity }) => ({ productId: product.id, quantity })),
          coupon: appliedCoupon?.code,
          customer: {
            firstName: form.get("firstName"),
            lastName: form.get("lastName"),
            email: form.get("email"),
            phone: form.get("phone"),
            street: form.get("street"),
            city: form.get("city"),
            postalCode: form.get("postalCode") || undefined,
            notes: form.get("notes") || undefined,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "שגיאה בחיבור לשער התשלומים");
        setLoading(false);
        return;
      }

      window.location.href = data.paymentUrl;
    } catch {
      setError("שגיאה בחיבור לשער התשלומים. אנא נסו שוב.");
      setLoading(false);
    }
  }

  return (
    <main className="container checkout-page">
      <header><p className="eyebrow">קופה מאובטחת</p><h1>השלמת הזמנה</h1><p><LockKeyhole /> התשלום מאובטח ומועבר ישירות לשער הסליקה, ללא שמירת פרטי כרטיס באתר.</p></header>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
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
          {error && <div className="warning"><strong>שגיאה:</strong> {error}</div>}
          <button className="button checkout-submit" type="submit" disabled={loading}>
            <LockKeyhole /> {loading ? "מעבד..." : `לתשלום מאובטח — ${finalTotal.toFixed(2)} ₪`}
          </button>
        </form>
        <aside className="checkout-summary">
          <h2>ההזמנה שלכם</h2>
          {state.lines.map(({ product, quantity }) => (
            <div className="checkout-line" key={product.id}>
              <span>{quantity}×</span>
              {product.images?.[0] && <img src={product.images[0]} alt="" />}
              <div><strong>{product.flavor || product.name}</strong><small>{product.brand} · {unitPriceForQuantity(product, quantity).toFixed(2)} ₪ ליח׳</small></div>
              <b>{linePrice(product, quantity).toFixed(2)} ₪</b>
            </div>
          ))}
          <div className="checkout-coupon">
            {appliedCoupon ? (
              <div className="checkout-coupon-applied">
                <span>✓ קוד {appliedCoupon.code} הוחל</span>
                <button type="button" onClick={() => setAppliedCoupon(null)}>הסר</button>
              </div>
            ) : (
              <div className="checkout-coupon-input">
                <input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), handleCoupon())}
                  placeholder="קוד קופון"
                />
                <button type="button" className="button" onClick={handleCoupon} disabled={couponLoading}>
                  {couponLoading ? "…" : "החל"}
                </button>
              </div>
            )}
            {couponError && <small className="checkout-coupon-error">{couponError}</small>}
          </div>
          <dl>
            <div><dt>מוצרים</dt><dd>{totals.subtotal.toFixed(2)} ₪</dd></div>
            {discount > 0 && <div><dt>הנחה</dt><dd>-{discount.toFixed(2)} ₪</dd></div>}
            <div><dt>משלוח</dt><dd>{totals.shipping ? `${totals.shipping.toFixed(2)} ₪` : "חינם"}</dd></div>
            <div><dt>סה״כ</dt><dd>{finalTotal.toFixed(2)} ₪</dd></div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
