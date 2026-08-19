import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { CartProvider } from "@/components/commerce/cart-provider";
import { GuideProductRail } from "@/components/guides/guide-product-rail";
import { getAllProducts } from "@/lib/catalog/local-repository";

it("reuses the existing commerce product card for guide recommendations", async () => {
  const products = await getAllProducts();
  render(
    <CartProvider>
      <GuideProductRail products={products.slice(0, 2)} />
    </CartProvider>,
  );

  expect(screen.getByRole("heading", { name: "מוצרים להמשך השוואה" })).toBeVisible();
  expect(screen.getAllByTestId("product-card")).toHaveLength(2);
});
