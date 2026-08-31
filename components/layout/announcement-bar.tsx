"use client";

import { useEffect, useState } from "react";

export function AnnouncementBar({ messages }: { messages: string[] }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);

    updatePreference();
    preference.addEventListener?.("change", updatePreference);
    return () => preference.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!reducedMotion || messages.length < 2) return;
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 4_000);
    return () => window.clearInterval(timer);
  }, [messages.length, reducedMotion]);

  return (
    <div className="announcement" aria-label="הודעות החנות">
      {reducedMotion ? (
        <p className="announcement-reduced" data-testid="reduced-motion-announcement">
          {messages[messageIndex]}
        </p>
      ) : (
        <div className="announcement-track">
          {[0, 1].map((group) => (
            <div className="announcement-group" aria-hidden={group === 1} key={group}>
              {messages.map((message) => <span key={`${group}-${message}`}>{message}</span>)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
