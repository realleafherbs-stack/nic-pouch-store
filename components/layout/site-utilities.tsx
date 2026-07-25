"use client";

import { useEffect, useState } from "react";
import { Accessibility, Cookie, X } from "lucide-react";
import Link from "next/link";

const options = [
  ["a11y-large-text", "הגדלת טקסט"],
  ["a11y-high-contrast", "ניגודיות גבוהה"],
  ["a11y-underline-links", "הדגשת קישורים"],
  ["a11y-reduce-motion", "הפחתת תנועה"],
] as const;

export function SiteUtilities() {
  const [open, setOpen] = useState<"accessibility" | "cookies" | null>(null);
  const [active, setActive] = useState<string[]>(() => typeof window === "undefined" ? [] : JSON.parse(localStorage.getItem("nic-pouch-accessibility") || "[]"));
  const [cookieChoice, setCookieChoice] = useState<string | null>(() => typeof window === "undefined" ? null : localStorage.getItem("nic-pouch-cookie-choice"));

  useEffect(() => {
    active.forEach((item) => document.documentElement.classList.add(item));
  }, [active]);

  function toggleOption(className: string) {
    const next = active.includes(className) ? active.filter((item) => item !== className) : [...active, className];
    setActive(next);
    document.documentElement.classList.toggle(className, next.includes(className));
    localStorage.setItem("nic-pouch-accessibility", JSON.stringify(next));
  }

  function chooseCookies(value: "essential" | "all") {
    localStorage.setItem("nic-pouch-cookie-choice", value);
    setCookieChoice(value);
    setOpen(null);
  }

  return (
    <>
      <button className="site-utility-button accessibility-trigger" aria-label="פתיחת אפשרויות נגישות" aria-expanded={open === "accessibility"} onClick={() => setOpen(open === "accessibility" ? null : "accessibility")}><Accessibility /></button>
      <button className="site-utility-button cookie-trigger" aria-label="פתיחת הגדרות עוגיות" aria-expanded={open === "cookies"} onClick={() => setOpen(open === "cookies" ? null : "cookies")}><Cookie /></button>

      {open === "accessibility" && <section className="utility-panel accessibility-panel" role="dialog" aria-modal="false" aria-label="אפשרויות נגישות">
        <header><h2>נגישות באתר</h2><button aria-label="סגירה" onClick={() => setOpen(null)}><X /></button></header>
        <div className="utility-options">{options.map(([className, label]) => <button className={active.includes(className) ? "active" : ""} aria-pressed={active.includes(className)} key={className} onClick={() => toggleOption(className)}>{label}</button>)}</div>
        <p><Link href="/accessibility">להצהרת הנגישות וליצירת קשר</Link></p>
      </section>}

      {open === "cookies" && <section className="utility-panel cookie-panel" role="dialog" aria-modal="false" aria-label="הגדרות עוגיות">
        <header><h2>עוגיות ופרטיות</h2><button aria-label="סגירה" onClick={() => setOpen(null)}><X /></button></header>
        <p>כרגע האתר משתמש באחסון חיוני בלבד להפעלת העגלה, אימות הגיל והעדפות הנגישות. כלי מדידה או פרסום עתידיים יופעלו רק בהתאם לבחירה שלכם.</p>
        <div className="utility-actions"><button onClick={() => chooseCookies("essential")}>חיוניות בלבד</button><button className="primary" onClick={() => chooseCookies("all")}>אישור הכול</button></div>
        {cookieChoice && <small>הבחירה הנוכחית נשמרה במכשיר הזה.</small>}
        <p><Link href="/privacy">למדיניות הפרטיות המלאה</Link></p>
      </section>}
    </>
  );
}
