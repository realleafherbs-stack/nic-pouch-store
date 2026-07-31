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

  it("uses original catalog product images for each guide visual", () => {
    render(<GuideCard guide={articles[1]} variant="standard" />);

    expect(screen.getByTestId("guide-visual-strength")).toBeVisible();
    expect(screen.getByTestId("guide-visual-strength").querySelectorAll("img")).toHaveLength(3);
  });

  it("composes the choosing guide from faithful catalog images", () => {
    render(<GuideCard guide={articles[0]} variant="featured" />);

    const visual = screen.getByTestId("guide-visual-beginner");
    expect(visual.querySelectorAll("img")).toHaveLength(4);
    expect(visual.querySelector("img")).toHaveAttribute("src", "/products/6923742003716-1-commerce.webp");
  });
});
