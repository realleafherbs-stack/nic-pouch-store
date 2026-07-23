import type { PriceTier, Product } from "@/lib/catalog/model";

export const PURCHASE_QUANTITIES = [1, 5, 10] as const;
export type PurchaseQuantity = (typeof PURCHASE_QUANTITIES)[number];

export function productPriceTiers(product: Pick<Product, "retailPrice" | "priceTiers">): PriceTier[] {
  const configured = product.priceTiers
    ?.filter((tier) => Number.isInteger(tier.minQuantity) && tier.minQuantity > 0 && Number.isFinite(tier.unitPrice) && tier.unitPrice >= 0)
    .sort((a, b) => a.minQuantity - b.minQuantity);

  if (configured?.length) return configured;
  return [
    { minQuantity: 1, unitPrice: product.retailPrice },
    { minQuantity: 5, unitPrice: Math.max(0, product.retailPrice - 1) },
    { minQuantity: 10, unitPrice: Math.max(0, product.retailPrice - 2) },
  ];
}

export function unitPriceForQuantity(product: Pick<Product, "retailPrice" | "priceTiers">, quantity: number) {
  return productPriceTiers(product).reduce(
    (price, tier) => quantity >= tier.minQuantity ? tier.unitPrice : price,
    product.retailPrice,
  );
}

export function linePrice(product: Pick<Product, "retailPrice" | "priceTiers">, quantity: number) {
  return unitPriceForQuantity(product, quantity) * quantity;
}
