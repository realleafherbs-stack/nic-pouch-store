# NIC POUCH Mobile Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete mobile-first shopping journey with responsive navigation, functional filtering, persistent cart, checkout, and polished layouts from 320px through desktop.

**Architecture:** Add a client-side commerce layer around the existing static catalog so the public static deployment remains compatible. A single cart provider owns persistent state and exposes typed actions to the header, product cards, product detail, cart, and checkout; responsive components preserve the Figma visual direction while adapting interactions for touch.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, Vitest, Testing Library, Lucide React, CSS, localStorage.

## Global Constraints

- Preserve the existing Figma-derived NIC POUCH visual direction.
- Support 320px, 375px, 390px, 430px, 768px, 1024px, and 1440px widths.
- Maintain touch targets of at least 44px.
- Keep all 58 products and the normalized local WebP image library.
- Keep public static hosting compatibility.
- Keep the 18+ gate and nicotine warnings.
- Do not collect payment until CRM and HYP integrations are connected.

---

### Task 1: Persistent Cart Domain

**Files:**
- Create: `lib/cart/types.ts`
- Create: `lib/cart/reducer.ts`
- Create: `components/commerce/cart-provider.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/unit/cart-store.test.ts`

**Interfaces:**
- Consumes: `Product` from `lib/catalog/model.ts`.
- Produces: `CartLine`, `CartState`, `CartAction`, `cartReducer`, `cartTotals`, and `useCart()`.

- [ ] **Step 1: Write failing reducer and totals tests**

```ts
import { describe, expect, it } from "vitest";
import { cartReducer, cartTotals, initialCartState } from "@/lib/cart/reducer";

describe("cart", () => {
  it("adds and updates a line", () => {
    const product = { id: "1", retailPrice: 79 } as never;
    const added = cartReducer(initialCartState, { type: "add", product, quantity: 1 });
    const updated = cartReducer(added, { type: "setQuantity", productId: "1", quantity: 3 });
    expect(updated.lines[0].quantity).toBe(3);
  });

  it("calculates shipping and free-shipping progress", () => {
    const state = { lines: [{ product: { id: "1", retailPrice: 79 } as never, quantity: 2 }] };
    expect(cartTotals(state)).toEqual({
      itemCount: 2,
      subtotal: 158,
      shipping: 29,
      total: 187,
      remainingForFreeShipping: 41,
    });
  });
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `pnpm vitest run tests/unit/cart-store.test.ts`

Expected: FAIL because `lib/cart/reducer` does not exist.

- [ ] **Step 3: Implement typed cart state, reducer, totals, and provider**

```ts
export type CartLine = { product: Product; quantity: number };
export type CartState = { lines: CartLine[] };
export type CartAction =
  | { type: "hydrate"; state: CartState }
  | { type: "add"; product: Product; quantity: number }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };
```

Implement immutable add/update/remove behavior. `cartTotals` uses free shipping from ₪199 and ₪29 shipping below the threshold. `CartProvider` hydrates `nic-cart-v2`, persists each change after hydration, and exposes state, totals, and dispatch through `useCart()`.

- [ ] **Step 4: Mount the provider and verify tests**

Wrap the store layout body content with `<CartProvider>`. Run:

`pnpm vitest run tests/unit/cart-store.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/cart components/commerce/cart-provider.tsx app/layout.tsx tests/unit/cart-store.test.ts
git commit -m "feat: add persistent cart domain"
```

### Task 2: Mobile Navigation and Cart Drawer

**Files:**
- Create: `components/layout/mobile-navigation.tsx`
- Create: `components/commerce/cart-drawer.tsx`
- Modify: `components/layout/site-header.tsx`
- Modify: `app/globals.css`
- Test: `tests/unit/mobile-navigation.test.tsx`

**Interfaces:**
- Consumes: `useCart()` from Task 1.
- Produces: accessible menu and cart drawers plus a mobile bottom navigation.

- [ ] **Step 1: Write the failing navigation test**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

it("opens and closes the mobile menu", () => {
  render(<MobileNavigation />);
  fireEvent.click(screen.getByRole("button", { name: "פתיחת תפריט" }));
  expect(screen.getByRole("dialog", { name: "תפריט ראשי" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "סגירת תפריט" }));
  expect(screen.queryByRole("dialog", { name: "תפריט ראשי" })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `pnpm vitest run tests/unit/mobile-navigation.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the mobile shell**

Create a 44px menu control, centered logo, search link, cart button with live count, focusable dialog, close control, navigation links, overlay dismissal, and Escape handling. Add a bottom bar for home, shop, search, and cart with `env(safe-area-inset-bottom)`.

- [ ] **Step 4: Implement cart drawer**

Render compact cart lines, quantity controls, subtotal, free-shipping status, `/cart` and `/checkout` links, empty state, and accessible close behavior.

- [ ] **Step 5: Add responsive styles and verify**

Hide mobile controls above 850px. Ensure sticky elements do not overlap content and all icon controls are at least 44px. Run:

`pnpm vitest run tests/unit/mobile-navigation.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/layout components/commerce/cart-drawer.tsx app/globals.css tests/unit/mobile-navigation.test.tsx
git commit -m "feat: add mobile navigation and cart drawer"
```

### Task 3: Functional Shop Filters and Product Cards

**Files:**
- Create: `components/commerce/shop-catalog.tsx`
- Modify: `app/(store)/shop/page.tsx`
- Modify: `components/product/product-card.tsx`
- Modify: `app/globals.css`
- Test: `tests/unit/shop-catalog.test.tsx`

**Interfaces:**
- Consumes: `Product[]`, `useCart()`.
- Produces: client-side query, brand, strength, and sorting controls with direct add-to-cart.

- [ ] **Step 1: Write failing filter behavior test**

```tsx
it("filters products by search and brand", () => {
  render(<ShopCatalog products={products} />);
  fireEvent.change(screen.getByLabelText("חיפוש"), { target: { value: "מנטה" } });
  expect(screen.getAllByTestId("product-card")).toHaveLength(1);
});
```

- [ ] **Step 2: Verify the focused test fails**

Run: `pnpm vitest run tests/unit/shop-catalog.test.tsx`

Expected: FAIL because `ShopCatalog` does not exist.

- [ ] **Step 3: Implement client-side catalog state**

Use `useMemo` for query, brand, strength, and price sorting. Add a mobile filter drawer, active filter chips, reset action, result count, and empty result state.

- [ ] **Step 4: Upgrade product card**

Add `data-testid="product-card"`, fixed image ratio, two-line title clamp, strength and pack details, price, 44px add button, success feedback, and a full-card product link that does not swallow the add action.

- [ ] **Step 5: Verify filter and cart interactions**

Run:

`pnpm vitest run tests/unit/shop-catalog.test.tsx tests/unit/cart-store.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/commerce/shop-catalog.tsx components/product/product-card.tsx 'app/(store)/shop/page.tsx' app/globals.css tests/unit/shop-catalog.test.tsx
git commit -m "feat: add mobile product discovery"
```

### Task 4: Mobile Product Detail Conversion Layer

**Files:**
- Modify: `components/product/product-detail.tsx`
- Modify: `app/globals.css`
- Test: `tests/unit/product-detail.test.tsx`

**Interfaces:**
- Consumes: `useCart()`, `Product`, related products.
- Produces: gallery controls, cart action, sticky mobile purchase bar, and accordions.

- [ ] **Step 1: Write failing add-to-cart test**

```tsx
it("adds the selected quantity to the shared cart", () => {
  render(<ProductDetail product={product} related={[]} />);
  fireEvent.click(screen.getByRole("button", { name: "הגדלת כמות" }));
  fireEvent.click(screen.getByRole("button", { name: "הוסף לסל" }));
  expect(screen.getByText("נוספו 2 יחידות לסל")).toBeInTheDocument();
});
```

- [ ] **Step 2: Verify failure**

Run: `pnpm vitest run tests/unit/product-detail.test.tsx`

Expected: FAIL because the component still writes the legacy local-storage shape.

- [ ] **Step 3: Replace legacy cart behavior**

Use `dispatch({ type: "add", product, quantity })`, announce success with `aria-live`, and keep quantity bounded to at least one.

- [ ] **Step 4: Implement mobile gallery and sticky purchase bar**

Use horizontal snap for gallery media, 44px thumbnail controls, safe-area padding, product price, and an add button. Ensure the bar is hidden on desktop and does not cover the footer.

- [ ] **Step 5: Convert information tabs to accessible details on mobile**

Keep desktop tabs visually, but present specifications, storage, shipping, and FAQ as native `<details>` sections on mobile.

- [ ] **Step 6: Verify and commit**

Run: `pnpm vitest run tests/unit/product-detail.test.tsx`

Expected: PASS.

```bash
git add components/product/product-detail.tsx app/globals.css tests/unit/product-detail.test.tsx
git commit -m "feat: optimize mobile product detail"
```

### Task 5: Full Cart Page

**Files:**
- Create: `components/commerce/cart-page-client.tsx`
- Modify: `app/(store)/cart/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/unit/cart-page.test.tsx`

**Interfaces:**
- Consumes: `useCart()`.
- Produces: editable lines, totals, shipping progress, empty state, checkout CTA.

- [ ] **Step 1: Write failing cart page test**

```tsx
it("updates quantity and recalculates total", () => {
  render(<CartPageClient />);
  fireEvent.click(screen.getByRole("button", { name: "הגדלת כמות של HQD מנטה" }));
  expect(screen.getByTestId("cart-total")).toHaveTextContent("187.00 ₪");
});
```

- [ ] **Step 2: Verify failure**

Run: `pnpm vitest run tests/unit/cart-page.test.tsx`

Expected: FAIL because the cart page client does not exist.

- [ ] **Step 3: Implement line editing and totals**

Render product media, name, metadata, unit price, quantity controls, remove action, subtotal, shipping, total, and free-shipping progress. Disable checkout only when empty.

- [ ] **Step 4: Add responsive layout**

Use a single-column phone layout and desktop cart/summary columns. Keep the summary sticky only where it cannot obscure content.

- [ ] **Step 5: Verify and commit**

Run: `pnpm vitest run tests/unit/cart-page.test.tsx tests/unit/cart-store.test.ts`

Expected: PASS.

```bash
git add components/commerce/cart-page-client.tsx 'app/(store)/cart/page.tsx' app/globals.css tests/unit/cart-page.test.tsx
git commit -m "feat: build complete cart page"
```

### Task 6: Checkout and Order Confirmation

**Files:**
- Create: `lib/checkout/validation.ts`
- Create: `components/checkout/checkout-client.tsx`
- Modify: `app/(store)/checkout/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/unit/checkout-validation.test.ts`

**Interfaces:**
- Consumes: `useCart()` and `cartTotals`.
- Produces: `validateCheckout(values)`, customer form, shipping selection, order summary, local confirmation.

- [ ] **Step 1: Write validation tests**

```ts
it("requires contact, delivery, and adult confirmation", () => {
  expect(validateCheckout({ fullName: "", phone: "", email: "", city: "", street: "", house: "", adult: false }))
    .toEqual(expect.objectContaining({ fullName: expect.any(String), phone: expect.any(String), adult: expect.any(String) }));
});
```

- [ ] **Step 2: Verify failure**

Run: `pnpm vitest run tests/unit/checkout-validation.test.ts`

Expected: FAIL because validation does not exist.

- [ ] **Step 3: Implement deterministic validation**

Validate non-empty delivery fields, Israeli phone shape, email shape, adult confirmation, and terms confirmation. Return a keyed error object without sending data externally.

- [ ] **Step 4: Build checkout UI**

Create grouped contact and address fields, accessible inline errors, optional apartment/floor/postal code/notes, shipping choice, order summary, and submit action.

- [ ] **Step 5: Implement local confirmation**

On valid submit, generate a local reference, render an explicit “order saved for demonstration; no payment was taken” confirmation, then clear the cart. Do not transmit form data.

- [ ] **Step 6: Verify and commit**

Run: `pnpm vitest run tests/unit/checkout-validation.test.ts`

Expected: PASS.

```bash
git add lib/checkout components/checkout 'app/(store)/checkout/page.tsx' app/globals.css tests/unit/checkout-validation.test.ts
git commit -m "feat: add mobile checkout flow"
```

### Task 7: Responsive Visual System and Page Polish

**Files:**
- Modify: `app/globals.css`
- Modify: `app/(store)/page.tsx`
- Modify: `components/commerce/brand-showcase.tsx`
- Modify: `components/layout/site-footer.tsx`

**Interfaces:**
- Consumes: all components from Tasks 1–6.
- Produces: consistent responsive presentation across home, shop, product, cart, checkout, blog, legal pages, and footer.

- [ ] **Step 1: Add content-driven responsive tokens**

Add fluid container padding, `clamp()` typography, safe-area variables, focus ring tokens, card radius/shadow tokens, and consistent section spacing.

- [ ] **Step 2: Correct home-page mobile composition**

Use the dedicated mobile hero asset, prevent header/CTA clipping, tune brand snap widths, reduce NOIS visual height, stack benefits, and make blog cards readable at 320px.

- [ ] **Step 3: Correct supporting pages**

Ensure forms use 16px inputs, legal content has readable line length, footer columns collapse intentionally, and no horizontal overflow exists at 320px.

- [ ] **Step 4: Add touch and accessibility states**

Add `:focus-visible`, `:active`, disabled, error, and reduced-motion states. Keep interactive controls at least 44px.

- [ ] **Step 5: Run complete automated validation**

Run:

`pnpm test && pnpm lint && pnpm build:sites`

Expected: all tests and build pass; lint has no errors.

- [ ] **Step 6: Commit**

```bash
git add app components
git commit -m "feat: polish responsive storefront"
```

### Task 8: Responsive QA and Public Deployment

**Files:**
- Modify only files required by discovered defects.
- Update: `docs/superpowers/plans/2026-07-23-mobile-store-implementation.md`

**Interfaces:**
- Consumes: completed static build.
- Produces: verified public deployment.

- [ ] **Step 1: Test required viewports**

Inspect 320×568, 375×812, 390×844, 430×932, 768×1024, 1024×768, and 1440×1000. Verify header, menu, product grids, filters, detail gallery, sticky bar, cart, checkout, blog, footer, age gate, and browser safe areas.

- [ ] **Step 2: Test the purchase journey**

Open a product, change quantity, add to cart, edit cart, cross the free-shipping threshold, complete checkout validation, submit the local order, and confirm the cart clears.

- [ ] **Step 3: Fix defects and rerun validation**

Run: `pnpm test && pnpm lint && pnpm build:sites`

Expected: all tests pass, lint has no errors, and static export completes.

- [ ] **Step 4: Commit final fixes**

```bash
git add app components lib tests docs
git commit -m "fix: complete mobile storefront QA"
```

- [ ] **Step 5: Publish and verify**

Push the exact commit, package `dist`, save a new Sites version, deploy the public version, poll until successful, and verify:

```bash
curl -I https://nic-pouch-store.realleafherbs.chatgpt.site/
curl -I https://nic-pouch-store.realleafherbs.chatgpt.site/products/6923742003716-1.webp
```

Expected: both return `HTTP/2 200`.
