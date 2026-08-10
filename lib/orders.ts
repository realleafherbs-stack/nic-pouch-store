// Nothing about a checkout is written to the CRM until payment is confirmed.
// Order data is instead signed into a token and threaded through Hyp's own
// redirect (see app/api/hyp-checkout/route.ts). When Hyp sends the customer
// back to /payment/success, that token is verified — alongside Hyp's own
// signed redirect params via verifyHypRedirect() — and the order is created
// already-paid in one shot. If the customer's browser never makes it back
// here, nothing was ever written — there is no "pending" order to get stuck.
import crypto from "node:crypto";

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
  id: string;
  total: number;
  shipping: number;
  discount: number;
  coupon?: string;
  customer: OrderCustomer;
  items: OrderItem[];
}

function signingSecret(): string {
  const secret = process.env.HYP_KEY;
  if (!secret) throw new Error("HYP_KEY not configured");
  return secret;
}

export function signOrderToken(payload: OrderPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = crypto.createHmac("sha256", signingSecret()).update(body).digest("hex");
  return `${body}.${signature}`;
}

function verifyOrderToken(token: string): OrderPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = crypto.createHmac("sha256", signingSecret()).update(body).digest("hex");
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(signatureBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as OrderPayload;
    if (!ORDER_ID_PATTERN.test(payload.id)) return null;
    return payload;
  } catch {
    return null;
  }
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

// Verifies the token could only have come from our own server (HMAC-signed
// at checkout time, so the browser/Hyp round-trip can't tamper with the
// total, items, or customer data), cross-checks it against the order id Hyp
// itself echoes back, then creates the order in the CRM and immediately
// confirms it (marks paid, triggers the Payper invoice). Callers must have
// already verified the redirect itself via verifyHypRedirect() — this only
// proves the *data* wasn't tampered with, not that a real payment happened.
export async function finalizeOrderFromToken(token: string, hypOrderId: string): Promise<boolean> {
  const payload = verifyOrderToken(token);
  if (!payload || payload.id !== hypOrderId) return false;

  const created = await postToCrm("/orders", {
    id: payload.id,
    total: payload.total,
    shipping: payload.shipping,
    discount: payload.discount,
    coupon: payload.coupon,
    customer: payload.customer,
    items: payload.items,
  });
  if (!created) return false;

  return postToCrm(`/orders/${encodeURIComponent(payload.id)}/confirm`);
}
