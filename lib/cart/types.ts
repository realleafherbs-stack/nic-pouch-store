import type { Product } from "@/lib/catalog/model";

export type CartLine = {
  product: Product;
  quantity: number;
};

export type CartState = {
  lines: CartLine[];
};

export type CartAction =
  | { type: "hydrate"; state: CartState }
  | { type: "add"; product: Product; quantity: number }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };
