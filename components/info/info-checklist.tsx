import { CheckCircle2 } from "lucide-react";

export function InfoChecklist({ items }: { items: string[] }) {
  return (
    <ul className="info-checklist">
      {items.map((item) => (
        <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>
      ))}
    </ul>
  );
}
