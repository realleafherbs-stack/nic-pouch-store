import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";

export function SiteHeader() {
  return (
    <>
      <div className="announcement" role="status">
        <span>משלוח חינם מעל 199 ₪</span><span>אספקה עד 3 ימי עסקים</span><span>מגוון מותגים מובילים</span>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="logo" aria-label="NIC POUCH — דף הבית"><span>NIC</span> POUCH</Link>
          <nav aria-label="ניווט ראשי">
            <Link href="/shop">כל המוצרים</Link><Link href="/brands/nois">NOIS</Link><Link href="/blog">המדריך לפאוצ׳ים</Link><Link href="/shipping">משלוחים</Link>
          </nav>
          <div className="header-actions">
            <Link href="/shop" aria-label="חיפוש"><Search /></Link>
            <Link href="/checkout" aria-label="חשבון"><UserRound /></Link>
            <Link href="/cart" aria-label="סל קניות"><ShoppingBag /></Link>
          </div>
        </div>
      </header>
    </>
  );
}
