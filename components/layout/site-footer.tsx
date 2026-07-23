import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><div className="logo logo-light"><span>NIC</span> POUCH</div><p>הבית הישראלי למותגי פאוצ׳ים מובילים. בחירה ברורה, מידע אמין ושירות אישי.</p></div>
        <div><h3>חנות</h3><Link href="/shop">כל המוצרים</Link><Link href="/brands/nois">NOIS</Link><Link href="/blog">מדריכים</Link></div>
        <div><h3>שירות</h3><Link href="/shipping">משלוחים</Link><Link href="/terms">תקנון</Link><Link href="/privacy">פרטיות</Link><Link href="/accessibility">נגישות</Link></div>
        <div><h3>דברו איתנו</h3><a href="https://wa.me/972587991094">WhatsApp: 058-799-1094</a><p>ב׳–ה׳ 09:00–17:00</p></div>
      </div>
      <div className="container legal-line">© 2026 B2B MARKT LTD · המרכבה 25, חולון · ניקוטין הוא חומר ממכר. מיועד לבגירים בלבד.</div>
    </footer>
  );
}
