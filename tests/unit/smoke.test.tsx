import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(store)/page";

it("renders the store identity", async () => {
  render(await HomePage());
  expect(
    screen.getByRole("heading", { name: "כל מותגי הפאוצ׳ים במקום אחד" })
  ).toBeVisible();
});
