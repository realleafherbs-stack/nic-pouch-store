import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  GuideCallout,
  GuideFAQ,
  GuideSources,
  GuideStrengthScale,
  GuideTakeaways,
} from "@/components/guides/guide-article-blocks";
import { GuideCard } from "@/components/guides/guide-card";
import { GuideProductRail } from "@/components/guides/guide-product-rail";
import { GuideToc } from "@/components/guides/guide-toc";
import { GuideVisual } from "@/components/guides/guide-visual";
import { JsonLd } from "@/components/seo/json-ld";
import {
  articles,
  guideBySlug,
  guideCategoryLabels,
  relatedGuidesFor,
} from "@/data/articles";
import { products } from "@/lib/catalog/local-repository";
import type { Product } from "@/lib/catalog/model";
import {
  absoluteUrl,
  breadcrumbSchema,
  defaultKeywords,
  siteName,
  siteUrl,
} from "@/lib/seo";

function formatGuideDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};

  const socialImage = guide.image
    ? [{ url: absoluteUrl(guide.image.src), alt: guide.image.alt }]
    : undefined;

  return {
    title: guide.title,
    description: guide.excerpt,
    keywords: [guide.primaryKeyword, ...defaultKeywords],
    alternates: { canonical: `/blog/${guide.slug}` },
    openGraph: {
      type: "article",
      locale: "he_IL",
      url: `/blog/${guide.slug}`,
      title: guide.title,
      description: guide.excerpt,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt ?? guide.publishedAt,
      authors: [siteName],
      images: socialImage,
    },
    twitter: {
      card: guide.image ? "summary_large_image" : "summary",
      title: guide.title,
      description: guide.excerpt,
      images: guide.image ? [absoluteUrl(guide.image.src)] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

  const guideIndex = articles.findIndex((item) => item.slug === guide.slug);
  const nextGuide = articles[(guideIndex + 1) % articles.length];
  const relatedGuides = relatedGuidesFor(guide);
  const relatedProducts = (guide.relatedProductIds ?? [])
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
  const articleUrl = absoluteUrl(`/blog/${guide.slug}`);
  const articleSchema = {
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    headline: guide.title,
    description: guide.excerpt,
    ...(guide.image ? { image: [absoluteUrl(guide.image.src)] } : {}),
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt ?? guide.publishedAt,
    inLanguage: "he-IL",
    author: { "@type": "Organization", name: siteName, url: siteUrl },
    publisher: { "@id": `${siteUrl}/#organization` },
    keywords: [guide.primaryKeyword, ...defaultKeywords].join(", "),
    wordCount: guide.sections.reduce(
      (total, section) =>
        total + section.paragraphs.join(" ").split(/\s+/).filter(Boolean).length,
      0,
    ),
  };
  const faqSchema = {
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "דף הבית", path: "/" },
    { name: "NIC GUIDE", path: "/blog" },
    { name: guide.title, path: `/blog/${guide.slug}` },
  ]);

  return (
    <div className="guide-article-page">
      <JsonLd data={[articleSchema, faqSchema, breadcrumbs]} />
      <header className="guide-article-hero">
        <div className="container guide-article-hero-grid">
          <div className="guide-article-hero-copy">
            <nav aria-label="פירורי לחם">
              <Link href="/">דף הבית</Link><span>/</span>
              <Link href="/blog">NIC GUIDE</Link><span>/</span>
              <span aria-current="page">{guideCategoryLabels[guide.category]}</span>
            </nav>
            <p className="guide-kicker">{guideCategoryLabels[guide.category]} / {guide.number}</p>
            <h1>{guide.title}</h1>
            <p>{guide.excerpt}</p>
            <div className="guide-article-meta">
              <span>{guide.readingTime} דקות קריאה</span>
              <time dateTime={guide.publishedAt}>פורסם {formatGuideDate(guide.publishedAt)}</time>
              {guide.updatedAt && (
                <time dateTime={guide.updatedAt}>עודכן {formatGuideDate(guide.updatedAt)}</time>
              )}
            </div>
          </div>
          <div className="guide-article-hero-media">
            {guide.image ? (
              <img src={guide.image.src} alt={guide.image.alt} />
            ) : (
              <GuideVisual category={guide.category} />
            )}
            <b aria-hidden="true">{guide.number}</b>
          </div>
        </div>
      </header>

      <div className="container guide-article-shell">
        <GuideToc sections={guide.sections} />
        <article className="guide-article">
          <GuideTakeaways items={guide.takeaways} />
          <GuideCallout title="18+ בלבד" tone="important">
            שקיקי ניקוטין מכילים ניקוטין — חומר ממכר. המידע במדריך מיועד
            לבגירים שכבר משתמשים בניקוטין ואינו תחליף לייעוץ רפואי.
          </GuideCallout>

          {guide.sections.map((section) => (
            <section className="guide-article-section" key={section.id}>
              <h2 id={section.id}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {guide.category === "strength" && section.id === "strength" && (
                <GuideStrengthScale />
              )}
            </section>
          ))}

          <GuideProductRail products={relatedProducts} />
          <GuideFAQ items={guide.faq} />
          <GuideSources items={guide.sources} />

          <section className="guide-summary" aria-labelledby="guide-summary-title">
            <p className="guide-kicker">לפני שממשיכים</p>
            <h2 id="guide-summary-title">סיכום קצר</h2>
            <p>{guide.excerpt} תמיד כדאי להשוות את סימון היצרן ואת פרטי המוצר המעודכנים.</p>
          </section>

          <section className="guide-article-shop-cta">
            <div>
              <p className="guide-kicker">מוכנים לבחור?</p>
              <h2>השוו לפי מותג, טעם ועוצמה</h2>
            </div>
            <Link className="button" href="/shop">לכל המוצרים</Link>
          </section>

          <nav className="guide-next" aria-label="המדריך הבא">
            <span>המדריך הבא</span>
            <Link href={`/blog/${nextGuide.slug}`}>
              <b>{nextGuide.number}</b>
              <strong>{nextGuide.title}</strong>
              <ArrowLeft aria-hidden="true" />
            </Link>
          </nav>

          <section className="guide-related" aria-labelledby="guide-related-title">
            <p className="guide-kicker">להמשיך ללמוד</p>
            <h2 id="guide-related-title">מדריכים קשורים</h2>
            <div>
              {relatedGuides.slice(0, 3).map((related) => (
                <GuideCard guide={related} variant="compact" key={related.slug} />
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
