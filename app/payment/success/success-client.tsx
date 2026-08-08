"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/components/commerce/cart-provider";

export function SuccessClient() {
  const searchParams = useSearchParams();
  const { dispatch } = useCart();
  const orderId = searchParams.get("Order");

  useEffect(() => {
    if (orderId) {
      // Backup confirmation — the server-side confirm on this page's initial
      // load is the primary path, but if that request never completed (e.g.
      // the browser closed mid-redirect), this client-side call still fires
      // once the page actually renders. Idempotent server-side. Sends the
      // full Hyp redirect params (not just orderId) — the confirm route
      // re-verifies them against Hyp itself before trusting anything here.
      fetch("/api/confirm-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(searchParams.entries())),
      }).catch(() => {});
    }
    dispatch({ type: "clear" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container checkout-success">
      <CheckCircle2 />
      <h1>התשלום התקבל בהצלחה</h1>
      <p>שלחנו לך מייל אישור עם פרטי ההזמנה.</p>
      {orderId && <p dir="ltr"><strong>#{orderId}</strong></p>}
      <Link className="button" href="/shop">להמשך בקניות</Link>
    </main>
  );
}
