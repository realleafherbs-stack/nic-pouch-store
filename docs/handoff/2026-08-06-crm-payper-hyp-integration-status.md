# Session status: connecting this storefront to the CRM, Payper, and Hyp Pay

Written 2026-08-06 so context survives moving this folder into `C:\Users\anton\Desktop\b2b`
(sibling to `B2BCRM`, `xvape`, `polarizedx`). Claude Code's session memory is keyed to the
project's file path, so a fresh session opened at the new location starts cold — point it at
this file first.

## The big picture

This storefront (`nic-pouch-storefront`) is one of several sites served by a shared backend:

- **B2BCRM** (`../B2BCRM`, prod at `https://www.ducks.co.il`) — multi-tenant CRM, Postgres/Prisma
  on production Supabase (no separate dev DB — be careful with writes). Source of truth for
  products, orders, blogs, SEO, coupons per site. Every storefront reads it over HTTP via
  `/api/{slug}/...`; there is no shared database and the storefront never talks to Postgres or
  Payper directly.
- **Payper** (`api.payper.co.il`) — the client's inventory/POS system. Pushes stock, price,
  category and images into the CRM via a per-site webhook
  (`B2BCRM/app/api/[siteSlug]/payper-webhook/route.ts`). CRM-side only — the storefront never
  calls it. Also used (CRM-side) to issue Hebrew tax invoices/receipts once an order is paid.
- **Hyp Pay** (`pay.hyp.co.il`) — the actual credit-card payment gateway. Separate concern from
  Payper. Not wired up anywhere yet for this site.
- **This storefront** — Next.js 16, deploys to Cloudflare (`output: "export"`, OpenNext/wrangler
  present but static export means no server/API routes actually run at runtime today). Catalog is
  a checked-in JSON snapshot (`data/catalog.generated.json`), not a live read.

Full onboarding playbook for connecting any new site to this CRM:
`../B2BCRM/docs/adding-new-sites.md` — written generically, applies directly to this site.
Reference implementation of a finished integration (products + Hyp checkout): `../xvape`.

## Where things stand, per leg

### 1. Payper → CRM (inventory into the CRM)
**Webhook connectivity confirmed live, but still not sending real nic-pouch inventory.** As of a
later check, `lastPayperWebhookPayload` is no longer `null` — Payper has hit the webhook at least
once. But the payload was an unrelated test/sample product (an iPhone, category `שולחנות`
"tables") — not nic-pouch's actual categories (`סנוס NOIS`, `טבק הרחה/לעיסה`). The category filter
worked exactly as designed and correctly skipped it, so product count is still 0. Whoever manages
the Payper account still needs to point the real nic-pouch categories at this webhook — the
connection itself now works, the content doesn't match yet.

Originally confirmed via a read-only Prisma query against the production CRM DB:
- `nic-pouch` **is** already registered as a Site in the CRM (created 2026-07-24), with
  `payperCategories` already set: `סנוס NOIS`, `טבק הרחה/לעיסה`.
- `lastPayperWebhookPayload` is `null` — Payper has **never once** hit this site's webhook.
- It shares the same Payper merchant account as `xvape`/`polarizedx` (`realleaf@api.com`) — user
  confirmed this. Those two sites have live products, so the account/integration works in
  general; this site's categories just haven't been added to whatever Payper pushes to.
- The webhook receiver code itself needs no changes — it already handles any site generically.
- No `payperWebhookSecret` is used by any site on this account (all `null`) — not a gap, matches
  existing pattern.

**Next step (not code — needs the Payper account owner, per user: "someone else manages it —
agency/client"):** add a push rule on Payper's side for categories `סנוס NOIS` and
`טבק הרחה/לעיסה` targeting `https://www.ducks.co.il/api/nic-pouch/payper-webhook`.

### 2. CRM → website (catalog into the storefront)
**Done as of 2026-08-06.** `.env.local` (gitignored) now has `CRM_CATALOG_SYNC=true` +
`CRM_API_KEY` set (real key retrieved read-only from the CRM DB; site id
`cmrywgfsm000004ifqvbz21ez`). Verified live:
- `curl -H "x-api-key: <key>" https://www.ducks.co.il/api/nic-pouch/products` → `200 OK`, `[]`.
- `node scripts/sync-crm-catalog.mjs` → authenticates fine, logs "CRM returned no usable active
  products; keeping the last known catalog" (expected — CRM has 0 products for `nic-pouch` until
  leg 1 unblocks).

Nothing further to do on this leg. The sync is wired and safe to leave on — the next build after
Payper starts pushing products will pick them up automatically with zero further code changes.

### 3. Payment (Hyp Pay)
Not started. Current checkout (`components/commerce/checkout-client.tsx`) is a pure UI stub — it
saves nothing and charges nothing, by design, with a Hebrew banner saying so. Reference
implementation to copy from: `../xvape/app/api/hyp-checkout/route.ts` +
`../xvape/app/payment/{success,failure}`. Needs this site's own `HYP_MASOF`/`HYP_KEY`/`HYP_PASSP`
terminal credentials from the client — don't reuse another site's terminal. User said this comes
**after** the CRM/Payper product sync (current focus).

Also: `lib/payper/*` in this storefront (invoice/receipt builder) looks like dead scaffolding —
per the CRM's own architecture, Payper invoicing happens CRM-side
(`POST /api/{slug}/orders/{orderId}/confirm` auto-fires it), the storefront shouldn't call Payper
directly. Worth removing once the real order flow is built, not before.

## Other fixes made this session (unrelated to CRM, but worth knowing about)

- **pnpm was broken globally** (v9.15.0 didn't understand this project's `pnpm-workspace.yaml`
  `allowBuilds` key, which needs pnpm 10+). Fixed by upgrading the global pnpm install
  (`npm install -g pnpm@latest`, now v11.20.0). `packageManager` field also got added to
  `package.json` via `corepack use` (harmless, but the global upgrade is what actually fixed it —
  corepack's own shims aren't active on this machine, `corepack enable` fails with `EPERM`
  needing admin rights).
- **All 55 product slugs were Hebrew** (e.g. `hqd-פאוץ-ניקוטין-מנטה-20322`), which triggered a
  Next.js 16.2.0 + Turbopack dev-mode bug: every `/shop/[slug]` page 500'd in `next dev` (ASCII
  routes like `/brands/hqd` were unaffected; production `pnpm build` static export actually
  worked fine, so this was dev-only, but broke local testing entirely). Fixed by switching all
  slugs to ASCII (`hqd-15mg-20322` — brand + nicotine strength + id, since flavor names have no
  English source yet) in `data/catalog.generated.json`, and updating both slug-generation
  pipelines (`scripts/import-woocommerce-csv.mjs`, `scripts/catalog-import.ts`) plus
  `lib/catalog/crm-adapter.mjs` (added a `safeSlug()` fallback to product id, mirroring what
  `xvape/lib/products.ts` already does) so future re-imports/CRM syncs keep producing safe slugs.
  This matters for leg 2 above: the CRM's own Payper-webhook product creation
  (`B2BCRM/app/api/[siteSlug]/payper-webhook/route.ts`) generates a `handle` from the Hebrew
  `product_name` with no ASCII fallback — so real synced products will need the storefront-side
  `safeSlug()` guard regardless.
- Also fixed one hardcoded reference to the old Hebrew "sample" slug in
  `lib/catalog/product-page-variant.ts` (picks the "balanced" vs "legacy" product-detail design)
  and its two tests. All 82 unit tests pass.

## Loose end noticed, not yet raised with user

`next.config.ts` has `output: "export"` (pure static, no server/API routes possible) but the
project also depends on `@opennextjs/cloudflare` + `wrangler` (which exist to run a *full* Next
server on Cloudflare Workers — SSR, API routes, ISR). These are contradictory deploy strategies.
The product-sync leg doesn't care (build-time script works fine under static export), but the
Hyp Pay checkout **will** — API routes like `hyp-checkout` and `/api/revalidate` cannot exist
under `output: "export"`. This will need resolving before payment work starts (likely: drop
`output: "export"` and actually run on Workers via OpenNext, matching how `xvape` presumably
deploys). Flag this explicitly when payment work begins.
