import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const esc = (s: string = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, message } = body ?? {};

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
    return NextResponse.json({ error: "נא למלא שם, אימייל והודעה" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "כתובת אימייל לא תקינה" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
  } catch (verifyErr) {
    console.error("[contact] SMTP verify failed:", verifyErr);
    return NextResponse.json({ error: "שליחת הפנייה נכשלה. נסו שוב." }, { status: 502 });
  }

  try {
    await transporter.sendMail({
      from: `"NIC POUCH Website" <noreply@nicpouch.co.il>`,
      to: process.env.SMTP_USER!,
      replyTo: email,
      subject: `פנייה חדשה מהאתר – ${name}`,
      text: `שם: ${name}\nטלפון: ${phone || "—"}\nאימייל: ${email}\nהודעה: ${message}`,
      html: `
        <div dir="rtl" style="font-family:sans-serif;font-size:16px">
          <h2>פנייה חדשה מהאתר</h2>
          <p><strong>שם:</strong> ${esc(name)}</p>
          <p><strong>טלפון:</strong> ${esc(phone) || "—"}</p>
          <p><strong>אימייל:</strong> ${esc(email)}</p>
          <p><strong>הודעה:</strong><br/>${esc(message)}</p>
        </div>
      `,
    });
  } catch (sendErr) {
    console.error("[contact] sendMail failed:", sendErr);
    return NextResponse.json({ error: "שליחת הפנייה נכשלה. נסו שוב." }, { status: 502 });
  }

  // Save to CRM inbox as well — non-fatal, the email already went out.
  const apiBaseUrl = process.env.CRM_API_BASE_URL?.replace(/\/$/, "");
  const siteSlug = process.env.CRM_SITE_SLUG;
  const apiKey = process.env.CRM_API_KEY;
  if (apiBaseUrl && siteSlug && apiKey) {
    try {
      await fetch(`${apiBaseUrl}/${encodeURIComponent(siteSlug)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({ name, email, phone: phone || undefined, message }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      // Non-fatal — email already sent.
    }
  }

  return NextResponse.json({ ok: true });
}
