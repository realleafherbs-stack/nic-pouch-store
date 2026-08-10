// Live CRM-fetched blog posts — unlike the product catalog (build-time sync
// to a checked-in JSON file), blog posts are fetched at request time with
// ISR. The CRM's own publish action pings /api/revalidate with the exact
// paths to bust, so a new post shows up almost immediately once deployed;
// the 60s revalidate window is just the fallback for when that ping doesn't
// arrive (e.g. local dev, or a missed request).
const apiBaseUrl = process.env.CRM_API_BASE_URL?.replace(/\/$/, "");
const siteSlug = process.env.CRM_SITE_SLUG;
const apiKey = process.env.CRM_API_KEY;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  publishedAt: string | null;
  featuredImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  tags: string[];
}

export interface BlogPostFull extends BlogPost {
  body: string;
}

function isJson(res: Response) {
  return (res.headers.get("content-type") ?? "").includes("application/json");
}

export async function getBlogs(): Promise<BlogPost[]> {
  if (!apiBaseUrl || !siteSlug || !apiKey) return [];
  try {
    const res = await fetch(`${apiBaseUrl}/${encodeURIComponent(siteSlug)}/blogs`, {
      headers: { "x-api-key": apiKey, accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok || !isJson(res)) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getBlog(slug: string): Promise<BlogPostFull | null> {
  if (!apiBaseUrl || !siteSlug || !apiKey) return null;
  try {
    const res = await fetch(`${apiBaseUrl}/${encodeURIComponent(siteSlug)}/blogs/${encodeURIComponent(slug)}`, {
      headers: { "x-api-key": apiKey, accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok || !isJson(res)) return null;
    return res.json();
  } catch {
    return null;
  }
}
