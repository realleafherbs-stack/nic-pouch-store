"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { cartReducer, cartTotals, initialCartState } from "@/lib/cart/reducer";
import type { CartAction, CartState } from "@/lib/cart/types";

const CART_STORAGE_KEY = "nic-cart-v2";

type CartContextValue = {
  state: CartState;
  totals: ReturnType<typeof cartTotals>;
  dispatch: React.Dispatch<CartAction>;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartState | null {
  const serializedCart = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!serializedCart) return null;

  const parsedCart: unknown = JSON.parse(serializedCart);
  if (
    !parsedCart ||
    typeof parsedCart !== "object" ||
    !Array.isArray((parsedCart as CartState).lines)
  ) {
    return null;
  }

  return parsedCart as CartState;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = readStoredCart();
      if (storedCart) dispatch({ type: "hydrate", state: storedCart });
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    }
  }, [hydrated, state]);

  const value = useMemo(
    () => ({ state, totals: cartTotals(state), dispatch }),
    [state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used within a CartProvider");

  return cart;
}
