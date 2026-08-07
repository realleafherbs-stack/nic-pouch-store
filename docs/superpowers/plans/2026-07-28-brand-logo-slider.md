# Brand Logo Slider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage brand product cards with a five-brand, logos-only rail that links directly to each brand catalog and becomes an RTL scroll-snap slider on mobile.

**Architecture:** Keep `BrandShowcase` data-driven from the existing product catalog, but render only one linked wordmark for each supported brand. Keep all responsive presentation in the existing global stylesheet and verify semantic behavior with a focused component test plus desktop/mobile browser checks.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest, Testing Library.

## Global Constraints

- Render only NOIS, HQD, PABLO, KILLA, and CUBA, in that order.
- Do not render product images, descriptions, or visible CTA buttons.
- Omit brands that are not present in the supplied catalog.
- Every logo links to `/brands/{lowercase-brand}` and has a descriptive accessible name.
- Desktop shows one five-item row; mobile uses RTL horizontal scroll snap with 84% cards.
- Do not change product data, checkout, header, footer, CRM, or other sites.

---

### Task 1: Logos-only brand component

**Files:**
- Create: `tests/unit/brand-showcase.test.tsx`
- Modify: `components/commerce/brand-showcase.tsx`

**Interfaces:**
- Consumes: `products: Product[]`
- Produces: `BrandShowcase({ products }: { products: Product[] }): JSX.Element`

- [ ] **Step 1: Write the failing component tests**

```tsx
import { render, screen } from "@testing-library/react";
import { BrandShowcase } from "@/components/commerce/brand-showcase";
import type { Product } from "@/lib/catalog/model";

const product = (brand: string, id: string): Product => ({
  id,
  slug: `${brand.toLowerCase()}-${id}`,
  sku: `${brand}-${id}`,
  name: `${brand} product`,
  brand,
  flavor: null,
  nicotineMg: null,
  strengthLevel: null,
  retailPrice: 29.9,
  sourcePrice: 20,
  stock: 10,
  active: true,
  packSize: 1,
  images: ["/products/test.webp"],
  categories: ["פאוצ׳ים"],
});

it("renders five unique brand links in the approved order", () => {
  render(<BrandShowcase products={[
    product("CUBA", "1"),
    product("NOIS", "2"),
    product("PABLO", "3"),
    product("HQD", "4"),
    product("KILLA", "5"),
    product("NOIS", "6"),
  ]} />);

  expect(screen.getAllByRole("link").map(link => link.textContent)).toEqual([
    "NOIS", "HQD", "PABLO", "KILLA", "CUBA",
  ]);
  expect(screen.getByRole("link", { name: "למוצרי המותג NOIS" })).toHaveAttribute("href", "/brands/nois");
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

it("omits brands that are missing from the catalog", () => {
  render(<BrandShowcase products={[product("NOIS", "1")]} />);
  expect(screen.getAllByRole("link")).toHaveLength(1);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `pnpm test -- tests/unit/brand-showcase.test.tsx`

Expected: FAIL because the current component renders product images and extra text.

- [ ] **Step 3: Implement the minimal logos-only markup**

```tsx
import Link from "next/link";
import type { Product } from "@/lib/catalog/model";

const brandOrder = ["NOIS", "HQD", "PABLO", "KILLA", "CUBA"] as const;

export function BrandShowcase({ products }: { products: Product[] }) {
  const availableBrands = new Set(products.map(product => product.brand));

  return (
    <nav className="brand-showcase" aria-label="מותגים מובילים">
      {brandOrder.filter(brand => availableBrands.has(brand)).map(brand => (
        <Link
          href={`/brands/${brand.toLowerCase()}`}
          className={`brand-card brand-${brand.toLowerCase()}`}
          aria-label={`למוצרי המותג ${brand}`}
          key={brand}
        >
          <span className="brand-logo-word" aria-hidden="true">{brand}</span>
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Run the focused test and verify success**

Run: `pnpm test -- tests/unit/brand-showcase.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit the semantic component change**

```bash
git add components/commerce/brand-showcase.tsx tests/unit/brand-showcase.test.tsx
git commit -m "feat: simplify brand showcase to linked logos"
```

### Task 2: Responsive black logo rail

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `.brand-showcase`, `.brand-card`, `.brand-logo-word`, and per-brand classes emitted by Task 1.
- Produces: five-column desktop layout and 84% RTL mobile scroll-snap rail.

- [ ] **Step 1: Replace the existing brand-card presentation**

Implement a charcoal section rail with:

```css
.brand-showcase {
  display:grid;
  grid-template-columns:repeat(5,minmax(0,1fr));
  gap:1px;
  overflow:hidden;
  background:#34342f;
  border:1px solid #34342f;
}
.brand-card {
  min-height:180px;
  display:grid;
  place-items:center;
  padding:28px 18px;
  background:#151614;
  color:#f4f3eb;
  scroll-snap-align:start;
  transition:background-color .25s ease,transform .25s ease;
}
.brand-card:hover {
  background:#20211d;
  transform:translateY(-3px);
}
.brand-card:focus-visible {
  outline:3px solid #d9ff28;
  outline-offset:-4px;
}
.brand-logo-word {
  display:block;
  font-size:clamp(32px,3.2vw,52px);
  font-weight:950;
  letter-spacing:-.065em;
  line-height:1;
}
.brand-pablo .brand-logo-word,
.brand-killa .brand-logo-word {
  font-style:italic;
  transform:skew(-7deg);
}
```

- [ ] **Step 2: Replace the mobile brand rules**

```css
@media (max-width: 760px) {
  .brand-showcase {
    grid-template-columns:none;
    grid-auto-flow:column;
    grid-auto-columns:84%;
    gap:8px;
    overflow-x:auto;
    margin-inline:-14px;
    padding-inline:14px;
    border:0;
    background:transparent;
    scroll-padding-inline:14px;
    scroll-snap-type:x mandatory;
  }
  .brand-card {
    min-height:156px;
    border:1px solid #34342f;
  }
}
```

- [ ] **Step 3: Run complete automated verification**

Run: `pnpm test && pnpm lint && pnpm build`

Expected: all tests pass, lint has no new errors, and the production build completes.

- [ ] **Step 4: Verify the layout in a browser**

Check the homepage at desktop width and at `390 × 844`.

Expected desktop: five unique linked wordmarks in one row with no product images.

Expected mobile: NOIS begins the RTL rail, one 84% card is visible, the next card peeks into view, and horizontal scrolling works.

- [ ] **Step 5: Commit the responsive presentation**

```bash
git add app/globals.css
git commit -m "style: add responsive brand logo rail"
```
