import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandShowcase } from "@/components/commerce/brand-showcase";
import type { Product } from "@/lib/catalog/model";

const makeProduct = (brand: string): Product => ({
  id: brand.toLowerCase(),
  slug: `${brand.toLowerCase()}-mint`,
  sku: `${brand}-1`,
  name: `${brand} מנטה`,
  brand,
  flavor: "מנטה",
  nicotineMg: 15,
  strengthLevel: "medium",
  retailPrice: 29.9,
  sourcePrice: 20,
  stock: 10,
  active: true,
  packSize: 1,
  images: [`/products/${brand.toLowerCase()}.webp`],
  categories: ["פאוצ׳ים"],
});

describe("BrandShowcase", () => {
  it("renders one logos-only link per leading brand in the intended order", () => {
    render(<BrandShowcase products={["KILLA", "CUBA", "NOIS", "PABLO", "HQD"].map(makeProduct)} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
    expect(links.map((link) => link.getAttribute("aria-label"))).toEqual([
      "למוצרי המותג NOIS",
      "למוצרי המותג HQD",
      "למוצרי המותג PABLO",
      "למוצרי המותג KILLA",
      "למוצרי המותג CUBA",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/brands/nois",
      "/brands/hqd",
      "/brands/pablo",
      "/brands/killa",
      "/brands/cuba",
    ]);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("omits brands that are not present in the catalog", () => {
    render(<BrandShowcase products={[makeProduct("NOIS"), makeProduct("CUBA")]} />);

    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "למוצרי המותג NOIS" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "למוצרי המותג CUBA" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "למוצרי המותג PABLO" })).not.toBeInTheDocument();
  });
});
