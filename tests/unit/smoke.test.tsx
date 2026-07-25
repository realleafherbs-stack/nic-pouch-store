import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(store)/page";
import { CartProvider } from "@/components/commerce/cart-provider";

it("renders the store identity", async () => {
  render(<CartProvider>{await HomePage()}</CartProvider>);
  expect(
    screen.getByRole("heading", { name: "מבחר ענק של סנוס שקיקי ניקוטין ללא טבק" })
  ).toBeVisible();
});
