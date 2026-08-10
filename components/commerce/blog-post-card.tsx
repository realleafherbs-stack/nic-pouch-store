import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

export function BlogPostCard({ post }: { post: BlogPost }) {
  const date = formatDate(post.publishedAt);
  return (
    <Link className="blog-post-card" href={`/blog/${post.slug}`}>
      <div className="blog-post-card-image">
        {post.featuredImage ? <img src={post.featuredImage} alt="" loading="lazy" /> : <span className="can-placeholder">NIC POUCH</span>}
      </div>
      <div className="blog-post-card-body">
        {date && <time>{date}</time>}
        <h3>{post.title}</h3>
        {post.metaDescription && <p>{post.metaDescription}</p>}
      </div>
    </Link>
  );
}
