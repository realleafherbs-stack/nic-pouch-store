import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllProducts } from "@/lib/catalog/local-repository";
import { absoluteUrl, breadcrumbSchema, getPageSeo, mergePageSeo } from "@/lib/seo";

const brandGuides: Record<string, { title: string; description: string }> = {
  NOIS: {
    title: "NOIS נויס: שקיקי ניקוטין ומידע על התווית",
    description: "מידע על שקיקי ניקוטין NOIS נויס, קריאת תווית ויחידות ניקוטין. לבני 18 ומעלה; ניקוטין ממכר.",
  },
  HQD: {
    title: "HQD: שקיקי ניקוטין ומידע על התווית",
    description: "מידע על שקיקי ניקוטין HQD, קריאת תווית ויחידות ניקוטין. לבני 18 ומעלה; ניקוטין ממכר.",
  },
};

export async function generateStaticParams() {
  const products = await getAllProducts();
  return [...new Set(products.map((product) => product.brand.toLowerCase()))].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const brand = (await params).slug.toUpperCase();
  const products = await getAllProducts();
  const items = products.filter((product) => product.brand === brand);
  if (!items.length) return {};
  const primary = brand === "HQD" ? `שקיקי ניקוטין ${brand}` : `סנוס ${brand} ושקיקי ניקוטין ${brand}`;
  const description = `${primary}: כל הטעמים, העוצמות, המחירים והזמינות במקום אחד. המוצרים ללא טבק ומיועדים לבגירים בלבד.`;
  const seo = await getPageSeo(`brands/${brand.toLowerCase()}`);
  const guide = brandGuides[brand];
  const copy = mergePageSeo(guide ? { ...seo, metaTitle: null, metaDescription: null, heading: null, summary: null } : seo, { metaTitle: guide?.title || primary, metaDescription: guide?.description || description, heading: guide?.title || primary, summary: guide?.description || description });
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: seo.canonicalUrl || `/brands/${brand.toLowerCase()}` },
    robots: seo.indexable === false ? { index: false, follow: true } : undefined,
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: `/brands/${brand.toLowerCase()}`,
      images: [{ url: copy.ogImage || absoluteUrl(items[0].images[0]), alt: copy.heading }],
    },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const brand = (await params).slug.toUpperCase();
  const products = await getAllProducts();
  const items = products.filter((product) => product.brand === brand);
  if (!items.length) notFound();
  const itemList = {
    "@type": "ItemList",
    name: `מוצרי ${brand}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/shop/${item.slug}`),
      name: item.name,
    })),
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "דף הבית", path: "/" },
    { name: "מותגים", path: "/#brands" },
    { name: brand, path: `/brands/${brand.toLowerCase()}` },
  ]);
  const heading = brand === "HQD" ? `שקיקי ניקוטין ${brand}` : `סנוס ${brand} ושקיקי ניקוטין ${brand}`;
  const fallbackSummary = `כל מוצרי ${brand} ללא טבק הזמינים כרגע בחנות, לפי טעם ועוצמה.`;
  const seo = await getPageSeo(`brands/${brand.toLowerCase()}`);
  const guide = brandGuides[brand];
  const copy = mergePageSeo(guide ? { ...seo, metaTitle: null, metaDescription: null, heading: null, summary: null } : seo, { metaTitle: guide?.title || heading, metaDescription: guide?.description || fallbackSummary, heading: guide?.title || heading, summary: guide?.description || fallbackSummary });
  const collection = guide && { "@type": "CollectionPage", name: copy.heading, description: copy.summary, url: absoluteUrl(`/brands/${brand.toLowerCase()}`), inLanguage: "he-IL", mainEntity: itemList };
  return <><JsonLd data={collection ? [collection, breadcrumbs] : [itemList, breadcrumbs]} /><div className="page-hero"><div className="container"><p className="eyebrow">מותג</p><h1>{copy.heading}</h1><p>{copy.summary}</p></div></div><section className="section"><div className="container product-grid">{items.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>{guide && <section className="container article"><h2>מה בודקים על אריזת {brand}?</h2><p>שם המוצר או הטעם לבדו אינו מאמת את הרכיבים או את כמות הניקוטין. יש לבדוק את פרטי היצרן, הרכיבים, האזהרות ויחידת המדידה על אריזת המוצר המסוים.</p><h2>מ״ג לשקיק לעומת מ״ג לגרם</h2><p>מ״ג לשקיק מציין כמות בשקיק אחד; מ״ג לגרם מציין כמות ביחס למשקל. כדי להשוות ביניהם נדרשים משקל השקיק ויחידות מאומתים. למידע נוסף ראו את <Link href="/blog/strength-guide">מדריך סימון הניקוטין</Link> ואת <Link href="/snus">ההסבר על סנוס ושקיקי ניקוטין</Link>.</p><p>המידע לבני 18 ומעלה. ניקוטין ממכר ואינו מיועד למי שאינם משתמשים בניקוטין. במקרה של חשיפה או בליעה יש לפנות למרכז הרעלות או לשירותי חירום.</p></section>}</>;
}
