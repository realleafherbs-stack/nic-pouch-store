import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, breadcrumbSchema, getPageSeo, mergePageSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "מה זה סנוס ומה ההבדל משקיק ניקוטין?";
  const fallbackDescription = "מהו סנוס מסורתי המכיל טבק, כיצד הוא שונה משקיק ניקוטין ללא טבק ומה חשוב לדעת על ניקוטין ואזהרות? מידע לבני 18 ומעלה.";
  const seo = await getPageSeo("snus");
  const copy = mergePageSeo({ ...seo, metaTitle: null, metaDescription: null, heading: null, summary: null }, { metaTitle: fallbackTitle, metaDescription: fallbackDescription, heading: "מה זה סנוס ומה ההבדל משקיק ניקוטין?", summary: fallbackDescription, ogImage: absoluteUrl("/generated/guide-choosing-editorial-v3.jpg") });
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
    question: "האם כל שקיק ניקוטין מכיל טבק?",
    answer: "לא בהכרח. יש לבדוק את הרכיבים ואת סיווג המוצר על האריזה או אצל היצרן; שם המוצר לבדו אינו מספיק.",
  },
  {
    question: "מה בודקים בסימון הניקוטין?",
    answer: "בודקים אם הנתון מציין מ״ג לשקיק או מ״ג לגרם. אין להשוות ביניהם בלי משקל שקיק ויחידות מאומתים.",
  },
  {
    question: "האם שקיקי ניקוטין מיועדים לקטינים?",
    answer: "לא. ניקוטין הוא חומר ממכר והמוצרים מיועדים לבגירים בלבד.",
  },
];

export default async function SnusPage() {
  const seo = await getPageSeo("snus");
  const copy = mergePageSeo({ ...seo, metaTitle: null, metaDescription: null, heading: null, summary: null }, {
    metaTitle: "מה זה סנוס ומה ההבדל משקיק ניקוטין?",
    metaDescription: "הסבר ברור על סנוס, שקיקי ניקוטין ללא טבק ופאוץ׳ ניקוטין, ועל הפרטים שצריך לקרוא לפני בחירה באתר.",
    heading: "מה זה סנוס ומה ההבדל משקיק ניקוטין?",
    summary: "מידע על ההבדל בין סנוס מסורתי לשקיקי ניקוטין ועל בדיקת הרכיבים והסימון.",
  });
  const articleUrl = absoluteUrl("/snus");
  const schema = {
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: articleUrl,
    headline: "מה זה סנוס ומה ההבדל משקיק ניקוטין?",
    description: "מידע על ההבדל בין סנוס מסורתי לשקיקי ניקוטין ועל בדיקת הרכיבים והסימון.",
    image: absoluteUrl("/generated/guide-choosing-editorial-v3.jpg"),
    datePublished: "2026-07-26",
    dateModified: "2026-11-26",
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
        <p>סנוס מסורתי מכיל טבק. שקיקי ניקוטין ללא טבק אינם מכילים טבק, אף שהם עשויים להיראות דומים ולהיות מיועדים לשימוש מתחת לשפה. יש לבדוק את הרכיבים ואת סיווג המוצר על האריזה או אצל היצרן; השם לבדו אינו מאמת את הרכבו.</p>
        <h2>מה זה שקיק ניקוטין, פאוץ׳ או שקית ניקוטין?</h2>
        <p>שקיק ניקוטין, פאוץ׳ ניקוטין ושקית ניקוטין הם שמות חיפוש נפוצים לאותו סוג מוצר: שקיק קטן שמכיל ניקוטין ומיועד לשימוש לפי הוראות היצרן. השם המסחרי, הטעם והסימון משתנים בין מותגים, ולכן יש לקרוא את דף המוצר ואת האריזה.</p>
        <h2>מה בודקים על תווית שקיק ניקוטין?</h2>
        <p>התווית עשויה לכלול את שם היצרן, הרכיבים, סימון הניקוטין ואזהרות. יש לקרוא את הסימון של המוצר המסוים ולוודא את יחידת המדידה; מספר בשם המוצר אינו מעיד לבדו על היחידה או על הרכב המוצר.</p>
        <h2>איך משווים בצורה נכונה?</h2>
        <p>בדקו את יחידת המדידה בסימון היצרן: מ״ג לשקיק מציין כמות בשקיק אחד ומ״ג לגרם מציין ריכוז לפי משקל. אין להשוות ביניהם בלי משקל שקיק ויחידות מאומתים. הטעם אינו מעיד על כמות הניקוטין ולכן יש לבדוק את מספר המ״ג בנפרד. האתר אינו נותן המלצת מינון.</p>
        <p><Link href="/blog/nicotine-pouch-guide">מה בודקים על אריזת שקיק ניקוטין</Link> · <Link href="/blog/strength-guide">קראו את מדריך העוצמות</Link> · <Link href="/blog/nicotine-label-missing-units">מה עושים כשיחידת המ״ג אינה ברורה?</Link>.</p>
        <h2>ניקוטין ואזהרות</h2>
        <p>ניקוטין ממכר. שקיקי ניקוטין אינם מיועדים למי שאינם משתמשים בניקוטין, ויש להרחיקם מילדים ומבעלי חיים. במקרה של חשיפה או בליעה יש לפנות מיד למרכז הרעלות או לשירותי חירום, לפי הנסיבות.</p>
        <p>למידע נוסף על ניקוטין ואזהרות ראו את <Link href="/nicotine-information">עמוד המידע על ניקוטין</Link>. אין להסיק מהשם או מהטעם שמוצר כלשהו בטוח.</p>
        <h2>שאלות נפוצות</h2>
        <div className="pd-faq">
          {faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </div>
        <h2>מקורות ומידע נוסף</h2>
        <ul>
          <li><a href="https://www.cdc.gov/tobacco/nicotine-pouches/index.html" rel="noreferrer" target="_blank">CDC — מידע על שקיקי ניקוטין</a></li>
          <li><a href="https://www.fda.gov/consumers/consumer-updates/properly-store-nicotine-pouches-prevent-accidental-exposure-children-and-pets" rel="noreferrer" target="_blank">FDA — אחסון בטוח והרחקה מילדים ומבעלי חיים</a></li>
        </ul>
        <div className="warning"><strong>אזהרה:</strong> ניקוטין ממכר. המידע לבני 18 ומעלה שכבר משתמשים בניקוטין בלבד; אינו מיועד למי שאינם משתמשים בניקוטין ואינו תרופת גמילה. המידע אינו ייעוץ רפואי.</div>
      </article>
    </>
  );
}
