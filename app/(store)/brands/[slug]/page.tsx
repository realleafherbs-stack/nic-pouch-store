import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/lib/catalog/local-repository";

export function generateStaticParams() {
  return [...new Set(products.map((product) => product.brand.toLowerCase()))].map((slug) => ({ slug }));
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const brand = (await params).slug.toUpperCase();
  const items = products.filter((product) => product.brand === brand);
  if (!items.length) notFound();
  return <><div className="page-hero"><div className="container"><p className="eyebrow">מותג</p><h1>{brand}</h1><p>{brand === "NOIS" ? "המותג שלנו, עם מגוון עוצמות וטעמים לבחירה מדויקת." : `כל מוצרי ${brand} הזמינים כרגע בחנות.`}</p></div></div><section className="section"><div className="container product-grid">{items.map((item) => <ProductCard key={item.id} product={item} />)}</div></section></>;
}
