import Link from "next/link";
import type { Product } from "@/lib/catalog/model";
import { productFaq } from "@/lib/catalog/product-seo";
import { strengthLabels } from "./product-facts";

export function ProductContent({ product }: { product: Product }) {
  const strength = product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי סימון היצרן";
  const faq = productFaq(product);

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
        <h3>הסבר על העוצמה</h3>
        <p>{product.nicotineMg ? `${product.nicotineMg} מ״ג נמצאים` : "המוצר נמצא"} ברמת {strength} לפי סולם האתר. מוצר ברמה זו מיועד למשתמשי ניקוטין מנוסים בלבד.</p>
        <h3>שימוש ואחסון</h3>
        <p>יש לשמור במקום קריר ויבש והרחק מהישג ידם של ילדים ובעלי חיים.</p>
        <h3>משלוחים והחזרות</h3>
        <p>אספקה רגילה עד 3 ימי עסקים, בהתאם ליישוב ולחברת המשלוחים. משלוח חינם בקנייה מעל 199 ₪.</p>
        <p>ביטול עסקה והחזרת מוצר מתבצעים בהתאם לדין ולתנאי האתר. לפרטים המלאים ראו <Link href="/terms">תקנון והחזרות</Link>.</p>
        <p className="pd-content-links">למידע נוסף: <Link href="/blog/strength-guide">מדריך העוצמות</Link><span> · </span><Link href="/blog/how-to-use">מדריך השימוש האחראי</Link>.</p>
      </div>
      <div className="warning"><strong>אזהרה:</strong> ניקוטין הוא חומר ממכר. המוצר מיועד לבגירים בלבד.</div>
      <div className="pd-faq">
        <h2>שאלות נפוצות</h2>
        {faq.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
