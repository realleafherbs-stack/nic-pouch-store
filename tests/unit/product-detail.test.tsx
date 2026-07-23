import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider } from "@/components/commerce/cart-provider";
import { ProductDetail } from "@/components/product/product-detail";
import type { Product } from "@/lib/catalog/model";

const product: Product = {
  id: "p-1", slug: "hqd-mint", sku: "HQD-1", name: "HQD מנטה", brand: "HQD",
  flavor: "מנטה", nicotineMg: 15, strengthLevel: "medium", retailPrice: 29.9,
  sourcePrice: 20, stock: 10, active: true, packSize: 1, images: ["/products/test.webp"],
  categories: ["פאוצ׳ים"],
};

it("adds the selected quantity to the shared cart", () => {
  render(<CartProvider><ProductDetail product={product} related={[]} /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: "הגדלת כמות" }));
  expect(screen.getByLabelText("רכישה מהירה")).toHaveTextContent("2 יחידות");
  expect(screen.getByLabelText("רכישה מהירה")).toHaveTextContent("59.80 ₪");
  fireEvent.click(screen.getByRole("button", { name: /הוסף לעגלה/ }));
  expect(screen.getAllByText("נוסף לעגלה").length).toBeGreaterThan(0);
});
