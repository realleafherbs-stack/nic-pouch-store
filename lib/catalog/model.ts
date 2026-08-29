export type StrengthLevel = "mild" | "medium" | "strong" | "extra-strong";

export interface PriceTier {
  minQuantity: number;
  unitPrice: number;
}

export interface ProductFeature {
  title: string;
  subtitle?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  legacySlugs?: string[];
  sku: string;
  name: string;
  brand: string;
  flavor: string | null;
  nicotineMg: number | null;
  strengthLevel: StrengthLevel | null;
  retailPrice: number;
  priceTiers?: PriceTier[];
  sourcePrice: number;
  stock: number;
  active: boolean;
  packSize: number;
  images: string[];
  imageAlt?: string;
  categories: string[];
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  indexable?: boolean;
  gtin?: string;
  relatedProductIds?: string[];
  badge?: string;
  cardFeatures?: string[];
  features?: ProductFeature[];
  specs?: ProductSpec[];
  inTheBox?: string[];
  usageInstructions?: string[];
  warrantyInfo?: string[];
  faq?: ProductFaqItem[];
  videoUrl?: string;
  soldCount?: string;
  rating?: number;
  reviewCount?: number;
}

export interface CatalogQuery {
  q?: string;
  brand?: string | string[];
  strength?: string | string[];
  sort?: string;
}
