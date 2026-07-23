import { describe, expect, it } from "vitest";
import { linePrice, unitPriceForQuantity } from "@/lib/catalog/pricing";

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
});
