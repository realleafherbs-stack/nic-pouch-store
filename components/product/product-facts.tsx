import { CircleGauge, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import type { Product, StrengthLevel } from "@/lib/catalog/model";

export const strengthLabels: Record<StrengthLevel, string> = {
  mild: "עדין",
  medium: "בינוני",
  strong: "חזק",
  "extra-strong": "חזק מאוד",
};

export function ProductFacts({ product, compact = false }: { product: Product; compact?: boolean }) {
  const strength = product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי היצרן";

  return (
    <div className={`pd-quick-facts${compact ? " pd-quick-facts-compact" : ""}`} aria-label="עובדות מרכזיות">
      <div><CircleGauge /><strong>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "לפי האריזה"}</strong><span>ניקוטין</span></div>
      <div><Sparkles /><strong>{product.flavor || "לא צוין"}</strong><span>טעם</span></div>
      <div><ShieldCheck /><strong>{strength}</strong><span>עוצמה</span></div>
      <div><PackageCheck /><strong>{product.packSize > 1 ? `${product.packSize} יח׳` : "יחידה"}</strong><span>אריזה</span></div>
    </div>
  );
}
