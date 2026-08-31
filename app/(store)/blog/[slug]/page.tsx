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
import { GuideToc } from "@/components/guides/guide-toc";
import { GuideVisual } from "@/components/guides/guide-visual";
import { JsonLd } from "@/components/seo/json-ld";
import {
  articles,
  guideBySlug,
  guideCategoryLabels,
  relatedGuidesFor,
} from "@/data/articles";
import { getBlog } from "@/lib/blog";
import { blogFaqSchema } from "@/lib/blog-seo";
import {
  absoluteUrl,
  breadcrumbSchema,
  defaultKeywords,
  siteName,
  siteUrl,
} from "@/lib/seo";

function formatPostDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

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
  if (!guide) {
    const post = await getBlog(slug);
    if (!post) return {};
    return {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? undefined,
      alternates: { canonical: `/blog/${post.slug}` },
      openGraph: {
        type: "article",
        locale: "he_IL",
        url: `/blog/${post.slug}`,
        title: post.metaTitle ?? post.title,
        description: post.metaDescription ?? undefined,
        publishedTime: post.publishedAt ?? undefined,
        authors: [siteName],
        images: post.ogImage ? [{ url: absoluteUrl(post.ogImage) }] : undefined,
      },
    };
  }

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

  if (!guide) {
    const post = await getBlog(slug);
    if (!post) notFound();

    const postUrl = absoluteUrl(`/blog/${post.slug}`);
    const postSchema = {
      "@type": "BlogPosting",
      "@id": `${postUrl}#article`,
      mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      headline: post.title,
      ...(post.metaDescription ? { description: post.metaDescription } : {}),
      ...(post.ogImage ? { image: [absoluteUrl(post.ogImage)] } : {}),
      datePublished: post.publishedAt ?? undefined,
      dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
      inLanguage: "he-IL",
      author: {
        "@type": "Organization",
        name: post.authorName ?? siteName,
        url: siteUrl,
      },
      publisher: { "@id": `${siteUrl}/#organization` },
      ...(post.primaryKeyword ? { keywords: post.primaryKeyword } : {}),
      wordCount: post.body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
    };
    const postFaqSchema = blogFaqSchema(post.faq);
    const postBreadcrumbs = breadcrumbSchema([
      { name: "דף הבית", path: "/" },
      { name: "NIC GUIDE", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]);
    const postDate = formatPostDate(post.publishedAt);

    return (
      <div className="guide-article-page">
        <JsonLd data={[postSchema, ...(postFaqSchema ? [postFaqSchema] : []), postBreadcrumbs]} />
        <header className="guide-article-hero">
          <div className="container guide-article-hero-grid">
            <div className="guide-article-hero-copy">
              <nav aria-label="פירורי לחם">
                <Link href="/">דף הבית</Link><span>/</span>
                <Link href="/blog">NIC GUIDE</Link><span>/</span>
                <span aria-current="page">{post.title}</span>
              </nav>
              <p className="guide-kicker">מהבלוג</p>
              <h1>{post.title}</h1>
              {post.metaDescription && <p>{post.metaDescription}</p>}
              <div className="guide-article-meta">
                {postDate && <time dateTime={post.publishedAt ?? undefined}>פורסם {postDate}</time>}
              </div>
            </div>
            {post.featuredImage && (
              <div className="guide-article-hero-media">
                <img src={post.featuredImage} alt="" />
              </div>
            )}
          </div>
        </header>

        <div className="container blog-post-shell">
          <article className="guide-article blog-post-article">
            {post.directAnswer && (
              <GuideCallout title="התשובה הקצרה">{post.directAnswer}</GuideCallout>
            )}
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
            {post.faq && post.faq.length > 0 && <GuideFAQ items={post.faq} />}
          </article>
        </div>

        <section className="guide-store-cta">
          <div className="container">
            <div>
              <p className="guide-kicker">מוכנים לבחור?</p>
              <h2>השוו לפי מותג, טעם ועוצמה</h2>
            </div>
            <Link className="button" href="/shop">לכל המוצרים</Link>
          </div>
        </section>
      </div>
    );
  }

  const guideIndex = articles.findIndex((item) => item.slug === guide.slug);
  const nextGuide = articles[(guideIndex + 1) % articles.length];
  const relatedGuides = relatedGuidesFor(guide);
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
            <GuideVisual category={guide.category} guideSlug={guide.slug} showLabel={false} />
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
