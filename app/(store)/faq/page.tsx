import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { InfoHero } from "@/components/info/info-hero";

const questions = [
  ["מה ההבדל בין סנוס לשקיקי ניקוטין?", "סנוס מסורתי מכיל טבק. המוצרים באתר הם שקיקי ניקוטין ללא טבק, אלא אם צוין אחרת."],
  ["למי מיועדים המוצרים?", "לבגירים בני 18 ומעלה שכבר משתמשים בניקוטין. ניקוטין הוא חומר ממכר."],
  ["כמה זמן נמשך המשלוח?", "זמן האספקה הרגיל הוא עד 3 ימי עסקים, בכפוף ליישוב ולחברת המשלוחים."],
  ["איך בוחרים חוזק?", "בודקים את כמות הניקוטין ואת סימון היצרן. כשלא בטוחים, מתחילים בעוצמה נמוכה יותר."],
];

export const metadata: Metadata = { title: "שאלות נפוצות על סנוס ושקיקי ניקוטין", description: "תשובות על מוצרים ללא טבק, חוזק, משלוחים, שימוש ואחסון.", alternates: { canonical: "/faq" } };

export default function FaqPage() {
  const schema = { "@type": "FAQPage", mainEntity: questions.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
  return (
    <>
      <JsonLd data={schema} />
      <main className="container info-page">
        <InfoHero eyebrow="מידע שימושי" title="שאלות נפוצות" />
        <div className="info-faq">
          {questions.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </main>
    </>
  );
}
