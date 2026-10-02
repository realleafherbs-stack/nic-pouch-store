import { describe, expect, it } from "vitest";
import { getProductByCurrentOrLegacySlug } from "@/lib/catalog/local-repository";

describe("historic product slugs", () => {
  it("resolves a Hebrew legacy URL to the active semantic product", async () => {
    await expect(getProductByCurrentOrLegacySlug("hqd-אוכמניות-32787")).resolves.toMatchObject({
      slug: "hqd-blueberry-15",
    });
  });
});
