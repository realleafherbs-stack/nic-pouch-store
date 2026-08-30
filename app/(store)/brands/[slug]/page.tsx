import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllProducts } from "@/lib/catalog/local-repository";
import { absoluteUrl, breadcrumbSchema, getPageSeo, mergePageSeo } from "@/lib/seo";

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
  const copy = mergePageSeo(seo, { metaTitle: primary, metaDescription: description, heading: primary, summary: description });
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
  const copy = mergePageSeo(seo, { metaTitle: heading, metaDescription: fallbackSummary, heading, summary: fallbackSummary });
  return <><JsonLd data={[itemList, breadcrumbs]} /><div className="page-hero"><div className="container"><p className="eyebrow">מותג</p><h1>{copy.heading}</h1><p>{copy.summary}</p></div></div><section className="section"><div className="container product-grid">{items.map((item) => <ProductCard key={item.id} product={item} />)}</div></section></>;
}
