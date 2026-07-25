import Link from "next/link";
import { LockKeyhole, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { BrandLogo } from "./brand-logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-trust">
        <div><Truck /><span><strong>משלוח מהיר</strong><small>עד 3 ימי עסקים</small></span></div>
        <div><ShieldCheck /><span><strong>מוצרים מקוריים</strong><small>באריזת היצרן</small></span></div>
        <div><LockKeyhole /><span><strong>קנייה מאובטחת</strong><small>פרטיות מלאה</small></span></div>
        <div><MessageCircle /><span><strong>שירות אישי</strong><small>אנחנו כאן לעזור</small></span></div>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand"><BrandLogo className="footer-logo" /><p>הבית הישראלי למותגי פאוצ׳ים מובילים. בחירה ברורה, מידע אמין ושירות אישי.</p><strong>18+ בלבד</strong></div>
        <div className="footer-links"><h3>חנות</h3><Link href="/shop">כל המוצרים</Link><Link href="/blog">המדריכים</Link><Link href="/faq">שאלות נפוצות</Link><Link href="/authenticity">מקוריות המוצרים</Link></div>
        <div className="footer-links"><h3>שירות ומידע</h3><Link href="/about">אודות</Link><Link href="/contact">צור קשר</Link><Link href="/shipping">משלוחים</Link><Link href="/returns">החזרות וביטולים</Link><Link href="/age-policy">אימות גיל</Link><Link href="/nicotine-information">אזהרות ניקוטין</Link><Link href="/terms">תקנון ותנאי שימוש</Link><Link href="/privacy">מדיניות פרטיות</Link><Link href="/accessibility">הצהרת נגישות</Link></div>
        <div className="footer-contact"><h3>דברו איתנו</h3><a className="footer-whatsapp" href="https://wa.me/972587991094"><MessageCircle />058-799-1094</a><p>ב׳–ה׳ 09:00–17:00</p><small>מענה מהיר ב־WhatsApp</small></div>
      </div>
      <div className="container legal-line">
        <span>© 2026 B2B MARKT LTD · המרכבה 25, חולון</span>
        <span>ניקוטין הוא חומר ממכר · מיועד לבגירים בלבד</span>
      </div>
    </footer>
  );
}
