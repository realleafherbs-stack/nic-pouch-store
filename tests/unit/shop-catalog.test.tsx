import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { CartProvider } from "@/components/commerce/cart-provider";
import { ShopCatalog } from "@/components/commerce/shop-catalog";
import type { Product } from "@/lib/catalog/model";

const products = [
  { id: "1", slug: "mint", sku: "1", name: "HQD מנטה", brand: "HQD", flavor: "מנטה", nicotineMg: 15, strengthLevel: "medium", retailPrice: 29.9, sourcePrice: 0, stock: 1, active: true, packSize: 1, images: [], categories: [] },
  { id: "2", slug: "berry", sku: "2", name: "NOIS פירות יער", brand: "NOIS", flavor: "פירות יער", nicotineMg: 25, strengthLevel: "strong", retailPrice: 39.9, sourcePrice: 0, stock: 1, active: true, packSize: 1, images: [], categories: [] },
] as Product[];

afterEach(() => {
  window.localStorage.clear();
});

it("filters products by search and brand", () => {
  render(<CartProvider><ShopCatalog products={products} /></CartProvider>);
  fireEvent.change(screen.getByLabelText("חיפוש"), { target: { value: "מנטה" } });
  expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  expect(screen.getByRole("link", { name: "HQD מנטה" })).toBeInTheDocument();
});

it("adds a product directly from its card", () => {
  render(<CartProvider><ShopCatalog products={products} /></CartProvider>);
  const quantityGroups = screen.getAllByLabelText("בחירת כמות עבור HQD מנטה");
  fireEvent.click(quantityGroups[0].querySelectorAll("button")[1]);
  fireEvent.click(screen.getByRole("button", { name: "הוספת 5 יחידות של HQD מנטה לעגלה" }));
  expect(screen.getByText("5 בעגלה")).toBeInTheDocument();
});

it("replaces a failed product image with a bounded brand fallback", () => {
  const brokenImageProduct = {
    ...products[0],
    images: ["https://payper.example.com/should-now-apply.jpg"],
  } as Product;

  render(<CartProvider><ShopCatalog products={[brokenImageProduct]} /></CartProvider>);
  const image = screen.getByRole("img", { name: "HQD מנטה" });
  fireEvent.error(image);

  expect(screen.queryByRole("img", { name: "HQD מנטה" })).not.toBeInTheDocument();
  expect(screen.getByTestId("product-image-fallback")).toHaveTextContent("HQD");
});

it("lets shoppers add single units after adding a quantity tier", () => {
  render(<CartProvider><ShopCatalog products={products} /></CartProvider>);
  const quantityGroups = screen.getAllByLabelText("בחירת כמות עבור HQD מנטה");
  fireEvent.click(quantityGroups[0].querySelectorAll("button")[2]);
  fireEvent.click(screen.getByRole("button", { name: "הוספת 10 יחידות של HQD מנטה לעגלה" }));

  expect(screen.getByText("10 בעגלה")).toBeInTheDocument();
  expect(screen.getAllByText("27.90 ₪ ליח׳").length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole("button", { name: "הוספת יחידה נוספת של HQD מנטה" }));

  expect(screen.getByText("11 בעגלה")).toBeInTheDocument();
  expect(screen.getAllByText("27.90 ₪ ליח׳").length).toBeGreaterThan(0);
});

it("opens with a strength filter and explanation from the URL", async () => {
  window.history.replaceState({}, "", "/shop?strength=strong");
  render(<CartProvider><ShopCatalog products={products} /></CartProvider>);
  await waitFor(() => expect(screen.getByText("עוצמה חזקה")).toBeInTheDocument());
  expect(screen.getAllByTestId("product-card")).toHaveLength(1);
  window.history.replaceState({}, "", "/shop");
});

it("opens with a brand filter from the URL", async () => {
  window.history.replaceState({}, "", "/shop?brand=NOIS");
  render(<CartProvider><ShopCatalog products={products} /></CartProvider>);
  await waitFor(() => expect(screen.getAllByTestId("product-card")).toHaveLength(1));
  expect(screen.getByRole("link", { name: "NOIS פירות יער" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "NOIS" })).toBeInTheDocument();
  window.history.replaceState({}, "", "/shop");
});

it("opens and focuses mobile search when the search navigation is activated", async () => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
  render(<CartProvider><ShopCatalog products={products} /></CartProvider>);
  act(() => window.dispatchEvent(new Event("open-catalog-search")));
  const dialog = await screen.findByRole("dialog", { name: "סינון ומיון" });
  const searchInput = dialog.querySelector<HTMLInputElement>('input[aria-label="חיפוש"]');
  await waitFor(() => expect(searchInput).toHaveFocus());
});
