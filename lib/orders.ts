// Confirms an order as paid in the CRM (marks it paid, triggers the Payper
// invoice). Idempotent server-side — safe to call more than once for the
// same order. Retries a few times so a single transient network failure
// doesn't leave an order stuck at "pending" forever with no second chance.
const ORDER_ID_PATTERN = /^NIC-\d+-[a-f0-9]{8}$/;

export async function confirmOrderServerSide(orderId: string): Promise<boolean> {
  if (!ORDER_ID_PATTERN.test(orderId)) return false;

  const apiBaseUrl = process.env.CRM_API_BASE_URL?.replace(/\/$/, "");
  const siteSlug = process.env.CRM_SITE_SLUG;
  const apiKey = process.env.CRM_API_KEY;
  if (!apiBaseUrl || !siteSlug || !apiKey) return false;

  const url = `${apiBaseUrl}/${encodeURIComponent(siteSlug)}/orders/${encodeURIComponent(orderId)}/confirm`;
  const attempts = 3;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) return true;
    } catch {
      // fall through to retry
    }
    if (attempt < attempts - 1) await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
  }

  return false;
}
