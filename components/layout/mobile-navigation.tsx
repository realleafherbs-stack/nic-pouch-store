"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Menu, Search, ShoppingBag, Store, X } from "lucide-react";
import { useCart } from "@/components/commerce/cart-provider";
import { CartDrawer } from "@/components/commerce/cart-drawer";

export function MobileNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totals } = useCart();

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCartOpen(false);
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <div className="mobile-header">
        <button className="icon-button" aria-label="פתיחת תפריט" onClick={() => setMenuOpen(true)}><Menu /></button>
        <Link href="/" className="mobile-logo" aria-label="NIC POUCH — דף הבית"><img src="/figma/nic-pouch-logo.jpg" alt="NIC POUCH" /></Link>
        <button className="icon-button cart-trigger" aria-label={`פתיחת עגלה, ${totals.itemCount} פריטים`} onClick={() => setCartOpen(true)}>
          <ShoppingBag />{totals.itemCount > 0 && <span>{totals.itemCount}</span>}
        </button>
      </div>

      {menuOpen && (
        <div className="drawer-layer">
          <button className="drawer-scrim" aria-label="סגירת שכבת תפריט" onClick={() => setMenuOpen(false)} />
          <aside className="mobile-menu" role="dialog" aria-modal="true" aria-label="תפריט ראשי">
            <header><strong>תפריט</strong><button className="icon-button" aria-label="סגירת תפריט" onClick={() => setMenuOpen(false)}><X /></button></header>
            <nav>
              <Link href="/shop" onClick={() => setMenuOpen(false)}>כל המוצרים</Link>
              <Link href="/#brands" onClick={() => setMenuOpen(false)}>מותגים מובילים</Link>
              <Link href="/blog" onClick={() => setMenuOpen(false)}>המדריכים שלנו</Link>
              <Link href="/shipping" onClick={() => setMenuOpen(false)}>משלוחים</Link>
              <Link href="/accessibility" onClick={() => setMenuOpen(false)}>נגישות</Link>
            </nav>
            <div className="mobile-menu-note"><strong>18+</strong><p>המוצרים מכילים ניקוטין — חומר ממכר. מיועד לבגירים בלבד.</p></div>
          </aside>
        </div>
      )}

      <nav className="mobile-bottom-nav" aria-label="ניווט מהיר">
        <Link href="/"><Home /><span>בית</span></Link>
        <Link href="/shop"><Store /><span>חנות</span></Link>
        <Link href="/shop"><Search /><span>חיפוש</span></Link>
        <button onClick={() => setCartOpen(true)}><span className="bottom-cart-icon"><ShoppingBag />{totals.itemCount > 0 && <b>{totals.itemCount}</b>}</span><span>עגלה</span></button>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
