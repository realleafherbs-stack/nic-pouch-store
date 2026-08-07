import { expect, test } from "@playwright/test";

const samplePath = "/shop/nois-50mg-43589";

test("balanced sample has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(samplePath);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("button", { name: /הוסף לעגלה/ })).toHaveCount(1);
});

test("balanced sample keeps gallery and purchase summary above the fold on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(samplePath);
  const gallery = page.locator(".pd-balanced .pd-gallery");
  const purchase = page.locator(".pd-balanced .pd-purchase-box");
  await expect(gallery).toBeVisible();
  await expect(purchase).toBeVisible();

  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const galleryBox = await gallery.boundingBox();
  const purchaseBox = await purchase.boundingBox();
  expect(galleryBox).not.toBeNull();
  expect(purchaseBox).not.toBeNull();
  expect(galleryBox!.y + galleryBox!.height).toBeLessThanOrEqual(viewportHeight);
  expect(purchaseBox!.y + purchaseBox!.height).toBeLessThanOrEqual(viewportHeight);
});
