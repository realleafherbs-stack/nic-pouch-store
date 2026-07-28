import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GuideCard } from "@/components/guides/guide-card";
import { GuideVisual } from "@/components/guides/guide-visual";
import { articles } from "@/data/articles";

describe("GuideCard", () => {
  it("can render the index artwork without a guide number", () => {
    render(<GuideVisual category="beginner" showLabel={false} />);

    expect(screen.getByTestId("guide-visual-beginner")).not.toHaveTextContent("01");
  });

  it.each(["featured", "standard", "compact"] as const)(
    "renders the %s variant as one descriptive article link",
    (variant) => {
      render(<GuideCard guide={articles[1]} variant={variant} />);

      const link = screen.getByRole("link", { name: /מה אומר מספר המ״ג/ });
      expect(link).toHaveAttribute("href", "/blog/strength-guide");
      expect(link.querySelectorAll("a")).toHaveLength(0);
      expect(screen.getByText("02")).toBeVisible();
      expect(screen.getByText(/עוצמות · 5 דקות/)).toBeVisible();
    },
  );

  it("uses the category visual when a guide has no raster image", () => {
    render(<GuideCard guide={articles[1]} variant="standard" />);

    expect(screen.getByTestId("guide-visual-strength")).toBeVisible();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("uses a faithful image and alt text when one is available", () => {
    render(<GuideCard guide={articles[0]} variant="featured" />);

    expect(
      screen.getByRole("img", {
        name: "איור מדריך להשוואת שקיקי ניקוטין לפי מותג, טעם ועוצמה",
      }),
    ).toHaveAttribute("src", "/generated/guide-choosing.png");
  });
});
