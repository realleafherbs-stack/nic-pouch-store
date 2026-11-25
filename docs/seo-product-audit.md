# Product page SEO audit

Audited against the checked-in catalog (`data/catalog.generated.json`) before the template change. The storefront serves the same records through `getAllProducts()` when the CRM is not configured.

## How product pages are built

- Route: `app/(store)/shop/[slug]/page.tsx`.
- Data: `lib/catalog/local-repository.ts` loads active `packSize === 1` products. With CRM env vars it fetches live products; otherwise it uses the checked-in catalog. Legacy slugs redirect to the current slug. URLs stay `/shop/{slug}`.
- There are **77 product pages**, one per active single unit, across BIT, CUBA, HQD, KILLA, NOIS, PABLO, and RABBIT.
- Copy was already centralized in `lib/catalog/product-seo.ts` (`productSeoTitle`, `productSeoDescription`) and emitted by `generateMetadata`. Structured data was an inline `Product` object plus `FAQPage` and `BreadcrumbList` in the page.
- The root layout title template is `%s | NIC POUCH`, so a string `title` is not the title Google sees.

## What was already in place

- Every product had a stored `metaTitle`, `metaDescription`, and `canonicalUrl` of `/shop/{slug}`.
- `generateMetadata` set a canonical to the current slug, an Open Graph object, and a Twitter card.
- `Product` and `BreadcrumbList` JSON-LD were present. The breadcrumb matched the visible trail (home, shop, brand, product).
- No product has `rating`, `reviewCount`, or `gtin`. Schema did not invent reviews.
- One product, `nois-cool-strong-35`, is `indexable: false`. That noindex is unchanged.

## What was missing or weak

### Titles

Stored titles were unique and 37–50 characters, all on the pattern `{name} | שקיק ניקוטין ללא טבק`. The rendered `<title>` appended ` | NIC POUCH`.

- Rendered length: 49–62 characters.
- **6 of 77 rendered titles were over 60 characters** (five at 61, one at 62):
  - CUBA בלאק קולד דריי 43 מ״ג
  - NOIS דובדבן אקסטרים 50 מ״ג
  - NOIS בלוברי אקסטרים 50 מ״ג
  - CUBA וויט קולד דריי 16 מ״ג
  - PABLO טרופיקל פאנצ׳ 50 מ״ג
  - NOIS Cool Strong 35 מ״ג/גרם (62)
- Open Graph titles used the same string plus another ` | NIC POUCH`, so social titles were long even when the stored title was not.
- `nois-cool-strong-35` used an English stored title (`NOIS Cool Strong…`) instead of the Hebrew catalog name.

### Descriptions

Stored descriptions were unique but almost the same sentence, and `productSeoDescription` returned that stored string whenever it existed. The generator never reached flavor or strength.

- Length: 113–132. **3 of 77 were under 120 characters** (`hqd-mint-6` 119, `hqd-mango-6` 119, `nois-cool-strong-35` 113). None were over 155.
- The shared sentence was `{name}, שקיק ניקוטין ללא טבק למבוגרים בלבד. {mg} מ״ג, מחיר וזמינות באתר NIC POUCH. המוצר מכיל ניקוטין — חומר ממכר.` It repeated the milligrams and did not name the flavor or the strength level.
- The fallback used only when `metaDescription` was empty did include a price (`החל מ־{retailPrice} ₪`). Every current product had a stored description, so that fallback was unused. It is still the wrong default: a price does not belong in the description template.
- `nois-cool-strong-35` said the pouch is mint, 17.5 mg per pouch, and 27 pouches per can. Those figures are not in `name`, `brand`, `flavor`, `nicotineMg`, or `strengthLevel`. The flavor field on that product is `קול חזק 35 מ"ל`, which is a milliliter typo, not a taste.

### Flavor fields

39 of 77 flavor strings are not usable as written:

- 20 start with `פאוץ' ניקוטין`
- 18 end with a stray dash
- 6 repeat the brand
- 1 uses `מ"ל` (`nois-cool-strong-35`)

Some strings have more than one of these. Visible product text still shows the stored flavor. Metadata now strips only the prefix, the trailing dash, and a leading brand, and it drops the milliliter value instead of guessing a taste.

### Canonical and Open Graph

- Canonical path was already correct and still is: `/shop/{current slug}`. `metadataBase` makes it absolute. Legacy slugs are not canonical.
- Open Graph existed, but `locale` and `siteName` were left to the root merge, the title repeated the site name, and image alt text was always `{name} – תמונת מוצר` even when `imageAlt` was set.
- `hqd-blueberry-25` has no image and no `ogImage`, so it cannot have an Open Graph image. That is unchanged.
- Two products set `ogImage` to a third-party CDN. When a catalog image exists, the page now uses that image.

### Structured data

- `Product.name` was `{name} – שקיקי ניקוטין ללא טבק`, not the product name.
- `Product.description` preferred the long catalog description, including the extra mint / 17.5 mg / 27-pouch claims on Cool Strong.
- `manufacturer` was set to the brand. The catalog does not say the brand is the manufacturer.
- `gtin13` was copied from `sku` whenever the SKU had 13 digits (**74 products**). No product has a `gtin` field, so those barcodes were inferred.
- `additionalProperty` included `אריזה: יחידה` for every product, and it passed dirty flavor strings through.
- `audience.suggestedMinAge` was added even though age is a site rule, not a product attribute.
- `FAQPage` was emitted on every product page. Those four questions are rendered only by the balanced layout, whose slug (`nois-50mg-43589`) is not in this catalog. All 77 current pages are the legacy layout, so the FAQ markup described text that was not on the page. `BreadcrumbList` was fine and stays.
- Offer price, currency, and stock were real catalog values. They stay. Nothing is added for ratings or reviews, because the catalog has none.

## What the templates do now

`generateMetadata` and `productSchema()` build every product page from the catalog record:

- Title: `{name} | שקיק ניקוטין ללא טבק`, set with `title.absolute` so the layout does not append ` | NIC POUCH`. All 77 titles are unique and 37–50 characters.
- Description: name, brand, cleaned flavor when it is a real taste, nicotine mg, and strength (`עדינה` / `בינונית` / `חזקה` / `חזקה מאוד`, the same scale as before, in the feminine form that agrees with עוצמה). A short sentence adds `הנתונים לפי סימון האריזה` only when the text would otherwise be under 120 characters. All 77 descriptions are unique and 121–144 characters. No prices, no health claims. The nicotine warning is the same warning already shown on the page.
- Canonical stays `/shop/{slug}`.
- Open Graph and Twitter use that title and description, `he_IL`, the site name, the canonical URL, and real images with the catalog alt text.
- JSON-LD is `Product` plus `BreadcrumbList`. `FAQPage` is included only if the balanced layout, which actually renders those questions, is the one on screen.
- Offer uses `retailPrice` and stock from the product. `gtin` is emitted only when `product.gtin` is set.

Stored `metaTitle` and `metaDescription` are left in the catalog and are not rendered. They were one shared template, and preferring them is what kept flavor and strength out of the tags.

Visible names, prices, slugs, and page copy are unchanged. The strength chips on the page still use the masculine labels (עדין, בינוני, חזק, חזק מאוד).

## Before / after

### HQD מנטה 6 מ״ג (`/shop/hqd-mint-6`)

Description was 119 characters and did not mention flavor or strength. The flavor field is `פאוץ' ניקוטין  מנטה`.

- Title before: `HQD מנטה 6 מ״ג | שקיק ניקוטין ללא טבק | NIC POUCH`
- Title after (37): `HQD מנטה 6 מ״ג | שקיק ניקוטין ללא טבק`
- Description before (119): `HQD מנטה 6 מ״ג, שקיק ניקוטין ללא טבק למבוגרים בלבד. 6 מ״ג, מחיר וזמינות באתר NIC POUCH. המוצר מכיל ניקוטין — חומר ממכר.`
- Description after (140): `HQD מנטה 6 מ״ג מבית HQD, שקיק ניקוטין ללא טבק בטעם מנטה, 6 מ״ג בעוצמה עדינה. הנתונים לפי סימון האריזה. למבוגרים בלבד. ניקוטין הוא חומר ממכר.`

### CUBA בלאק קולד דריי 43 מ״ג (`/shop/cuba-black-cold-dry-43`)

Rendered title was 61 characters. Flavor was `בלאק קולד דריי  -`. Strength (חזקה מאוד) was not in the description.

- Title before: `CUBA בלאק קולד דריי 43 מ״ג | שקיק ניקוטין ללא טבק | NIC POUCH`
- Title after (49): `CUBA בלאק קולד דריי 43 מ״ג | שקיק ניקוטין ללא טבק`
- Description before (132): `CUBA בלאק קולד דריי 43 מ״ג, שקיק ניקוטין ללא טבק למבוגרים בלבד. 43 מ״ג, מחיר וזמינות באתר NIC POUCH. המוצר מכיל ניקוטין — חומר ממכר.`
- Description after (142): `CUBA בלאק קולד דריי 43 מ״ג מבית CUBA, שקיק ניקוטין ללא טבק בטעם בלאק קולד דריי, 43 מ״ג בעוצמה חזקה מאוד. למבוגרים בלבד. ניקוטין הוא חומר ממכר.`

### NOIS קול סטרונג 35 מ״ג לגרם (`/shop/nois-cool-strong-35`)

Rendered title was 62 characters and in English. Description was 113 characters and added mint, 17.5 mg per pouch, and 27 pouches. The page stays `noindex`.

- Title before: `NOIS Cool Strong 35 מ״ג/גרם | שקיק ניקוטין ללא טבק | NIC POUCH`
- Title after (50): `NOIS קול סטרונג 35 מ״ג לגרם | שקיק ניקוטין ללא טבק`
- Description before (113): `NOIS Cool Strong בטעם מנטה: 35 מ״ג לגרם ו-17.5 מ״ג לשקיק, 27 שקיקים באריזה. למבוגרים בלבד; ניקוטין הוא חומר ממכר.`
- Description after (123): `NOIS קול סטרונג 35 מ״ג לגרם מבית NOIS, שקיק ניקוטין ללא טבק, 35 מ״ג בעוצמה חזקה מאוד. למבוגרים בלבד. ניקוטין הוא חומר ממכר.`
