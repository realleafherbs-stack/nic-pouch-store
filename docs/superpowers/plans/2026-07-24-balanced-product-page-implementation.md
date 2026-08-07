# Balanced Product Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify the approved balanced product-page experience on the single NOIS Cherry Extreme 50 mg sample product, without deploying it or changing CRM/Payper/other sites.

**Architecture:** Keep catalog data and tier-pricing logic as the source of truth, while splitting the current monolithic product detail into focused purchase, facts/content, and related-products components. Gate the redesigned layout by the approved sample slug so every other NIC POUCH product remains unchanged until explicit approval.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Testing Library, Lucide React, existing CSS design tokens.

## Global Constraints

- Scope is the single NOIS Cherry Extreme 50 mg product sample.
- Do not deploy this implementation before visual and functional approval.
- Do not modify CRM, Payper, DNS, Polarized-X, B2B, or any other site.
- Use only the original product image and catalog facts; do not alter packaging, logos, warnings, product names, or strength markings.
- Do not invent popularity, reviews, ratings, discounts, ingredients, health claims, or product benefits.
- Purchase quantities are 1, 5, and 10; unit price and total must always come from `lib/catalog/pricing.ts`.
- Mobile must not render a duplicate sticky purchase bar.
- Keep all existing product pages working while the sample is reviewed.

---

## File Structure

- `components/product/product-purchase-panel.tsx`: owns quantity state, tier buttons, total calculation, stock state, and add-to-cart feedback.
- `components/product/product-facts.tsx`: renders catalog-backed facts and product specifications without invented copy.
- `components/product/product-content.tsx`: renders the approved SEO/information, warning, shipping summary, and FAQ sections.
- `components/product/related-products.tsx`: renders one accessible horizontal carousel on mobile and desktop.
- `components/product/product-detail.tsx`: composes gallery, summary, and the four focused child components.
- `app/(store)/shop/[slug]/page.tsx`: selects the approved sample layout and keeps all other products on the current layout.
- `app/globals.css`: contains the scoped responsive visual treatment for the sample page.
- `tests/unit/product-purchase-panel.test.tsx`: verifies quantity tiers, plus/minus recalculation, cart behavior, and stock handling.
- `tests/unit/product-detail.test.tsx`: verifies accurate content, absence of fake claims, and related-product behavior.
- `tests/e2e/product-page.spec.ts`: verifies the sample at desktop and mobile sizes and checks for horizontal overflow.

### Task 1: Extract and verify the purchase panel

**Files:**
- Create: `components/product/product-purchase-panel.tsx`
- Create: `tests/unit/product-purchase-panel.test.tsx`
- Modify: `components/product/product-detail.tsx`

**Interfaces:**
- Consumes: `Product`, `PURCHASE_QUANTITIES`, `unitPriceForQuantity(product, quantity)`, `linePrice(product, quantity)`, and `useCart()`.
- Produces: `ProductPurchasePanel({ product }: { product: Product }): JSX.Element`.

- [ ] **Step 1: Write failing tests for the purchase behavior**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider } from "@/components/commerce/cart-provider";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import type { Product } from "@/lib/catalog/model";

const product: Product = {
  id: "nois-cherry", slug: "nois-cherry", sku: "NOIS-CHERRY",
  name: "NOIS דובדבן אקסטרים", brand: "NOIS", flavor: "דובדבן אקסטרים",
  nicotineMg: 50, strengthLevel: "extra-strong", retailPrice: 29,
  priceTiers: [{ minQuantity: 5, unitPrice: 28 }, { minQuantity: 10, unitPrice: 27 }],
  sourcePrice: 20, stock: 20, active: true, packSize: 1,
  images: ["/products/nois-cherry.webp"], categories: ["פאוצ׳ים"],
};

it("shows catalog-backed 1, 5 and 10 unit prices and totals", () => {
  render(<CartProvider><ProductPurchasePanel product={product} /></CartProvider>);
  expect(screen.getByRole("button", { name: /5 יחידות, 28.00 ₪ ליחידה/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /10 יחידות, 27.00 ₪ ליחידה/ }));
  expect(screen.getByText("270.00 ₪")).toBeInTheDocument();
});

it("recalculates the applicable tier when quantity changes", () => {
  render(<CartProvider><ProductPurchasePanel product={product} /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: /5 יחידות/ }));
  fireEvent.click(screen.getByRole("button", { name: "הגדלת כמות" }));
  expect(screen.getByText("168.00 ₪")).toBeInTheDocument();
  expect(screen.getByText("28.00 ₪ ליח׳")).toBeInTheDocument();
});

it("adds the selected quantity to the shared cart once", () => {
  render(<CartProvider><ProductPurchasePanel product={product} /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: /5 יחידות/ }));
  fireEvent.click(screen.getByRole("button", { name: "הוסף לעגלה · 5" }));
  expect(screen.getByRole("button", { name: "נוספו 5 יחידות לעגלה" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the purchase-panel tests and verify they fail**

Run: `pnpm test -- tests/unit/product-purchase-panel.test.tsx`

Expected: FAIL because `@/components/product/product-purchase-panel` does not exist.

- [ ] **Step 3: Implement the focused purchase panel**

```tsx
"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/catalog/model";
import { linePrice, PURCHASE_QUANTITIES, unitPriceForQuantity } from "@/lib/catalog/pricing";
import { useCart } from "@/components/commerce/cart-provider";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [addedQuantity, setAddedQuantity] = useState<number | null>(null);
  const { dispatch } = useCart();
  const inStock = product.stock > 0;
  const unitPrice = unitPriceForQuantity(product, quantity);

  function selectQuantity(value: number) {
    setQuantity(value);
    setAddedQuantity(null);
  }

  function addToCart() {
    if (!inStock) return;
    dispatch({ type: "add", product, quantity });
    setAddedQuantity(quantity);
  }

  return (
    <div className="pd-purchase-box">
      <fieldset className="pd-pack-choice">
        <legend>בחרו כמות</legend>
        <div>
          {PURCHASE_QUANTITIES.map((amount) => {
            const tierUnitPrice = unitPriceForQuantity(product, amount);
            return (
              <button
                type="button"
                key={amount}
                className={quantity === amount ? "active" : ""}
                onClick={() => selectQuantity(amount)}
                aria-pressed={quantity === amount}
                aria-label={`${amount} יחידות, ${tierUnitPrice.toFixed(2)} ₪ ליחידה`}
              >
                <strong>{amount}</strong>
                <small>{tierUnitPrice.toFixed(2)} ₪ ליח׳</small>
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="pd-purchase-row">
        <span>כמות</span>
        <div className="pd-quantity" aria-label="בחירת כמות">
          <button type="button" onClick={() => selectQuantity(Math.max(1, quantity - 1))} aria-label="הקטנת כמות"><Minus /></button>
          <output aria-live="polite">{quantity}</output>
          <button type="button" onClick={() => selectQuantity(quantity + 1)} aria-label="הגדלת כמות"><Plus /></button>
        </div>
      </div>
      <p className="pd-purchase-total">
        <span>{unitPrice.toFixed(2)} ₪ ליח׳</span>
        <strong>{linePrice(product, quantity).toFixed(2)} ₪</strong>
      </p>
      <button
        type="button"
        disabled={!inStock}
        className="pd-add"
        onClick={addToCart}
        aria-label={addedQuantity ? `נוספו ${addedQuantity} יחידות לעגלה` : `הוסף לעגלה · ${quantity}`}
      >
        <ShoppingBag />
        {!inStock ? "אזל מהמלאי" : addedQuantity ? `נוספו ${addedQuantity} יחידות` : `הוסף לעגלה · ${quantity}`}
      </button>
    </div>
  );
}
```

Replace the inline purchase markup and quantity state in `product-detail.tsx` with:

```tsx
<ProductPurchasePanel product={product} />
```

- [ ] **Step 4: Run the focused and existing product tests**

Run: `pnpm test -- tests/unit/product-purchase-panel.test.tsx tests/unit/product-detail.test.tsx`

Expected: PASS for both test files.

- [ ] **Step 5: Commit the purchase-panel extraction**

```bash
git add components/product/product-purchase-panel.tsx components/product/product-detail.tsx tests/unit/product-purchase-panel.test.tsx tests/unit/product-detail.test.tsx
git commit -m "feat: extract catalog-backed product purchase panel"
```

### Task 2: Render accurate facts and SEO content

**Files:**
- Create: `components/product/product-facts.tsx`
- Create: `components/product/product-content.tsx`
- Modify: `components/product/product-detail.tsx`
- Modify: `tests/unit/product-detail.test.tsx`

**Interfaces:**
- Consumes: `Product` and the existing `StrengthLevel` values.
- Produces: `ProductFacts({ product, compact? })` and `ProductContent({ product })`.

- [ ] **Step 1: Add failing accuracy and no-fabrication tests**

```tsx
it("renders only catalog-backed product facts", () => {
  render(<CartProvider><ProductDetail product={product} related={[]} variant="balanced" /></CartProvider>);
  expect(screen.getAllByText("50 מ״ג").length).toBeGreaterThan(0);
  expect(screen.getAllByText("חזק מאוד").length).toBeGreaterThan(0);
  expect(screen.getByText("NOIS-CHERRY")).toBeInTheDocument();
});

it("does not fabricate popularity, reviews or ratings", () => {
  render(<CartProvider><ProductDetail product={product} related={[]} variant="balanced" /></CartProvider>);
  expect(screen.queryByText("פופולרי")).not.toBeInTheDocument();
  expect(screen.queryByText(/חוות דעת/)).not.toBeInTheDocument();
  expect(screen.queryByText(/☆/)).not.toBeInTheDocument();
});

it("contains the approved warning, storage and FAQ information", () => {
  render(<CartProvider><ProductDetail product={product} related={[]} variant="balanced" /></CartProvider>);
  expect(screen.getByText(/ניקוטין הוא חומר ממכר/)).toBeInTheDocument();
  expect(screen.getByText(/מקום קריר ויבש/)).toBeInTheDocument();
  expect(screen.getByText("מהי עוצמת המוצר?")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the product-detail tests and verify they fail**

Run: `pnpm test -- tests/unit/product-detail.test.tsx`

Expected: FAIL because `variant="balanced"` and the new accurate content are not implemented.

- [ ] **Step 3: Implement `ProductFacts`**

```tsx
import { CircleGauge, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import type { Product, StrengthLevel } from "@/lib/catalog/model";

export const strengthLabels: Record<StrengthLevel, string> = {
  mild: "עדין",
  medium: "בינוני",
  strong: "חזק",
  "extra-strong": "חזק מאוד",
};

export function ProductFacts({ product }: { product: Product }) {
  const strength = product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי היצרן";
  return (
    <div className="pd-quick-facts" aria-label="עובדות מרכזיות">
      <div><CircleGauge /><strong>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "לפי האריזה"}</strong><span>ניקוטין</span></div>
      <div><Sparkles /><strong>{product.flavor || "לא צוין"}</strong><span>טעם</span></div>
      <div><ShieldCheck /><strong>{strength}</strong><span>עוצמה</span></div>
      <div><PackageCheck /><strong>{product.packSize > 1 ? `${product.packSize} יח׳` : "יחידה"}</strong><span>אריזה</span></div>
    </div>
  );
}
```

- [ ] **Step 4: Implement `ProductContent` with four explicit FAQs**

```tsx
import type { Product } from "@/lib/catalog/model";
import { strengthLabels } from "./product-facts";

export function ProductContent({ product }: { product: Product }) {
  const strength = product.strengthLevel ? strengthLabels[product.strengthLevel] : "לפי סימון היצרן";
  return (
    <section className="pd-content" aria-label="מידע על המוצר">
      <div className="pd-specification">
        <h2>פרטי המוצר</h2>
        <dl>
          <div><dt>מותג</dt><dd>{product.brand}</dd></div>
          <div><dt>טעם</dt><dd>{product.flavor || "לא צוין"}</dd></div>
          <div><dt>ניקוטין</dt><dd>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "לפי האריזה"}</dd></div>
          <div><dt>עוצמה</dt><dd>{strength}</dd></div>
          <div><dt>מק״ט</dt><dd>{product.sku}</dd></div>
        </dl>
      </div>
      <div className="pd-information">
        <h2>מידע חשוב לפני הרכישה</h2>
        <p>{product.name} הוא מוצר של {product.brand}. נתוני הטעם, העוצמה והניקוטין בדף מבוססים על הקטלוג וסימון האריזה.</p>
        <h3>שימוש ואחסון</h3>
        <p>יש לשמור במקום קריר ויבש, באריזה סגורה והרחק מהישג ידם של ילדים ובעלי חיים.</p>
        <h3>משלוח</h3>
        <p>אספקה רגילה עד 3 ימי עסקים, בהתאם ליישוב ולחברת המשלוחים. משלוח חינם בקנייה מעל 199 ₪.</p>
      </div>
      <div className="warning"><strong>אזהרה:</strong> ניקוטין הוא חומר ממכר. המוצר מיועד לבגירים בלבד.</div>
      <div className="pd-faq">
        <h2>שאלות נפוצות</h2>
        <details><summary>מהי עוצמת המוצר?</summary><p>{strength}{product.nicotineMg ? `, ${product.nicotineMg} מ״ג לפי סימון המוצר.` : ", לפי סימון היצרן."}</p></details>
        <details><summary>מהו הטעם?</summary><p>{product.flavor || "הטעם לא צוין בקטלוג."}</p></details>
        <details><summary>כיצד שומרים את המוצר?</summary><p>במקום קריר ויבש, באריזה סגורה והרחק מילדים ובעלי חיים.</p></details>
        <details><summary>מתי המשלוח מגיע?</summary><p>אספקה רגילה עד 3 ימי עסקים, בכפוף ליישוב ולחברת המשלוחים.</p></details>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Compose the facts and content in `product-detail.tsx`**

Add:

```tsx
<ProductFacts product={product} />
```

below the price/stock line, and:

```tsx
<ProductContent product={product} />
```

after the main two-column section. Remove the fake popularity badge, star row, duplicated feature cards, and duplicated accordions from the balanced variant.

- [ ] **Step 6: Run the unit tests**

Run: `pnpm test -- tests/unit/product-detail.test.tsx tests/unit/product-purchase-panel.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit the accurate facts and content**

```bash
git add components/product/product-facts.tsx components/product/product-content.tsx components/product/product-detail.tsx tests/unit/product-detail.test.tsx
git commit -m "feat: add accurate product facts and buying guidance"
```

### Task 3: Isolate the balanced layout to the approved NOIS sample

**Files:**
- Modify: `components/product/product-detail.tsx`
- Modify: `app/(store)/shop/[slug]/page.tsx`
- Modify: `tests/unit/product-detail.test.tsx`

**Interfaces:**
- Consumes: `ProductDetailProps`.
- Produces: `ProductDetail({ product, related, variant = "legacy" }: ProductDetailProps)` where `variant` is `"legacy" | "balanced"`.

- [ ] **Step 1: Add a failing variant-isolation test**

```tsx
it("keeps the existing layout unless the balanced variant is requested", () => {
  const { rerender } = render(<CartProvider><ProductDetail product={product} related={[]} /></CartProvider>);
  expect(screen.queryByRole("heading", { name: "מידע חשוב לפני הרכישה" })).not.toBeInTheDocument();
  rerender(<CartProvider><ProductDetail product={product} related={[]} variant="balanced" /></CartProvider>);
  expect(screen.getByRole("heading", { name: "מידע חשוב לפני הרכישה" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the isolation test and verify it fails**

Run: `pnpm test -- tests/unit/product-detail.test.tsx -t "keeps the existing layout"`

Expected: FAIL because the variant prop is not implemented.

- [ ] **Step 3: Add the explicit variant contract**

```tsx
interface ProductDetailProps {
  product: Product;
  related: Product[];
  variant?: "legacy" | "balanced";
}

export function ProductDetail({ product, related, variant = "legacy" }: ProductDetailProps) {
  if (variant === "legacy") {
    return <LegacyProductDetail product={product} related={related} />;
  }
  return <BalancedProductDetail product={product} related={related} />;
}
```

Keep the existing UI in `LegacyProductDetail` and the newly composed UI in `BalancedProductDetail`; both remain local to `product-detail.tsx` during the single-sample review.

- [ ] **Step 4: Gate the sample slug in the route**

```tsx
const balancedSampleSlug = "nois-דובדבן-אקסטרים-43589";
const variant = product.slug === balancedSampleSlug ? "balanced" : "legacy";

return (
  <>
    <JsonLd data={[schema, breadcrumbs]} />
    <ProductDetail product={product} related={related} variant={variant} />
  </>
);
```

Before committing, confirm the exact slug with:

Run: `node -e "const p=require('./data/catalog.generated.json'); console.log(p.filter(x=>x.brand==='NOIS' && x.nicotineMg===50 && /דובדבן אקסטרים/.test(x.name)).map(x=>x.slug))"`

Expected: `[ 'nois-דובדבן-אקסטרים-43589' ]`.

- [ ] **Step 5: Run unit tests and a production build**

Run: `pnpm test`

Expected: all tests PASS.

Run: `pnpm build`

Expected: build completes and the product route is generated.

- [ ] **Step 6: Commit the isolated sample gate**

```bash
git add components/product/product-detail.tsx app/'(store)'/shop/'[slug]'/page.tsx tests/unit/product-detail.test.tsx
git commit -m "feat: isolate balanced layout to NOIS sample"
```

### Task 4: Apply the approved responsive visual system

**Files:**
- Modify: `app/globals.css`
- Modify: `components/product/product-detail.tsx`
- Create: `tests/e2e/product-page.spec.ts`

**Interfaces:**
- Consumes: balanced-layout class names prefixed with `.pd-balanced`.
- Produces: desktop two-column layout and mobile single-column layout with no duplicate sticky purchase control.

- [ ] **Step 1: Write the failing browser checks**

```ts
import { expect, test } from "@playwright/test";

const samplePath = "/shop/nois-%D7%93%D7%95%D7%91%D7%93%D7%91%D7%9F-%D7%90%D7%A7%D7%A1%D7%98%D7%A8%D7%99%D7%9D-43589";

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
```

- [ ] **Step 2: Run the browser checks and verify the layout assertion fails**

Run: `pnpm test:e2e -- tests/e2e/product-page.spec.ts`

Expected: at least one FAIL before the scoped responsive styles are complete.

- [ ] **Step 3: Add the balanced-layout root and scoped styles**

Wrap the approved layout:

```tsx
<main className="pd-balanced">
  {/* balanced product layout */}
</main>
```

Add responsive rules:

```css
.pd-balanced .pd-main {
  display:grid;
  grid-template-columns:minmax(0,1.06fr) minmax(420px,.94fr);
  gap:clamp(40px,6vw,84px);
  padding-block:48px 64px;
}
.pd-balanced .pd-image-stage {
  aspect-ratio:1/1;
  height:auto;
  background:#f3f0e9;
  border:1px solid #ded9cf;
  border-radius:18px;
}
.pd-balanced .pd-summary h1 {
  max-width:14ch;
  font-size:clamp(42px,4.2vw,64px);
}
.pd-balanced .pd-content {
  display:grid;
  grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);
  gap:24px 56px;
  padding-bottom:80px;
}
.pd-balanced .pd-specification,
.pd-balanced .pd-information,
.pd-balanced .pd-faq {
  padding:28px;
  border:1px solid #e3dfd6;
  background:#fff;
}
.pd-balanced .pd-faq,
.pd-balanced .warning {
  grid-column:1/-1;
}
@media (max-width:850px) {
  .pd-balanced .pd-main,
  .pd-balanced .pd-content {
    grid-template-columns:1fr;
  }
  .pd-balanced .pd-main {
    width:100%;
    gap:0;
    padding-top:12px;
  }
  .pd-balanced .pd-gallery,
  .pd-balanced .pd-summary,
  .pd-balanced .pd-content {
    width:min(100% - 28px,1200px);
    margin-inline:auto;
  }
  .pd-balanced .pd-summary {
    padding-top:28px;
  }
  .pd-balanced .pd-pack-choice > div {
    grid-template-columns:repeat(3,minmax(0,1fr));
  }
  .pd-balanced .pd-content {
    gap:14px;
    padding-bottom:56px;
  }
  .pd-balanced .pd-faq,
  .pd-balanced .warning {
    grid-column:auto;
  }
}
```

- [ ] **Step 4: Run browser and unit tests**

Run: `pnpm test:e2e -- tests/e2e/product-page.spec.ts`

Expected: PASS.

Run: `pnpm test`

Expected: all unit tests PASS.

- [ ] **Step 5: Commit the responsive sample design**

```bash
git add app/globals.css components/product/product-detail.tsx tests/e2e/product-page.spec.ts
git commit -m "style: polish responsive NOIS sample product page"
```

### Task 5: Verify locally and prepare the approval handoff

**Files:**
- Modify only if verification finds a scoped defect:
  - `components/product/product-detail.tsx`
  - `components/product/product-purchase-panel.tsx`
  - `components/product/product-facts.tsx`
  - `components/product/product-content.tsx`
  - `app/globals.css`
  - their corresponding tests

**Interfaces:**
- Produces: a local review URL and evidence that the redesign remains isolated.

- [ ] **Step 1: Run the full quality gate**

Run: `pnpm lint`

Expected: exit code 0.

Run: `pnpm test`

Expected: all unit tests PASS.

Run: `pnpm build`

Expected: Next.js production build completes.

- [ ] **Step 2: Start the local review server**

Run: `pnpm dev`

Expected: local server reports a working localhost URL.

- [ ] **Step 3: Review the sample at desktop and mobile widths**

Open the exact sample route at 1440×1000 and 390×844. Verify:

- original front-of-pack product image is sharp and undistorted;
- brand, flavor, 50 mg, strength, stock, SKU, and price match the catalog;
- 1/5/10 unit price and total update together;
- only one add-to-cart control is present on mobile;
- related products are a single horizontal slider;
- no other product page uses the balanced layout;
- no horizontal page overflow exists.

- [ ] **Step 4: Inspect the change boundary**

Run: `git diff --name-only 8b10b87..HEAD`

Expected: only NIC POUCH product-page components, styles, tests, and approved documentation appear; no CRM, Payper, DNS, deployment, Polarized-X, or B2B files appear.

- [ ] **Step 5: Present the local sample for user approval**

Provide the local sample URL and summarize:

```text
דוגמת NOIS מוכנה לבדיקה מקומית בלבד.
לא בוצעה פריסה, לא שונה ה-CRM ולא הושפע מוצר אחר.
לאחר אישור חזותי ופונקציונלי ניצור תוכנית נפרדת להרחבת התבנית ולשדות ה-CRM.
```

Do not deploy or generalize the layout in this task.
