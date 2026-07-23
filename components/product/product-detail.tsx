"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Heart, Layers3, Minus, Plus, Share2, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import type { Product } from "@/lib/catalog/model";
import { ProductCard } from "./product-card";

const strengthLabels = { mild: "עדין", medium: "בינוני", strong: "חזק", "extra-strong": "חזק מאוד" };

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const images = product.images.length ? product.images.slice(0, 4) : [];
  const [activeImage, setActiveImage] = useState(images[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function addToCart() {
    const current = JSON.parse(localStorage.getItem("nic-cart") || "[]") as Array<{ id: string; quantity: number }>;
    const existing = current.find((line) => line.id === product.id);
    if (existing) existing.quantity += quantity;
    else current.push({ id: product.id, quantity });
    localStorage.setItem("nic-cart", JSON.stringify(current));
    setAdded(true);
  }

  return (
    <>
      <section className="pd-main container">
        <div className="pd-gallery">
          <div className="pd-image-stage">
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
          <p className="pd-brand">{product.brand}</p>
          <h1>{product.flavor || product.name}</h1>
          <p className="pd-reviews">☆ ☆ ☆ ☆ ☆ <span>אין חוות דעת עדיין</span></p>
          <div className="pd-price-stock"><strong>{product.retailPrice.toFixed(2)} ₪</strong><span>● במלאי</span></div>
          <ul className="pd-highlights">
            <li><Check /> {product.nicotineMg ? `${product.nicotineMg} מ״ג ניקוטין` : "נתוני מוצר מאומתים"}</li>
            <li><Check /> עוצמה {product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי סימון היצרן"}</li>
            <li><Check /> {product.flavor || "טעם כמפורט על האריזה"}</li>
            <li><Check /> מיועד לבגירים בלבד</li>
          </ul>
          <div className="pd-quantity" aria-label="בחירת כמות">
            <button onClick={() => setQuantity((value) => value + 1)} aria-label="הגדלת כמות"><Plus /></button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="הקטנת כמות"><Minus /></button>
          </div>
          <button className="pd-add" onClick={addToCart}><ShoppingBag /> {added ? "נוסף לסל" : "הוסף לסל"}</button>
          <Link className="pd-buy" href="/cart">קנה עכשיו</Link>
          <div className="pd-secondary"><button><Heart /> שמור למועדפים</button><button><Share2 /> שתף</button></div>
          <div className="warning"><strong>אזהרה:</strong> ניקוטין הוא חומר ממכר. המוצר מיועד לבגירים בלבד.</div>
        </div>
      </section>

      <section className="pd-benefits">
        <div className="container">
          <div><Layers3 /><strong>מבחר עוצמות</strong><p>סימון ברור של רמת הניקוטין כדי לבחור בצורה מודעת.</p></div>
          <div><Sparkles /><strong>מגוון טעמים</strong><p>טעמי מנטה, פירות וקירור ממותגים מובילים.</p></div>
          <div><ShieldCheck /><strong>מוצר סגור ומקורי</strong><p>נשלח באריזת היצרן ובהתאם לזמינות המלאי.</p></div>
          <div><ShoppingBag /><strong>משלוח מהיר</strong><p>עד 3 ימי עסקים וחינם בקנייה מעל 199 ₪.</p></div>
        </div>
      </section>

      <section className="pd-why container">
        <div className="pd-brand-visual">
          <div>{activeImage ? <img src={activeImage} alt={product.name} /> : null}</div>
          <aside><strong>{product.brand}</strong><span>NICOTINE POUCHES</span></aside>
        </div>
        <div>
          <h2>למה לבחור ב‑{product.name}?</h2>
          <p>{product.name} הוא מוצר של {product.brand}{product.flavor ? ` בטעם ${product.flavor}` : ""}. בדף זה מוצגים רק הנתונים שנמסרו בקטלוג או מופיעים בשם המוצר, כדי לאפשר בחירה ברורה ללא השלמת מידע שאינו מאומת.</p>
          <ul className="pd-checks">
            <li><Check /><span><strong>עוצמה ברורה</strong><small>{product.nicotineMg ? `${product.nicotineMg} מ״ג לפי סימון המוצר` : "לפי סימון היצרן"}</small></span></li>
            <li><Check /><span><strong>אריזה מקורית</strong><small>{product.packSize > 1 ? `מארז ${product.packSize} יחידות` : "יחידה אחת"}</small></span></li>
            <li><Check /><span><strong>מלאי זמין</strong><small>הזמנה מהירה ומשלוח לכל הארץ</small></span></li>
          </ul>
        </div>
      </section>

      <section className="pd-info container">
        <div className="pd-tabs"><button className="active">מפרט מוצר</button><button>שימוש ואחסון</button><button>משלוחים</button></div>
        <div className="pd-specs">
          <h2>פרטי מוצר</h2>
          <dl>
            <div><dt>מותג</dt><dd>{product.brand}</dd></div>
            <div><dt>טעם</dt><dd>{product.flavor || "לא צוין"}</dd></div>
            <div><dt>ניקוטין</dt><dd>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "לא צוין"}</dd></div>
            <div><dt>עוצמה</dt><dd>{product.strengthLevel ? strengthLabels[product.strengthLevel] : "לא צוינה"}</dd></div>
            <div><dt>אריזה</dt><dd>{product.packSize > 1 ? `מארז ${product.packSize}` : "יחידה"}</dd></div>
            <div><dt>מק״ט</dt><dd>{product.sku}</dd></div>
          </dl>
        </div>
      </section>

      <section className="pd-faq container">
        <h2>שאלות ותשובות</h2>
        <details><summary>למי המוצר מיועד?</summary><p>לבגירים המשתמשים בניקוטין בלבד. אינו מיועד לקטינים או למי שאינו משתמש בניקוטין.</p></details>
        <details><summary>איך שומרים את המוצר?</summary><p>במקום קריר ויבש, באריזה סגורה והרחק מהישג ידם של ילדים ובעלי חיים.</p></details>
        <details><summary>תוך כמה זמן המשלוח מגיע?</summary><p>זמן האספקה הרגיל הוא עד 3 ימי עסקים, בהתאם ליישוב ולחברת המשלוחים.</p></details>
      </section>

      {related.length > 0 && <section className="section section-alt"><div className="container"><div className="section-heading"><h2>לקוחות התעניינו גם</h2></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section>}
    </>
  );
}
