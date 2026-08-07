import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { CartProvider } from "@/components/commerce/cart-provider";
import { RelatedProducts } from "@/components/product/related-products";
import type { Product } from "@/lib/catalog/model";

const relatedProduct: Product = {
  id: "p-1", slug: "hqd-mint", sku: "HQD-1", name: "HQD מנטה", brand: "HQD",
  flavor: "מנטה", nicotineMg: 15, strengthLevel: "medium", retailPrice: 29.9,
  sourcePrice: 20, stock: 10, active: true, packSize: 1, images: ["/products/test.webp"],
  categories: ["פאוצ׳ים"],
};

it.each([
  ["balanced", "מוצרים נוספים מהקטלוג"],
  ["legacy", "לקוחות התעניינו גם"],
] as const)("preserves the %s heading and horizontal carousel behavior", (variant, heading) => {
  render(
    <CartProvider>
      <RelatedProducts products={[relatedProduct]} variant={variant} />
    </CartProvider>,
  );
  const carousel = screen.getByTestId("related-products-carousel");
  const scrollBy = vi.fn();
  Object.defineProperty(carousel, "clientWidth", { configurable: true, value: 1000 });
  carousel.scrollBy = scrollBy;

  expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "מוצרים קודמים" }));
  expect(scrollBy).toHaveBeenCalledWith({ left: 780, behavior: "smooth" });
});

it("renders nothing when no related products exist", () => {
  const { container } = render(
    <CartProvider>
      <RelatedProducts products={[]} variant="balanced" />
    </CartProvider>,
  );

  expect(container).toBeEmptyDOMElement();
});
