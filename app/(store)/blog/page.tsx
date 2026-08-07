import Link from "next/link";
import { GuideIndex } from "@/components/guides/guide-index";
import { GuideVisual } from "@/components/guides/guide-visual";
import { JsonLd } from "@/components/seo/json-ld";
import { articles } from "@/data/articles";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "NIC GUIDE — מדריכים על סנוס ושקיקי ניקוטין",
  description:
    "מדריכי NIC GUIDE על סנוס ושקיקי ניקוטין ללא טבק: עוצמות מ״ג, טעמים, מותגים ושימוש אחראי.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const itemList = {
    "@type": "ItemList",
    name: "NIC GUIDE",
    numberOfItems: articles.length,
    itemListElement: articles.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: absoluteUrl(`/blog/${guide.slug}`),
    })),
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "דף הבית", path: "/" },
    { name: "NIC GUIDE", path: "/blog" },
  ]);

  return (
    <>
      <JsonLd data={[itemList, breadcrumbs]} />
      <header className="guide-index-hero">
        <div className="container guide-index-hero-grid">
          <div className="guide-index-hero-copy">
            <p className="guide-kicker">NIC GUIDE / INDEX</p>
            <h1>לדעת לפני שבוחרים</h1>
            <p>מדריכים ברורים על טעמים, עוצמות ושימוש נכון.</p>
          </div>
          <div className="guide-index-hero-art" aria-hidden="true">
            <GuideVisual category="beginner" showLabel={false} />
            <span>NIC<br />GUIDE</span>
          </div>
        </div>
      </header>

      <main className="guide-index-page">
        <section className="container guide-index-content" aria-labelledby="guide-index-title">
          <div className="guide-index-heading">
            <div>
              <p className="guide-kicker">לבחור נושא ולהעמיק</p>
              <h2 id="guide-index-title">המדריכים שלנו</h2>
            </div>
            <p>מידע שימושי, ברור ואחראי — בלי להעמיס ובלי לנחש.</p>
          </div>
          <GuideIndex guides={articles} />
        </section>

        <section className="guide-store-cta">
          <div className="container">
            <div>
              <p className="guide-kicker">מהידע לבחירה</p>
              <h2>מוכנים לבחור?</h2>
            </div>
            <Link className="button" href="/shop">לכל המוצרים</Link>
          </div>
        </section>
      </main>
    </>
  );
}
