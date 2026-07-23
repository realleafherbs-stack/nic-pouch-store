import Link from "next/link";
import { MessageCircle, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { BrandShowcase } from "@/components/commerce/brand-showcase";
import { HomeBlog } from "@/components/commerce/home-blog";
import { QuickShop } from "@/components/commerce/quick-shop";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/lib/catalog/local-repository";

export default async function HomePage() {
  const noisProducts = products.filter((product) => product.brand === "NOIS");
  const otherProducts = products.filter((product) => product.brand !== "NOIS" && product.packSize === 1);
  const featured = [noisProducts[0], otherProducts[0], otherProducts[17], noisProducts[1], otherProducts[19], otherProducts[3], noisProducts[2], otherProducts[12]].filter(Boolean);
  const nois = products.filter((product) => product.brand === "NOIS").slice(0, 2);
  const heroProducts = [noisProducts[0], otherProducts[0], otherProducts[17]].filter(Boolean);
  return (
    <>
      <section className="hero hero-editorial">
        <div className="hero-word" aria-hidden="true">POUCH</div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">כל המותגים. בחירה אחת מדויקת.</p>
            <h1>מוצאים את<br />הפאוץ׳ שלך.</h1>
            <p>58 מוצרים, עוצמות וטעמים — מסודרים כדי שתגיעו לבחירה הנכונה מהר.</p>
            <div className="actions"><Link className="button" href="#quick-shop">התאמה מהירה</Link><Link className="button secondary" href="/shop">לכל החנות</Link></div>
          </div>
          <div className="hero-product-stage" aria-label="מוצרים נבחרים">
            {heroProducts.map((product, index) => product.images[0] && <img key={product.id} className={`hero-can hero-can-${index + 1}`} src={product.images[0]} alt={product.name} />)}
            <span>18+</span>
          </div>
        </div>
      </section>
      <div id="quick-shop"><QuickShop products={products} /></div>
      <section className="section">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">לבחירה מהירה</p><h2>המותגים המובילים</h2></div><Link className="text-link" href="/shop">לכל המותגים</Link></div>
          <BrandShowcase products={products} />
        </div>
      </section>
      <section className="section section-alt">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">נבחרו בשבילכם</p><h2>הפופולריים עכשיו</h2></div><Link className="text-link" href="/shop">צפו בכל הקטלוג</Link></div>
          <div className="product-grid">{featured.map((product) => <ProductCard product={product} key={product.id} />)}</div>
        </div>
      </section>
      <section className="section section-dark">
        <div className="container finder">
          <div><p className="eyebrow">פשוט למצוא את מה שמתאים</p><h2>מה העוצמה שלך?</h2><p>בחרו לפי רמת הניקוטין שמופיעה על המוצר. אם אינכם בטוחים, התחילו בעוצמה נמוכה יותר.</p><Link className="button" href="/blog/nicotine-pouch-guide">למדריך המלא</Link></div>
          <div className="strength-list">
            <Link href="/shop?strength=mild" className="strength-row"><strong>עדין</strong><span className="strength-line"/><span>עד 8 מ״ג</span></Link>
            <Link href="/shop?strength=medium" className="strength-row"><strong>בינוני</strong><span className="strength-line"/><span>9–16 מ״ג</span></Link>
            <Link href="/shop?strength=strong" className="strength-row"><strong>חזק</strong><span className="strength-line"/><span>17–30 מ״ג</span></Link>
            <Link href="/shop?strength=extra-strong" className="strength-row"><strong>חזק מאוד</strong><span className="strength-line"/><span>31+ מ״ג</span></Link>
          </div>
        </div>
      </section>
      <section className="nois">
        <div className="nois-copy"><p className="eyebrow">המותג שלנו</p><h2>הכירו את NOIS</h2><p>פאוצ׳ים שפותחו כדי לתת לכם בחירה מדויקת: שלוש עוצמות, טעמים ברורים ואריזה שמספרת בדיוק מה יש בפנים.</p><Link className="button" href="/brands/nois">לכל מוצרי NOIS</Link></div>
        <div className="nois-visual">{nois.map((product) => product.images[0] && <img key={product.id} src={product.images[0]} alt={product.name} />)}</div>
      </section>
      <HomeBlog />
      <section className="section icon-benefits"><div className="container trust-grid">
        <div><Truck /><strong>משלוח חינם</strong><span>בקנייה מעל 199 ₪</span></div>
        <div><PackageCheck /><strong>עד 3 ימי עסקים</strong><span>משלוח מהיר לכל הארץ</span></div>
        <div><ShieldCheck /><strong>קנייה מאובטחת</strong><span>תשתית מוכנה למסוף נפרד</span></div>
        <div><MessageCircle /><strong>שירות אמיתי</strong><span>זמינים גם ב‑WhatsApp</span></div>
      </div></section>
    </>
  );
}
