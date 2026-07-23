"use client";
import { useEffect, useState } from "react";

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
        <div className="logo"><span>NIC</span> POUCH</div>
        <p className="eyebrow">כניסה לבגירים בלבד</p>
        <h2 id="age-title">האם גילך מעל 18?</h2>
        <p>האתר כולל מוצרי ניקוטין, חומר ממכר שאינו מיועד לקטינים.</p>
        <button onClick={() => { localStorage.setItem("nic-age", "confirmed"); setOpen(false); }}>כן, אני מעל גיל 18</button>
        <a href="https://www.google.com">לא, יציאה מהאתר</a>
      </div>
    </div>
  );
}
