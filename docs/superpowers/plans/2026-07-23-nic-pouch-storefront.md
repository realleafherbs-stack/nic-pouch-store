# NIC POUCH Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, mobile-first NIC POUCH B2C storefront that matches the supplied Figma direction, sells the active single-can catalog, supports high-quality SEO, and can later switch from local data to the Ducks CRM.

**Architecture:** Next.js App Router renders indexable pages on the server. Domain models and repository interfaces isolate UI components from the current local catalog and the future CRM API. Cart state is client-side for the first milestone; checkout persists a draft order through an adapter whose initial implementation is local/mock and whose future implementation targets CRM and HYP.

**Tech Stack:** Next.js 16.2, React 19.2, TypeScript, Tailwind CSS 4.3, Vitest, Testing Library, Playwright, axe-core.

## Global Constraints

- Hebrew RTL and mobile-first.
- B2C customers and adults only.
- NIC POUCH is independent from Polarized X and XVape.
- The store presents all relevant brands; NOIS receives contextual promotion but does not bias search or filters.
- Only active single-can products are included in the launch catalog.
- B2B prices are not exposed as retail prices.
- Free shipping threshold is 199 ILS.
- No live payment until a separate HYP terminal and credentials exist.
- No unsupported medical claims.
- Product, category, brand, article and policy pages must be server-rendered and indexable.
- Every task must preserve keyboard navigation, visible focus and reduced-motion behavior.

---

## File Structure

```text
app/
  (store)/
    page.tsx
    shop/page.tsx
    shop/[slug]/page.tsx
    brands/[slug]/page.tsx
    cart/page.tsx
    checkout/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    shipping/page.tsx
    accessibility/page.tsx
    privacy/page.tsx
    terms/page.tsx
  layout.tsx
  globals.css
  robots.ts
  sitemap.ts
components/
  commerce/
  layout/
  product/
  seo/
  ui/
data/
  catalog.generated.json
  articles.ts
  policies.ts
lib/
  catalog/
    model.ts
    repository.ts
    local-repository.ts
    selectors.ts
  cart/
    model.ts
    reducer.ts
  checkout/
    model.ts
    repository.ts
    local-repository.ts
  seo/
    metadata.ts
    schema.ts
scripts/
  import-woocommerce-csv.mjs
tests/
  unit/
  e2e/
public/
  products/
  brand/
```

---

### Task 1: Bootstrap the tested application shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `vitest.config.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/(store)/page.tsx`
- Create: `tests/unit/smoke.test.tsx`

**Interfaces:**
- Produces: a runnable Next.js App Router application and test command.

- [ ] **Step 1: Write the failing smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(store)/page";

it("renders the store identity", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { name: "כל מותגי הפאוצ׳ים במקום אחד" })).toBeVisible();
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `pnpm test -- tests/unit/smoke.test.tsx`

Expected: FAIL because the application and page do not exist.

- [ ] **Step 3: Create package scripts and minimal page**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

```tsx
export default function HomePage() {
  return <h1>כל מותגי הפאוצ׳ים במקום אחד</h1>;
}
```

- [ ] **Step 4: Run unit test, lint and production build**

Run: `pnpm test && pnpm lint && pnpm build`

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.ts postcss.config.mjs vitest.config.ts app tests
git commit -m "feat: bootstrap NIC POUCH storefront"
```

### Task 2: Define catalog contracts and import active single products

**Files:**
- Create: `lib/catalog/model.ts`
- Create: `lib/catalog/repository.ts`
- Create: `lib/catalog/local-repository.ts`
- Create: `scripts/import-woocommerce-csv.mjs`
- Create: `data/catalog.generated.json`
- Create: `tests/unit/catalog-import.test.ts`

**Interfaces:**
- Produces: `Product`, `Brand`, `StrengthLevel`, `CatalogRepository`, `localCatalogRepository`.
- `CatalogRepository.listProducts(query): Promise<Product[]>`
- `CatalogRepository.getProduct(slug): Promise<Product | null>`

- [ ] **Step 1: Write model and importer tests**

```ts
it("keeps only published single-can nicotine pouch products", async () => {
  const products = await importCatalog(fixtureCsv);
  expect(products.every((product) => product.active && product.packSize === 1)).toBe(true);
});

it("does not use the B2B price as retail price", async () => {
  const [product] = await importCatalog(fixtureCsv);
  expect(product.retailPrice).toBeNull();
  expect(product.sourcePrice).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `pnpm test -- tests/unit/catalog-import.test.ts`

Expected: FAIL because importer and types are missing.

- [ ] **Step 3: Implement typed model**

```ts
export type StrengthLevel = "mild" | "medium" | "strong" | "extra-strong";

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  flavor: string | null;
  flavorFamily: string | null;
  nicotineMg: number | null;
  strengthLevel: StrengthLevel | null;
  retailPrice: number | null;
  sourcePrice: number;
  stock: number;
  active: boolean;
  packSize: 1;
  images: string[];
}
```

- [ ] **Step 4: Import the supplied CSV**

Run:

```bash
pnpm import:catalog "/Users/dwrwnbrwn/Downloads/wc-product-export-23-7-2026-1784803498707.csv"
```

Expected: `data/catalog.generated.json` contains only active single-can products and reports rejected bundle rows.

- [ ] **Step 5: Run tests and commit**

```bash
pnpm test -- tests/unit/catalog-import.test.ts
git add lib/catalog scripts data tests/unit/catalog-import.test.ts
git commit -m "feat: add catalog model and WooCommerce importer"
```

### Task 3: Add the visual system and responsive site shell

**Files:**
- Create: `components/layout/announcement-bar.tsx`
- Create: `components/layout/site-header.tsx`
- Create: `components/layout/mobile-nav.tsx`
- Create: `components/layout/site-footer.tsx`
- Create: `components/layout/age-gate.tsx`
- Create: `components/ui/container.tsx`
- Create: `components/ui/button.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Test: `tests/unit/site-shell.test.tsx`

**Interfaces:**
- Produces: `SiteHeader`, `SiteFooter`, `AgeGate`, shared design tokens.

- [ ] **Step 1: Write accessibility tests**

```tsx
it("exposes navigation and skip link", () => {
  render(<RootLayout><div id="main">Content</div></RootLayout>);
  expect(screen.getByRole("link", { name: "דלגו לתוכן" })).toHaveAttribute("href", "#main");
  expect(screen.getByRole("navigation", { name: "ניווט ראשי" })).toBeVisible();
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `pnpm test -- tests/unit/site-shell.test.tsx`

Expected: FAIL because the shell components do not exist.

- [ ] **Step 3: Implement Figma-derived shell**

Use Heebo for body copy, tinted neutral surfaces, a restrained black/cream system, and brand accents derived from the Figma. The top bar displays free shipping over 199 ILS and delivery in up to three business days.

- [ ] **Step 4: Verify desktop, mobile and reduced motion**

Run: `pnpm test -- tests/unit/site-shell.test.tsx && pnpm build`

Expected: PASS and build exits 0.

- [ ] **Step 5: Commit**

```bash
git add app components tests/unit/site-shell.test.tsx
git commit -m "feat: add responsive accessible site shell"
```

### Task 4: Build the conversion-focused homepage

**Files:**
- Create: `components/commerce/hero.tsx`
- Create: `components/commerce/brand-strip.tsx`
- Create: `components/commerce/featured-products.tsx`
- Create: `components/commerce/strength-finder.tsx`
- Create: `components/commerce/nois-feature.tsx`
- Create: `components/commerce/trust-strip.tsx`
- Modify: `app/(store)/page.tsx`
- Test: `tests/unit/homepage.test.tsx`

**Interfaces:**
- Consumes: `CatalogRepository.listProducts`.
- Produces: homepage sections with contextual NOIS promotion.

- [ ] **Step 1: Write section and CTA tests**

```tsx
it("offers catalog discovery without hiding other brands", async () => {
  render(await HomePage());
  expect(screen.getByRole("link", { name: "לכל המוצרים" })).toHaveAttribute("href", "/shop");
  expect(screen.getByRole("heading", { name: "הכירו את NOIS" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "המותגים המובילים" })).toBeVisible();
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `pnpm test -- tests/unit/homepage.test.tsx`

Expected: FAIL because homepage sections do not exist.

- [ ] **Step 3: Implement homepage in the Figma visual language**

Include hero, brands, popular products, strength education, NOIS feature, trust, editorial cards and final CTA. Copy must avoid health claims.

- [ ] **Step 4: Run unit tests and build**

Run: `pnpm test -- tests/unit/homepage.test.tsx && pnpm build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app components tests/unit/homepage.test.tsx
git commit -m "feat: build conversion-focused homepage"
```

### Task 5: Implement catalog search, filters and product cards

**Files:**
- Create: `lib/catalog/selectors.ts`
- Create: `components/product/product-card.tsx`
- Create: `components/product/product-grid.tsx`
- Create: `components/product/catalog-filters.tsx`
- Create: `components/product/catalog-toolbar.tsx`
- Create: `app/(store)/shop/page.tsx`
- Test: `tests/unit/catalog-selectors.test.ts`
- Test: `tests/e2e/shop.spec.ts`

**Interfaces:**
- Produces: `filterProducts(products, query): Product[]`.
- Query keys: `q`, `brand`, `flavor`, `strength`, `inStock`, `sort`.

- [ ] **Step 1: Write filter tests**

```ts
it("combines brand and strength filters", () => {
  expect(filterProducts(products, { brand: ["CUBA"], strength: ["strong"] }))
    .toEqual([cubaStrong]);
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `pnpm test -- tests/unit/catalog-selectors.test.ts`

Expected: FAIL because selector is missing.

- [ ] **Step 3: Implement pure selectors and URL-backed filters**

All filters use URL search params. Filtered URLs are `noindex` unless represented by an approved landing page.

- [ ] **Step 4: Run unit and browser tests**

Run: `pnpm test -- tests/unit/catalog-selectors.test.ts && pnpm test:e2e -- tests/e2e/shop.spec.ts`

Expected: filters update results and survive reload.

- [ ] **Step 5: Commit**

```bash
git add app components lib tests
git commit -m "feat: add searchable filterable catalog"
```

### Task 6: Build brand and product detail pages

**Files:**
- Create: `app/(store)/brands/[slug]/page.tsx`
- Create: `app/(store)/shop/[slug]/page.tsx`
- Create: `components/product/product-gallery.tsx`
- Create: `components/product/product-summary.tsx`
- Create: `components/product/product-details.tsx`
- Create: `components/product/related-products.tsx`
- Create: `components/product/strength-warning.tsx`
- Test: `tests/unit/product-page.test.tsx`
- Test: `tests/e2e/product.spec.ts`

**Interfaces:**
- Consumes: `CatalogRepository.getProduct`.
- Produces: server-rendered product and brand pages.

- [ ] **Step 1: Write product content tests**

```tsx
it("shows price, stock, strength and nicotine warning", async () => {
  render(await ProductPage({ params: Promise.resolve({ slug: "cuba-example" }) }));
  expect(screen.getByText("34.90 ₪")).toBeVisible();
  expect(screen.getByText("חזק")).toBeVisible();
  expect(screen.getByText(/ניקוטין הוא חומר ממכר/)).toBeVisible();
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `pnpm test -- tests/unit/product-page.test.tsx`

Expected: FAIL because page does not exist.

- [ ] **Step 3: Implement product and brand templates**

Show source-backed attributes only. Missing attributes must be omitted, not invented. Add sticky mobile purchase action.

- [ ] **Step 4: Verify responsive interactions**

Run: `pnpm test -- tests/unit/product-page.test.tsx && pnpm test:e2e -- tests/e2e/product.spec.ts`

Expected: gallery, variant controls and add-to-cart flow pass.

- [ ] **Step 5: Commit**

```bash
git add app components tests
git commit -m "feat: add brand and product pages"
```

### Task 7: Add cart and checkout boundary

**Files:**
- Create: `lib/cart/model.ts`
- Create: `lib/cart/reducer.ts`
- Create: `components/commerce/cart-provider.tsx`
- Create: `components/commerce/cart-drawer.tsx`
- Create: `app/(store)/cart/page.tsx`
- Create: `lib/checkout/model.ts`
- Create: `lib/checkout/repository.ts`
- Create: `lib/checkout/local-repository.ts`
- Create: `app/(store)/checkout/page.tsx`
- Test: `tests/unit/cart-reducer.test.ts`
- Test: `tests/e2e/checkout.spec.ts`

**Interfaces:**
- Produces: `CartState`, `cartReducer`, `CheckoutRepository.createDraft`.
- `createDraft(input): Promise<{ orderId: string; paymentUrl: string | null }>`

- [ ] **Step 1: Write cart calculation tests**

```ts
it("grants free shipping at 199 ILS", () => {
  expect(calculateTotals([{ price: 99.5, quantity: 2 }]).shipping).toBe(0);
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `pnpm test -- tests/unit/cart-reducer.test.ts`

Expected: FAIL because cart model is missing.

- [ ] **Step 3: Implement cart and mock checkout**

Checkout validates contact details, address, age confirmation and terms. The mock repository creates a local order reference and clearly labels payment as unavailable until HYP is connected.

- [ ] **Step 4: Run end-to-end checkout**

Run: `pnpm test && pnpm test:e2e -- tests/e2e/checkout.spec.ts`

Expected: user can add, edit, remove and submit a draft order without a live payment.

- [ ] **Step 5: Commit**

```bash
git add app components lib tests
git commit -m "feat: add cart and checkout boundary"
```

### Task 8: Add blog, policies and reusable content

**Files:**
- Create: `data/articles.ts`
- Create: `data/policies.ts`
- Create: `app/(store)/blog/page.tsx`
- Create: `app/(store)/blog/[slug]/page.tsx`
- Create: `app/(store)/shipping/page.tsx`
- Create: `app/(store)/accessibility/page.tsx`
- Create: `app/(store)/privacy/page.tsx`
- Create: `app/(store)/terms/page.tsx`
- Create: `components/seo/article-layout.tsx`
- Test: `tests/unit/content-pages.test.tsx`

**Interfaces:**
- Produces: `Article`, `PolicyPage`, content page templates.

- [ ] **Step 1: Write content page tests**

```tsx
it("renders article author, update date, sources and related products", async () => {
  render(await ArticlePage({ params: Promise.resolve({ slug: "nicotine-pouch-guide" }) }));
  expect(screen.getByText("עודכן לאחרונה")).toBeVisible();
  expect(screen.getByRole("heading", { name: "מקורות" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "מוצרים קשורים" })).toBeVisible();
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `pnpm test -- tests/unit/content-pages.test.tsx`

Expected: FAIL because content pages are missing.

- [ ] **Step 3: Implement content templates and adapted policies**

Use the approved company facts and shipping terms. Mark legal copy for counsel review in source metadata, not in customer-facing text.

- [ ] **Step 4: Run tests and build**

Run: `pnpm test -- tests/unit/content-pages.test.tsx && pnpm build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app components data tests
git commit -m "feat: add blog and policy pages"
```

### Task 9: Implement technical SEO and structured data

**Files:**
- Create: `lib/seo/metadata.ts`
- Create: `lib/seo/schema.ts`
- Create: `components/seo/json-ld.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Test: `tests/unit/seo.test.ts`
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- Produces: `buildProductSchema`, `buildArticleSchema`, `buildBreadcrumbSchema`.

- [ ] **Step 1: Write structured data tests**

```ts
it("emits a purchasable Product Offer with stock and price", () => {
  const schema = buildProductSchema(product);
  expect(schema.offers).toMatchObject({
    "@type": "Offer",
    priceCurrency: "ILS",
    availability: "https://schema.org/InStock"
  });
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `pnpm test -- tests/unit/seo.test.ts`

Expected: FAIL because schema builders are missing.

- [ ] **Step 3: Implement metadata, canonical and JSON-LD**

Product, Article, Organization and Breadcrumb JSON-LD must reflect visible page data. Filter URLs are noindex. Sitemap includes only canonical active pages.

- [ ] **Step 4: Run unit and page-source checks**

Run: `pnpm test -- tests/unit/seo.test.ts && pnpm test:e2e -- tests/e2e/seo.spec.ts`

Expected: canonical, robots and JSON-LD assertions pass.

- [ ] **Step 5: Commit**

```bash
git add app components lib tests
git commit -m "feat: add technical SEO and structured data"
```

### Task 10: Complete quality, accessibility and performance verification

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/navigation.spec.ts`
- Modify: affected files from defects found during verification.

**Interfaces:**
- Consumes: complete storefront.
- Produces: verified release candidate.

- [ ] **Step 1: Add automated accessibility checks**

```ts
test("homepage has no serious axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
});
```

- [ ] **Step 2: Test target viewports**

Run: `pnpm test:e2e -- tests/e2e/responsive.spec.ts`

Expected: homepage, shop, product, cart and checkout pass at 390x844, 768x1024 and 1440x1000.

- [ ] **Step 3: Run full verification**

Run:

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

Expected: all commands exit 0.

- [ ] **Step 4: Inspect final pages visually**

Compare homepage, shop and product screenshots against the Figma at desktop and mobile widths. Fix spacing, typography, image crop, RTL order, focus states and overflow.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "test: verify storefront accessibility and responsive quality"
```

---

## Deferred Integration Plan

The initial release keeps these behind interfaces:

- `CrmCatalogRepository implements CatalogRepository`
- `CrmCheckoutRepository implements CheckoutRepository`
- Payper webhook ingestion in Ducks CRM
- HYP payment session creation and signed webhook handling

No frontend component may import CRM or payment vendor code directly.
