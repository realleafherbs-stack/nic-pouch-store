"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleGauge, PackageCheck, ShieldCheck, Sparkles, Truck, ZoomIn } from "lucide-react";
import type { Product } from "@/lib/catalog/model";
import type { ProductDetailVariant } from "@/lib/catalog/product-page-variant";
import { resolveVideoEmbed } from "@/lib/catalog/video-embed";
import { LegacyProductPurchase } from "./legacy-product-purchase";
import { ProductContent } from "./product-content";
import { ProductFacts, strengthLabels } from "./product-facts";
import { ProductPurchasePanel } from "./product-purchase-panel";
import { ProductReviews } from "./product-reviews";
import { RelatedProducts } from "./related-products";

interface ProductDetailProps {
  product: Product;
  related: Product[];
  variant?: ProductDetailVariant;
}

export function ProductDetail({ product, related, variant = "legacy" }: ProductDetailProps) {
  const images = product.images.length ? product.images.slice(0, 4) : [];
  const [activeImage, setActiveImage] = useState(images[0] ?? "");

  return (
    <div className={variant === "balanced" ? "pd-balanced" : undefined}>
      <nav className="pd-breadcrumbs container" aria-label="פירורי לחם">
        <Link href="/">דף הבית</Link><span>/</span><Link href="/shop">חנות</Link><span>/</span><Link href={`/brands/${product.brand.toLowerCase()}`}>{product.brand}</Link><span>/</span><b>{product.flavor || product.name}</b>
      </nav>
      <section className="pd-main container">
        <div className="pd-gallery">
          <div className="pd-image-stage">
            <ZoomIn className="pd-zoom" aria-hidden="true" />
            {activeImage ? <img src={activeImage} alt={product.imageAlt || product.name} /> : <span className="can-placeholder">{product.brand}</span>}
          </div>
          {images.length > 1 && (
            <div className="pd-thumbs" aria-label="תמונות המוצר">
              {images.map((image, index) => (
                <button key={image} className={activeImage === image ? "active" : ""} onClick={() => setActiveImage(image)} aria-label={`הצגת תמונה ${index + 1} של ${product.name}`} aria-pressed={activeImage === image}>
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-summary">
          {variant === "balanced" ? <p className="pd-brand">{product.brand}</p> : <div className="pd-kicker"><span>{product.badge || "פופולרי"}</span><p className="pd-brand">{product.brand}</p></div>}
          <h1>{product.flavor || product.name}</h1>
          {variant === "legacy" && (
            <p className="pd-reviews">
              {product.rating
                ? <>{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))} <span>{product.rating.toFixed(1)}{product.reviewCount ? ` (${product.reviewCount} חוות דעת)` : ""}</span></>
                : <>☆ ☆ ☆ ☆ ☆ <span>אין חוות דעת עדיין</span></>}
              {product.soldCount && <span className="pd-sold-count"> · נמכרו {product.soldCount}</span>}
            </p>
          )}
          <div className="pd-price-stock"><strong>{product.retailPrice.toFixed(2)} ₪</strong><span>{product.stock > 0 ? "● במלאי" : "אזל מהמלאי"}</span></div>
          {variant === "balanced" ? <ProductFacts product={product} /> : <div className="pd-quick-facts">
            <div><CircleGauge /><strong>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "מסומן"}</strong><span>ניקוטין</span></div>
            <div><Sparkles /><strong>{product.flavor || "מקורי"}</strong><span>טעם</span></div>
            <div><ShieldCheck /><strong>{product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי היצרן"}</strong><span>עוצמה</span></div>
            <div><PackageCheck /><strong>{product.packSize > 1 ? `${product.packSize} יח׳` : "יחידה"}</strong><span>אריזה</span></div>
          </div>}
          {variant === "balanced"
            ? <ProductPurchasePanel product={product} />
            : <LegacyProductPurchase product={product} />}
        </div>
      </section>

      {variant === "balanced" ? <ProductContent product={product} /> : <section className="pd-lower container">
        <div className="pd-feature-cards">
          <div><CircleGauge /><strong>עוצמה ברורה</strong><p>{product.nicotineMg ? `${product.nicotineMg} מ״ג לפי סימון המוצר` : "בהתאם לסימון היצרן"}</p></div>
          <div><Sparkles /><strong>טעם מובחן</strong><p>{product.flavor || "הטעם מופיע על גבי האריזה"}</p></div>
          <div><PackageCheck /><strong>אריזה מקורית</strong><p>מוצר סגור ממותג {product.brand}</p></div>
          <div><Truck /><strong>משלוח מהיר</strong><p>חינם בקנייה מעל 199 ₪</p></div>
        </div>

        {(product.cardFeatures?.length || product.features?.length) ? (
          <div className="pd-feature-cards pd-extra-features">
            {product.cardFeatures?.map((feature) => <div key={feature}><Sparkles /><p>{feature}</p></div>)}
            {product.features?.map((feature) => (
              <div key={feature.title}>
                <Sparkles /><strong>{feature.title}</strong>
                {feature.subtitle && <p>{feature.subtitle}</p>}
              </div>
            ))}
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

        <div className="pd-accordions">
          <details open>
            <summary>מפרט מוצר</summary>
            <dl>
              <div><dt>מותג</dt><dd>{product.brand}</dd></div>
              <div><dt>טעם</dt><dd>{product.flavor || "לא צוין"}</dd></div>
              <div><dt>ניקוטין</dt><dd>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "לא צוין"}</dd></div>
              <div><dt>עוצמה</dt><dd>{product.strengthLevel ? strengthLabels[product.strengthLevel] : "לא צוינה"}</dd></div>
              <div><dt>אריזה</dt><dd>{product.packSize > 1 ? `מארז ${product.packSize}` : "יחידה"}</dd></div>
              <div><dt>מק״ט</dt><dd>{product.sku}</dd></div>
              {product.specs?.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}
            </dl>
          </details>
          <details>
            <summary>על המוצר</summary>
            <p>{product.description || <>{product.name} הוא מוצר של {product.brand}{product.flavor ? ` בטעם ${product.flavor}` : ""}. הנתונים בדף מבוססים על הקטלוג וסימון המוצר.</>}</p>
          </details>
          {product.inTheBox?.length ? (
            <details><summary>מה בקופסה</summary><ul>{product.inTheBox.map((item) => <li key={item}>{item}</li>)}</ul></details>
          ) : null}
          <details>
            <summary>שימוש ואחסון</summary>
            {product.usageInstructions?.length
              ? <ul>{product.usageInstructions.map((item) => <li key={item}>{item}</li>)}</ul>
              : <p>יש לשמור במקום קריר ויבש, באריזה סגורה והרחק מהישג ידם של ילדים ובעלי חיים.</p>}
          </details>
          {product.warrantyInfo?.length ? (
            <details><summary>אחריות ושירות</summary><ul>{product.warrantyInfo.map((item) => <li key={item}>{item}</li>)}</ul></details>
          ) : null}
          <details><summary>משלוחים והחזרות</summary><p>אספקה רגילה עד 3 ימי עסקים, בהתאם ליישוב ולחברת המשלוחים. משלוח חינם בקנייה מעל 199 ₪.</p></details>
          <details><summary>אזהרות ושאלות נפוצות</summary><p>ניקוטין הוא חומר ממכר. המוצר מיועד לבגירים המשתמשים בניקוטין בלבד ואינו מיועד לקטינים.</p></details>
          {product.faq?.map((item) => (
            <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>
          ))}
        </div>
        <div className="warning"><strong>אזהרה:</strong> ניקוטין הוא חומר ממכר. המוצר מיועד לבגירים בלבד.</div>
      </section>}

      <ProductReviews product={product} />
      <RelatedProducts products={related} variant={variant} />
    </div>
  );
}
