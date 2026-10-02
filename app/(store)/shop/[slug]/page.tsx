import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { preconnect } from "react-dom";
import { ProductDetail } from "@/components/product/product-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllProducts, getProductByCurrentOrLegacySlug, getProduct, getProductsByIds } from "@/lib/catalog/local-repository";
import { productVariantForSlug } from "@/lib/catalog/product-page-variant";
import { retiredProductRedirectDestination } from "@/lib/catalog/retired-product-redirects";
import { productFaq, productSeoDescription, productSeoTitle, productStrengthLabel } from "@/lib/catalog/product-seo";
import { absoluteUrl, breadcrumbSchema, defaultKeywords, organizationName, siteName, siteUrl } from "@/lib/seo";

// Historic Hebrew product URLs can arrive percent-encoded. Rendering this
// route dynamically prevents Next from placing those raw characters in its
// static cache-tag response header before the canonical redirect is returned.
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.flatMap(({ slug, legacySlugs = [] }) => [slug, ...legacySlugs]).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProductByCurrentOrLegacySlug(decodeURIComponent((await params).slug));
  if (!product) return {};
  const seoName = productSeoTitle(product);
  const description = productSeoDescription(product);
  const socialImages = product.ogImage ? [product.ogImage] : product.images;
  return {
    title: seoName,
    description,
    keywords: [
      product.name,
      product.brand,
      product.flavor ?? "",
      product.nicotineMg ? `${product.nicotineMg} מ״ג` : "",
      `שקיקי ניקוטין ${product.brand}`,
      `סנוס ${product.brand}`,
      ...defaultKeywords,
    ].filter(Boolean),
    alternates: { canonical: `/shop/${product.slug}` },
    robots: product.indexable === false ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      title: `${seoName} | ${siteName}`,
      description,
      url: `/shop/${product.slug}`,
      images: socialImages.map((image) => ({
        url: absoluteUrl(image),
        alt: `${product.name} – תמונת מוצר`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoName} | ${siteName}`,
      description,
      images: socialImages.map((image) => absoluteUrl(image)),
    },
  };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const requestedSlug = decodeURIComponent((await params).slug);
  const retiredDestination = retiredProductRedirectDestination(requestedSlug);
  if (retiredDestination) permanentRedirect(retiredDestination);
  const product = await getProductByCurrentOrLegacySlug(requestedSlug);
  if (!product) notFound();
  if (requestedSlug !== product.slug) permanentRedirect(`/shop/${product.slug}`);
  const primaryImage = product.images[0];
  if (primaryImage) {
    try {
      const imageOrigin = new URL(primaryImage, siteUrl).origin;
      if (imageOrigin !== siteUrl) preconnect(imageOrigin, { crossOrigin: "anonymous" });
    } catch {
      // A malformed catalog image must never prevent the product page from rendering.
    }
  }
  const curatedRelated = product.relatedProductIds?.length
    ? (await getProductsByIds(product.relatedProductIds)).filter((item) => item.id !== product.id)
    : [];
  const products = await getAllProducts();
  const sameBrand = products.filter((item) => item.id !== product.id && item.brand === product.brand);
  const sameStrengthOtherBrand = products.filter(
    (item) => item.id !== product.id && item.brand !== product.brand && item.strengthLevel === product.strengthLevel,
  );
  const related = curatedRelated.length
    ? curatedRelated.slice(0, 4)
    : [...sameBrand, ...sameStrengthOtherBrand].slice(0, 4);
  const productUrl = absoluteUrl(`/shop/${product.slug}`);
  const faq = productFaq(product);
  const schema = {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: `${product.name} – שקיקי ניקוטין ללא טבק`,
    description: product.description ?? product.metaDescription ?? `${product.name} מבית ${product.brand}, שקיקי ניקוטין ללא טבק. המחיר והזמינות מעודכנים בדף המוצר.`,
    image: product.images.map((image) => absoluteUrl(image)),
    sku: product.sku,
    ...((product.gtin ?? product.sku).replace(/\D/g, "").length === 13 ? { gtin13: (product.gtin ?? product.sku).replace(/\D/g, "") } : {}),
    category: "שקיקי ניקוטין ללא טבק",
    audience: { "@type": "PeopleAudience", suggestedMinAge: 18 },
    brand: { "@type": "Brand", name: product.brand },
    manufacturer: { "@type": "Organization", name: product.brand },
    additionalProperty: [
      ...(product.flavor ? [{ "@type": "PropertyValue", name: "טעם", value: product.flavor }] : []),
      ...(product.nicotineMg ? [{ "@type": "PropertyValue", name: "ניקוטין", value: `${product.nicotineMg} מ״ג` }] : []),
      { "@type": "PropertyValue", name: "עוצמה", value: productStrengthLabel(product) },
      { "@type": "PropertyValue", name: "אריזה", value: "יחידה" },
    ],
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
  const faqSchema = {
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
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
      <JsonLd data={[schema, faqSchema, breadcrumbs]} />
      <ProductDetail product={product} related={related} variant={variant} />
    </>
  );
}
