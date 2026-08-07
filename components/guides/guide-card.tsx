import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  guideCategoryLabels,
  type Guide,
} from "@/data/articles";
import { GuideVisual } from "@/components/guides/guide-visual";

export type GuideCardVariant = "featured" | "standard" | "compact";

export function GuideCard({
  guide,
  variant = "standard",
}: {
  guide: Guide;
  variant?: GuideCardVariant;
}) {
  return (
    <article className={`guide-card guide-card-${variant}`}>
      <Link className="guide-card-link" href={`/blog/${guide.slug}`}>
        {variant !== "compact" && (
          <div className="guide-card-media">
            <GuideVisual category={guide.category} guideSlug={guide.slug} showLabel={false} />
            <b className="guide-card-number" aria-hidden="true">{guide.number}</b>
          </div>
        )}
        <div className="guide-card-copy">
          {variant === "compact" && (
            <b className="guide-card-number" aria-hidden="true">{guide.number}</b>
          )}
          <p className="guide-card-meta">
            {guideCategoryLabels[guide.category]} · {guide.readingTime} דקות
          </p>
          <h2>{guide.title}</h2>
          {variant !== "compact" && <p>{guide.excerpt}</p>}
          <span className="guide-card-action">
            לקריאה <ArrowLeft aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
