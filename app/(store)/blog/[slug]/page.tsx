import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock3, ShieldAlert } from "lucide-react";
import { articles } from "@/data/articles";

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return (
    <>
      <header className="article-hero"><div className="container"><Link href="/blog">המגזין /</Link><p className="eyebrow">מדריך NIC POUCH</p><h1>{article.title}</h1><p>{article.excerpt}</p><div><span><Clock3 />5 דקות קריאה</span><span>עודכן {article.updated}</span></div></div></header>
      <div className="container article-layout">
        <aside className="article-toc"><strong>במדריך הזה</strong><a href="#before">לפני שמתחילים</a><a href="#strength">איך קוראים עוצמה?</a><a href="#flavor">בחירת טעם</a><a href="#sources">מקורות</a></aside>
        <article className="article article-designed">
          <p className="article-lead">{article.excerpt} כאן ריכזנו את הדברים החשובים בשפה פשוטה, כדי שתוכלו להשוות בין המוצרים בלי לנחש.</p>
          <div className="article-warning"><ShieldAlert /><p><strong>18+ בלבד</strong> פאוצ׳ים מכילים ניקוטין — חומר ממכר. הם מיועדים לבגירים שכבר משתמשים בניקוטין ואינם אמצעי גמילה.</p></div>
          <h2 id="before">לפני שמתחילים</h2><p>פאוצ׳ים מגיעים במגוון מותגים, טעמים ורמות ניקוטין. לפני שבוחרים, חשוב לבדוק את הנתונים שמופיעים על האריזה ואת רמת העוצמה המוצגת בדף המוצר.</p>
          <h2 id="strength">איך קוראים את העוצמה?</h2><p>בדף המוצר אנחנו מציגים את כמות הניקוטין רק כאשר היא מופיעה בשם או במידע שסופק על המוצר. ככל שהמספר גבוה יותר, כך העוצמה עשויה להיות מורגשת יותר. כשאין מידע מאומת, איננו משלימים אותו בעצמנו.</p>
          <div className="article-scale"><span>עדין<small>עד 8 מ״ג</small></span><span>בינוני<small>9–16 מ״ג</small></span><span>חזק<small>17–30 מ״ג</small></span><span>חזק מאוד<small>31+ מ״ג</small></span></div>
          <h2 id="flavor">בחירת טעם</h2><p>אפשר להתחיל ממשפחות טעם מוכרות: מנטה וקירור, פירות, פירות טרופיים או טעמים מתוקים. הסינון בחנות מאפשר לצמצם את הבחירה לפי מותג ועוצמה.</p>
          <h2 id="sources">מקורות ושקיפות</h2><ul><li>נתוני היצרן והמידע המופיע על אריזת המוצר</li><li>קטלוג המוצרים המאושר של החברה</li><li>הנחיות השירות והמשלוחים של B2B MARKT LTD</li></ul>
          <div className="article-shop-cta"><div><strong>מצאתם את העוצמה שלכם?</strong><p>עברו לחנות וסננו לפי מותג, טעם ועוצמה.</p></div><Link className="button" href="/shop">למוצרים <ArrowLeft /></Link></div>
        </article>
      </div>
    </>
  );
}
