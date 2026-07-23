import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider } from "@/components/commerce/cart-provider";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

it("opens and closes the mobile menu", () => {
  render(<CartProvider><MobileNavigation /></CartProvider>);
  const trigger = screen.getByRole("button", { name: "פתיחת תפריט" });
  fireEvent.click(trigger);
  expect(screen.getByRole("dialog", { name: "תפריט ראשי" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "סגירת תפריט" })).toHaveFocus();
  fireEvent.click(screen.getByRole("button", { name: "סגירת תפריט" }));
  expect(screen.queryByRole("dialog", { name: "תפריט ראשי" })).not.toBeInTheDocument();
});

it("closes the menu with Escape and restores focus", async () => {
  render(<CartProvider><MobileNavigation /></CartProvider>);
  const trigger = screen.getByRole("button", { name: "פתיחת תפריט" });
  fireEvent.click(trigger);
  fireEvent.keyDown(window, { key: "Escape" });
  expect(screen.queryByRole("dialog", { name: "תפריט ראשי" })).not.toBeInTheDocument();
});

it("opens an empty cart drawer", () => {
  render(<CartProvider><MobileNavigation /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: "פתיחת עגלה, 0 פריטים" }));
  expect(screen.getByRole("dialog", { name: "עגלה מהירה" })).toBeInTheDocument();
  expect(screen.getByText("העגלה עדיין ריקה")).toBeInTheDocument();
});
