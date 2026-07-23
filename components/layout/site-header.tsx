import Link from "next/link";
import { MobileNavigation } from "./mobile-navigation";
import { DesktopHeaderActions } from "./desktop-header-actions";

export function SiteHeader() {
  return (
    <>
      <div className="announcement" role="status">
        <span>משלוח חינם מעל 199 ₪</span><span>אספקה עד 3 ימי עסקים</span><span>מגוון מותגים מובילים</span>
      </div>
      <header className="site-header">
        <MobileNavigation />
        <div className="container header-inner">
          <Link href="/" className="figma-logo" aria-label="NIC POUCH — דף הבית">
            <img src="/figma/nic-pouch-logo.jpg" alt="NIC POUCH" />
          </Link>
          <nav aria-label="ניווט ראשי">
            <Link href="/">דף הבית</Link><Link href="/shop">כל המוצרים</Link><Link href="/#brands">מותגים</Link><Link href="/blog">המדריכים שלנו</Link><Link href="/shipping">משלוחים</Link>
          </nav>
          <DesktopHeaderActions />
        </div>
      </header>
    </>
  );
}
