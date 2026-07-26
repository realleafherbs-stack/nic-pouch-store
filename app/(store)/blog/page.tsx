import Link from "next/link";
import { ArrowLeft, BookOpenText, Clock3, Gauge, Leaf, Search } from "lucide-react";
import { articles } from "@/data/articles";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

const articleMeta = [
  { icon: BookOpenText, category: "מדריך מקיף", readTime: "6 דקות", tone: "mint" },
  { icon: Gauge, category: "עוצמות", readTime: "4 דקות", tone: "lime" },
  { icon: Leaf, category: "שימוש אחראי", readTime: "5 דקות", tone: "sand" },
];

export const metadata = {
  title: "מדריכים על סנוס ושקיקי ניקוטין ללא טבק",
  description: "מדריכים ברורים על סנוס ושקיקי ניקוטין ללא טבק: בחירת מוצר, עוצמות מ״ג, טעמים ושימוש אחראי.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const featured = articles[0];
  const FeaturedIcon = articleMeta[0].icon;
  const itemList = {
    "@type": "ItemList",
    name: "מדריכי NIC POUCH",
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      url: absoluteUrl(`/blog/${article.slug}`),
    })),
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "דף הבית", path: "/" },
    { name: "מדריכים", path: "/blog" },
  ]);
  return (
    <>
      <JsonLd data={[itemList, breadcrumbs]} />
      <section className="blog-hero">
        <div className="container blog-hero-grid">
          <div><p className="eyebrow">ידע לפני קנייה</p><h1>המגזין של<br />NIC POUCH</h1><p>מדריכים ברורים שיעזרו להבין עוצמות, לקרוא אריזות ולבחור מוצר בצורה אחראית.</p></div>
          <div className="blog-hero-art" aria-hidden="true"><FeaturedIcon /><span>READ<br />BEFORE<br />YOU PICK</span></div>
        </div>
      </section>

      <main className="container blog-index">
        <Link className="blog-featured" href={`/blog/${featured.slug}`}>
          <div className="blog-featured-art"><FeaturedIcon /><span>01</span></div>
          <div className="blog-featured-copy"><p className="eyebrow">הכתבה המומלצת</p><h2>{featured.title}</h2><p>{featured.excerpt}</p><div><span><Clock3 />6 דקות קריאה</span><strong>לקריאה <ArrowLeft /></strong></div></div>
        </Link>

        <div className="blog-heading"><div><p className="eyebrow">להעמיק ולבחור נכון</p><h2>כל המדריכים</h2></div><Link href="/shop"><Search /> מצאו מוצר בחנות</Link></div>
        <div className="blog-card-grid">
          {articles.map((article, index) => {
            const meta = articleMeta[index];
            const Icon = meta.icon;
            return <Link className={`blog-card blog-card-${meta.tone}`} href={`/blog/${article.slug}`} key={article.slug}><div className="blog-card-art"><Icon /><b>0{index + 1}</b></div><div className="blog-card-copy"><span>{meta.category} · {meta.readTime}</span><h3>{article.title}</h3><p>{article.excerpt}</p><strong>לקריאה <ArrowLeft /></strong></div></Link>;
          })}
        </div>
        <section className="blog-cta"><div><p className="eyebrow">מוכנים לבחור?</p><h2>עברו מהידע למוצר שמתאים לכם</h2></div><Link className="button" href="/shop">לכל המוצרים</Link></section>
      </main>
    </>
  );
}
