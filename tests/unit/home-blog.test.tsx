import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeBlog } from "@/components/commerce/home-blog";
import { articles } from "@/data/articles";

describe("homepage NIC GUIDE teaser", () => {
  it("uses the NIC GUIDE identity and links every current guide", () => {
    render(<HomeBlog />);

    expect(
      screen.getByRole("heading", { name: "NIC GUIDE — לדעת לפני שבוחרים" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "לכל המדריכים" })).toHaveAttribute(
      "href",
      "/blog",
    );

    for (const guide of articles) {
      expect(screen.getByRole("link", { name: new RegExp(guide.title) })).toHaveAttribute(
        "href",
        `/blog/${guide.slug}`,
      );
    }
  });
});
