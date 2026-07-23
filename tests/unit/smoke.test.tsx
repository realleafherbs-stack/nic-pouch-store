import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(store)/page";

it("renders the store identity", async () => {
  render(await HomePage());
  expect(
    screen.getByRole("heading", { name: "15% הנחה ברכישה ראשונה" })
  ).toBeVisible();
});
