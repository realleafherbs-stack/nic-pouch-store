import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { secret, path } = await request.json();
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestedPath = typeof path === "string" && path.startsWith("/") ? path : "/";
  revalidateTag("crm-blogs", "max");
  revalidatePath(requestedPath);
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({
    revalidated: true,
    path: requestedPath,
    relatedPaths: ["/blog", "/sitemap.xml"],
  });
}
