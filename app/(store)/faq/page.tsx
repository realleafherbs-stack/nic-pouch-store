import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
const questions = [
  ["מה ההבדל בין סנוס לשקיקי ניקוטין?", "סנוס מסורתי מכיל טבק. המוצרים באתר הם שקיקי ניקוטין ללא טבק, אלא אם צוין אחרת."],
  ["למי מיועדים המוצרים?", "לבגירים בני 18 ומעלה שכבר משתמשים בניקוטין. ניקוטין הוא חומר ממכר."],
  ["כמה זמן נמשך המשלוח?", "זמן האספקה הרגיל הוא עד 3 ימי עסקים, בכפוף ליישוב ולחברת המשלוחים."],
  ["איך בוחרים חוזק?", "בודקים את כמות הניקוטין ואת סימון היצרן. כשלא בטוחים, מתחילים בעוצמה נמוכה יותר."],
];
export const metadata: Metadata = { title: "שאלות נפוצות על סנוס ושקיקי ניקוטין", description: "תשובות על מוצרים ללא טבק, חוזק, משלוחים, שימוש ואחסון.", alternates: { canonical: "/faq" } };
export default function FaqPage() { const schema = { "@type": "FAQPage", mainEntity: questions.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }; return <><JsonLd data={schema} /><main className="container article"><p className="eyebrow">מידע שימושי</p><h1>שאלות נפוצות</h1>{questions.map(([question, answer]) => <section key={question}><h2>{question}</h2><p>{answer}</p></section>)}</main></>; }
