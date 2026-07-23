import type { CartAction, CartState } from "@/lib/cart/types";

const FREE_SHIPPING_THRESHOLD = 199;
const SHIPPING_COST = 29;

export const initialCartState: CartState = { lines: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      if (action.quantity <= 0) return state;

      const existingLine = state.lines.find(({ product }) => product.id === action.product.id);
      if (!existingLine) {
        return { lines: [...state.lines, { product: action.product, quantity: action.quantity }] };
      }

      return {
        lines: state.lines.map((line) =>
          line.product.id === action.product.id
            ? { ...line, quantity: line.quantity + action.quantity }
            : line,
        ),
      };
    }
    case "setQuantity":
      if (action.quantity <= 0) {
        return { lines: state.lines.filter((line) => line.product.id !== action.productId) };
      }

      return {
        lines: state.lines.map((line) =>
          line.product.id === action.productId ? { ...line, quantity: action.quantity } : line,
        ),
      };
    case "remove":
      return { lines: state.lines.filter((line) => line.product.id !== action.productId) };
    case "clear":
      return initialCartState;
  }
}

export function cartTotals(state: CartState) {
  const itemCount = state.lines.reduce((count, line) => count + line.quantity, 0);
  const subtotal = state.lines.reduce(
    (sum, line) => sum + line.product.retailPrice * line.quantity,
    0,
  );
  const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_COST : 0;

  return {
    itemCount,
    subtotal,
    shipping,
    total: subtotal + shipping,
    remainingForFreeShipping: Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0),
  };
}
