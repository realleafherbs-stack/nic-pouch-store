import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description: "התאמות הנגישות באתר NIC POUCH ודרכי יצירת קשר לקבלת סיוע.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() { return <main className="container article"><p className="eyebrow">שירות שוויוני</p><h1>הצהרת נגישות</h1><p>אנחנו רואים חשיבות במתן שירות שוויוני לכלל הלקוחות, לרבות אנשים עם מוגבלויות, ופועלים לשיפור מתמשך של חוויית הגלישה.</p><h2>התאמות הנגישות באתר</h2><ul><li>מבנה היררכי של כותרות, פסקאות ורשימות.</li><li>ניווט מלא באמצעות מקלדת וקישור דילוג לתוכן.</li><li>טקסט חלופי לתמונות ושימוש בתוויות ARIA במקומות הנדרשים.</li><li>ניגודיות, מצבי מיקוד גלויים והתאמה למסכים שונים.</li><li>תמיכה בהגדלת תצוגת הדפדפן והעדפת הפחתת תנועה.</li></ul><h2>הנחיות שימוש</h2><p>ניתן לנווט באמצעות Tab ולהפעיל קישורים וכפתורים באמצעות Enter. אפשר להגדיל את התצוגה באמצעות Ctrl יחד עם המקשים + או −.</p><h2>נתקלתם בקושי?</h2><p>נשמח לקבל משוב ולסייע. אחראי הנגישות: רועי מזרחי. אימייל: <a href="mailto:realleafherbs@gmail.com">realleafherbs@gmail.com</a>. ניתן לפנות גם ב‑WhatsApp במספר 058-799-1094 ולציין את העמוד והפעולה שבהם נתקלתם בקושי.</p></main>; }
