import { NextRequest, NextResponse } from "next/server";
import { verifyHypRedirect } from "@/lib/hyp";
import { finalizeOrderFromToken } from "@/lib/orders";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rawParams: Record<string, string> = {};
  for (const [k, v] of Object.entries(body ?? {})) {
    if (typeof v === "string") rawParams[k] = v;
  }

  // Same rule as the success page: never confirm on the client's say-so
  // alone. Re-verify against Hyp's own transaction record before touching
  // the CRM, or this endpoint would let anyone conjure up an order just by
  // knowing (or guessing) its id.
  const { valid, orderId } = await verifyHypRedirect(rawParams);
  if (!valid || !orderId || !rawParams.t) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ok = await finalizeOrderFromToken(rawParams.t, orderId);
  return NextResponse.json({ ok });
}
