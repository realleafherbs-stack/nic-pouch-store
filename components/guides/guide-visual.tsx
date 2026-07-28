import type { GuideCategory } from "@/data/articles";

const visualLabels: Record<GuideCategory, string> = {
  beginner: "01",
  strength: "MG",
  "flavors-brands": "TASTE",
  "use-storage": "USE",
};

export function GuideVisual({
  category,
  number,
}: {
  category: GuideCategory;
  number?: string;
}) {
  return (
    <div
      className={`guide-visual guide-visual-${category}`}
      data-testid={`guide-visual-${category}`}
      aria-hidden="true"
    >
      <span className="guide-visual-ring guide-visual-ring-outer" />
      <span className="guide-visual-ring guide-visual-ring-inner" />
      <span className="guide-visual-axis" />
      <b>{number ?? visualLabels[category]}</b>
      {category === "strength" && (
        <span className="guide-visual-scale">
          <i>8</i><i>16</i><i>30</i><i>31+</i>
        </span>
      )}
    </div>
  );
}
