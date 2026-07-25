import Link from "next/link";
import { BrandShowcase } from "@/components/commerce/brand-showcase";
import { HomeBlog } from "@/components/commerce/home-blog";
import { QuickShop } from "@/components/commerce/quick-shop";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/lib/catalog/local-repository";

export default async function HomePage() {
  const noisProducts = products.filter((product) => product.brand === "NOIS");
  const otherProducts = products.filter((product) => product.brand !== "NOIS" && product.packSize === 1);
  const featured = [noisProducts[0], otherProducts[0], otherProducts[17], noisProducts[1], otherProducts[19], otherProducts[3]].filter(Boolean);
  return (
    <>
      <section className="hero hero-editorial">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">כל המותגים. כל הטעמים. כל החוזקים.</p>
            <h1>מבחר ענק של סנוס<br />שקיקי ניקוטין ללא טבק</h1>
            <p>בחירה קלה, הזמנה פשוטה ומשלוח מהיר.</p>
            <div className="actions"><Link className="button" href="#quick-shop">להתחיל לבחור</Link><Link className="button secondary" href="/shop">לכל המוצרים</Link></div>
          </div>
        </div>
      </section>
      <div id="quick-shop"><QuickShop products={products} /></div>
      <section className="section" id="brands">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">לבחירה מהירה</p><h2>המותגים המובילים</h2></div><Link className="text-link" href="/shop">לכל המותגים</Link></div>
          <BrandShowcase products={products} />
        </div>
      </section>
      <section className="section section-alt" id="deals">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">נבחרו בשבילכם</p><h2>הפופולריים עכשיו</h2></div><Link className="text-link" href="/shop">צפו בכל הקטלוג</Link></div>
          <div className="product-grid popular-products-grid">{featured.map((product) => <ProductCard product={product} key={product.id} />)}</div>
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
      <HomeBlog />
    </>
  );
}
