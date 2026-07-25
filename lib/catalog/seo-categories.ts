import type { Product, StrengthLevel } from "./model";

export const flavorCategories = {
  mint: { title: "סנוס מנטה ושקיקי ניקוטין מנטה", description: "שקיקי ניקוטין ללא טבק בטעמי מנטה וקירור.", terms: ["מנטה", "mint", "spearmint", "peppermint", "ice"] },
  cherry: { title: "סנוס דובדבן ושקיקי ניקוטין דובדבן", description: "שקיקי ניקוטין ללא טבק בטעמי דובדבן.", terms: ["דובדבן", "cherry"] },
  mango: { title: "סנוס מנגו ושקיקי ניקוטין מנגו", description: "שקיקי ניקוטין ללא טבק בטעמי מנגו.", terms: ["מנגו", "mango"] },
  fruity: { title: "שקיקי ניקוטין בטעמי פירות", description: "מבחר טעמי פירות, פירות יער ופירות טרופיים.", terms: ["פטל", "אבטיח", "לימון", "לימונדה", "ענבים", "אוכמניות", "קיווי", "תפוח", "טרופי", "raspberry", "watermelon", "lemon", "grape", "berry", "kiwi", "apple", "tropical"] },
} as const;

export const strengthCategories: Record<StrengthLevel, { title: string; description: string; range: string }> = {
  mild: { title: "שקיקי ניקוטין בעוצמה עדינה", description: "מוצרים ברמת עוצמה עדינה, לפי הסימון והמידע המאומת בקטלוג.", range: "עד 8 מ״ג" },
  medium: { title: "שקיקי ניקוטין בעוצמה בינונית", description: "מוצרים ברמת עוצמה בינונית, לפי הסימון והמידע המאומת בקטלוג.", range: "9–16 מ״ג" },
  strong: { title: "שקיקי ניקוטין חזקים", description: "מוצרים ברמת עוצמה חזקה, המיועדים לבגירים שכבר משתמשים בניקוטין.", range: "17–30 מ״ג" },
  "extra-strong": { title: "שקיקי ניקוטין חזקים מאוד", description: "מוצרים ברמת עוצמה חזקה מאוד. ניקוטין הוא חומר ממכר.", range: "31+ מ״ג" },
};

export function productsForFlavor(products: Product[], slug: keyof typeof flavorCategories) {
  const terms = flavorCategories[slug].terms;
  return products.filter((product) => terms.some((term) => `${product.flavor || ""} ${product.name}`.toLowerCase().includes(term.toLowerCase())));
}
