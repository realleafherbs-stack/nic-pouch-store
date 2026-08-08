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
    return { valid, orderId: valid ? orderId : undefined };
  } catch {
    return { valid: false };
  }
}
