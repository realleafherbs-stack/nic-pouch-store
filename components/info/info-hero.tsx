import type { ReactNode } from "react";

interface InfoHeroProps {
  eyebrow: string;
  title: string;
  lede?: ReactNode;
}

export function InfoHero({ eyebrow, title, lede }: InfoHeroProps) {
  return (
    <header className="info-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lede && <p className="info-lede">{lede}</p>}
    </header>
  );
}
