import { expect, it } from "vitest";

import { createAnalyticsBootstrap } from "@/lib/analytics-bootstrap";

it("denies cookies before config and removes payment details from GA page URLs", () => {
  const browserWindow = {
    dataLayer: [] as unknown[],
    location: new URL("https://nicpouch.co.il/payment/success?Order=private-order&CCode=0&utm_source=google"),
  };
  const browserDocument = {
    referrer: "https://nicpouch.co.il/checkout?email=customer@example.com",
  };

  new Function("window", "document", "localStorage", "URL", createAnalyticsBootstrap("G-M7N2S68MQZ"))(
    browserWindow,
    browserDocument,
    { getItem: () => null },
    URL,
  );

  const commands = browserWindow.dataLayer.map((entry) => Array.from(entry as ArrayLike<unknown>));
  expect(commands[0]).toEqual([
    "consent",
    "default",
    {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
  ]);

  const config = commands.find((entry) => entry[0] === "config");
  expect(config?.[2]).toMatchObject({
    page_location: "https://nicpouch.co.il/payment/success?utm_source=google",
    page_referrer: "https://nicpouch.co.il/checkout",
  });
});
