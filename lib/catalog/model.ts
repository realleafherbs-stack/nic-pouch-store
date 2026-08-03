export type StrengthLevel = "mild" | "medium" | "strong" | "extra-strong";

export interface PriceTier {
  minQuantity: number;
  unitPrice: number;
}

export interface Product {
  id: string;
  slug: string;
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
  categories: string[];
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  indexable?: boolean;
  gtin?: string;
}

export interface CatalogQuery {
  q?: string;
  brand?: string | string[];
  strength?: string | string[];
  sort?: string;
}
