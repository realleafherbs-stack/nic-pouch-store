import { Suspense } from "react";
import { verifyHypRedirect } from "@/lib/hyp";
import { finalizeOrderFromToken } from "@/lib/orders";
import { SuccessClient } from "./success-client";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const rawParams: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string") rawParams[k] = v;
  }

  // Creates and confirms the order server-side so it fires regardless of
  // client JS. Hyp Pay only redirects the browser here — there is no
  // server-to-server callback — so this is the primary point where a paid
  // order is actually written to the CRM. Never trust the redirect on its
  // own: verify it against Hyp's own transaction record first, or anyone
  // landing on this URL with a guessed/observed Order id could conjure up an
  // order without ever paying. SuccessClient also retries client-side as a
  // backup in case this whole request never completes (e.g. the browser
  // closed mid-redirect).
  const { valid, orderId } = await verifyHypRedirect(rawParams);
  if (valid && orderId && rawParams.t) {
    await finalizeOrderFromToken(rawParams.t, orderId);
  }

  return (
    <Suspense>
      <SuccessClient />
    </Suspense>
  );
}
