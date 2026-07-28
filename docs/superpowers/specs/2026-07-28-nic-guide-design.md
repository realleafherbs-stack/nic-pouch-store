# NIC GUIDE — Design and Content System Specification

## Status

Approved implementation specification derived from the user's NIC POUCH source-of-truth brief.

## Goal

Turn the existing `/blog` and `/blog/[slug]` routes into **NIC GUIDE**, an editorial selection system that helps adult nicotine users understand products before choosing.

The promise is:

> לדעת לפני שבוחרים

This is not a generic blog redesign. It is a focused extension of the existing NIC POUCH storefront language.

## Scope and safety boundaries

### In scope

- `/blog`
- `/blog/[slug]`
- The existing `data/articles.ts` content model
- New guide-only components and guide-only CSS
- Guide metadata, Article/FAQ/Breadcrumb structured data
- Optional product recommendations using the existing `ProductCard`
- Tests for the new guide model, filters, cards, article layout, and schemas

### Out of scope

- Existing header and announcement bar
- Existing footer
- Cart, checkout, pricing, or payment flows
- Existing `ProductCard` implementation
- Product or brand pages
- A new CMS or second content data layer
- The pending brands-logo feature branch
- Production deployment or merge before verification and explicit integration choice

## Design direction

NIC GUIDE shares the storefront's core visual vocabulary:

- black ink
- warm off-white paper
- neon lime
- restrained mint
- sharp grids
- thin rules
- open space
- large editorial Hebrew typography

It must avoid:

- generic blog cards
- large rounded containers
- unnecessary gradients
- glossy effects
- stock smoking imagery
- smoke motifs
- aggressive strength imagery such as fire or lightning

The repeating guide motif is a pouch-can circle expressed as thin rings, cropped circles, measurement marks, and two-digit guide numbers.

## Tokens

Reuse existing equivalents where possible. Guide-specific aliases may be added:

```css
--guide-ink: #0b0b0a;
--guide-paper: #f4f2eb;
--guide-white: #fff;
--guide-lime: #d8ff3e;
--guide-mint: #dff0ed;
--guide-mint-strong: #cde8e4;
--guide-line: rgba(11, 11, 10, 0.22);
--guide-muted: rgba(11, 11, 10, 0.62);
```

Default corner radius is zero. Only pills and circular motifs may be fully rounded.

## Content model

`data/articles.ts` remains the single source of truth and is extended, not duplicated.

```ts
export type GuideCategory =
  | "beginner"
  | "strength"
  | "flavors-brands"
  | "use-storage";

export type Guide = {
  slug: string;
  number: string;
  title: string;
  excerpt: string;
  category: GuideCategory;
  readingTime: number;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  image?: { src: string; alt: string };
  takeaways: string[];
  sections: GuideSection[];
  faq: GuideFaq[];
  sources: string[];
  relatedGuideSlugs: string[];
  relatedProductIds?: string[];
  primaryKeyword: string;
};
```

Existing content fields may be retained temporarily where required by other consumers, but all guide UI reads the normalized fields.

Rules:

- Guide numbers are always two digits.
- Guide numbers never form the URL.
- Reordering a guide never changes its slug.
- A guide may render without an image.
- Unknown product associations are omitted rather than invented.

## `/blog` index

### Hero

- 520–680px on desktop.
- Asymmetric two-column layout.
- Right column: `NIC GUIDE / INDEX`, H1 `לדעת לפני שבוחרים`, and the short description `מדריכים ברורים על טעמים, עוצמות ושימוש נכון`.
- Left column: CSS/SVG-free decorative markup using circles and rules; no product or lifestyle image required.
- On mobile, the visual is cropped and secondary so the title remains above the fold.

### Category filters

Four filters:

- מתחילים כאן
- עוצמות
- טעמים ומותגים
- שימוש ואחסון

Requirements:

- Default state shows all guides.
- Selected filter uses lime on black.
- Full keyboard operation.
- `aria-pressed`.
- URL is updated with a shareable `category` query parameter.
- Desktop displays a four-item row.
- Mobile displays a horizontal snap rail.
- The page must not gain accidental horizontal overflow.

### Guide cards

Three variants share one component API:

- Featured
- Standard
- Compact

Every card is a single semantic link with no nested links.

Featured card:

- number
- title
- excerpt
- category
- reading time
- image or category visual

Standard card:

- number
- category visual or image
- title
- category
- reading time
- directional arrow

Compact card:

- number
- category
- title
- reading time
- no image by default

Motion:

- image scale at most 3%
- arrow translation 4–6px
- a lime rule may grow
- no layout shift
- transforms disabled under reduced motion

### Layout

- Desktop: three-column standard grid
- Tablet: two columns
- Mobile: one column
- Initial content remains the current three guides
- No fake empty guide inventory

### Bottom CTA

One commercial CTA only:

- heading: `מוכנים לבחור?`
- button: `לכל המוצרים`
- lime accent
- no product carousel adjacent to it

## `/blog/[slug]` article

### Article hero

Contains:

- breadcrumb
- category
- H1
- excerpt
- reading time
- published date
- updated date when present
- guide number and category visual or real article image

### Takeaways

The first content block is:

> מה תדעו בסוף המדריך

It contains three to five real bullet points from the content model.

### Table of contents

- Sticky on desktop.
- Highlights the active section.
- On mobile, renders as a closed `<details>` control labeled `במדריך הזה`.
- Anchors remain available without JavaScript.

### Article body

- Reading width: 720–780px.
- Correct H2/H3 hierarchy.
- Comfortable RTL line length and rhythm.
- Numbers, `mg`, and English brand names must not break the reading direction.

### Reusable content components

- `GuideCallout`
- `GuideSteps`
- `GuideComparisonTable`
- `GuideStrengthScale`
- `GuideProductRail`
- `GuideFAQ`
- `GuideSources`

The current three guides use only components supported by their real content. Unused components remain small and generic, not decorative demos.

`GuideProductRail`:

- uses the existing `ProductCard` unchanged
- renders two to four products only when valid IDs exist
- appears after the article has started, never above the takeaways

`GuideFAQ`:

- all question and answer HTML exists when details are closed
- FAQ schema is emitted only when the visible FAQ exists

### Ending order

1. Short summary
2. Store CTA
3. Next guide
4. Two or three related guides

There must not be consecutive commercial CTAs.

## Category visual system

- `beginner`: can rings, open/closed states, guide numbers
- `strength`: mg values, scales, rings, measurement ticks
- `flavors-brands`: restrained category color and package crop only when a faithful image exists
- `use-storage`: line icons, numbered steps, simple storage/handling diagrams

All category visuals must still work when no raster image is present.

## SEO and structured data

- Exactly one H1 per page.
- Unique title, description, canonical, Open Graph, and Twitter data.
- Semantic article cards and `<time>` elements.
- Breadcrumbs on index and articles.
- `BlogPosting` or `Article` structured data only for real articles.
- FAQ schema only for the visible FAQ content.
- Image metadata omitted when a guide has no image.
- Image alt describes information, not decorative styling.

## Accessibility

- 44px minimum interactive targets on mobile.
- Strong visible focus of at least 2px.
- Full keyboard navigation for filters, cards, TOC, and accordions.
- `prefers-reduced-motion` disables guide transformations.
- WCAG AA text contrast.
- Decorative motifs are hidden from assistive technology.
- Content remains usable without JavaScript.

## Performance

- No animation library.
- Existing image handling is reused.
- Explicit aspect ratios prevent layout shifts.
- Below-fold images are lazy loaded.
- CSS motifs replace unnecessary decorative assets.

## Responsive behavior

- Existing project breakpoints are reused.
- Desktop: two-column hero, three-card grid, sticky TOC.
- Tablet: two-card grid; TOC may move above content.
- Mobile: vertical hero, horizontal snap filters, single card column, mobile TOC accordion.
- No full-page horizontal scrolling.

## Acceptance criteria

- All four category filters function and create shareable URLs.
- Featured, standard, and compact cards render with or without images.
- All three existing guides render from the shared model.
- Every article includes takeaways, TOC, content, FAQ, sources, and ending sequence.
- A future guide can be added through `data/articles.ts` without changing component code.
- Product recommendations reuse `ProductCard`.
- Existing header, footer, cart, checkout, and product cards are unchanged.
- Unit tests, lint, production build, and responsive browser QA pass.
