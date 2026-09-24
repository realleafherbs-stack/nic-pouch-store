import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, breadcrumbSchema, getPageSeo, mergePageSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "סנוס ושקיקי ניקוטין: מה זה וההבדל מטבק";
  const fallbackDescription = "מה זה סנוס ושקיקי ניקוטין ללא טבק? הסבר על המונחים פאוץ׳ ושקית ניקוטין, ומה בודקים לפני בחירה באתר בישראל.";
  const seo = await getPageSeo("snus");
  const copy = mergePageSeo(seo, { metaTitle: fallbackTitle, metaDescription: fallbackDescription, heading: "מה זה סנוס?", summary: fallbackDescription, ogImage: absoluteUrl("/generated/guide-choosing-editorial-v3.jpg") });
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords: [seo.focusKeyword || "מה זה סנוס", "סנוס", "סנוסים", "סנוס ניקוטין", "שקיקי ניקוטין", "שקיקי ניקוטין ללא טבק", "פאוץ׳ ניקוטין", "סנוס ישראל"],
    alternates: { canonical: seo.canonicalUrl || "/snus" },
    robots: seo.indexable === false ? { index: false, follow: true } : undefined,
    openGraph: { type: "article", title: copy.metaTitle, description: copy.metaDescription, url: "/snus", images: [{ url: copy.ogImage!, alt: "מדריך לסנוס ושקיקי ניקוטין ללא טבק" }] },
  };
}

const faq = [
  {
    question: "מה זה סנוס?",
    answer: "סנוס מסורתי הוא מוצר שמכיל טבק ומונח מתחת לשפה. בישראל משתמשים לעיתים במילה סנוס גם כשם כללי לשקיקי ניקוטין.",
  },
  {
    question: "האם המוצרים באתר מכילים טבק?",
    answer: "לא. המוצרים המוצגים באתר הם שקיקי ניקוטין ללא טבק. נתוני כל מוצר מופיעים בדף המוצר ועל גבי האריזה.",
  },
  {
    question: "איך בוחרים בין שקיקי ניקוטין?",
    answer: "משווים את המותג, הטעם, מספר המ״ג ורמת העוצמה לפי סימון היצרן. האתר אינו נותן המלצת מינון.",
  },
  {
    question: "האם שקיקי ניקוטין מיועדים לקטינים?",
    answer: "לא. ניקוטין הוא חומר ממכר והמוצרים מיועדים לבגירים בלבד.",
  },
];

export default async function SnusPage() {
  const seo = await getPageSeo("snus");
  const copy = mergePageSeo(seo, {
    metaTitle: "סנוס ושקיקי ניקוטין: מה זה וההבדל מטבק",
    metaDescription: "הסבר ברור על סנוס, שקיקי ניקוטין ללא טבק ופאוץ׳ ניקוטין, ועל הפרטים שצריך לקרוא לפני בחירה באתר.",
    heading: "מה זה סנוס ושקיקי ניקוטין?",
    summary: "ההבדל בין סנוס מסורתי לבין שקיקי הניקוטין ללא טבק שנמכרים באתר בישראל.",
  });
  const articleUrl = absoluteUrl("/snus");
  const schema = {
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: articleUrl,
    headline: "סנוס ושקיקי ניקוטין: מה זה וההבדל מטבק",
    description: "הסבר על סנוס מסורתי ועל שקיקי ניקוטין ללא טבק שנמכרים באתר בישראל.",
    image: absoluteUrl("/generated/guide-choosing-editorial-v3.jpg"),
    datePublished: "2026-07-26",
    dateModified: "2026-07-26",
    inLanguage: "he-IL",
    author: { "@type": "Organization", "@id": `${absoluteUrl("/")}#organization`, name: "NIC POUCH" },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
  const faqSchema = {
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "דף הבית", path: "/" },
    { name: "סנוס ושקיקי ניקוטין", path: "/snus" },
  ]);

  return (
    <>
      <JsonLd data={[schema, faqSchema, breadcrumbs]} />
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow">מילון NIC POUCH</p>
          <h1>{copy.heading}</h1>
          <p>{copy.summary}</p>
        </div>
      </header>
      <article className="container article article-designed">
        <p className="article-lead">המילים ״סנוס״, ״סנוסים״ ו״סנוס ניקוטין״ משמשות בישראל גם לחיפוש שקיקי ניקוטין. חשוב להבחין בין סוגי המוצרים ולקרוא את הסימון שעל האריזה.</p>
        <h2>סנוס מסורתי לעומת שקיקי ניקוטין</h2>
        <p>סנוס מסורתי מכיל טבק. שקיקי ניקוטין מודרניים אינם מכילים טבק, אף שהם עשויים להיראות דומים ולהיות מיועדים לשימוש מתחת לשפה. כל המוצרים בחנות NIC POUCH הם שקיקי ניקוטין ללא טבק.</p>
        <h2>מה זה שקיק ניקוטין, פאוץ׳ או שקית ניקוטין?</h2>
        <p>שקיק ניקוטין, פאוץ׳ ניקוטין ושקית ניקוטין הם שמות חיפוש נפוצים לאותו סוג מוצר: שקיק קטן שמכיל ניקוטין ומיועד לשימוש לפי הוראות היצרן. השם המסחרי, הטעם והסימון משתנים בין מותגים, ולכן יש לקרוא את דף המוצר ואת האריזה.</p>
        <h2>מה מופיע בדף המוצר?</h2>
        <p>בכל דף מוצר מוצגים המותג, הטעם, נתון הניקוטין כאשר הוא מאומת, רמת העוצמה, המחיר והזמינות. אפשר לבחור יחידה אחת או כמות של 5 או 10 בהתאם למדרגות המחיר.</p>
        <h2>איך משווים בצורה נכונה?</h2>
        <p>השוו את העוצמה לפי סימון היצרן, ולאחר מכן את משפחת הטעם והמותג. הטעם אינו מעיד על כמות הניקוטין ולכן יש לבדוק את מספר המ״ג בנפרד. האתר אינו נותן המלצת מינון.</p>
        <p><Link href="/blog/strength-guide">קראו את מדריך העוצמות</Link> או עברו אל <Link href="/shop">כל שקיקי הניקוטין בחנות</Link>.</p>
        <section className="info-cta" aria-label="מעבר למוצרים">
          <div>
            <p>מוכנים לראות מוצרים זמינים?</p>
            <span>השוו מותג, טעם וסימון, ובדקו מחיר ומלאי בסל לפני התשלום.</span>
          </div>
          <Link className="button" href="/shop">למוצרים זמינים</Link>
        </section>
        <h2>שאלות נפוצות</h2>
        <div className="pd-faq">
          {faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </div>
        <h2>מקורות ומידע נוסף</h2>
        <ul>
          <li><a href="https://www.cdc.gov/tobacco/nicotine-pouches/index.html" rel="noreferrer" target="_blank">CDC — מידע על שקיקי ניקוטין</a></li>
          <li><a href="https://www.fda.gov/consumers/consumer-updates/properly-store-nicotine-pouches-prevent-accidental-exposure-children-and-pets" rel="noreferrer" target="_blank">FDA — אחסון בטוח והרחקה מילדים ומבעלי חיים</a></li>
        </ul>
        <div className="warning"><strong>אזהרה:</strong> ניקוטין הוא חומר ממכר. המוצרים מיועדים לבגירים בלבד.</div>
      </article>
    </>
  );
}
