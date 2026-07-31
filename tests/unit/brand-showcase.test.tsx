import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandShowcase } from "@/components/commerce/brand-showcase";
import type { Product } from "@/lib/catalog/model";

const product = (brand: string): Product => ({
  id: brand,
  slug: brand.toLowerCase(),
  sku: brand,
  name: `${brand} מנטה`,
  brand,
  flavor: "מנטה",
  nicotineMg: 15,
  strengthLevel: "medium",
  retailPrice: 29.9,
  sourcePrice: 0,
  stock: 1,
  active: true,
  packSize: 1,
  images: [`/${brand}.webp`],
  categories: [],
});

describe("BrandShowcase", () => {
  it("renders available brands as direct links without product imagery", () => {
    const { container } = render(<BrandShowcase products={[product("NOIS"), product("HQD"), product("PABLO")]} />);

    expect(screen.getByRole("link", { name: "לכל מוצרי NOIS" })).toHaveAttribute("href", "/brands/nois");
    expect(screen.getByRole("link", { name: "לכל מוצרי HQD" })).toHaveAttribute("href", "/brands/hqd");
    expect(screen.getByRole("link", { name: "לכל מוצרי PABLO" })).toHaveAttribute("href", "/brands/pablo");
    expect(container.querySelector("img")).toBeNull();
  });

  it("does not render brands that are missing from the catalog", () => {
    render(<BrandShowcase products={[product("NOIS")]} />);

    expect(screen.getByRole("link", { name: "לכל מוצרי NOIS" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "לכל מוצרי KILLA" })).not.toBeInTheDocument();
  });
});
