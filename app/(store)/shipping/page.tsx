import type { Metadata } from "next";
import { Calendar, Clock, MessageCircle, Wallet } from "lucide-react";
import { InfoAccordion } from "@/components/info/info-accordion";
import { InfoHero } from "@/components/info/info-hero";

export const metadata: Metadata = {
  title: "משלוחים ואספקה",
  description: "זמני אספקה, עלויות משלוח, מעקב ושירות להזמנות NIC POUCH בישראל.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <main className="container info-page">
      <InfoHero
        eyebrow="שירות"
        title="מדיניות משלוחים ואספקה"
        lede="אנחנו עושים את מרב המאמצים כדי שההזמנה שלכם תגיע במהירות ובאריזה דיסקרטית."
      />
      <InfoAccordion
        items={[
          {
            icon: Clock,
            title: "מהירות הטיפול בהזמנה",
            defaultOpen: true,
            content: <p>הזמנה שתתקבל עד השעה 14:00 ביום עסקים רגיל תטופל, ככל האפשר, עוד באותו היום ותימסר לחברת השליחויות. לאחר קליטת החבילה יישלח עדכון עם קישור למעקב למספר הטלפון שהוזן בהזמנה.</p>,
          },
          {
            icon: Calendar,
            title: "זמני אספקה",
            content: <p>זמן האספקה הוא עד 3 ימי עסקים. יום ההזמנה, ימי שישי, שבת, ערבי חג וחג אינם נספרים כימי עסקים. ביישובים מרוחקים, לרבות אילת, רמת הגולן, יישובי הערבה ואזורים שמעבר לקו הירוק, ייתכנו עיכובים.</p>,
          },
          {
            icon: Wallet,
            title: "עלות משלוח",
            content: <p>המשלוח ללא עלות בקנייה מעל 199 ₪. עלות המשלוח להזמנה נמוכה יותר תוצג בסל לפני אישור ההזמנה.</p>,
          },
          {
            icon: MessageCircle,
            title: "שירות ובירורים",
            content: <p>אם ההזמנה לא הגיעה בתוך 3 ימי עסקים או אם יש לכם שאלה, אפשר לפנות ב‑WhatsApp למספר 058-799-1094 בשעות הפעילות א׳–ה׳, 09:00–17:00.</p>,
          },
        ]}
      />
    </main>
  );
}
