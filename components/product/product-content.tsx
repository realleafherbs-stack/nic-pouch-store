import type { Product } from "@/lib/catalog/model";
import { strengthLabels } from "./product-facts";

export function ProductContent({ product }: { product: Product }) {
  const strength = product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי סימון היצרן";

  return (
    <section className="pd-content container" aria-label="מידע על המוצר">
      <div className="pd-specification">
        <h2>פרטי המוצר</h2>
        <dl>
          <div><dt>מותג</dt><dd>{product.brand}</dd></div>
          <div><dt>טעם</dt><dd>{product.flavor || "לא צוין"}</dd></div>
          <div><dt>ניקוטין</dt><dd>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "לפי האריזה"}</dd></div>
          <div><dt>עוצמה</dt><dd>{strength}</dd></div>
          <div><dt>מק״ט</dt><dd>{product.sku}</dd></div>
        </dl>
      </div>
      <div className="pd-information">
        <h2>מידע חשוב לפני הרכישה</h2>
        <p>{product.name} הוא מוצר של {product.brand}. נתוני הטעם, העוצמה והניקוטין בדף מבוססים על הקטלוג וסימון האריזה.</p>
        <h3>שימוש ואחסון</h3>
        <p>יש לשמור במקום קריר ויבש, באריזה סגורה והרחק מהישג ידם של ילדים ובעלי חיים.</p>
        <h3>משלוח</h3>
        <p>אספקה רגילה עד 3 ימי עסקים, בהתאם ליישוב ולחברת המשלוחים. משלוח חינם בקנייה מעל 199 ₪.</p>
      </div>
      <div className="warning"><strong>אזהרה:</strong> ניקוטין הוא חומר ממכר. המוצר מיועד לבגירים בלבד.</div>
      <div className="pd-faq">
        <h2>שאלות נפוצות</h2>
        <details><summary>מהי עוצמת המוצר?</summary><p>{strength}{product.nicotineMg ? `, ${product.nicotineMg} מ״ג לפי סימון המוצר.` : ", לפי סימון היצרן."}</p></details>
        <details><summary>מהו הטעם?</summary><p>{product.flavor || "הטעם לא צוין בקטלוג."}</p></details>
        <details><summary>כיצד שומרים את המוצר?</summary><p>במקום קריר ויבש, באריזה סגורה והרחק מילדים ובעלי חיים.</p></details>
        <details><summary>מתי המשלוח מגיע?</summary><p>אספקה רגילה עד 3 ימי עסקים, בכפוף ליישוב ולחברת המשלוחים.</p></details>
      </div>
    </section>
  );
}
