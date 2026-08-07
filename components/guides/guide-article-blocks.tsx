import type { ReactNode } from "react";
import type { GuideFaq } from "@/data/articles";

export function GuideTakeaways({ items }: { items: string[] }) {
  return (
    <section className="guide-takeaways" aria-labelledby="guide-takeaways-title">
      <p className="guide-kicker">בקצרה ולעניין</p>
      <h2 id="guide-takeaways-title">מה תדעו בסוף המדריך</h2>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

export function GuideCallout({
  title,
  tone = "note",
  children,
}: {
  title: string;
  tone?: "summary" | "note" | "important";
  children: ReactNode;
}) {
  return (
    <aside className={`guide-callout guide-callout-${tone}`}>
      <strong>{title}</strong>
      <p>{children}</p>
    </aside>
  );
}

export function GuideSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="guide-steps">
      {steps.map((step, index) => (
        <li key={step}>
          <b aria-hidden="true">{String(index + 1).padStart(2, "0")}</b>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function GuideComparisonTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="guide-table-scroll" tabIndex={0} aria-label={`${caption}, ניתן לגלול אופקית`}>
      <table>
        <caption>{caption}</caption>
        <thead><tr>{headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) =>
                index === 0
                  ? <th scope="row" key={cell}>{cell}</th>
                  : <td key={`${cell}-${index}`}>{cell}</td>,
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GuideStrengthScale() {
  return (
    <div className="guide-strength-scale" aria-label="סולם עוצמות הניקוטין באתר">
      <span><b>עדין</b><small>עד 8 מ״ג</small></span>
      <span><b>בינוני</b><small>9–16 מ״ג</small></span>
      <span><b>חזק</b><small>17–30 מ״ג</small></span>
      <span><b>חזק מאוד</b><small>31+ מ״ג</small></span>
    </div>
  );
}

export function GuideFAQ({ items }: { items: GuideFaq[] }) {
  return (
    <section className="guide-faq" id="questions" aria-labelledby="guide-faq-title">
      <p className="guide-kicker">תשובות ברורות</p>
      <h2 id="guide-faq-title">שאלות נפוצות</h2>
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </section>
  );
}

export function GuideSources({ items }: { items: string[] }) {
  return (
    <section className="guide-sources" id="sources" aria-labelledby="guide-sources-title">
      <p className="guide-kicker">מקורות ושקיפות</p>
      <h2 id="guide-sources-title">על מה המידע מבוסס?</h2>
      <ol>{items.map((item) => <li key={item}>{item}</li>)}</ol>
    </section>
  );
}
