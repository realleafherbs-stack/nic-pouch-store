import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ArticlePage from "@/app/(store)/blog/[slug]/page";
import { articles } from "@/data/articles";

describe("NIC GUIDE article pages", () => {
  it.each(articles)("renders $slug from the shared guide model", async (guide) => {
    const { container } = render(await ArticlePage({ params: Promise.resolve({ slug: guide.slug }) }));

    expect(screen.getByRole("heading", { level: 1, name: guide.title })).toBeVisible();
    expect(screen.getByRole("heading", { name: "מה תדעו בסוף המדריך" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "תוכן המדריך" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "שאלות נפוצות" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "על מה המידע מבוסס?" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "סיכום קצר" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "מוצרים להמשך השוואה" })).not.toBeInTheDocument();
    expect(container.querySelector('img[src^="/products/"]')).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "לכל המוצרים" })).toHaveAttribute("href", "/shop");
    expect(screen.getByText("המדריך הבא")).toBeVisible();
  });
});
