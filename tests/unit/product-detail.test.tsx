import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider } from "@/components/commerce/cart-provider";
import { ProductDetail } from "@/components/product/product-detail";
import type { Product } from "@/lib/catalog/model";

const product: Product = {
  id: "p-1", slug: "hqd-mint", sku: "HQD-1", name: "HQD מנטה", brand: "HQD",
  flavor: "מנטה", nicotineMg: 15, strengthLevel: "medium", retailPrice: 29.9,
  sourcePrice: 20, stock: 10, active: true, packSize: 1, images: ["/products/test.webp"],
  categories: ["פאוצ׳ים"],
};

const balancedProduct: Product = {
  id: "nois-cherry", slug: "nois-cherry", sku: "NOIS-CHERRY",
  name: "NOIS דובדבן אקסטרים", brand: "NOIS", flavor: "דובדבן אקסטרים",
  nicotineMg: 50, strengthLevel: "extra-strong", retailPrice: 29,
  sourcePrice: 20, stock: 20, active: true, packSize: 1,
  images: ["/products/nois-cherry.webp"], categories: ["פאוצ׳ים"],
};

it("adds the selected quantity to the shared cart", () => {
  render(<CartProvider><ProductDetail product={product} related={[]} /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: "הגדלת כמות" }));
  expect(screen.getByText("59.80 ₪")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /הוסף לעגלה · 2/ }));
  expect(screen.getByText("נוספו 2 יחידות")).toBeInTheDocument();
});

it("renders only catalog-backed product facts", () => {
  render(<CartProvider><ProductDetail product={balancedProduct} related={[]} variant="balanced" /></CartProvider>);

  expect(screen.getAllByText("50 מ״ג").length).toBeGreaterThan(0);
  expect(screen.getAllByText("חזק מאוד").length).toBeGreaterThan(0);
  expect(screen.getByText("NOIS-CHERRY")).toBeInTheDocument();
});

it("keeps the existing layout unless the balanced variant is requested", () => {
  const { rerender } = render(<CartProvider><ProductDetail product={product} related={[]} /></CartProvider>);

  expect(screen.queryByRole("heading", { name: "מידע חשוב לפני הרכישה" })).not.toBeInTheDocument();

  rerender(<CartProvider><ProductDetail product={product} related={[]} variant="balanced" /></CartProvider>);

  expect(screen.getByRole("heading", { name: "מידע חשוב לפני הרכישה" })).toBeInTheDocument();
});

it("does not fabricate popularity, reviews or ratings", () => {
  render(<CartProvider><ProductDetail product={balancedProduct} related={[]} variant="balanced" /></CartProvider>);

  expect(screen.queryByText("פופולרי")).not.toBeInTheDocument();
  expect(screen.queryByText(/חוות דעת/)).not.toBeInTheDocument();
  expect(screen.queryByText(/☆/)).not.toBeInTheDocument();
  expect(screen.queryByText(/מומלץ לשלב טעמים ועוצמות/)).not.toBeInTheDocument();
  expect(screen.queryByText("משלוח מהיר")).not.toBeInTheDocument();
  expect(screen.queryByText("אריזה מקורית")).not.toBeInTheDocument();
  expect(screen.queryByText("איסוף בטוח")).not.toBeInTheDocument();
});

it("uses neutral related-products wording in the balanced variant", () => {
  render(<CartProvider><ProductDetail product={balancedProduct} related={[product]} variant="balanced" /></CartProvider>);

  expect(screen.getByRole("heading", { name: "מוצרים נוספים מהקטלוג" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "לקוחות התעניינו גם" })).not.toBeInTheDocument();
});

it("contains the approved warning, storage and FAQ information", () => {
  render(<CartProvider><ProductDetail product={balancedProduct} related={[]} variant="balanced" /></CartProvider>);

  expect(screen.getByText(/ניקוטין הוא חומר ממכר/)).toBeInTheDocument();
  expect(screen.getByText(/מקום קריר ויבש/, { selector: ".pd-information p" })).toBeInTheDocument();
  expect(screen.getByText("מהי עוצמת המוצר?")).toBeInTheDocument();
});
