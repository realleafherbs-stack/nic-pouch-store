import { describe, expect, it } from "vitest";
import { legacyProductRedirectDestination } from "@/lib/catalog/legacy-product-redirects";

describe("legacy product redirects", () => {
  const oldHebrewPath = "/shop/hqd-אוכמניות-32787";

  it("finds the current product URL when Next provides a decoded Hebrew pathname", () => {
    expect(legacyProductRedirectDestination(oldHebrewPath)).toBe("/shop/hqd-blueberry-15");
  });

  it("finds the same redirect when the incoming pathname is percent-encoded", () => {
    expect(legacyProductRedirectDestination(encodeURI(oldHebrewPath))).toBe("/shop/hqd-blueberry-15");
  });

  it("leaves current and unknown product URLs alone", () => {
    expect(legacyProductRedirectDestination("/shop/hqd-blueberry-15")).toBeNull();
  });
});
