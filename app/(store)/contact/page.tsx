import type { Metadata } from "next";
import { ContactForm } from "@/components/commerce/contact-form";
import { getPageSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("contact");
  return {
    title: seo.metaTitle || "צור קשר",
    description: seo.metaDescription || "יצירת קשר עם שירות הלקוחות של NIC POUCH.",
    alternates: { canonical: "/contact" },
  };
}

export default function ContactPage() {
  return (
    <main className="container article">
      <p className="eyebrow">אנחנו כאן לעזור</p>
      <h1>צור קשר</h1>
      <p>לשאלות על מוצרים, הזמנות, משלוחים או נגישות ניתן לפנות אלינו:</p>
      <ul>
        <li>WhatsApp: <a href="https://wa.me/972587991094">058-799-1094</a></li>
        <li>אימייל: <a href="mailto:realleafherbs@gmail.com">realleafherbs@gmail.com</a></li>
        <li>שעות מענה: ב׳–ה׳, 09:00–17:00</li>
        <li>כתובת: NIC POUCH, המרכבה 25, חולון</li>
      </ul>
      <p>בעת פנייה בנושא הזמנה, ציינו את מספר ההזמנה בלבד. אין לשלוח פרטי כרטיס אשראי.</p>
      <ContactForm />
    </main>
  );
}
