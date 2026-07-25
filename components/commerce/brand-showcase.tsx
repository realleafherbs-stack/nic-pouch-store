import Link from "next/link";
import type { Product } from "@/lib/catalog/model";

const brandStyles: Record<string, { tagline: string; className: string }> = {
  NOIS: { tagline: "המותג שלנו. שלוש עוצמות, בחירה מדויקת.", className: "brand-nois" },
  HQD: { tagline: "טעמים בהירים וקירור מאוזן.", className: "brand-hqd" },
  PABLO: { tagline: "אופי נועז ועוצמות לחובבי החזק.", className: "brand-pablo" },
  KILLA: { tagline: "טעמי פרי ומנטה במראה אייקוני.", className: "brand-killa" },
  CUBA: { tagline: "קווים נקיים וטעמים קלאסיים.", className: "brand-cuba" }
};

export function BrandShowcase({ products }: { products: Product[] }) {
  const cards = Object.keys(brandStyles)
    .map((brand) => ({ brand, product: products.find((item) => item.brand === brand) }))
    .filter((item): item is { brand: string; product: Product } => Boolean(item.product));

  return (
    <div className="brand-showcase" aria-label="מותגים מובילים">
      {cards.map(({ brand, product }) => {
        const style = brandStyles[brand];
        return (
          <Link href={`/brands/${brand.toLowerCase()}`} className={`brand-card ${style.className}`} key={brand}>
            <div className="brand-card-copy">
              <span className="brand-logo-word" aria-label={`לוגו ${brand}`}>{brand}</span>
              <p>{style.tagline}</p>
              <span className="brand-card-cta">לצפייה במוצרים</span>
            </div>
            <div className="brand-card-product">
              {product.images[0] && <img src={product.images[0]} alt={`מוצר מייצג של ${brand}`} />}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
