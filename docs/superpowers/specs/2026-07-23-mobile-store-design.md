# NIC POUCH — Mobile Store Design

## Goal

Turn the existing Figma-based storefront into a polished, conversion-focused B2C store that works from 320px mobile screens through desktop. Preserve the established NIC POUCH visual direction while improving hierarchy, touch behavior, readability, speed, and the full shopping journey.

## Experience Direction

Use a hybrid commerce layout:

- Preserve the Figma hero, monochrome foundation, warm neutrals, product-led imagery, and strong editorial sections.
- Use two product columns on standard phones and one column only where content cannot remain readable.
- Prioritize product discovery and quick buying without making the interface feel like a dense marketplace.
- Keep all primary controls at least 44px high and avoid hover-only interactions.

## Navigation

Desktop retains the current header structure. Mobile receives:

- Compact sticky header with centered NIC POUCH logo.
- Accessible menu drawer for shop, brands, blog, offers, shipping, and support.
- Search entry point and cart icon with a live item count.
- Sticky bottom navigation for home, shop, search, and cart.
- Safe-area spacing for modern iPhone and Android browser chrome.

## Home Page

- Keep the Figma hero and messaging while correcting mobile crop, text width, CTA placement, and vertical rhythm.
- Make leading brands a swipeable, snap-aligned showcase.
- Use consistent normalized product imagery.
- Improve the strength guide, NOIS promotion, trust benefits, blog cards, and footer for small screens.
- Reduce unnecessary visual height while preserving the premium feel.

## Shop and Product Cards

- Responsive filter bar with a mobile filter sheet.
- Client-side search, brand, strength, and price sorting so static hosting remains fully functional.
- Results count and active filter chips.
- Two-column phone grid with consistent image ratios, readable titles, visible strength, price, and a direct add-to-cart control.
- One-column fallback at very narrow widths.
- Product cards maintain stable heights to prevent layout jumps.

## Product Detail

- Swipe-friendly image gallery with thumbnails and consistent image containment.
- Clear brand, product name, strength, stock, price, and adult-use warning.
- Quantity selection and add-to-cart feedback.
- Sticky mobile purchase bar containing price and add-to-cart.
- Expandable product specifications, storage guidance, shipping information, and FAQ.
- Related products remain horizontally browsable on mobile.

## Cart

Implement a real client-side cart backed by local storage:

- Product image, name, strength, unit price, quantity controls, and remove action.
- Persistent cart state shared by header, product pages, product cards, cart, and checkout.
- Subtotal, free-shipping progress, shipping amount, and order total.
- Empty-cart state with a clear return-to-shop action.
- Cart drawer for quick review and a full cart page for editing.

Shipping is free from ₪199. Below that threshold, the UI displays a configurable shipping fee and remaining amount for free shipping.

## Checkout

- Mobile-first form for customer and delivery details.
- Required fields: full name, phone, email, city, street, house number, apartment/floor when relevant, postal code, and order notes.
- Shipping selection and complete order summary.
- Required 18+ and terms confirmation.
- No payment collection until the dedicated HYP terminal and CRM integration are connected.
- Successful local submission produces an order confirmation screen without claiming that payment was completed.

## Accessibility and Safety

- Semantic landmarks, skip link, keyboard navigation, visible focus states, and labelled controls.
- Minimum touch target of 44px and body text of at least 16px in forms.
- Respect reduced-motion preferences.
- Maintain the 18+ gate and nicotine warnings without blocking assistive technology.
- Sufficient contrast across text, controls, chips, and disabled states.

## Responsive System

Content-driven breakpoints:

- 320–479px: compact mobile, one or two product columns depending on available card width.
- 480–767px: standard mobile, two product columns.
- 768–1023px: tablet, two or three columns and expanded navigation patterns.
- 1024px and above: desktop layout.

Use fluid spacing and typography with `clamp()`, safe-area insets, horizontal snap scrolling where appropriate, and no fixed element that obscures content.

## Architecture

- Central cart provider and reducer with local-storage persistence.
- Reusable mobile navigation, cart drawer, product card actions, filter controls, order summary, and form field components.
- Catalog remains the source of product truth.
- The static deployment remains compatible with the current public hosting.
- Future CRM and HYP connections enter through isolated adapter modules without redesigning the UI.

## Validation

- Unit tests for cart totals, quantity updates, persistence, free-shipping threshold, and checkout validation.
- Production build for all static routes.
- Visual and interaction checks at 320, 375, 390, 430, 768, 1024, and 1440px.
- Verify menu, filters, add-to-cart, cart editing, checkout, age gate, keyboard flow, and reduced motion.
- Confirm public deployment returns successful responses for the storefront and product images.

## Out of Scope for This Pass

- Live payment capture.
- Sending orders into the CRM.
- Real-time inventory synchronization.
- Customer accounts and authentication.

The interfaces for these integrations will be prepared, but external transactions will not be simulated as completed.
