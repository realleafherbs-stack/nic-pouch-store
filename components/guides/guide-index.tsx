"use client";

import { useMemo, useState } from "react";
import {
  guideCategoryLabels,
  type Guide,
  type GuideCategory,
} from "@/data/articles";
import { GuideCard } from "@/components/guides/guide-card";

type GuideFilter = "all" | GuideCategory;

const filters: { value: GuideFilter; label: string }[] = [
  { value: "all", label: "כל המדריכים" },
  ...Object.entries(guideCategoryLabels).map(([value, label]) => ({
    value: value as GuideCategory,
    label,
  })),
];

function categoryFromLocation(): GuideFilter {
  if (typeof window === "undefined") return "all";
  const category = new URLSearchParams(window.location.search).get("category");
  return filters.some((filter) => filter.value === category)
    ? (category as GuideCategory)
    : "all";
}

export function GuideIndex({ guides }: { guides: Guide[] }) {
  const [activeFilter, setActiveFilter] = useState<GuideFilter>(categoryFromLocation);
  const visibleGuides = useMemo(
    () =>
      activeFilter === "all"
        ? guides
        : guides.filter((guide) => guide.category === activeFilter),
    [activeFilter, guides],
  );
  const featured =
    activeFilter === "all"
      ? visibleGuides.find((guide) => guide.featured) ?? visibleGuides[0]
      : undefined;
  const standardGuides = featured
    ? visibleGuides.filter((guide) => guide.slug !== featured.slug)
    : visibleGuides;

  function selectFilter(filter: GuideFilter) {
    setActiveFilter(filter);
    const url = new URL(window.location.href);
    if (filter === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", filter);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <>
      <div className="guide-filters" role="group" aria-label="סינון מדריכים לפי נושא">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={activeFilter === filter.value}
            onClick={() => selectFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="guide-results" aria-live="polite">
        {featured && <GuideCard guide={featured} variant="featured" />}
        <div className="guide-card-grid">
          {standardGuides.map((guide) => (
            <GuideCard guide={guide} key={guide.slug} />
          ))}
        </div>
        {visibleGuides.length === 0 && (
          <p className="guide-empty">עדיין אין מדריכים בנושא הזה.</p>
        )}
      </div>
    </>
  );
}
