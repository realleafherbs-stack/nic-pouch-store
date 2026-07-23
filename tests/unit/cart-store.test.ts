import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "@/components/commerce/cart-provider";
import { cartReducer, cartTotals, initialCartState } from "@/lib/cart/reducer";

const CART_STORAGE_KEY = "nic-cart-v2";

function CartStateProbe() {
  const { state } = useCart();
  return createElement("output", { "data-testid": "cart-state" }, JSON.stringify(state));
}

describe("cart", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("adds and updates a line", () => {
    const product = { id: "1", retailPrice: 79 } as never;
    const added = cartReducer(initialCartState, { type: "add", product, quantity: 1 });
    const updated = cartReducer(added, { type: "setQuantity", productId: "1", quantity: 3 });

    expect(updated.lines[0].quantity).toBe(3);
  });

  it("calculates shipping and free-shipping progress", () => {
    const state = { lines: [{ product: { id: "1", retailPrice: 79 } as never, quantity: 2 }] };

    expect(cartTotals(state)).toEqual({
      itemCount: 2,
      subtotal: 158,
      shipping: 29,
      total: 187,
      remainingForFreeShipping: 41,
    });
  });

  it("handles reducer boundaries and every cart action", () => {
    const product = { id: "1", retailPrice: 79 } as never;
    const hydrated = { lines: [{ product, quantity: 2 }] };

    expect(cartReducer(initialCartState, { type: "add", product, quantity: 0 })).toBe(initialCartState);
    expect(cartReducer(initialCartState, { type: "hydrate", state: hydrated })).toBe(hydrated);

    const added = cartReducer(initialCartState, { type: "add", product, quantity: 1 });
    const merged = cartReducer(added, { type: "add", product, quantity: 2 });
    expect(merged.lines).toHaveLength(1);
    expect(merged.lines[0].quantity).toBe(3);

    const removedByZero = cartReducer(merged, { type: "setQuantity", productId: "1", quantity: 0 });
    expect(removedByZero).toEqual(initialCartState);

    const removed = cartReducer(merged, { type: "remove", productId: "1" });
    expect(removed).toEqual(initialCartState);
    expect(cartReducer(merged, { type: "clear" })).toBe(initialCartState);
  });

  it.each([
    ["a missing product", '{"lines":[{"quantity":1}]}'],
    ["an empty product id", '{"lines":[{"product":{"id":"","retailPrice":79},"quantity":1}]}'],
    ["a negative retail price", '{"lines":[{"product":{"id":"1","retailPrice":-1},"quantity":1}]}'],
    ["a non-finite retail price", '{"lines":[{"product":{"id":"1","retailPrice":1e999},"quantity":1}]}'],
    ["a zero quantity", '{"lines":[{"product":{"id":"1","retailPrice":79},"quantity":0}]}'],
    ["a fractional quantity", '{"lines":[{"product":{"id":"1","retailPrice":79},"quantity":1.5}]}'],
  ])("removes persisted carts containing %s", async (_description, serializedCart) => {
    window.localStorage.setItem(CART_STORAGE_KEY, serializedCart);
    const removeItem = vi.spyOn(Storage.prototype, "removeItem");

    render(createElement(CartProvider, null, createElement(CartStateProbe)));

    await waitFor(() => {
      expect(removeItem).toHaveBeenCalledWith(CART_STORAGE_KEY);
    });
    expect(screen.getByTestId("cart-state")).toHaveTextContent('{"lines":[]}');
  });
});
