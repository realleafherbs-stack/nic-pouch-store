import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, vi } from "vitest";
import { CartProvider, useCart } from "@/components/commerce/cart-provider";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import type { Product } from "@/lib/catalog/model";

const { pushToRoute } = vi.hoisted(() => ({ pushToRoute: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushToRoute }),
}));

const product: Product = {
  id: "nois-cherry", slug: "nois-cherry", sku: "NOIS-CHERRY",
  name: "NOIS דובדבן אקסטרים", brand: "NOIS", flavor: "דובדבן אקסטרים",
  nicotineMg: 50, strengthLevel: "extra-strong", retailPrice: 29,
  priceTiers: [{ minQuantity: 5, unitPrice: 28 }, { minQuantity: 10, unitPrice: 27 }],
  sourcePrice: 20, stock: 20, active: true, packSize: 1,
  images: ["/products/nois-cherry.webp"], categories: ["פאוצ׳ים"],
};

function CartStateProbe() {
  const { state } = useCart();
  return <output data-testid="cart-state">{JSON.stringify(state.lines.map((line) => ({
    productId: line.product.id,
    quantity: line.quantity,
  })))}</output>;
}

function renderPanel(renderedProduct = product) {
  return render(
    <CartProvider>
      <ProductPurchasePanel product={renderedProduct} />
      <CartStateProbe />
    </CartProvider>,
  );
}

beforeEach(() => {
  pushToRoute.mockReset();
});

it("shows helper-derived unit price, total and only positive savings for every tier", () => {
  renderPanel();

  expect(screen.getByRole("button", { name: "1 יחידות, 29.00 ₪ ליחידה, סה״כ 29.00 ₪" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "5 יחידות, 28.00 ₪ ליחידה, סה״כ 140.00 ₪, חיסכון 5.00 ₪" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "10 יחידות, 27.00 ₪ ליחידה, סה״כ 270.00 ₪, חיסכון 20.00 ₪" })).toBeInTheDocument();
  expect(screen.getAllByText(/חיסכון/)).toHaveLength(2);

  fireEvent.click(screen.getByRole("button", { name: /10 יחידות, 27.00 ₪ ליחידה/ }));
  expect(screen.getByText("270.00 ₪")).toBeInTheDocument();
});

it("recalculates the applicable tier when quantity changes", () => {
  renderPanel();
  fireEvent.click(screen.getByRole("button", { name: /5 יחידות/ }));
  fireEvent.click(screen.getByRole("button", { name: "הגדלת כמות" }));
  expect(screen.getByText("168.00 ₪")).toBeInTheDocument();
  expect(screen.getByText("28.00 ₪ ליח׳")).toBeInTheDocument();
});

it("adds the selected quantity to actual CartProvider state once", () => {
  renderPanel();
  fireEvent.click(screen.getByRole("button", { name: /5 יחידות/ }));
  fireEvent.click(screen.getByRole("button", { name: "הוסף לעגלה · 5" }));

  expect(screen.getByTestId("cart-state")).toHaveTextContent(
    JSON.stringify([{ productId: product.id, quantity: 5 }]),
  );
  expect(screen.getByRole("button", { name: "נוספו 5 יחידות לעגלה" })).toBeInTheDocument();
});

it("adds the selected quantity before navigating to checkout", () => {
  renderPanel();
  fireEvent.click(screen.getByRole("button", { name: /10 יחידות/ }));
  fireEvent.click(screen.getByRole("button", { name: "קנה עכשיו · 10" }));

  expect(screen.getByTestId("cart-state")).toHaveTextContent(
    JSON.stringify([{ productId: product.id, quantity: 10 }]),
  );
  expect(pushToRoute).toHaveBeenCalledWith("/checkout");
});

it("disables both purchase actions and leaves cart and navigation untouched when out of stock", () => {
  renderPanel({ ...product, stock: 0 });
  const addButton = screen.getByRole("button", { name: "אזל מהמלאי" });
  const buyButton = screen.getByRole("button", { name: "קנה עכשיו · 1" });

  expect(addButton).toBeDisabled();
  expect(buyButton).toBeDisabled();
  fireEvent.click(addButton);
  fireEvent.click(buyButton);

  expect(screen.getByTestId("cart-state")).toHaveTextContent("[]");
  expect(pushToRoute).not.toHaveBeenCalled();
});
