import type { Metadata } from "next";
import { UserCheck } from "lucide-react";
import { InfoHero } from "@/components/info/info-hero";
import { InfoSection } from "@/components/info/info-section";

export const metadata: Metadata = { title: "מדיניות אימות גיל", description: "מדיניות מכירה לבגירים ואימות גיל באתר NIC POUCH.", alternates: { canonical: "/age-policy" } };

export default function AgePolicyPage() {
  return (
    <main className="container info-page">
      <InfoHero
        eyebrow="18+ בלבד"
        title="מדיניות אימות גיל"
        lede="המוצרים באתר מכילים ניקוטין ומיועדים לבגירים בני 18 ומעלה בלבד. הכניסה לאתר והרכישה מותנות באישור גיל."
      />
      <InfoSection icon={UserCheck} title="אימות והגבלות">
        <p>החברה רשאית לבקש פרטים או מסמך מתאים לצורך אימות גיל, וכן לבטל הזמנה כאשר קיים חשש שהרוכש אינו בגיר.</p>
        <div className="warning"><strong>לתשומת לב:</strong> אין לרכוש עבור קטין ואין למסור את המוצרים לקטינים.</div>
      </InfoSection>
    </main>
  );
}
