import { describe, expect, it } from "vitest";
import { retiredProductRedirectDestination } from "@/lib/catalog/retired-product-redirects";

describe("retired product redirects", () => {
  it("sends discontinued legacy HQD products to the live catalog", () => {
    expect(retiredProductRedirectDestination("hqd-אוכמניות-32787")).toBe("/shop");
  });
});
