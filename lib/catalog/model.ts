export type StrengthLevel = "mild" | "medium" | "strong" | "extra-strong";

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
  sourcePrice: number;
  stock: number;
  active: boolean;
  packSize: number;
  images: string[];
  categories: string[];
}

export interface CatalogQuery {
  q?: string;
  brand?: string | string[];
  strength?: string | string[];
  sort?: string;
}
