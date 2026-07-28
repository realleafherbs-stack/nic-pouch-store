# NIC POUCH — Brand Logo Slider Design

## Goal

Replace the current light brand-card grid with a premium, compact logo rail that
matches the approved black NIC POUCH visual language and makes every brand an
obvious route into its catalog.

## Approved visual direction

- Dark charcoal section, not pure black, with a restrained NIC POUCH lime accent.
- Five unique brands only: NOIS, HQD, PABLO, KILLA, CUBA.
- Each card uses only the brand name as a bold wordmark treatment.
- No duplicate brand cards and no invented packaging, logos, or products.
- Cards use fine borders and flat tonal separation instead of generic shadows or
  glass effects.

## Information hierarchy

1. Section eyebrow: `כל המותגים במקום אחד`
2. Section heading: `המותגים המובילים`
3. Brand wordmark

Product images, marketing descriptions, and visible CTA buttons are intentionally
excluded from the cards.

## Desktop behavior

- One horizontal row of five cards inside the existing homepage content width.
- All five brands remain visible at common desktop widths.
- A card lifts slightly and its wordmark gains contrast on hover.
- The whole card is a link to `/brands/{brand}`.
- Keyboard focus receives a visible lime outline.

## Mobile behavior

- Horizontal scroll-snap rail.
- One primary card occupies 84% of the viewport.
- The next card remains partially visible to communicate that the rail is
  scrollable.
- Touch targets are at least 44px high.
- No tiny multi-column logo grid and no hidden brands.
- The rail preserves RTL reading order and starts with NOIS.

## Brand order

1. NOIS
2. HQD
3. PABLO
4. KILLA
5. CUBA

This order gives the owned brand first position without creating a separate NOIS
section.

## Data and linking

- Brand availability is derived from the existing `products` prop by exact brand.
- Missing brands are omitted safely.
- Every card links to the existing brand landing page.
- Accessible names include both the brand and the destination.

## Implementation boundary

- Update `components/commerce/brand-showcase.tsx`.
- Replace only the related `.brand-showcase` and `.brand-card*` CSS rules in
  `app/globals.css`.
- Add focused tests for brand order, uniqueness, links, and accessible labels.
- Do not change product data, checkout, header, footer, CRM, or other sites.

## Verification

- Unit tests verify five unique brands in the specified order and correct links.
- Desktop visual check verifies a single five-card row.
- Mobile visual check verifies scroll snap, next-card preview, RTL order, and
  usable touch targets.
- Build and lint must pass before a new site version is saved or deployed.
