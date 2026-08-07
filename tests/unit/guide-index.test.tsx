import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { GuideIndex } from "@/components/guides/guide-index";
import { articles } from "@/data/articles";

describe("GuideIndex", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/blog");
  });

  it("shows the complete guide collection by default", () => {
    render(<GuideIndex guides={articles} />);

    expect(screen.getByRole("button", { name: "כל המדריכים" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    for (const guide of articles) {
      expect(screen.getByRole("link", { name: new RegExp(guide.title) })).toBeVisible();
    }
  });

  it("filters by category and writes a shareable URL state", () => {
    render(<GuideIndex guides={articles} />);

    fireEvent.click(screen.getByRole("button", { name: "עוצמות" }));

    expect(screen.getByRole("button", { name: "עוצמות" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("מה אומר מספר המ״ג בסנוס ובשקיקי ניקוטין?")).toBeVisible();
    expect(screen.queryByText("איך משתמשים בשקיקי ניקוטין ללא טבק?")).not.toBeInTheDocument();
    expect(window.location.search).toBe("?category=strength");
  });

  it("restores a valid category from the URL and ignores an invalid one", () => {
    window.history.replaceState({}, "", "/blog?category=use-storage");
    const { unmount } = render(<GuideIndex guides={articles} />);

    expect(screen.getByRole("button", { name: "שימוש ואחסון" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    unmount();

    window.history.replaceState({}, "", "/blog?category=unknown");
    render(<GuideIndex guides={articles} />);
    expect(screen.getByRole("button", { name: "כל המדריכים" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
