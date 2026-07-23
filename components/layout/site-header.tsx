import Link from "next/link";
import { MobileNavigation } from "./mobile-navigation";
import { DesktopHeaderActions } from "./desktop-header-actions";

export function SiteHeader() {
  const announcements = ["משלוח חינם מעל 199 ₪", "אספקה עד 3 ימי עסקים", "מגוון מותגים מובילים", "18+ בלבד"];
  return (
    <>
      <div className="announcement" aria-label="הודעות החנות">
        <div className="announcement-track">
          {[0, 1].map((group) => (
            <div className="announcement-group" aria-hidden={group === 1} key={group}>
              {announcements.map((message) => <span key={`${group}-${message}`}>{message}</span>)}
            </div>
          ))}
        </div>
      </div>
      <header className="site-header">
        <MobileNavigation />
        <div className="container header-inner">
          <Link href="/" className="figma-logo" aria-label="NIC POUCH — דף הבית">
            <img src="/figma/nic-pouch-logo.jpg" alt="NIC POUCH" />
          </Link>
          <nav aria-label="ניווט ראשי">
            <Link href="/shop">חנות</Link><Link href="/#brands">מותגים</Link><Link href="/blog">מדריכים</Link><Link href="/#deals">מבצעים</Link>
          </nav>
          <DesktopHeaderActions />
        </div>
      </header>
    </>
  );
}
