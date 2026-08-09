import type { ComponentType, ReactNode } from "react";

interface InfoSectionProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}

export function InfoSection({ icon: Icon, title, children }: InfoSectionProps) {
  return (
    <section className="info-section">
      <h2><Icon className="info-section-icon" aria-hidden="true" />{title}</h2>
      <div className="info-section-body">{children}</div>
    </section>
  );
}
