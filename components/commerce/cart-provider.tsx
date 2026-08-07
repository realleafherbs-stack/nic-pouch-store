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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidCartState(value: unknown): value is CartState {
  if (!isRecord(value) || !Array.isArray(value.lines)) return false;

  return value.lines.every((line) => {
    if (!isRecord(line) || !isRecord(line.product)) return false;

    const { product } = line;
    return (
      typeof product.id === "string" &&
      product.id.length > 0 &&
      typeof product.retailPrice === "number" &&
      Number.isFinite(product.retailPrice) &&
      product.retailPrice >= 0 &&
      typeof line.quantity === "number" &&
      Number.isFinite(line.quantity) &&
      Number.isInteger(line.quantity) &&
      line.quantity > 0
    );
  });
}

function readStoredCart(): CartState | null {
  const serializedCart = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!serializedCart) return null;

  const parsedCart: unknown = JSON.parse(serializedCart);
  if (!isValidCartState(parsedCart)) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return null;
  }

  return parsedCart;
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
