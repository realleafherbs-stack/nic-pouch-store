import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { getProduct, products } from "@/lib/catalog/local-repository";
import { productVariantForSlug } from "@/lib/catalog/product-page-variant";
import { absoluteUrl, breadcrumbSchema, organizationName, siteName } from "@/lib/seo";

export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProduct(decodeURIComponent((await params).slug));
  if (!product) return {};
  const seoName = `${product.name}${product.nicotineMg && !product.name.includes(`${product.nicotineMg}`) ? ` ${product.nicotineMg} מ״ג` : ""} – שקיקי ניקוטין ללא טבק`;
  const description = `${seoName} מבית ${product.brand}, בעוצמה ${product.nicotineMg ? `${product.nicotineMg} מ״ג לפי סימון המוצר` : "המופיעה על האריזה"}. החל מ־${product.retailPrice.toFixed(2)} ₪.`;
  return {
    title: seoName,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${seoName} | ${siteName}`,
      description,
      url: `/shop/${product.slug}`,
      images: product.images.map((image) => ({
        url: absoluteUrl(image),
        alt: `${product.name} – תמונת מוצר`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoName} | ${siteName}`,
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
    name: `${product.name} – שקיקי ניקוטין ללא טבק`,
    description: `${product.name} מבית ${product.brand}, שקיקי ניקוטין ללא טבק. המחיר והזמינות מעודכנים בדף המוצר.`,
    image: product.images.map((image) => absoluteUrl(image)),
    sku: product.sku,
    category: "שקיקי ניקוטין ללא טבק",
    audience: { "@type": "PeopleAudience", suggestedMinAge: 18 },
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
  const variant = productVariantForSlug(product.slug);

  return (
    <>
      <JsonLd data={[schema, breadcrumbs]} />
      <ProductDetail product={product} related={related} variant={variant} />
    </>
  );
}
