import Link from "next/link";
import { ArrowLeft, BookOpenText, Gauge, Leaf } from "lucide-react";
import { articles } from "@/data/articles";

const articleIcons = [BookOpenText, Gauge, Leaf];

export function HomeBlog() {
  return (
    <section className="home-blog section">
      <div className="container">
        <div className="section-heading">
          <div><p className="eyebrow">לומדים לפני שבוחרים</p><h2>המדריך של NIC POUCH</h2></div>
          <Link className="text-link" href="/blog">לכל המאמרים</Link>
        </div>
        <div className="editorial-grid">
          {articles.map((article, index) => {
            const Icon = articleIcons[index] ?? BookOpenText;
            return (
              <Link className={`editorial-card editorial-card-${index + 1}`} href={`/blog/${article.slug}`} key={article.slug}>
                <div className="editorial-art" aria-hidden="true"><Icon /></div>
                <div className="editorial-copy">
                  <span>מדריך · {article.updated}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <strong>לקריאה <ArrowLeft /></strong>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
