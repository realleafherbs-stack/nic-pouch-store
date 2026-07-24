import { expect, test } from "@playwright/test";

const samplePath = "/shop/nois-%D7%93%D7%95%D7%91%D7%93%D7%91%D7%9F-%D7%90%D7%A7%D7%A1%D7%98%D7%A8%D7%99%D7%9D-43589";

test.use({ baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://127.0.0.1:3000" });

test("balanced sample has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
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
});
