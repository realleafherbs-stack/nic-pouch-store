import { describe, expect, it } from "vitest";
import { productVariantForSlug } from "@/lib/catalog/product-page-variant";

describe("product page variant selection", () => {
  it("selects balanced only for the approved sample slug", () => {
    expect(productVariantForSlug("nois-50mg-43589")).toBe("balanced");
    expect(productVariantForSlug("hqd-15mg-12345")).toBe("legacy");
  });
});
