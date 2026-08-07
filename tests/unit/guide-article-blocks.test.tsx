import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  GuideCallout,
  GuideComparisonTable,
  GuideFAQ,
  GuideSources,
  GuideSteps,
  GuideStrengthScale,
  GuideTakeaways,
} from "@/components/guides/guide-article-blocks";
import { GuideToc } from "@/components/guides/guide-toc";

describe("NIC GUIDE article blocks", () => {
  it("starts with a concrete takeaways list", () => {
    render(<GuideTakeaways items={["להבין את הסימון", "להשוות נכון", "לבחור באחריות"]} />);

    expect(screen.getByRole("heading", { name: "מה תדעו בסוף המדריך" })).toBeVisible();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders callouts and ordered steps as real content", () => {
    render(
      <>
        <GuideCallout title="חשוב לדעת" tone="important">ניקוטין הוא חומר ממכר.</GuideCallout>
        <GuideSteps steps={["קוראים את האריזה", "בודקים עוצמה", "שומרים סגור"]} />
      </>,
    );

    expect(screen.getByText("ניקוטין הוא חומר ממכר.")).toBeVisible();
    expect(screen.getByRole("list")).toHaveClass("guide-steps");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("keeps comparison data and strength labels accessible", () => {
    render(
      <>
        <GuideComparisonTable
          caption="השוואת סימונים"
          headers={["סימון", "משמעות"]}
          rows={[["מ״ג", "נתון ניקוטין"], ["טעם", "אינו מדד עוצמה"]]}
        />
        <GuideStrengthScale />
      </>,
    );

    expect(screen.getByRole("table", { name: "השוואת סימונים" })).toBeVisible();
    expect(screen.getByText("31+ מ״ג")).toBeVisible();
  });

  it("keeps FAQ answers and sources in the HTML before interaction", () => {
    render(
      <>
        <GuideFAQ items={[{ question: "איך בודקים?", answer: "קוראים את סימון היצרן." }]} />
        <GuideSources items={["אריזת המוצר", "קטלוג החברה"]} />
      </>,
    );

    expect(screen.getByText("קוראים את סימון היצרן.")).toBeInTheDocument();
    expect(screen.getByText("אריזת המוצר")).toBeVisible();
  });

  it("offers sticky desktop links and a closed mobile table of contents", () => {
    render(
      <GuideToc
        sections={[
          { id: "first", title: "התחלה" },
          { id: "second", title: "השוואה" },
        ]}
      />,
    );

    expect(screen.getByRole("navigation", { name: "תוכן המדריך" })).toBeVisible();
    expect(screen.getAllByRole("link", { name: "התחלה" })).toHaveLength(2);
    const mobileSummary = screen.getByText("במדריך הזה", { selector: "summary" });
    expect(mobileSummary).toBeVisible();
    expect(mobileSummary.closest("details")).not.toHaveAttribute("open");
  });
});
