import { describe, expect, it } from "vitest";
import { mapCrmProducts, selectCatalogForSync } from "@/lib/catalog/crm-adapter.mjs";

const currentCatalog = [{
  id: "local-1",
  slug: "local-product",
  sku: "LOCAL-1",
  name: "מוצר מקומי",
  brand: "NOIS",
  flavor: "מנטה",
  nicotineMg: 15,
  strengthLevel: "medium",
  retailPrice: 29,
  sourcePrice: 0,
  stock: 4,
  active: true,
  packSize: 1,
  images: ["/products/local.webp"],
  categories: ["שקיקי ניקוטין"],
}];

describe("CRM catalog adapter", () => {
  it("maps a NIC POUCH CRM product into the storefront product contract", () => {
    const products = mapCrmProducts([{
      id: "crm-1",
      handle: "nois-cherry-ice",
      name: "NOIS דובדבן אקסטרים",
      price: 39.9,
      image: "https://cdn.example.com/nois-front.webp",
      images: ["https://cdn.example.com/nois-front.webp", "https://cdn.example.com/nois-side.webp"],
      payperSku: "729000000001",
      category: { name: "סנוס NOIS", slug: "snus-nois" },
      brand: "NOIS",
      gtin: "729000000001",
      stockQuantity: 12,
      description: "תיאור מוצר מאושר מה־CRM",
      metaTitle: "NOIS דובדבן אקסטרים | שקיקי ניקוטין",
      metaDescription: "תיאור מטא ייחודי ומאושר למוצר.",
      ogImage: "https://cdn.example.com/nois-og.webp",
      focusKeyword: "שקיקי ניקוטין NOIS",
      canonicalUrl: "/shop/nois-cherry-ice",
      indexable: false,
      priceTiers: [
        { minQuantity: 1, unitPrice: 39.9 },
        { minQuantity: 5, unitPrice: 38.9 },
        { minQuantity: 10, unitPrice: 37.9 },
      ],
      attributes: {
        flavor: "דובדבן אקסטרים",
        nicotineMg: 50,
        strengthLevel: "extra-strong",
        packSize: 1,
        sourcePrice: 22,
      },
    }]);

    expect(products).toEqual([expect.objectContaining({
      id: "crm-1",
      slug: "nois-cherry-ice",
      sku: "729000000001",
      brand: "NOIS",
      flavor: "דובדבן אקסטרים",
      nicotineMg: 50,
      strengthLevel: "extra-strong",
      retailPrice: 39.9,
      stock: 12,
      active: true,
      packSize: 1,
      images: ["https://cdn.example.com/nois-front.webp", "https://cdn.example.com/nois-side.webp"],
      categories: ["סנוס NOIS"],
      description: "תיאור מוצר מאושר מה־CRM",
      metaTitle: "NOIS דובדבן אקסטרים | שקיקי ניקוטין",
      metaDescription: "תיאור מטא ייחודי ומאושר למוצר.",
      ogImage: "https://cdn.example.com/nois-og.webp",
      focusKeyword: "שקיקי ניקוטין NOIS",
      canonicalUrl: "/shop/nois-cherry-ice",
      indexable: false,
      gtin: "729000000001",
    })]);
    expect(products[0].priceTiers).toHaveLength(3);
  });

  it("keeps only valid single products and derives strength when needed", () => {
    const products = mapCrmProducts([
      {
        id: "valid",
        handle: "hqd-mint",
        name: "HQD מנטה",
        price: 29.9,
        brand: "HQD",
        stockQuantity: 0,
        attributes: { nicotineMg: 15, packSize: 1 },
      },
      {
        id: "multipack",
        handle: "hqd-mint-10",
        name: "HQD מנטה מארז 10",
        price: 279,
        brand: "HQD",
        attributes: { nicotineMg: 15, packSize: 10 },
      },
      { id: "invalid", handle: "", name: "", price: -1 },
    ]);

    expect(products).toHaveLength(1);
    expect(products[0]).toEqual(expect.objectContaining({
      id: "valid",
      strengthLevel: "medium",
      stock: 0,
      packSize: 1,
    }));
  });

  it("preserves the last known catalog when CRM returns no usable products", () => {
    expect(selectCatalogForSync(currentCatalog, [])).toEqual(currentCatalog);
    expect(selectCatalogForSync(currentCatalog, [{ id: "new" }])).toEqual(currentCatalog);
  });

  it("uses the CRM catalog when at least one valid product is available", () => {
    const incoming = [{
      id: "crm-2",
      handle: "pablo-kiwi",
      name: "PABLO קיווי",
      price: 39.9,
      brand: "PABLO",
      attributes: { nicotineMg: 50, packSize: 1 },
    }];

    const selected = selectCatalogForSync(currentCatalog, incoming);
    expect(selected).toHaveLength(1);
    expect(selected[0]).toEqual(expect.objectContaining({ id: "crm-2", slug: "pablo-kiwi" }));
  });
});
