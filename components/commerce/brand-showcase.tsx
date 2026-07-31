import Link from "next/link";
import type { Product } from "@/lib/catalog/model";

const brandStyles: Record<string, { className: string }> = {
  NOIS: { className: "brand-nois" },
  HQD: { className: "brand-hqd" },
  PABLO: { className: "brand-pablo" },
  KILLA: { className: "brand-killa" },
  CUBA: { className: "brand-cuba" }
};

export function BrandShowcase({ products }: { products: Product[] }) {
  const cards = Object.keys(brandStyles)
    .filter((brand) => products.some((item) => item.brand === brand));

  return (
    <div className="brand-showcase" aria-label="מותגים מובילים">
      {cards.map((brand) => {
        const style = brandStyles[brand];
        return (
          <Link
            href={`/brands/${brand.toLowerCase()}`}
            className={`brand-card ${style.className}`}
            aria-label={`לכל מוצרי ${brand}`}
            key={brand}
          >
            <span className="brand-logo-word" aria-hidden="true">{brand}</span>
            <div className="brand-card-cta">
              <span>למוצרים</span>
              <span aria-hidden="true">←</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
