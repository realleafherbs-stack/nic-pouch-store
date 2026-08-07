export type ProductDetailVariant = "legacy" | "balanced";

const BALANCED_SAMPLE_SLUG = "nois-50mg-43589";

export function productVariantForSlug(slug: string): ProductDetailVariant {
  return slug === BALANCED_SAMPLE_SLUG ? "balanced" : "legacy";
}
