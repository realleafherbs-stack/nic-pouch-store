import Link from "next/link";
import { XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "התשלום לא הושלם" };

export default function PaymentFailurePage() {
  return (
    <main className="container checkout-success">
      <XCircle style={{ color: "#c0392b" }} />
      <h1>התשלום לא הושלם</h1>
      <p>לא בוצע חיוב. ניתן לנסות שוב או לפנות אלינו אם הבעיה חוזרת.</p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link className="button" href="/checkout">נסה שוב</Link>
        <Link className="button" href="/contact">צור קשר</Link>
      </div>
    </main>
  );
}
