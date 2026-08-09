import type { Metadata } from "next";
import { RotateCcw } from "lucide-react";
import { InfoChecklist } from "@/components/info/info-checklist";
import { InfoHero } from "@/components/info/info-hero";
import { InfoSection } from "@/components/info/info-section";

export const metadata: Metadata = { title: "החזרות וביטולים", description: "מדיניות החזרות וביטול הזמנה באתר NIC POUCH.", alternates: { canonical: "/returns" } };

export default function ReturnsPage() {
  return (
    <main className="container info-page">
      <InfoHero
        eyebrow="שירות"
        title="החזרות וביטולים"
        lede="בקשת ביטול או החזרה תטופל בהתאם לחוק הגנת הצרכן, לסוג המוצר ולמצבו."
      />
      <InfoSection icon={RotateCcw} title="תנאים בסיסיים">
        <InfoChecklist
          items={[
            "המוצר יוחזר סגור, ללא שימוש ובאריזתו המקורית.",
            "יש לפנות לשירות הלקוחות לפני שליחת מוצר חזרה.",
            "לא ניתן להחזיר מוצר שנפתח או שנפגעה אטימותו, בכפוף לדין.",
            "עלות ההחזרה והזיכוי ייקבעו לפי נסיבות הביטול והוראות הדין.",
          ]}
        />
      </InfoSection>
      <div className="info-cta">
        <p>לבקשת ביטול או החזרה, פנו אלינו:</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="button" href="https://wa.me/972587991094">WhatsApp · 058-799-1094</a>
          <a className="button secondary" href="mailto:realleafherbs@gmail.com">realleafherbs@gmail.com</a>
        </div>
      </div>
    </main>
  );
}
