import type { Metadata } from "next";
import { ClipboardList, Cookie, Settings2, Share2, ShieldCheck, UserCheck } from "lucide-react";
import { InfoAccordion } from "@/components/info/info-accordion";
import { InfoHero } from "@/components/info/info-hero";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description: "מדיניות הפרטיות של NIC POUCH: איסוף מידע, שימוש, שמירה וזכויות המשתמשים.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="container info-page">
      <InfoHero
        eyebrow="עודכן לאחרונה · 23.07.2026"
        title="מדיניות פרטיות"
        lede="הפרטיות שלכם חשובה לנו. מדיניות זו מסבירה איזה מידע עשוי להיאסף באתר NIC POUCH, כיצד נעשה בו שימוש ומהן האפשרויות העומדות לרשותכם."
      />
      <InfoAccordion
        items={[
          {
            icon: ClipboardList,
            title: "המידע שאנחנו אוספים",
            defaultOpen: true,
            content: (
              <ul>
                <li>מידע טכני על המכשיר והדפדפן, כתובת IP ודפי האתר שבהם ביקרתם.</li>
                <li>פרטים שמסרתם לצורך הזמנה: שם, טלפון, אימייל וכתובת למשלוח.</li>
                <li>מידע הקשור להזמנה, לשירות לקוחות, לפניות ולחוות דעת.</li>
                <li>העדפות דיוור רק כאשר ניתנה הסכמה מפורשת.</li>
              </ul>
            ),
          },
          {
            icon: Settings2,
            title: "כיצד נשתמש במידע",
            content: (
              <ul>
                <li>תפעול האתר, טיפול בהזמנה, משלוח והפקת מסמכים.</li>
                <li>שליחת עדכונים תפעוליים על סטטוס ההזמנה.</li>
                <li>אבטחת האתר, מניעת הונאות ושיפור השירות.</li>
                <li>שליחת תוכן שיווקי רק בכפוף להסכמה, עם אפשרות הסרה בכל עת.</li>
              </ul>
            ),
          },
          {
            icon: Share2,
            title: "שיתוף מידע",
            content: <p>מידע יימסר לספקי תשלום, משלוחים, אחסון ומערכות תפעול רק במידה הנדרשת למתן השירות. לא נמכור מידע אישי לצדדים שלישיים לצורכי שיווק שלהם.</p>,
          },
          {
            icon: ShieldCheck,
            title: "אבטחת מידע ושמירה",
            content: <p>ננקוט אמצעים ארגוניים וטכניים סבירים להגנה על המידע. מידע יישמר רק כל עוד הוא נדרש למטרה שלשמה נאסף או לפי הוראות הדין.</p>,
          },
          {
            icon: Cookie,
            title: "עוגיות וכלי מדידה",
            content: <p>האתר עשוי להשתמש בעוגיות תפעוליות ובכלי מדידה לשיפור חוויית השימוש. חסימת עוגיות דרך הדפדפן עלולה לפגוע בחלק מהפעולות באתר.</p>,
          },
          {
            icon: UserCheck,
            title: "הזכויות שלכם",
            content: <p>ניתן לבקש לעיין במידע, לתקנו או להפסיק דיוור שיווקי, בכפוף לזיהוי ולדין. לפניות בנושא פרטיות: NIC POUCH, המרכבה 25, חולון, או דרך אמצעי הקשר באתר.</p>,
          },
        ]}
      />
    </main>
  );
}
