import Link from "next/link";
import type { Product } from "@/lib/catalog/model";
import { productFaq } from "@/lib/catalog/product-seo";
import { resolveVideoEmbed } from "@/lib/catalog/video-embed";
import { strengthLabels } from "./product-facts";

export function ProductContent({ product }: { product: Product }) {
  const strength = product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי סימון היצרן";
  const faq = [...productFaq(product), ...(product.faq ?? [])];
  const usageInstructions = Array.isArray(product.usageInstructions)
    ? product.usageInstructions
    : product.usageInstructions ? [product.usageInstructions] : [];
  const warrantyInfo = Array.isArray(product.warrantyInfo)
    ? product.warrantyInfo
    : product.warrantyInfo ? [product.warrantyInfo] : [];

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
          {product.specs?.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}
        </dl>
      </div>

      {(product.cardFeatures?.length || product.features?.length) ? (
        <div className="pd-specification">
          <h2>תכונות נוספות</h2>
          <ul>
            {product.cardFeatures?.map((feature) => <li key={feature}>{feature}</li>)}
            {product.features?.map((feature) => {
              const normalized = typeof feature === "string" ? { title: feature } : feature;
              return <li key={normalized.title}>{normalized.subtitle ? `${normalized.title} — ${normalized.subtitle}` : normalized.title}</li>;
            })}
          </ul>
        </div>
      ) : null}

      {(() => {
        const video = resolveVideoEmbed(product.videoUrl);
        if (!video) return null;
        return (
          <div className="pd-video">
            {video.kind === "youtube" ? (
              <iframe src={video.url} title={`סרטון על ${product.name}`} allowFullScreen loading="lazy" />
            ) : (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={video.url} controls />
            )}
          </div>
        );
      })()}

      <div className="pd-information">
        <h2>מידע חשוב לפני הרכישה</h2>
        <p>{product.description || <>{product.name} הוא מוצר של {product.brand}. נתוני הטעם, העוצמה והניקוטין בדף מבוססים על הקטלוג וסימון האריזה.</>}</p>
        <h3>הסבר על העוצמה</h3>
        <p>{product.nicotineMg ? `${product.nicotineMg} מ״ג נמצאים` : "המוצר נמצא"} ברמת {strength} לפי סולם האתר. מוצר ברמה זו מיועד למשתמשי ניקוטין מנוסים בלבד.</p>
        {product.inTheBox?.length ? (
          <>
            <h3>מה בקופסה</h3>
            <ul>{product.inTheBox.map((item) => <li key={item}>{item}</li>)}</ul>
          </>
        ) : null}
        <h3>שימוש ואחסון</h3>
        {usageInstructions.length
          ? <ul>{usageInstructions.map((item) => <li key={item}>{item}</li>)}</ul>
          : <p>יש לשמור במקום קריר ויבש והרחק מהישג ידם של ילדים ובעלי חיים.</p>}
        {warrantyInfo.length ? (
          <>
            <h3>אחריות ושירות</h3>
            <ul>{warrantyInfo.map((item) => <li key={item}>{item}</li>)}</ul>
          </>
        ) : null}
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
