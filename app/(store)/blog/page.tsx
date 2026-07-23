import Link from "next/link";
import { articles } from "@/data/articles";
export const metadata = { title: "מדריכים ומאמרים", description: "מידע ברור על פאוצ׳ים, טעמים ועוצמות." };
export default function BlogPage() {
  return <><div className="page-hero"><div className="container"><p className="eyebrow">ידע לפני קנייה</p><h1>המדריך לפאוצ׳ים</h1><p>תוכן ברור ומבוסס שמסייע להבין את המוצרים ולבחור באחריות.</p></div></div><section className="section"><div className="container brands">{articles.map((article) => <Link className="brand-tile" style={{ minHeight: 220, alignContent: "center" }} href={`/blog/${article.slug}`} key={article.slug}><div><p className="eyebrow">{article.updated}</p><h2>{article.title}</h2><p>{article.excerpt}</p></div></Link>)}</div></section></>;
}
