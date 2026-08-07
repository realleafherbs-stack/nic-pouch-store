import Link from "next/link";
import type { Product } from "@/lib/catalog/model";

const brandOrder = ["NOIS", "HQD", "PABLO", "KILLA", "CUBA"] as const;

export function BrandShowcase({ products }: { products: Product[] }) {
  const availableBrands = new Set(products.map((product) => product.brand));

  return (
    <nav
      className="brand-showcase"
      aria-label="מותגים מובילים"
      data-display="logos-only"
    >
      {brandOrder
        .filter((brand) => availableBrands.has(brand))
        .map((brand) => (
          <Link
            href={`/brands/${brand.toLowerCase()}`}
            className={`brand-card brand-${brand.toLowerCase()}`}
            aria-label={`למוצרי המותג ${brand}`}
            key={brand}
          >
            <span className="brand-logo-word" aria-hidden="true">
              {brand}
            </span>
          </Link>
        ))}
    </nav>
  );
}
