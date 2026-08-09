"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/catalog/model";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
}

const stars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

export function ProductReviews({ product }: { product: Product }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_CRM_URL}/api/${process.env.NEXT_PUBLIC_CRM_SITE_SLUG}/reviews?productId=${product.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { if (!cancelled) setReviews(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setReviews([]); });
    return () => { cancelled = true; };
  }, [product.id]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CRM_URL}/api/${process.env.NEXT_PUBLIC_CRM_SITE_SLUG}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, name: name.trim(), rating, text: text.trim() }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setName("");
      setText("");
      setRating(5);
    } catch {
      setError("שגיאה בשליחת חוות הדעת. נסו שוב.");
    }
    setSubmitting(false);
  }

  const count = reviews?.length ?? 0;
  const average = count ? reviews!.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return (
    <section className="pd-reviews-section container" aria-label="חוות דעת">
      <div className="pd-reviews-heading">
        <h2>חוות דעת{count > 0 ? ` (${count})` : ""}</h2>
        {count > 0 && (
          <div className="pd-reviews-average">
            <span aria-hidden="true">{stars(Math.round(average))}</span>
            <span>{average.toFixed(1)} מתוך 5</span>
          </div>
        )}
      </div>

      {reviews === null ? null : reviews.length === 0 ? (
        <p className="pd-reviews-empty">אין חוות דעת עדיין. היו הראשונים לכתוב אחת.</p>
      ) : (
        <div className="pd-reviews-list">
          {reviews.map((review) => (
            <div className="pd-review" key={review.id}>
              <div className="pd-review-head">
                <strong>{review.name}</strong>
                <span aria-hidden="true">{stars(review.rating)}</span>
              </div>
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pd-review-form-wrap">
        {submitted ? (
          <p className="pd-review-thanks">תודה על חוות הדעת! היא תוצג לאחר אישור.</p>
        ) : (
          <form className="pd-review-form" onSubmit={handleSubmit}>
            <h3>כתבו חוות דעת</h3>
            <div className="pd-review-stars" role="radiogroup" aria-label="דירוג">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setRating(value)}
                  aria-label={`${value} כוכבים`}
                  aria-pressed={rating === value}
                >
                  {value <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>
            <label><span>שם</span><input value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} /></label>
            <label><span>חוות דעת</span><textarea value={text} onChange={(event) => setText(event.target.value)} rows={4} required maxLength={2000} /></label>
            {error && <p className="pd-review-error">{error}</p>}
            <button className="button" type="submit" disabled={submitting}>{submitting ? "שולח..." : "שליחת חוות דעת"}</button>
          </form>
        )}
      </div>
    </section>
  );
}
