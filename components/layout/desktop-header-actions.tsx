"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { useCart } from "@/components/commerce/cart-provider";

export function DesktopHeaderActions() {
  const [cartOpen, setCartOpen] = useState(false);
  const { totals } = useCart();

  return (
    <>
      <div className="header-actions">
        <button className="header-cart-button" aria-label={`פתיחת עגלה, ${totals.itemCount} פריטים`} onClick={() => setCartOpen(true)}>
          <ShoppingCart />
          {totals.itemCount > 0 && <b>{totals.itemCount}</b>}
        </button>
        <Link href="/shop" aria-label="חיפוש"><Search /></Link>
        <Link href="/shop" aria-label="מוצרים שאהבתי"><Heart /></Link>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
