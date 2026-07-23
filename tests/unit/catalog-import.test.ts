import { describe, expect, it } from "vitest";
import { importCatalogRows } from "@/scripts/catalog-import";

describe("catalog import", () => {
  it("keeps only published nicotine products", () => {
    const rows = [
      { מזהה: "1", שם: "פאוץ' ניקוטין HQD מנטה 15 מ\"ג", פורסם: "1", קטגוריות: "פאוצ' ניקוטין / טבק הרחה", "מחיר רגיל": "16", "במלאי?": "1", תמונות: "https://example.com/hqd.jpg", 'מק"ט': "A" },
      { מזהה: "2", שם: "מוצר אחר", פורסם: "0", קטגוריות: "כללי", "מחיר רגיל": "10", "במלאי?": "1", תמונות: "", 'מק"ט': "B" }
    ];
    const products = importCatalogRows(rows);
    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({ brand: "HQD", nicotineMg: 15, active: true });
  });

  it("creates a retail price independently from the source price", () => {
    const [product] = importCatalogRows([
      { מזהה: "1", שם: "פאוץ' ניקוטין HQD מנטה 15 מ\"ג", פורסם: "1", קטגוריות: "פאוצ' ניקוטין / טבק הרחה", "מחיר רגיל": "16", "במלאי?": "1", תמונות: "", 'מק"ט': "A" }
    ]);
    expect(product.sourcePrice).toBe(16);
    expect(product.retailPrice).toBe(29.9);
  });
});
