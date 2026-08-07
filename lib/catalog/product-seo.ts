import type { Product, StrengthLevel } from "./model";
import { linePrice, PURCHASE_QUANTITIES, unitPriceForQuantity } from "./pricing";

const strengthLabels: Record<StrengthLevel, string> = {
  mild: "עדינה",
  medium: "בינונית",
  strong: "חזקה",
  "extra-strong": "חזקה מאוד",
};

export function productStrengthLabel(product: Product) {
  return product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי סימון היצרן";
}

export function productSeoTitle(product: Product) {
  if (product.metaTitle?.trim()) return product.metaTitle.trim();
  const strength = product.nicotineMg ? `${product.nicotineMg} מ״ג` : "";
  const nameWithStrength = strength && !product.name.includes(strength)
    ? `${product.name} ${strength}`
    : product.name;
  return `${nameWithStrength} – שקיקי ניקוטין ללא טבק`;
}

export function productSeoDescription(product: Product) {
  if (product.metaDescription?.trim()) return product.metaDescription.trim();
  const flavor = product.flavor ? `בטעם ${product.flavor}` : "לפי סימון האריזה";
  const nicotine = product.nicotineMg
    ? `${product.nicotineMg} מ״ג ובעוצמה ${productStrengthLabel(product)}`
    : `ובעוצמה ${productStrengthLabel(product)}`;
  const availability = product.stock > 0 ? "זמין להזמנה" : "בדקו זמינות";
  return `${product.name} מבית ${product.brand}, שקיקי ניקוטין ללא טבק ${flavor}, ${nicotine}. ${availability} החל מ־${product.retailPrice.toFixed(2)} ₪.`;
}

export function productFaq(product: Product) {
  const strength = productStrengthLabel(product);
  const priceAnswer = PURCHASE_QUANTITIES.map((quantity) => {
    const unitPrice = unitPriceForQuantity(product, quantity);
    const total = linePrice(product, quantity);
    return `${quantity} יח׳: ${unitPrice.toFixed(2)} ₪ ליחידה, ${total.toFixed(2)} ₪ בסך הכול`;
  }).join("; ");

  return [
    {
      question: product.nicotineMg
        ? `מה משמעות ${product.nicotineMg} מ״ג במוצר?`
        : "מה משמעות רמת העוצמה במוצר?",
      answer: `${product.nicotineMg ? `${product.nicotineMg} מ״ג הם נתון הניקוטין לפי סימון המוצר. ` : ""}בסולם האתר רמת המוצר היא ${strength}.`,
    },
    {
      question: "כמה עולה יחידה בקנייה של 1, 5 או 10?",
      answer: `${priceAnswer}.`,
    },
    {
      question: "תוך כמה זמן המשלוח מגיע?",
      answer: "אספקה רגילה עד 3 ימי עסקים, בכפוף ליישוב ולחברת המשלוחים. משלוח חינם בקנייה מעל 199 ₪.",
    },
    {
      question: "כיצד שומרים את המוצר?",
      answer: "יש לשמור במקום קריר ויבש והרחק מהישג ידם של ילדים ובעלי חיים.",
    },
  ];
}
