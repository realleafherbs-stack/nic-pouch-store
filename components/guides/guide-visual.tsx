import type { GuideCategory } from "@/data/articles";

const visualLabels: Record<GuideCategory, string> = {
  beginner: "01",
  strength: "MG",
  "flavors-brands": "TASTE",
  "use-storage": "USE",
};

const guideProductVisuals: Record<string, { images: string[]; className: string }> = {
  "nicotine-pouch-guide": {
    className: "guide-product-visual-choosing",
    images: [
      "/products/6923742003716-1-commerce.webp",
      "/products/5740031401029-1-commerce.webp",
      "/products/5744000761954-1-commerce.webp",
      "/products/4742024720569-1-commerce.webp",
    ],
  },
  "strength-guide": {
    className: "guide-product-visual-strength",
    images: [
      "/products/4742024720767-1-commerce.webp",
      "/products/6923742003716-1-commerce.webp",
      "/products/4742024720569-1-commerce.webp",
    ],
  },
  "how-to-use": {
    className: "guide-product-visual-use",
    images: ["/products/4742024720019-1-commerce.webp"],
  },
};

export function GuideVisual({
  category,
  guideSlug,
  number,
  showLabel = true,
}: {
  category: GuideCategory;
  guideSlug?: string;
  number?: string;
  showLabel?: boolean;
}) {
  const productVisual = guideSlug ? guideProductVisuals[guideSlug] : undefined;

  if (productVisual) {
    return (
      <div
        className={`guide-visual guide-product-visual ${productVisual.className}`}
        data-testid={`guide-visual-${category}`}
        aria-hidden="true"
      >
        <span className="guide-product-grid" />
        <div className="guide-product-stage">
          {productVisual.images.map((src, index) => (
            <img src={src} alt="" key={src} className={`guide-product-image guide-product-image-${index + 1}`} />
          ))}
          {guideSlug === "strength-guide" && (
            <span className="guide-mg-scale">
              <i>8</i><i>15</i><i>50</i>
            </span>
          )}
          {guideSlug === "how-to-use" && (
            <span className="guide-pouch-set">
              <i /><i /><i />
            </span>
          )}
        </div>
        {showLabel && <b>{number ?? visualLabels[category]}</b>}
      </div>
    );
  }

  return (
    <div
      className={`guide-visual guide-visual-${category}`}
      data-testid={`guide-visual-${category}`}
      aria-hidden="true"
    >
      <span className="guide-visual-ring guide-visual-ring-outer" />
      <span className="guide-visual-ring guide-visual-ring-inner" />
      <span className="guide-visual-axis" />
      {showLabel && <b>{number ?? visualLabels[category]}</b>}
      {category === "strength" && (
        <span className="guide-visual-scale">
          <i>8</i><i>16</i><i>30</i><i>31+</i>
        </span>
      )}
    </div>
  );
}
