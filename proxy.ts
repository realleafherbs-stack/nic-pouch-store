import { NextResponse, type NextRequest } from "next/server";
import { legacyProductRedirectDestination } from "@/lib/catalog/legacy-product-redirects";

export function proxy(request: NextRequest) {
  const destination = legacyProductRedirectDestination(request.nextUrl.pathname);
  return destination
    ? NextResponse.redirect(new URL(destination, request.url), 301)
    : NextResponse.next();
}

export const config = {
  matcher: "/shop/:path*",
};
