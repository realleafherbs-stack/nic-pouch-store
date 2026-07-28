import Link from "next/link";
import { GuideCard } from "@/components/guides/guide-card";
import { articles } from "@/data/articles";

export function HomeBlog() {
  return (
    <section className="home-blog section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="guide-kicker">ידע שימושי. בחירה אחראית.</p>
            <h2>NIC GUIDE — לדעת לפני שבוחרים</h2>
          </div>
          <Link className="text-link" href="/blog">לכל המדריכים</Link>
        </div>
        <div className="home-guide-grid">
          {articles.map((guide) => (
            <GuideCard guide={guide} key={guide.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
