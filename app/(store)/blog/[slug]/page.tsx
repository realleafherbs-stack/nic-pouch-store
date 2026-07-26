import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock3, ShieldAlert } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { articles } from "@/data/articles";
import { absoluteUrl, breadcrumbSchema, defaultKeywords, siteName, siteUrl } from "@/lib/seo";

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    keywords: [article.primaryKeyword, ...defaultKeywords],
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      locale: "he_IL",
      url: `/blog/${article.slug}`,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.published,
      modifiedTime: article.modified,
      authors: [siteName],
      images: [{ url: absoluteUrl(article.image), alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [absoluteUrl(article.image)],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const articleUrl = absoluteUrl(`/blog/${article.slug}`);
  const schema = {
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    headline: article.title,
    description: article.excerpt,
    image: [absoluteUrl(article.image)],
    datePublished: article.published,
    dateModified: article.modified,
    inLanguage: "he-IL",
    author: { "@type": "Organization", name: siteName, url: siteUrl },
    publisher: { "@id": `${siteUrl}/#organization` },
    keywords: [article.primaryKeyword, ...defaultKeywords].join(", "),
    wordCount: article.sections.reduce(
      (total, section) =>
        total + section.paragraphs.join(" ").split(/\s+/).filter(Boolean).length,
      0,
    ),
  };
  const faqSchema = {
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "דף הבית", path: "/" },
    { name: "מדריכים", path: "/blog" },
    { name: article.title, path: `/blog/${article.slug}` },
  ]);
  return (
    <>
      <JsonLd data={[schema, faqSchema, breadcrumbs]} />
      <header className="article-hero"><div className="container"><Link href="/blog">המגזין /</Link><p className="eyebrow">מדריך NIC POUCH</p><h1>{article.title}</h1><p>{article.excerpt}</p><div><span><Clock3 />{article.readTime}</span><span>עודכן {article.updated}</span></div></div></header>
      <div className="container article-layout">
        <aside className="article-toc"><strong>במדריך הזה</strong>{article.sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}<a href="#questions">שאלות נפוצות</a><a href="#sources">מקורות</a></aside>
        <article className="article article-designed">
          <p className="article-lead">{article.excerpt} המידע מבוסס על קטלוג המוצרים, סימון האריזות והנחיות האתר.</p>
          <div className="article-warning"><ShieldAlert /><p><strong>18+ בלבד</strong> פאוצ׳ים מכילים ניקוטין — חומר ממכר. הם מיועדים לבגירים שכבר משתמשים בניקוטין ואינם אמצעי גמילה.</p></div>
          {article.sections.map((section) => (
            <section key={section.id}>
              <h2 id={section.id}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.id === "strength" && <div className="article-scale"><span>עדין<small>עד 8 מ״ג</small></span><span>בינוני<small>9–16 מ״ג</small></span><span>חזק<small>17–30 מ״ג</small></span><span>חזק מאוד<small>31+ מ״ג</small></span></div>}
            </section>
          ))}
          <h2 id="questions">שאלות נפוצות</h2>
          <div className="pd-faq">
            {article.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
          </div>
          <h2 id="sources">מקורות ושקיפות</h2><ul><li>נתוני היצרן והמידע המופיע על אריזת המוצר</li><li>קטלוג המוצרים המאושר של החברה</li><li>הנחיות השירות והמשלוחים של B2B MARKT LTD</li></ul>
          <nav className="article-related" aria-label="המשך קריאה וקנייה">
            <strong>השלב הבא</strong>
            {article.relatedLinks.map((item) => <Link href={item.href} key={item.href}>{item.label} <ArrowLeft /></Link>)}
          </nav>
          <div className="article-shop-cta"><div><strong>מוכנים להשוות מוצרים?</strong><p>עברו לחנות וסננו לפי מותג, טעם ועוצמה.</p></div><Link className="button" href="/shop">למוצרים <ArrowLeft /></Link></div>
        </article>
      </div>
    </>
  );
}
