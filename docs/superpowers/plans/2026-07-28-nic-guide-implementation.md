# NIC GUIDE Implementation Plan

> Execution mode: inline, isolated worktree. Do not merge or deploy until verified.

**Goal:** Replace the current generic blog presentation with a reusable NIC GUIDE editorial system while preserving the current storefront, content URLs, commerce components, and production rollback point.

**Architecture:** Extend `data/articles.ts` as the only guide data source. Compose `/blog` from a client-side filter shell and server-rendered guide content. Compose `/blog/[slug]` from reusable guide article blocks. Reuse `ProductCard` unchanged for optional recommendations.

**Stack:** Next.js App Router, React 19, TypeScript, global CSS, Lucide, Vitest, Testing Library, Playwright.

---

## Task 1: Normalize the guide content model

**Files**

- Modify: `data/articles.ts`
- Modify: `tests/unit/seo.test.ts`
- Add: `tests/unit/guides-data.test.ts`

**Steps**

1. Add failing tests for four valid category values, two-digit guide numbers, numeric reading times, unique slugs/numbers, takeaways, sources, related guide references, and optional images.
2. Define `GuideCategory`, `GuideSection`, `GuideFaq`, and `Guide`.
3. Migrate all three current articles without changing their slugs or factual claims.
4. Add deterministic helper functions: `guideBySlug`, `relatedGuidesFor`, and category labels.
5. Run `pnpm test -- tests/unit/guides-data.test.ts tests/unit/seo.test.ts`.
6. Commit: `feat: normalize nic guide content model`.

## Task 2: Build guide visual primitives and cards

**Files**

- Add: `components/guides/guide-visual.tsx`
- Add: `components/guides/guide-card.tsx`
- Add: `tests/unit/guide-card.test.tsx`
- Modify: `app/globals.css`

**Steps**

1. Add failing tests for featured, standard, and compact cards, one-link semantics, optional image handling, category/time labels, and two-digit numbers.
2. Build a single `GuideCard` component with a typed `variant` prop.
3. Build category visuals from semantic markup and CSS rings/lines.
4. Add sharp, tokenized styling, stable aspect ratios, focus states, restrained motion, and reduced-motion behavior.
5. Run the focused tests.
6. Commit: `feat: add nic guide card system`.

## Task 3: Implement the guide index and filters

**Files**

- Add: `components/guides/guide-index.tsx`
- Add: `tests/unit/guide-index.test.tsx`
- Modify: `app/(store)/blog/page.tsx`
- Modify: `app/globals.css`

**Steps**

1. Add failing tests for all four filters, default all state, `aria-pressed`, filtered results, and URL category state.
2. Implement progressive client filtering that initially renders the full guide collection.
3. Update `category` in the URL without a full navigation.
4. Rebuild the hero as `NIC GUIDE / INDEX` with category-safe circular artwork.
5. Add one featured guide, the standard guide grid, one compact supplementary row only when useful, and the single bottom CTA.
6. Preserve ItemList and breadcrumb JSON-LD.
7. Run the focused tests.
8. Commit: `feat: rebuild nic guide index`.

## Task 4: Build the article component system

**Files**

- Add: `components/guides/guide-article-blocks.tsx`
- Add: `components/guides/guide-toc.tsx`
- Add: `components/guides/guide-product-rail.tsx`
- Add: `tests/unit/guide-article-blocks.test.tsx`
- Modify: `app/globals.css`

**Steps**

1. Add failing tests for takeaways, callouts, steps, comparison table, strength scale, FAQ source HTML, sources, and mobile TOC.
2. Implement `GuideCallout`, `GuideSteps`, `GuideComparisonTable`, `GuideStrengthScale`, `GuideFAQ`, and `GuideSources`.
3. Implement a sticky desktop TOC with IntersectionObserver enhancement and a no-JavaScript mobile `<details>` TOC.
4. Implement `GuideProductRail` using existing `ProductCard` without modification.
5. Add responsive and accessible styling.
6. Run focused tests.
7. Commit: `feat: add nic guide article components`.

## Task 5: Rebuild the article route

**Files**

- Modify: `app/(store)/blog/[slug]/page.tsx`
- Add: `tests/unit/guide-article-page.test.tsx`
- Modify: `tests/unit/seo.test.ts`
- Modify: `app/globals.css`

**Steps**

1. Add failing tests that render all three current articles and assert hero, takeaways, TOC, FAQ, sources, summary, CTA, and related guide structure.
2. Build the new article hero with breadcrumb, category, dates, reading time, guide number, and optional image.
3. Render content blocks from the existing section data.
4. Render product recommendations only for valid product IDs.
5. Enforce the ending sequence: summary, store CTA, next guide, related guides.
6. Update metadata and structured data to handle optional images correctly.
7. Keep FAQ schema identical to visible FAQ content.
8. Run focused tests.
9. Commit: `feat: rebuild nic guide article pages`.

## Task 6: Update the homepage guide teaser safely

**Files**

- Modify: `components/commerce/home-blog.tsx`
- Add or modify: `tests/unit/smoke.test.tsx`
- Modify: `app/globals.css`

**Steps**

1. Add a regression assertion for `NIC GUIDE` language and valid article links.
2. Reuse the standard/compact guide card system where it fits without changing homepage section order.
3. Keep the homepage section concise and subordinate to commerce.
4. Run focused tests.
5. Commit: `refactor: align homepage guides with nic guide`.

## Task 7: Verification and responsive QA

**Files**

- Modify only if a verified defect is found.

**Steps**

1. Run `pnpm test`.
2. Run `pnpm lint`.
3. Run `pnpm build`.
4. Start a local production server.
5. Browser-check `/blog` and all three `/blog/[slug]` pages at desktop, tablet, and mobile widths.
6. Verify filters, keyboard focus, mobile horizontal rail, TOC, accordions, reduced motion, no horizontal page overflow, and no console errors.
7. Run an accessibility pass on `/blog` and one article.
8. Review the diff to confirm no changes to header, footer, cart, checkout, or `ProductCard`.
9. Commit any verified QA fixes.
10. Present the preview and safe integration choices. Do not merge or deploy automatically.
