import { expect, it } from "vitest";
import { calculateTotals } from "@/lib/cart/model";
it("grants free shipping at 199 ILS", () => {
  expect(calculateTotals([{ id: "1", name: "x", price: 99.5, quantity: 2 }]).shipping).toBe(0);
});
