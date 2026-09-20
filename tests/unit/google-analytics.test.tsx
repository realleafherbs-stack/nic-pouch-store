import { fireEvent, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";

afterEach(() => vi.unstubAllGlobals());

it("keeps analytics storage denied until the visitor accepts measurement cookies", () => {
  const gtag = vi.fn();
  vi.stubGlobal("gtag", gtag);

  render(<GoogleAnalytics />);
  expect(gtag).toHaveBeenCalledWith("consent", "update", {
    analytics_storage: "denied",
  });

  localStorage.setItem("nic-pouch-cookie-choice", "all");
  fireEvent(window, new Event("nic-pouch-cookie-consent"));
  expect(gtag).toHaveBeenLastCalledWith("consent", "update", {
    analytics_storage: "granted",
  });

  localStorage.setItem("nic-pouch-cookie-choice", "essential");
  fireEvent(window, new Event("nic-pouch-cookie-consent"));
  expect(gtag).toHaveBeenLastCalledWith("consent", "update", {
    analytics_storage: "denied",
  });
});
