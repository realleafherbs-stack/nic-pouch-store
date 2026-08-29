import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { secret, path } = await request.json();
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // "layout" (not the default "page") because the CRM has no way to know
  // this site's own slug scheme — a product-field write always revalidates
  // path "/", which with the default "page" type only invalidates the
  // homepage itself, not /shop/[slug]. Every route shares the root layout
  // (app/layout.tsx), so revalidating "/" as a layout cascades to every
  // page site-wide instead of requiring the CRM to guess an exact URL.
  revalidatePath(path ?? "/", "layout");
  return NextResponse.json({ revalidated: true, path });
}
