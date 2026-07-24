import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider } from "@/components/commerce/cart-provider";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import type { Product } from "@/lib/catalog/model";

const product: Product = {
  id: "nois-cherry", slug: "nois-cherry", sku: "NOIS-CHERRY",
  name: "NOIS דובדבן אקסטרים", brand: "NOIS", flavor: "דובדבן אקסטרים",
  nicotineMg: 50, strengthLevel: "extra-strong", retailPrice: 29,
  priceTiers: [{ minQuantity: 5, unitPrice: 28 }, { minQuantity: 10, unitPrice: 27 }],
  sourcePrice: 20, stock: 20, active: true, packSize: 1,
  images: ["/products/nois-cherry.webp"], categories: ["פאוצ׳ים"],
};

it("shows catalog-backed 1, 5 and 10 unit prices and totals", () => {
  render(<CartProvider><ProductPurchasePanel product={product} /></CartProvider>);
  expect(screen.getByRole("button", { name: /5 יחידות, 28.00 ₪ ליחידה/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /10 יחידות, 27.00 ₪ ליחידה/ }));
  expect(screen.getByText("270.00 ₪")).toBeInTheDocument();
});

it("recalculates the applicable tier when quantity changes", () => {
  render(<CartProvider><ProductPurchasePanel product={product} /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: /5 יחידות/ }));
  fireEvent.click(screen.getByRole("button", { name: "הגדלת כמות" }));
  expect(screen.getByText("168.00 ₪")).toBeInTheDocument();
  expect(screen.getByText("28.00 ₪ ליח׳")).toBeInTheDocument();
});

it("adds the selected quantity to the shared cart once", () => {
  render(<CartProvider><ProductPurchasePanel product={product} /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: /5 יחידות/ }));
  fireEvent.click(screen.getByRole("button", { name: "הוסף לעגלה · 5" }));
  expect(screen.getByRole("button", { name: "נוספו 5 יחידות לעגלה" })).toBeInTheDocument();
});
