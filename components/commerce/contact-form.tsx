"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone") || undefined,
          message: form.get("message"),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "שליחת הפנייה נכשלה. נסו שוב.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("שליחת הפנייה נכשלה. נסו שוב.");
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="contact-form-success">
        <p>הפנייה נשלחה בהצלחה. נחזור אליכם בהקדם.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="checkout-grid">
        <label><span>שם</span><input name="name" autoComplete="name" required /></label>
        <label><span>אימייל</span><input name="email" type="email" autoComplete="email" required /></label>
        <label><span>טלפון (אופציונלי)</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" /></label>
        <label className="wide"><span>הודעה</span><textarea name="message" rows={5} required /></label>
      </div>
      {error && <div className="warning"><strong>שגיאה:</strong> {error}</div>}
      <button className="button" type="submit" disabled={submitting}>{submitting ? "שולח..." : "שליחת הפנייה"}</button>
    </form>
  );
}
