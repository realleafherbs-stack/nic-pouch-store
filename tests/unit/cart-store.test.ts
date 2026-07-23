import { describe, expect, it } from "vitest";
import { cartReducer, cartTotals, initialCartState } from "@/lib/cart/reducer";

describe("cart", () => {
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
});
