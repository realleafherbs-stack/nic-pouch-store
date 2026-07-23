"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, Menu, Search, ShoppingBag, Store, X } from "lucide-react";
import { useCart } from "@/components/commerce/cart-provider";
import { CartDrawer } from "@/components/commerce/cart-drawer";

export function MobileNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totals } = useCart();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const cartOpenerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLElement>(null);

  function closeMenu() {
    setMenuOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }

  function closeCart() {
    setCartOpen(false);
    requestAnimationFrame(() => cartOpenerRef.current?.focus());
  }

  function openCart(event: React.MouseEvent<HTMLButtonElement>) {
    cartOpenerRef.current = event.currentTarget;
    setCartOpen(true);
  }

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (menuOpen) closeMenu();
        if (cartOpen) closeCart();
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen, cartOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const menu = menuRef.current;
    const focusable = menu?.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
    focusable?.[0]?.focus();
    function trapFocus(event: KeyboardEvent) {
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    menu?.addEventListener("keydown", trapFocus);
    return () => menu?.removeEventListener("keydown", trapFocus);
  }, [menuOpen]);

  return (
    <>
      <div className="mobile-header">
        <button ref={menuButtonRef} className="icon-button" aria-label="פתיחת תפריט" onClick={() => setMenuOpen(true)}><Menu /></button>
        <Link href="/" className="mobile-logo" aria-label="NIC POUCH — דף הבית"><img src="/figma/nic-pouch-logo.jpg" alt="NIC POUCH" /></Link>
        <button className="icon-button cart-trigger" aria-label={`פתיחת עגלה, ${totals.itemCount} פריטים`} onClick={openCart}>
          <ShoppingBag />{totals.itemCount > 0 && <span>{totals.itemCount}</span>}
        </button>
      </div>

      {menuOpen && (
        <div className="drawer-layer">
          <button className="drawer-scrim" aria-label="סגירת שכבת תפריט" onClick={closeMenu} />
          <aside ref={menuRef} className="mobile-menu" role="dialog" aria-modal="true" aria-label="תפריט ראשי">
            <header><strong>תפריט</strong><button className="icon-button" aria-label="סגירת תפריט" onClick={closeMenu}><X /></button></header>
            <nav>
              <Link href="/shop" onClick={closeMenu}>כל המוצרים</Link>
              <Link href="/#brands" onClick={closeMenu}>מותגים מובילים</Link>
              <Link href="/blog" onClick={closeMenu}>המדריכים שלנו</Link>
              <Link href="/shipping" onClick={closeMenu}>משלוחים</Link>
              <Link href="/accessibility" onClick={closeMenu}>נגישות</Link>
            </nav>
            <div className="mobile-menu-note"><strong>18+</strong><p>המוצרים מכילים ניקוטין — חומר ממכר. מיועד לבגירים בלבד.</p></div>
          </aside>
        </div>
      )}

      <nav className="mobile-bottom-nav" aria-label="ניווט מהיר">
        <Link href="/"><Home /><span>בית</span></Link>
        <Link href="/shop"><Store /><span>חנות</span></Link>
        <Link href="/shop"><Search /><span>חיפוש</span></Link>
        <button onClick={openCart}><span className="bottom-cart-icon"><ShoppingBag />{totals.itemCount > 0 && <b>{totals.itemCount}</b>}</span><span>עגלה</span></button>
      </nav>

      <CartDrawer open={cartOpen} onClose={closeCart} />
    </>
  );
}
