import { revalidatePath, revalidateTag } from "next/cache";
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
  // (app/layout.tsx), so this marks every page's rendered HTML stale
  // instead of requiring the CRM to guess an exact URL.
  //
  // That alone is not sufficient, though: it marks the *page* cache stale,
  // but lib/catalog/local-repository.ts's own fetch of the CRM's product
  // list has an independent 60s Data Cache entry that revalidatePath does
  // not touch — a re-render still reads that same cached data until its own
  // timer expires. { expire: 0 } is the pattern Next's own docs prescribe
  // specifically for "webhooks or third-party services that need immediate
  // expiration" — which is exactly what this route is.
  revalidatePath(path ?? "/", "layout");
  revalidateTag("products", { expire: 0 });
  return NextResponse.json({ revalidated: true, path });
}
