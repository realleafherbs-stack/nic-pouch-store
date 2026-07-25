import { describe, expect, it } from "vitest";
import { linePrice, savingsForQuantity, unitPriceForQuantity } from "@/lib/catalog/pricing";

describe("volume pricing", () => {
  it("uses the default one and two shekel unit discounts", () => {
    const product = { retailPrice: 29 };
    expect(unitPriceForQuantity(product, 1)).toBe(29);
    expect(unitPriceForQuantity(product, 5)).toBe(28);
    expect(unitPriceForQuantity(product, 10)).toBe(27);
    expect(linePrice(product, 10)).toBe(270);
  });

  it("uses CRM-defined tiers when configured", () => {
    const product = { retailPrice: 31, priceTiers: [
      { minQuantity: 1, unitPrice: 29 },
      { minQuantity: 5, unitPrice: 28 },
      { minQuantity: 10, unitPrice: 27 },
    ] };
    expect(unitPriceForQuantity(product, 7)).toBe(28);
    expect(linePrice(product, 10)).toBe(270);
  });

  it("reports only real savings against the single-unit price", () => {
    const discounted = { retailPrice: 29, priceTiers: [
      { minQuantity: 1, unitPrice: 29 },
      { minQuantity: 5, unitPrice: 28 },
      { minQuantity: 10, unitPrice: 27 },
    ] };
    const undiscounted = { retailPrice: 29, priceTiers: [
      { minQuantity: 1, unitPrice: 29 },
      { minQuantity: 5, unitPrice: 29 },
      { minQuantity: 10, unitPrice: 30 },
    ] };

    expect(savingsForQuantity(discounted, 1)).toBe(0);
    expect(savingsForQuantity(discounted, 5)).toBe(5);
    expect(savingsForQuantity(discounted, 10)).toBe(20);
    expect(savingsForQuantity(undiscounted, 5)).toBe(0);
    expect(savingsForQuantity(undiscounted, 10)).toBe(0);
  });
});
