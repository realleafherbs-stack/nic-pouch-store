import Link from "next/link";
import { MobileNavigation } from "./mobile-navigation";
import { DesktopHeaderActions } from "./desktop-header-actions";
import { BrandLogo } from "./brand-logo";
import { AnnouncementBar } from "./announcement-bar";

export function SiteHeader() {
  const announcements = ["משלוח חינם מעל 199 ₪", "אספקה עד 3 ימי עסקים", "מגוון מותגים מובילים", "18+ בלבד"];
  return (
    <>
      <AnnouncementBar messages={announcements} />
      <MobileNavigation />
      <header className="site-header desktop-site-header">
        <div className="container header-inner">
          <Link href="/" className="figma-logo" aria-label="NIC POUCH — דף הבית">
            <BrandLogo />
          </Link>
          <nav aria-label="ניווט ראשי">
            <Link href="/shop">חנות</Link><Link href="/#brands">מותגים</Link><Link href="/flavors/mint">טעמים</Link><Link href="/blog">מדריכים</Link><Link href="/#deals">מבצעים</Link>
          </nav>
          <DesktopHeaderActions />
        </div>
      </header>
    </>
  );
}
