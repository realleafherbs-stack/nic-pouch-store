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

  it("uses one product-free editorial image for each guide visual", () => {
    render(<GuideCard guide={articles[1]} variant="standard" />);

    const visual = screen.getByTestId("guide-visual-strength");
    expect(visual).toBeVisible();
    expect(visual.querySelectorAll("img")).toHaveLength(1);
    expect(visual.querySelector("img")).toHaveAttribute("src", "/generated/guide-strength-editorial-v3.jpg");
  });

  it("keeps commercial product packaging out of the choosing guide", () => {
    render(<GuideCard guide={articles[0]} variant="featured" />);

    const visual = screen.getByTestId("guide-visual-beginner");
    expect(visual.querySelectorAll("img")).toHaveLength(1);
    expect(visual.querySelector("img")).toHaveAttribute("src", "/generated/guide-choosing-editorial-v3.jpg");
    expect(visual.innerHTML).not.toMatch(/NOIS|\/products\//i);
  });
});
