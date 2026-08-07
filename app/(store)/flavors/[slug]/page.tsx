import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { products } from "@/lib/catalog/local-repository";
import { flavorCategories, productsForFlavor } from "@/lib/catalog/seo-categories";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

type FlavorSlug = keyof typeof flavorCategories;
export function generateStaticParams() { return Object.keys(flavorCategories).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug as FlavorSlug;
  const category = flavorCategories[slug];
  if (!category) return {};
  return { title: category.title, description: category.description, alternates: { canonical: `/flavors/${slug}` } };
}
export default async function FlavorPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug as FlavorSlug;
  const category = flavorCategories[slug];
  if (!category) notFound();
  const items = productsForFlavor(products, slug);
  const breadcrumbs = breadcrumbSchema([{ name: "דף הבית", path: "/" }, { name: "חנות", path: "/shop" }, { name: category.title, path: `/flavors/${slug}` }]);
  const list = { "@type": "ItemList", name: category.title, numberOfItems: items.length, itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: absoluteUrl(`/shop/${item.slug}`) })) };
  return <><JsonLd data={[breadcrumbs, list]} /><header className="page-hero"><div className="container"><p className="eyebrow">בחירה לפי טעם</p><h1>{category.title}</h1><p>{category.description} הנתונים מבוססים על שמות המוצרים וסימון האריזות.</p><Link className="text-link" href="/shop">לכל המוצרים</Link></div></header><section className="section"><div className="container product-grid">{items.map((item) => <ProductCard key={item.id} product={item} />)}</div></section></>;
}
