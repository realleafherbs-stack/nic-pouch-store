import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { SiteUtilities } from "@/components/layout/site-utilities";

it("asks first-time visitors to choose cookies and saves their decision", () => {
  render(<SiteUtilities />);

  expect(screen.getByRole("dialog", { name: "הגדרות עוגיות" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "חיוניות בלבד" }));

  expect(window.localStorage.getItem("nic-pouch-cookie-choice")).toBe("essential");
  expect(screen.queryByRole("dialog", { name: "הגדרות עוגיות" })).not.toBeInTheDocument();
});
