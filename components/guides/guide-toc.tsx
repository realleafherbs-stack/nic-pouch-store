"use client";

import { useEffect, useState } from "react";

interface TocSection {
  id: string;
  title: string;
}

function TocLinks({
  sections,
  activeId,
}: {
  sections: TocSection[];
  activeId: string;
}) {
  return (
    <>
      {sections.map((section) => (
        <a
          className={activeId === section.id ? "active" : ""}
          href={`#${section.id}`}
          aria-current={activeId === section.id ? "location" : undefined}
          key={section.id}
        >
          {section.title}
        </a>
      ))}
      <a href="#questions">שאלות נפוצות</a>
      <a href="#sources">מקורות</a>
    </>
  );
}

export function GuideToc({ sections }: { sections: TocSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -68% 0px" },
    );
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <nav className="guide-toc-desktop" aria-label="תוכן המדריך">
        <strong>במדריך הזה</strong>
        <TocLinks sections={sections} activeId={activeId} />
      </nav>
      <details className="guide-toc-mobile">
        <summary>במדריך הזה</summary>
        <div><TocLinks sections={sections} activeId={activeId} /></div>
      </details>
    </>
  );
}
