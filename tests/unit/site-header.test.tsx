import { render, screen } from "@testing-library/react";
import { CartProvider } from "@/components/commerce/cart-provider";
import { SiteHeader } from "@/components/layout/site-header";

it("shows the primary storefront destinations", () => {
  render(<CartProvider><SiteHeader /></CartProvider>);
  expect(screen.getByRole("link", { name: "מותגים" })).toHaveAttribute("href", "/#brands");
  expect(screen.getByRole("link", { name: "מדריכים" })).toHaveAttribute("href", "/blog");
  expect(screen.getByRole("link", { name: "מבצעים" })).toHaveAttribute("href", "/#deals");
});
