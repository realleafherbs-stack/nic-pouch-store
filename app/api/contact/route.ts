import { NextRequest, NextResponse } from "next/server";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(req: NextRequest) {
  const apiBaseUrl = process.env.CRM_API_BASE_URL?.replace(/\/$/, "");
  const siteSlug = process.env.CRM_SITE_SLUG;
  const apiKey = process.env.CRM_API_KEY;
  if (!apiBaseUrl || !siteSlug || !apiKey) {
    return NextResponse.json({ error: "CRM is not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { name, email, phone, message } = body ?? {};

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
    return NextResponse.json({ error: "נא למלא שם, אימייל והודעה" }, { status: 400 });
  }

  try {
    const res = await fetch(`${apiBaseUrl}/${encodeURIComponent(siteSlug)}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ name, email, phone: phone || undefined, message }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "שליחת הפנייה נכשלה. נסו שוב." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "שליחת הפנייה נכשלה. נסו שוב." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
