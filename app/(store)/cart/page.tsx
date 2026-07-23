import Link from "next/link";
export const metadata = { title: "סל קניות" };
export default function CartPage() {
  return <div className="container article"><p className="eyebrow">הקנייה שלכם</p><h1>סל קניות</h1><p>הסל המקומי מוכן לחיבור ל‑CRM ולמסוף HYP הנפרד. בשלב זה ניתן להמשיך לטופס ההזמנה ללא חיוב.</p><Link className="button" href="/shop">המשך לקנות</Link> <Link className="button secondary" href="/checkout">לצ׳קאאוט</Link></div>;
}
