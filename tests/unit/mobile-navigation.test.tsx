import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider } from "@/components/commerce/cart-provider";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

it("opens and closes the mobile menu", () => {
  render(<CartProvider><MobileNavigation /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: "פתיחת תפריט" }));
  expect(screen.getByRole("dialog", { name: "תפריט ראשי" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "סגירת תפריט" }));
  expect(screen.queryByRole("dialog", { name: "תפריט ראשי" })).not.toBeInTheDocument();
});

it("opens an empty cart drawer", () => {
  render(<CartProvider><MobileNavigation /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: "פתיחת עגלה, 0 פריטים" }));
  expect(screen.getByRole("dialog", { name: "עגלה מהירה" })).toBeInTheDocument();
  expect(screen.getByText("העגלה עדיין ריקה")).toBeInTheDocument();
});
