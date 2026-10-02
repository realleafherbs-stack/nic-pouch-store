const retiredProductRedirects = new Map<string, string>([
  ["hqd-פאוץ-ניקוטין-באבל-גאם-31646", "/shop"],
  ["hqd-אוכמניות-32787", "/shop"],
  ["hqd-פאוץ-ניקוטין-מנגו-20325", "/shop"],
  ["hqd-פאוץ-ניקוטין-פטל-שחור-32779", "/shop"],
]);

/** Redirect discontinued historic product URLs to the current catalog. */
export function retiredProductRedirectDestination(slug: string): string | null {
  return retiredProductRedirects.get(slug) ?? null;
}
