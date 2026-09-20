"use client";

import { useEffect } from "react";

type ConsentWindow = Window & {
  gtag?: (command: string, action: string, options: { analytics_storage: "denied" | "granted" }) => void;
};

export function GoogleAnalytics() {
  useEffect(() => {
    const syncConsent = () => {
      const analyticsStorage = localStorage.getItem("nic-pouch-cookie-choice") === "all" ? "granted" : "denied";
      (window as ConsentWindow).gtag?.("consent", "update", { analytics_storage: analyticsStorage });
    };

    syncConsent();
    window.addEventListener("nic-pouch-cookie-consent", syncConsent);
    window.addEventListener("storage", syncConsent);
    return () => {
      window.removeEventListener("nic-pouch-cookie-consent", syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  return null;
}
