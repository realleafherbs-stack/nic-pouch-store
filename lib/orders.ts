// Nothing about a checkout becomes an Order in the CRM until payment is
// confirmed. The full order data is staged server-side (CRM's
// CheckoutIntent, keyed by orderId) before the customer is sent to pay, and
// consumed exactly once — turned into a real, already-paid Order — when Hyp
// redirects the customer back with that same order id (verified against
// Hyp's own transaction record via verifyHypRedirect() before this is ever
// called). If the customer's browser never makes it back, the intent just
// sits unconsumed — never a stuck "pending" order.
const ORDER_ID_PATTERN = /^NIC-\d+-[a-f0-9]{8}$/;

interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  apartment: string;
  notes?: string;
  address: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface OrderPayload {
  total: number;
  shipping: number;
  discount: number;
  coupon?: string;
  customer: OrderCustomer;
  items: OrderItem[];
}

async function postToCrm(path: string, body?: unknown): Promise<boolean> {
  const apiBaseUrl = process.env.CRM_API_BASE_URL?.replace(/\/$/, "");
  const siteSlug = process.env.CRM_SITE_SLUG;
  const apiKey = process.env.CRM_API_KEY;
  if (!apiBaseUrl || !siteSlug || !apiKey) return false;

  const url = `${apiBaseUrl}/${encodeURIComponent(siteSlug)}${path}`;
  const attempts = 3;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      if (res.ok) return true;
    } catch {
      // fall through to retry
    }
    if (attempt < attempts - 1) await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
  }
  return false;
}

export async function stageCheckoutIntent(orderId: string, payload: OrderPayload): Promise<boolean> {
  if (!ORDER_ID_PATTERN.test(orderId)) return false;
  return postToCrm("/checkout-intents", { id: orderId, payload });
}

export async function finalizeOrder(orderId: string): Promise<boolean> {
  if (!ORDER_ID_PATTERN.test(orderId)) return false;
  return postToCrm(`/checkout-intents/${encodeURIComponent(orderId)}/finalize`);
}
