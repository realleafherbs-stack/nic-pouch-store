import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { InfoChecklist } from "@/components/info/info-checklist";
import { InfoHero } from "@/components/info/info-hero";
import { InfoSection } from "@/components/info/info-section";

export const metadata: Metadata = { title: "מקוריות המוצרים", description: "מידע על אריזות, מקוריות וסימון מוצרי NIC POUCH.", alternates: { canonical: "/authenticity" } };

export default function AuthenticityPage() {
  return (
    <main className="container info-page">
      <InfoHero
        eyebrow="שקיפות"
        title="מקוריות המוצרים"
        lede="המוצרים נמכרים באריזות היצרן הסגורות ובהתאם למלאי הקיים. תמונות האתר נועדו לזהות את המוצר, אך ייתכנו שינויי אריזה מצד היצרן."
      />
      <InfoSection icon={PackageCheck} title="מה לבדוק בקבלת המשלוח">
        <InfoChecklist
          items={[
            "שהאריזה סגורה ולא נפגעה.",
            "ששם המותג והטעם תואמים להזמנה.",
            "שהאזהרות וסימון העוצמה מופיעים על האריזה.",
          ]}
        />
        <p style={{ marginTop: 16 }}>במקרה של אי־התאמה, אין לפתוח את המוצר ויש לפנות לשירות הלקוחות.</p>
      </InfoSection>
    </main>
  );
}
