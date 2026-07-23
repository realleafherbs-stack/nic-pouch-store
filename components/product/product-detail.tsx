"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CircleGauge, Minus, PackageCheck, Plus, ShieldCheck, ShoppingBag, Sparkles, Truck, ZoomIn } from "lucide-react";
import type { Product } from "@/lib/catalog/model";
import { ProductCard } from "./product-card";
import { useCart } from "@/components/commerce/cart-provider";

const strengthLabels = { mild: "עדין", medium: "בינוני", strong: "חזק", "extra-strong": "חזק מאוד" };

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const images = product.images.length ? product.images.slice(0, 4) : [];
  const [activeImage, setActiveImage] = useState(images[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { dispatch } = useCart();
  const relatedRef = useRef<HTMLDivElement>(null);

  function addToCart() {
    if (product.stock <= 0) return;
    dispatch({ type: "add", product, quantity });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function scrollRelated(direction: 1 | -1) {
    relatedRef.current?.scrollBy({ left: direction * relatedRef.current.clientWidth * 0.78, behavior: "smooth" });
  }

  return (
    <>
      <nav className="pd-breadcrumbs container" aria-label="פירורי לחם">
        <Link href="/">דף הבית</Link><span>/</span><Link href="/shop">חנות</Link><span>/</span><Link href={`/brands/${product.brand.toLowerCase()}`}>{product.brand}</Link><span>/</span><b>{product.flavor || product.name}</b>
      </nav>
      <section className="pd-main container">
        <div className="pd-gallery">
          <div className="pd-image-stage">
            <ZoomIn className="pd-zoom" aria-hidden="true" />
            {activeImage ? <img src={activeImage} alt={product.name} /> : <span className="can-placeholder">{product.brand}</span>}
          </div>
          {images.length > 0 && (
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
          <div className="pd-kicker"><span>פופולרי</span><p className="pd-brand">{product.brand}</p></div>
          <h1>{product.flavor || product.name}</h1>
          <p className="pd-reviews">☆ ☆ ☆ ☆ ☆ <span>אין חוות דעת עדיין</span></p>
          <div className="pd-price-stock"><strong>{product.retailPrice.toFixed(2)} ₪</strong><span>{product.stock > 0 ? "● במלאי" : "אזל מהמלאי"}</span></div>
          <div className="pd-offer"><strong>משלוח חינם בקנייה מעל 199 ₪</strong><span>מומלץ לשלב טעמים ועוצמות במשלוח אחד</span></div>
          <div className="pd-quick-facts">
            <div><CircleGauge /><strong>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "מסומן"}</strong><span>ניקוטין</span></div>
            <div><Sparkles /><strong>{product.flavor || "מקורי"}</strong><span>טעם</span></div>
            <div><ShieldCheck /><strong>{product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי היצרן"}</strong><span>עוצמה</span></div>
            <div><PackageCheck /><strong>{product.packSize > 1 ? `${product.packSize} יח׳` : "יחידה"}</strong><span>אריזה</span></div>
          </div>
          <div className="pd-purchase-box">
            <div className="pd-pack-choice">
              <span>בחרו כמות</span>
              <div>{([1, 5, 10] as const).map((amount) => <button key={amount} className={quantity === amount ? "active" : ""} onClick={() => setQuantity(amount)} aria-pressed={quantity === amount}><strong>{amount}</strong><small>{amount === 1 ? "יחידה" : "יחידות"}</small></button>)}</div>
            </div>
            <div className="pd-purchase-row">
              <label>כמות</label>
              <div className="pd-quantity" aria-label="בחירת כמות">
                <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="הקטנת כמות"><Minus /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((value) => value + 1)} aria-label="הגדלת כמות"><Plus /></button>
              </div>
            </div>
            <p className="pd-purchase-total"><span>סה״כ</span><strong>{(product.retailPrice * quantity).toFixed(2)} ₪</strong></p>
            <button disabled={product.stock <= 0} className="pd-add" onClick={addToCart}><ShoppingBag /> {product.stock <= 0 ? "אזל מהמלאי" : added ? "נוסף לעגלה" : `הוסף לעגלה · ${quantity}`}</button>
            <Link className="pd-buy" href="/checkout">קנה עכשיו</Link>
          </div>
          <div className="pd-service-line"><span><Truck />משלוח מהיר</span><span><ShieldCheck />אריזה מקורית</span><span><PackageCheck />איסוף בטוח</span></div>
        </div>
      </section>

      <div className="pd-mobile-purchase" aria-label="רכישה מהירה">
        <div><small>{product.brand} · {quantity} {quantity === 1 ? "יחידה" : "יחידות"}</small><strong>{(product.retailPrice * quantity).toFixed(2)} ₪</strong></div>
        <button disabled={product.stock <= 0} onClick={addToCart}><ShoppingBag /> {product.stock <= 0 ? "אזל מהמלאי" : added ? "נוסף לעגלה" : `הוספה לעגלה · ${quantity}`}</button>
      </div>

      <section className="pd-lower container">
        <div className="pd-feature-cards">
          <div><CircleGauge /><strong>עוצמה ברורה</strong><p>{product.nicotineMg ? `${product.nicotineMg} מ״ג לפי סימון המוצר` : "בהתאם לסימון היצרן"}</p></div>
          <div><Sparkles /><strong>טעם מובחן</strong><p>{product.flavor || "הטעם מופיע על גבי האריזה"}</p></div>
          <div><PackageCheck /><strong>אריזה מקורית</strong><p>מוצר סגור ממותג {product.brand}</p></div>
          <div><Truck /><strong>משלוח מהיר</strong><p>חינם בקנייה מעל 199 ₪</p></div>
        </div>
        <div className="pd-accordions">
          <details open><summary>מפרט מוצר</summary><dl><div><dt>מותג</dt><dd>{product.brand}</dd></div><div><dt>טעם</dt><dd>{product.flavor || "לא צוין"}</dd></div><div><dt>ניקוטין</dt><dd>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "לא צוין"}</dd></div><div><dt>עוצמה</dt><dd>{product.strengthLevel ? strengthLabels[product.strengthLevel] : "לא צוינה"}</dd></div><div><dt>אריזה</dt><dd>{product.packSize > 1 ? `מארז ${product.packSize}` : "יחידה"}</dd></div><div><dt>מק״ט</dt><dd>{product.sku}</dd></div></dl></details>
          <details><summary>על המוצר</summary><p>{product.name} הוא מוצר של {product.brand}{product.flavor ? ` בטעם ${product.flavor}` : ""}. הנתונים בדף מבוססים על הקטלוג וסימון המוצר.</p></details>
          <details><summary>שימוש ואחסון</summary><p>יש לשמור במקום קריר ויבש, באריזה סגורה והרחק מהישג ידם של ילדים ובעלי חיים.</p></details>
          <details><summary>משלוחים והחזרות</summary><p>אספקה רגילה עד 3 ימי עסקים, בהתאם ליישוב ולחברת המשלוחים. משלוח חינם בקנייה מעל 199 ₪.</p></details>
          <details><summary>אזהרות ושאלות נפוצות</summary><p>ניקוטין הוא חומר ממכר. המוצר מיועד לבגירים המשתמשים בניקוטין בלבד ואינו מיועד לקטינים.</p></details>
        </div>
        <div className="warning"><strong>אזהרה:</strong> ניקוטין הוא חומר ממכר. המוצר מיועד לבגירים בלבד.</div>
      </section>

      {related.length > 0 && (
        <section className="section section-alt pd-related">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">עוד מהחנות</p><h2>לקוחות התעניינו גם</h2></div>
              <div className="carousel-controls" aria-label="ניווט בין מוצרים">
                <button onClick={() => scrollRelated(1)} aria-label="מוצרים קודמים"><ChevronRight /></button>
                <button onClick={() => scrollRelated(-1)} aria-label="מוצרים הבאים"><ChevronLeft /></button>
              </div>
            </div>
            <div ref={relatedRef} className="product-carousel">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
