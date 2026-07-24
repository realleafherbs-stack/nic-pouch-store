import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { getProduct, products } from "@/lib/catalog/local-repository";
import { absoluteUrl, breadcrumbSchema, organizationName, siteName } from "@/lib/seo";

const balancedSampleSlug = "nois-דובדבן-אקסטרים-43589";

export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProduct(decodeURIComponent((await params).slug));
  if (!product) return {};
  const description = `${product.name} מבית ${product.brand}, בעוצמה ${product.nicotineMg ? `${product.nicotineMg} מ״ג` : "המופיעה על האריזה"}. החל מ־${product.retailPrice.toFixed(2)} ₪ ומשלוח חינם מעל 199 ₪.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${siteName}`,
      description,
      url: `/shop/${product.slug}`,
      images: product.images.map((image) => ({
        url: absoluteUrl(image),
        alt: `${product.name} – תמונת מוצר`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${siteName}`,
      description,
      images: product.images.map((image) => absoluteUrl(image)),
    },
  };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct(decodeURIComponent((await params).slug));
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id && (item.brand === product.brand || item.strengthLevel === product.strengthLevel)).slice(0, 4);
  const productUrl = absoluteUrl(`/shop/${product.slug}`);
  const schema = {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: `${product.name} מבית ${product.brand}. המחיר והזמינות מעודכנים בדף המוצר.`,
    image: product.images.map((image) => absoluteUrl(image)),
    sku: product.sku,
    category: "פאוצ׳ ניקוטין",
    brand: { "@type": "Brand", name: product.brand },
    manufacturer: { "@type": "Organization", name: product.brand },
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: product.retailPrice.toFixed(2),
      priceCurrency: "ILS",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: organizationName },
    },
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "דף הבית", path: "/" },
    { name: "חנות", path: "/shop" },
    { name: product.brand, path: `/brands/${product.brand.toLowerCase()}` },
    { name: product.name, path: `/shop/${product.slug}` },
  ]);
  const variant = product.slug === balancedSampleSlug ? "balanced" : "legacy";

  return (
    <>
      <JsonLd data={[schema, breadcrumbs]} />
      <ProductDetail product={product} related={related} variant={variant} />
    </>
  );
}
