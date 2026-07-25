import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { products } from "@/lib/catalog/local-repository";
import { strengthCategories } from "@/lib/catalog/seo-categories";
import type { StrengthLevel } from "@/lib/catalog/model";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() { return Object.keys(strengthCategories).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug as StrengthLevel;
  const category = strengthCategories[slug];
  if (!category) return {};
  return { title: category.title, description: `${category.description} ${category.range}.`, alternates: { canonical: `/strength/${slug}` } };
}
export default async function StrengthPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug as StrengthLevel;
  const category = strengthCategories[slug];
  if (!category) notFound();
  const items = products.filter((product) => product.strengthLevel === slug);
  const breadcrumbs = breadcrumbSchema([{ name: "דף הבית", path: "/" }, { name: "חנות", path: "/shop" }, { name: category.title, path: `/strength/${slug}` }]);
  const list = { "@type": "ItemList", name: category.title, numberOfItems: items.length, itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: absoluteUrl(`/shop/${item.slug}`) })) };
  return <><JsonLd data={[breadcrumbs, list]} /><header className="page-hero"><div className="container"><p className="eyebrow">בחירה לפי חוזק · {category.range}</p><h1>{category.title}</h1><p>{category.description} אם אינכם בטוחים, התחילו בעוצמה נמוכה יותר וקראו את <Link href="/blog/strength-guide">מדריך העוצמות</Link>.</p></div></header><section className="section"><div className="container product-grid">{items.map((item) => <ProductCard key={item.id} product={item} />)}</div></section></>;
}
