import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/catalog/local-repository";
import { linePrice, unitPriceForQuantity } from "@/lib/catalog/pricing";
import { siteUrl } from "@/lib/seo";

// Matches lib/cart/reducer.ts's cartTotals() exactly — the free-shipping
// threshold shown to the customer in the cart must match what's actually
// charged here, or the two disagree at the worst possible moment.
const FREE_SHIPPING_THRESHOLD = 199;
const SHIPPING_COST = 29;

interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

interface CheckoutBody {
  items: CheckoutItem[];
  customer: CheckoutCustomer;
  coupon?: string;
}

function formatHypAmount(value: number) {
  return value.toFixed(2);
}

function sanitizeHypItemDescription(value: string) {
  return value.replace(/[~[\]]/g, " ").replace(/\s+/g, " ").trim();
}

function createHypLine(description: string, qty: number, price: number) {
  return `[0~${sanitizeHypItemDescription(description)}~${qty}~${formatHypAmount(price)}]`;
}

// Hyp's ClientName/ClientLName come back garbled for non-ASCII input no
// matter the encoding used — their SIGN action percent-encodes them but the
// hosted page never decodes it back. Plain ASCII sidesteps the bug; this is
// a consistent, readable transliteration, not a "correct" romanization.
const HEBREW_TRANSLITERATION: Record<string, string> = {
  "א": "", "ב": "b", "ג": "g", "ד": "d", "ה": "h", "ו": "o", "ז": "z",
  "ח": "ch", "ט": "t", "י": "y", "כ": "k", "ך": "ch", "ל": "l", "מ": "m",
  "ם": "m", "נ": "n", "ן": "n", "ס": "s", "ע": "a", "פ": "p", "ף": "f",
  "צ": "tz", "ץ": "tz", "ק": "k", "ר": "r", "ש": "sh", "ת": "t",
};

function transliterateName(value: string) {
  const transliterated = value.split("").map((ch) => HEBREW_TRANSLITERATION[ch] ?? ch).join("");
  return transliterated.charAt(0).toUpperCase() + transliterated.slice(1);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(req: NextRequest) {
  const masof = process.env.HYP_MASOF;
  const key = process.env.HYP_KEY;
  const passP = process.env.HYP_PASSP;

  if (!masof || !key || !passP) {
    return NextResponse.json(
      { error: "Hyp Pay credentials not configured. Set HYP_MASOF, HYP_KEY, HYP_PASSP in .env.local" },
      { status: 500 },
    );
  }

  const apiBaseUrl = process.env.CRM_API_BASE_URL?.replace(/\/$/, "");
  const siteSlug = process.env.CRM_SITE_SLUG;
  const apiKey = process.env.CRM_API_KEY;
  if (!apiBaseUrl || !siteSlug || !apiKey) {
    return NextResponse.json({ error: "CRM is not configured (CRM_API_BASE_URL/CRM_SITE_SLUG/CRM_API_KEY)" }, { status: 500 });
  }

  const body: CheckoutBody = await req.json();
  const { items, customer, coupon } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  for (const item of items) {
    if (!isNonEmptyString(item.productId) || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
    }
  }
  if (
    !customer ||
    !isNonEmptyString(customer.firstName) ||
    !isNonEmptyString(customer.lastName) ||
    !isNonEmptyString(customer.email) ||
    !isNonEmptyString(customer.phone) ||
    !isNonEmptyString(customer.street) ||
    !isNonEmptyString(customer.city)
  ) {
    return NextResponse.json({ error: "Missing required customer details" }, { status: 400 });
  }

  // Prices always come from the current catalog, never from the client —
  // this catalog has quantity-tier pricing (buy 5/10 discounts), so a naive
  // client-supplied total could easily be wrong even without tampering.
  const products = getProductsByIds(items.map((item) => item.productId));
  if (products.length !== items.length) {
    return NextResponse.json({ error: "One or more products could not be found" }, { status: 400 });
  }
  const pricedItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return { product, quantity: item.quantity };
  });

  const itemsTotal = pricedItems.reduce((sum, { product, quantity }) => sum + linePrice(product, quantity), 0);

  let discount = 0;
  let appliedCoupon: string | undefined;
  if (isNonEmptyString(coupon)) {
    try {
      const couponRes = await fetch(`${apiBaseUrl}/${encodeURIComponent(siteSlug)}/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon }),
        signal: AbortSignal.timeout(10_000),
      });
      if (couponRes.ok) {
        const couponData = await couponRes.json();
        discount = couponData.type === "PERCENT"
          ? Math.round(((itemsTotal * couponData.value) / 100) * 100) / 100
          : Math.min(couponData.value, itemsTotal);
        appliedCoupon = couponData.code ?? coupon;
      }
    } catch {
      // Coupon service unreachable — proceed without a discount rather than block checkout.
    }
  }

  const shipping = itemsTotal > 0 && itemsTotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_COST : 0;
  const payableItemsTotal = Math.max(0, itemsTotal - discount);
  const amount = payableItemsTotal + shipping;

  if (amount <= 0) {
    return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
  }

  // Generated server-side — never trust a client-supplied order id.
  const orderId = `NIC-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

  const paymentItems = pricedItems.map(({ product, quantity }) =>
    createHypLine(product.flavor ? `${product.brand} ${product.flavor}` : product.name, quantity, unitPriceForQuantity(product, quantity)),
  );
  if (discount > 0) {
    paymentItems.push(createHypLine(appliedCoupon ? `הנחת קופון ${appliedCoupon}` : "הנחה", 1, -discount));
  }
  if (shipping > 0) {
    paymentItems.push(createHypLine("משלוח", 1, shipping));
  }

  const fullAddress = `${customer.street}${customer.postalCode ? `, ${customer.postalCode}` : ""}`;

  // Save the order in the CRM before sending the customer to pay — required,
  // not best-effort. A successful Hyp payment with no matching CRM order
  // would have no way to ever be confirmed or invoiced, since the confirm
  // step requires this record to already exist.
  try {
    const orderRes = await fetch(`${apiBaseUrl}/${encodeURIComponent(siteSlug)}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({
        id: orderId,
        total: amount,
        shipping,
        discount,
        coupon: appliedCoupon,
        customer: { ...customer, address: fullAddress },
        items: pricedItems.map(({ product, quantity }) => ({
          id: product.id,
          name: product.name,
          price: unitPriceForQuantity(product, quantity),
          qty: quantity,
        })),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!orderRes.ok) {
      console.error("CRM order creation failed:", orderRes.status, await orderRes.text());
      return NextResponse.json({ error: "לא ניתן לשמור את ההזמנה. נסו שוב." }, { status: 502 });
    }
  } catch (err) {
    console.error("CRM order creation request failed:", err);
    return NextResponse.json({ error: "לא ניתן לשמור את ההזמנה. נסו שוב." }, { status: 502 });
  }

  const params = new URLSearchParams({
    action: "APISign",
    What: "SIGN",
    Sign: "True",
    KEY: key,
    PassP: passP,
    Masof: masof,
    Amount: formatHypAmount(amount),
    Coin: "1",
    Order: orderId,
    PageLang: "HEB",
    sendemail: "True",
    MoreData: "True",
    Pritim: "True",
    Tash: "1",
    heshDesc: paymentItems.join(""),
    SuccessUrl: `${siteUrl}/payment/success`,
    ErrorUrl: `${siteUrl}/payment/failure`,
  });
  if (customer.firstName) params.set("ClientName", transliterateName(customer.firstName));
  if (customer.lastName) params.set("ClientLName", transliterateName(customer.lastName));

  let signedParams: string;
  try {
    const resp = await fetch(`https://pay.hyp.co.il/p/?${params.toString()}`, { signal: AbortSignal.timeout(10_000) });
    signedParams = await resp.text();
  } catch (err) {
    console.error("Hyp APISign request failed:", err);
    return NextResponse.json({ error: "שגיאה בחיבור לשער התשלומים" }, { status: 502 });
  }

  if (signedParams.includes("CCode=") && !signedParams.includes("action=pay")) {
    return NextResponse.json({ error: "שגיאה משער התשלומים", details: signedParams }, { status: 400 });
  }

  return NextResponse.json({ paymentUrl: `https://pay.hyp.co.il/p/?${signedParams}` });
}
