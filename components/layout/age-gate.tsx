"use client";
import { useEffect, useState } from "react";
import { BrandLogo } from "./brand-logo";

export function AgeGate() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(localStorage.getItem("nic-age") !== "confirmed"), 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!open) return null;
  return (
    <div className="age-backdrop" role="dialog" aria-modal="true" aria-labelledby="age-title">
      <div className="age-card">
        <div className="age-mark" aria-hidden="true">18<span>+</span></div>
        <BrandLogo className="age-logo" />
        <h2 id="age-title">האתר מיועד למבוגרים בלבד</h2>
        <p>המוצרים באתר מכילים ניקוטין — חומר ממכר.<br />הכניסה מותרת לבני 18 ומעלה בלבד.</p>
        <button onClick={() => { localStorage.setItem("nic-age", "confirmed"); setOpen(false); }}>אני בן 18 ומעלה — כניסה</button>
        <a href="https://www.google.com">יציאה</a>
      </div>
    </div>
  );
}
