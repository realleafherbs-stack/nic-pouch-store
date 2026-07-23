import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { getProduct, products } from "@/lib/catalog/local-repository";

export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProduct(decodeURIComponent((await params).slug));
  if (!product) return {};
  return { title: product.name, description: `${product.name} במחיר ${product.retailPrice.toFixed(2)} ₪. משלוח חינם מעל 199 ₪.`, alternates: { canonical: `/shop/${product.slug}` } };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct(decodeURIComponent((await params).slug));
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id && (item.brand === product.brand || item.strengthLevel === product.strengthLevel)).slice(0, 4);
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, image: product.images, sku: product.sku, brand: { "@type": "Brand", name: product.brand }, offers: { "@type": "Offer", price: product.retailPrice, priceCurrency: "ILS", availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `https://nicpouch.co.il/shop/${product.slug}` } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductDetail product={product} related={related} />
    </>
  );
}
