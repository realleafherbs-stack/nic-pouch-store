import type { Metadata } from "next";
import { Ban } from "lucide-react";
import { InfoHero } from "@/components/info/info-hero";
import { InfoSection } from "@/components/info/info-section";

export const metadata: Metadata = { title: "מידע ואזהרות על ניקוטין", description: "מידע חשוב ואזהרות שימוש ביחס לשקיקי ניקוטין.", alternates: { canonical: "/nicotine-information" } };

export default function NicotineInformationPage() {
  return (
    <main className="container info-page">
      <InfoHero eyebrow="מידע חשוב" title="מידע ואזהרות על ניקוטין" />
      <div className="warning" style={{ maxWidth: 760 }}>
        <strong>ניקוטין הוא חומר ממכר.</strong> המוצרים מיועדים לבגירים שכבר משתמשים בניקוטין ואינם מוצרי גמילה או תחליף לייעוץ רפואי.
      </div>
      <InfoSection icon={Ban} title="אין להשתמש במוצר">
        <ul>
          <li>מתחת לגיל 18.</li>
          <li>בהריון או בהנקה.</li>
          <li>אם קיימת רגישות לניקוטין או מגבלה רפואית רלוונטית.</li>
        </ul>
        <p style={{ marginTop: 16 }}>יש לשמור באריזה סגורה, במקום קריר ויבש, הרחק מילדים ומבעלי חיים. במקרה של בליעה או תגובה חריגה יש לפנות לקבלת סיוע רפואי.</p>
      </InfoSection>
    </main>
  );
}
