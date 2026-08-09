import type { ComponentType, ReactNode } from "react";

export interface InfoAccordionItem {
  icon: ComponentType<{ className?: string }>;
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

export function InfoAccordion({ items }: { items: InfoAccordionItem[] }) {
  return (
    <div className="info-accordion">
      {items.map(({ icon: Icon, title, content, defaultOpen }) => (
        <details key={title} open={defaultOpen}>
          <summary><Icon className="info-section-icon" aria-hidden="true" />{title}</summary>
          <div className="info-accordion-body">{content}</div>
        </details>
      ))}
    </div>
  );
}
