import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider } from "@/components/commerce/cart-provider";
import { QuickShop } from "@/components/commerce/quick-shop";
import type { Product } from "@/lib/catalog/model";

const products = [
  { id: "1", slug: "killa-mint", sku: "1", name: "KILLA מנטה", brand: "KILLA", flavor: "מנטה", nicotineMg: 16, strengthLevel: "medium", retailPrice: 34.9, sourcePrice: 0, stock: 1, active: true, packSize: 1, images: [], categories: [] },
  { id: "2", slug: "nois-berry", sku: "2", name: "NOIS פירות יער", brand: "NOIS", flavor: "פירות יער", nicotineMg: 25, strengthLevel: "strong", retailPrice: 39.9, sourcePrice: 0, stock: 1, active: true, packSize: 1, images: [], categories: [] },
] as Product[];

it("keeps the selected brand when opening all matching products", () => {
  render(<CartProvider><QuickShop products={products} /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: "לפי מותג" }));
  fireEvent.click(screen.getByRole("button", { name: "KILLA" }));
  expect(screen.getByRole("link", { name: /לכל 1 המוצרים בסינון הזה/ })).toHaveAttribute("href", "/shop?brand=KILLA");
});
