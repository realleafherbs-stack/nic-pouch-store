import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { CartProvider } from "@/components/commerce/cart-provider";
import { ProductDetail } from "@/components/product/product-detail";
import type { Product } from "@/lib/catalog/model";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

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

it("retains the legacy purchase UI and feedback outside the balanced variant", () => {
  render(<CartProvider><ProductDetail product={product} related={[]} /></CartProvider>);
  expect(screen.queryByRole("group", { name: "בחרו כמות" })).not.toBeInTheDocument();
  expect(screen.getByText("בחרו כמות")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "הגדלת כמות" }));
  expect(screen.getByText("59.80 ₪")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /הוסף לעגלה · 2/ }));
  expect(screen.getByText("נוסף לעגלה")).toBeInTheDocument();
});

it("omits the promotional delivery recommendation from legacy product pages", () => {
  render(<CartProvider><ProductDetail product={product} related={[]} /></CartProvider>);

  expect(screen.queryByText("משלוח חינם בקנייה מעל 199 ₪")).not.toBeInTheDocument();
  expect(screen.queryByText("מומלץ לשלב טעמים ועוצמות במשלוח אחד")).not.toBeInTheDocument();
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
  expect(screen.queryByRole("group", { name: "בחרו כמות" })).not.toBeInTheDocument();

  rerender(<CartProvider><ProductDetail product={product} related={[]} variant="balanced" /></CartProvider>);

  expect(screen.getByRole("heading", { name: "מידע חשוב לפני הרכישה" })).toBeInTheDocument();
  expect(screen.getByRole("group", { name: "בחרו כמות" })).toBeInTheDocument();
});

it("does not fabricate popularity or canned copy, but shows the real reviews section", () => {
  render(<CartProvider><ProductDetail product={balancedProduct} related={[]} variant="balanced" /></CartProvider>);

  expect(screen.queryByText("פופולרי")).not.toBeInTheDocument();
  expect(screen.queryByText(/מומלץ לשלב טעמים ועוצמות/)).not.toBeInTheDocument();
  expect(screen.queryByText("משלוח מהיר")).not.toBeInTheDocument();
  expect(screen.queryByText("אריזה מקורית")).not.toBeInTheDocument();
  expect(screen.queryByText("איסוף בטוח")).not.toBeInTheDocument();
  // Reviews are real now (CRM-backed, user-submittable) — this is intentional,
  // not fabricated content, unlike the claims checked above.
  expect(screen.getByRole("heading", { name: /^חוות דעת/ })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /שליחת חוות דעת/ })).toBeInTheDocument();
});

it("uses neutral related-products wording in the balanced variant", () => {
  render(<CartProvider><ProductDetail product={balancedProduct} related={[product]} variant="balanced" /></CartProvider>);

  expect(screen.getByTestId("related-products")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "מוצרים נוספים מהקטלוג" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "לקוחות התעניינו גם" })).not.toBeInTheDocument();
});

it("contains the complete approved strength, policy, guide and four-FAQ content", () => {
  render(<CartProvider><ProductDetail product={balancedProduct} related={[]} variant="balanced" /></CartProvider>);

  expect(screen.getByText(/ניקוטין הוא חומר ממכר/)).toBeInTheDocument();
  expect(screen.getByText(/מקום קריר ויבש/, { selector: ".pd-information p" })).toBeInTheDocument();
  expect(screen.getByText(/מיועד למשתמשי ניקוטין מנוסים בלבד/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "מדריך העוצמות" })).toHaveAttribute("href", "/blog/strength-guide");
  expect(screen.getByRole("link", { name: "מדריך השימוש האחראי" })).toHaveAttribute("href", "/blog/how-to-use");
  expect(screen.getByRole("link", { name: "תקנון והחזרות" })).toHaveAttribute("href", "/terms");
  expect(screen.getByText("מה משמעות 50 מ״ג במוצר?")).toBeInTheDocument();
  expect(screen.getByText("כמה עולה יחידה בקנייה של 1, 5 או 10?")).toBeInTheDocument();
  expect(screen.getByText("תוך כמה זמן המשלוח מגיע?")).toBeInTheDocument();
  expect(screen.getByText("כיצד שומרים את המוצר?")).toBeInTheDocument();
  expect(document.querySelectorAll(".pd-faq details")).toHaveLength(4);
  expect(screen.queryByText(/באריזה סגורה/)).not.toBeInTheDocument();
});

it("renders the approved CRM product copy instead of generic placeholders", () => {
  const enrichedProduct: Product = {
    ...balancedProduct,
    description: "תיאור ייחודי ומאומת שנכתב למוצר הזה.",
    features: ["ללא טבק", "טעם דובדבן לפי סימון האריזה"],
    usageInstructions: "הוראות שימוש ואחסון ייחודיות שאושרו ב־CRM.",
    warrantyInfo: "מדיניות ההחזרה המאושרת למוצר.",
  };

  render(<CartProvider><ProductDetail product={enrichedProduct} related={[]} variant="balanced" /></CartProvider>);

  expect(screen.getByText(enrichedProduct.description!)).toBeInTheDocument();
  expect(screen.getByText(enrichedProduct.usageInstructions!)).toBeInTheDocument();
  expect(screen.getByText(/מדיניות ההחזרה המאושרת למוצר/)).toBeInTheDocument();
  for (const feature of enrichedProduct.features!) {
    expect(screen.getByText(feature)).toBeInTheDocument();
  }
});

it("omits thumbnails when the product has only one image", () => {
  render(<CartProvider><ProductDetail product={balancedProduct} related={[]} variant="balanced" /></CartProvider>);

  expect(screen.queryByLabelText("תמונות המוצר")).not.toBeInTheDocument();
});

it("replaces a failed main product image with a bounded brand fallback", () => {
  render(<CartProvider><ProductDetail product={{ ...product, images: ["https://invalid.example/image.jpg"] }} related={[]} /></CartProvider>);

  fireEvent.error(screen.getByRole("img", { name: product.name }));

  expect(screen.queryByRole("img", { name: product.name })).not.toBeInTheDocument();
  expect(screen.getByTestId("product-detail-image-fallback")).toHaveTextContent("HQD");
});
