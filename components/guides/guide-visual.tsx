import type { GuideCategory } from "@/data/articles";

const visualLabels: Record<GuideCategory, string> = {
  beginner: "01",
  strength: "MG",
  "flavors-brands": "TASTE",
  "use-storage": "USE",
};

const guideEditorialVisuals: Record<string, string> = {
  "nicotine-pouch-guide": "/generated/guide-choosing-editorial-v3.jpg",
  "strength-guide": "/generated/guide-strength-editorial-v3.jpg",
  "how-to-use": "/generated/guide-storage-editorial-v3.jpg",
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
  const editorialVisual = guideSlug ? guideEditorialVisuals[guideSlug] : undefined;

  if (editorialVisual) {
    return (
      <div
        className="guide-visual guide-editorial-visual"
        data-testid={`guide-visual-${category}`}
        aria-hidden="true"
      >
        <img src={editorialVisual} alt="" className="guide-editorial-image" />
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
