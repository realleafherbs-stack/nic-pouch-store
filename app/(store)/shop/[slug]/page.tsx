import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { preconnect } from "react-dom";
import { ProductDetail } from "@/components/product/product-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllProducts, getProductByCurrentOrLegacySlug, getProductsByIds } from "@/lib/catalog/local-repository";
import { productVariantForSlug } from "@/lib/catalog/product-page-variant";
import { retiredProductRedirectDestination } from "@/lib/catalog/retired-product-redirects";
import { productFaq, productSchema, productSeoDescription, productSeoKeywords, productSeoTitle, productSocialImages } from "@/lib/catalog/product-seo";
import { absoluteUrl, breadcrumbSchema, siteName, siteUrl } from "@/lib/seo";

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
  const title = productSeoTitle(product);
  const description = productSeoDescription(product);
  const canonical = `/shop/${product.slug}`;
  const images = productSocialImages(product).map((image) => ({
    url: absoluteUrl(image),
    alt: product.imageAlt || product.name,
  }));
  return {
    // Absolute, so the root template does not append " | NIC POUCH" and push the title over 60 characters.
    title: { absolute: title },
    description,
    keywords: productSeoKeywords(product),
    alternates: { canonical },
    robots: product.indexable === false ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: "he_IL",
      siteName,
      title,
      description,
      url: canonical,
      images,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title,
      description,
      images: images.map((image) => image.url),
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
  const breadcrumbs = breadcrumbSchema([
    { name: "דף הבית", path: "/" },
    { name: "חנות", path: "/shop" },
    { name: product.brand, path: `/brands/${product.brand.toLowerCase()}` },
    { name: product.name, path: `/shop/${product.slug}` },
  ]);
  const variant = productVariantForSlug(product.slug);
  // The shared FAQ is rendered only on the balanced product layout. Emitting
  // FAQPage on the legacy pages would describe questions that are not on the page.
  const faqSchema = variant === "balanced" ? {
    "@type": "FAQPage",
    mainEntity: productFaq(product).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  } : null;

  return (
    <>
      <JsonLd data={[productSchema(product), breadcrumbs, ...(faqSchema ? [faqSchema] : [])]} />
      <ProductDetail product={product} related={related} variant={variant} />
    </>
  );
}
