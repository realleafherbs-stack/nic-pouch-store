import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/data/articles";
export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return <article className="container article"><p className="eyebrow">עודכן לאחרונה · {article.updated}</p><h1>{article.title}</h1><p>{article.excerpt}</p><h2>לפני שמתחילים</h2><p>פאוצ׳ים מכילים ניקוטין — חומר ממכר. הם מיועדים לבגירים שכבר משתמשים בניקוטין, ואינם מוצר רפואי או אמצעי גמילה.</p><h2>איך קוראים את העוצמה?</h2><p>בדף המוצר אנחנו מציגים את כמות הניקוטין רק כאשר היא מופיעה בשם או במידע שסופק על המוצר. ככל שהמספר גבוה יותר, כך העוצמה עשויה להיות מורגשת יותר. כשאין מידע מאומת, איננו משלימים אותו בעצמנו.</p><h2>בחירת טעם</h2><p>אפשר להתחיל ממשפחות טעם מוכרות: מנטה וקירור, פירות, פירות טרופיים או טעמים מתוקים. הסינון בחנות מאפשר לצמצם את הבחירה לפי מותג ועוצמה.</p><h2>מקורות</h2><ul><li>נתוני היצרן והמידע המופיע על אריזת המוצר</li><li>קטלוג המוצרים המאושר של החברה</li><li>הנחיות שירות ומשלוחים של B2B MARKT LTD</li></ul><h2>מוצרים קשורים</h2><p><Link className="button" href="/shop">מעבר לחנות</Link></p></article>;
}
