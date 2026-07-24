import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { products } from "@/lib/catalog/local-repository";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return [...new Set(products.map((product) => product.brand.toLowerCase()))].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const brand = (await params).slug.toUpperCase();
  const items = products.filter((product) => product.brand === brand);
  if (!items.length) return {};
  const description = `כל מוצרי ${brand} הזמינים ב־NIC POUCH: טעמים, עוצמות, מחירים וזמינות במקום אחד.`;
  return {
    title: `פאוצ׳י ניקוטין ${brand}`,
    description,
    alternates: { canonical: `/brands/${brand.toLowerCase()}` },
    openGraph: {
      title: `פאוצ׳י ניקוטין ${brand}`,
      description,
      url: `/brands/${brand.toLowerCase()}`,
      images: [{ url: absoluteUrl(items[0].images[0]), alt: `פאוצ׳י ניקוטין ${brand}` }],
    },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const brand = (await params).slug.toUpperCase();
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
  return <><JsonLd data={[itemList, breadcrumbs]} /><div className="page-hero"><div className="container"><p className="eyebrow">מותג</p><h1>{brand}</h1><p>{`כל מוצרי ${brand} הזמינים כרגע בחנות.`}</p></div></div><section className="section"><div className="container product-grid">{items.map((item) => <ProductCard key={item.id} product={item} />)}</div></section></>;
}
