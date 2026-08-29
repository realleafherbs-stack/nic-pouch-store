import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { InfoChecklist } from "@/components/info/info-checklist";
import { InfoHero } from "@/components/info/info-hero";
import { InfoSection } from "@/components/info/info-section";
import { getPageSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("about");
  return {
    title: seo.metaTitle || "אודות NIC POUCH",
    description: seo.metaDescription || "מי עומד מאחורי NIC POUCH, כיצד נבחר המידע באתר ומהי מחויבותנו לשירות ולשקיפות.",
    alternates: { canonical: "/about" },
  };
}

export default function AboutPage() {
  return (
    <main className="container info-page">
      <InfoHero
        eyebrow="אודות"
        title="אודות NIC POUCH"
        lede="NIC POUCH היא חנות ישראלית המתמחה בשקיקי ניקוטין ללא טבק ממותגים מובילים, ופועלת מהמרכבה 25, חולון."
      />
      <InfoSection icon={Sparkles} title="מה חשוב לנו">
        <InfoChecklist
          items={[
            "מידע ברור המבוסס על הקטלוג וסימון היצרן.",
            "מחירים וזמינות המוצגים לפני ההזמנה.",
            "שירות אישי ומשלוח מהיר לכל הארץ.",
            "מכירה לבגירים בלבד והצגת אזהרות ניקוטין באופן בולט.",
          ]}
        />
        <p style={{ marginTop: 16 }}>המונח „סנוס” נפוץ בישראל גם עבור שקיקי ניקוטין. סנוס מסורתי מכיל טבק, ואילו המוצרים באתר הם ללא טבק, אלא אם צוין אחרת.</p>
      </InfoSection>
    </main>
  );
}
