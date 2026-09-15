// Verifies a Hyp Pay payment-completion redirect server-to-server before it's
// ever trusted. Hyp signs the redirect (Id, CCode, Amount, Order, ACode,
// Sign, ...) but that redirect only reaches us via the customer's browser —
// anyone could fabricate a `?Order=...&CCode=0` query string pointing at
// someone else's pending order otherwise. The `VERIFY` action re-checks the
// exact signed params against Hyp's own record of the transaction using our
// terminal credentials, independent of anything the client claims.

// Only these fields are ever copied from client-controlled input. In
// particular action/What/Masof/KEY/PassP are never sourced from rawParams —
// spreading arbitrary client input into the same params object as our own
// credentials would let a request override them (e.g. supply its own Masof/
// KEY/PassP and have us "verify" against a different terminal entirely).
const ALLOWED_REDIRECT_KEYS = ["Id", "CCode", "Amount", "ACode", "Order", "Sign", "Coin", "Fild1", "Fild2", "Fild3", "tmp"];

export async function verifyHypRedirect(
  rawParams: Record<string, string>,
): Promise<{ valid: boolean; orderId?: string }> {
  const masof = process.env.HYP_MASOF;
  const key = process.env.HYP_KEY;
  const passP = process.env.HYP_PASSP;
  if (!masof || !key || !passP) return { valid: false };

  const orderId = rawParams.Order;
  if (!orderId || !rawParams.Sign || !rawParams.CCode) return { valid: false };

  const params = new URLSearchParams();
  params.set("action", "APISign");
  params.set("What", "VERIFY");
  params.set("Masof", masof);
  params.set("KEY", key);
  params.set("PassP", passP);
  for (const k of ALLOWED_REDIRECT_KEYS) {
    if (typeof rawParams[k] === "string") params.set(k, rawParams[k]);
  }

  try {
    const res = await fetch(`https://pay.hyp.co.il/p/?${params.toString()}`, {
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    const valid = /(^|&)CCode=0(&|$)/.test(text) && rawParams.CCode === "0";
    // Diagnostic only, no logic change: this call has been silently
    // returning {valid:false} for real customer orders with no trail to
    // explain why. Logging on every rejection until we have real evidence
    // of what Hyp actually returns for a genuine successful payment — do
    // not remove until that's found. Never log Sign (a replayable
    // signature) or Fild1/Fild2/Fild3 (carry the customer's name/email per
    // Hyp's own docs) — only non-sensitive diagnostic fields.
    if (!valid) {
      const { Sign: _sign, Fild1: _f1, Fild2: _f2, Fild3: _f3, ...safeParamsSent } =
        Object.fromEntries(params.entries());
      console.error("[verifyHypRedirect] rejected", {
        orderId,
        rawCCode: rawParams.CCode,
        verifyResponseText: text.slice(0, 200),
        redirectParamsSent: safeParamsSent,
      });
    }
    return { valid, orderId: valid ? orderId : undefined };
  } catch (err) {
    console.error("[verifyHypRedirect] request failed", { orderId, err });
    return { valid: false };
  }
}
