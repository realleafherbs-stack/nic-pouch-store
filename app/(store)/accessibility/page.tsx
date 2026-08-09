import type { Metadata } from "next";
import { Accessibility, MapPin, MessageCircle } from "lucide-react";
import { InfoChecklist } from "@/components/info/info-checklist";
import { InfoHero } from "@/components/info/info-hero";
import { InfoSection } from "@/components/info/info-section";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description: "התאמות הנגישות באתר NIC POUCH ודרכי יצירת קשר לקבלת סיוע.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <main className="container info-page">
      <InfoHero
        eyebrow="עודכן לאחרונה · 25.07.2026"
        title="הצהרת נגישות"
        lede="אנחנו רואים חשיבות במתן שירות שוויוני לכלל הלקוחות, לרבות אנשים עם מוגבלויות, ופועלים לשיפור מתמשך של חוויית הגלישה ובהתאם לתקן הישראלי ת״י 5568 ברמת AA."
      />
      <InfoSection icon={Accessibility} title="התאמות הנגישות באתר">
        <InfoChecklist
          items={[
            "מבנה היררכי של כותרות, פסקאות ורשימות.",
            "ניווט באמצעות מקלדת וקישור דילוג לתוכן.",
            "טקסט חלופי לתמונות ותוויות נגישות לרכיבים אינטראקטיביים.",
            "מצבי מיקוד גלויים והתאמה למסכים שונים.",
            "תפריט עזר להגדלת טקסט, ניגודיות, הדגשת קישורים והפחתת תנועה.",
          ]}
        />
      </InfoSection>
      <InfoSection icon={MapPin} title="הסדרי נגישות">
        <p>החברה פועלת מהמרכבה 25, חולון. נכון למועד עדכון ההצהרה אין קבלת קהל קבועה במקום, והשירות ניתן בטלפון, ב‑WhatsApp ובאימייל.</p>
      </InfoSection>
      <InfoSection icon={MessageCircle} title="נתקלתם בקושי?">
        <p>נשמח לקבל משוב ולסייע. אחראי הנגישות: רועי מזרחי. אימייל: <a href="mailto:realleafherbs@gmail.com">realleafherbs@gmail.com</a>. ניתן לפנות גם ב‑WhatsApp במספר 058-799-1094 ולציין את העמוד, המכשיר והפעולה שבהם נתקלתם בקושי.</p>
        <p>ייתכן שיתגלו רכיבים או תכנים שטרם הונגשו במלואם. אנו ממשיכים לבדוק ולשפר את האתר.</p>
      </InfoSection>
    </main>
  );
}
