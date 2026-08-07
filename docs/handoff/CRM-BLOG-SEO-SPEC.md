# מפרט למתכנת — מערכת בלוג ו־SEO רב־אתרית

## מטרה

לבנות ב־CRM מערכת תוכן כללית לכל האתרים, שמאפשרת לנהל בלוג מקצועי, אשכולות תוכן ו־SEO טכני בלי שינוי קוד לכל אתר או נושא חדש.

## עקרונות

- הפרדה מלאה בין אתרים, דומיינים, הרשאות, אנליטיקה והגדרות SEO.
- תוכן מובנה ולא שדה HTML אחד בלבד.
- כל עמוד אינדקסבילי חייב להיות ניתן לניהול, לבדיקה ולתצוגה מקדימה.
- ה־API הוא מקור האמת לאתר. ממשק הניהול אינו מחובר ישירות לתבניות האתר.
- תמיכה בעברית, RTL ושפות נוספות בעתיד.

## מודל נתונים

### Article

- `id`
- `site_id`
- `title`
- `slug`
- `excerpt`
- `status`: draft, review, scheduled, published, archived
- `body_blocks`
- `featured_image_id`
- `author_id`
- `reviewer_id`
- `published_at`
- `updated_at`
- `scheduled_at`
- `content_type`: guide, comparison, news, brand, glossary, faq
- `reading_time`
- `primary_keyword`
- `secondary_keywords`
- `search_intent`
- `content_cluster_id`
- `source_list`
- `related_article_ids`
- `related_product_ids`
- `related_category_ids`
- `related_brand_ids`

### Taxonomy

- קטגוריות היררכיות.
- תגיות.
- אשכול תוכן.
- עמוד Pillar לכל אשכול.
- מניעת slug כפול בתוך אותו אתר.

### Author

- שם.
- תפקיד.
- תקציר מקצועי.
- תמונה.
- עמוד מחבר.
- קישורים חיצוניים מאומתים.
- אפשרות להגדיר עורך או בודק מקצועי נפרד.

## עורך תוכן

העורך יתמוך בבלוקים:

- פסקה.
- H2 ו־H3.
- רשימה.
- תמונה עם alt, caption וקרדיט.
- וידאו.
- טבלה.
- ציטוט.
- Callout.
- FAQ.
- כרטיסי מוצרים.
- השוואת מוצרים.
- CTA.
- קישורים למאמרים קשורים.

אין לאפשר יותר מ־H1 אחד בעמוד. H1 נגזר מכותרת המאמר.

## שדות SEO לכל עמוד

- `meta_title`
- `meta_description`
- `canonical_url`
- `robots_index`
- `robots_follow`
- `og_title`
- `og_description`
- `og_image_id`
- `twitter_card`
- `schema_type`
- `schema_overrides`
- `hreflang_group`
- `redirect_from`

המערכת תציג:

- ספירת תווים.
- תצוגה מקדימה של Google.
- תצוגה מקדימה של WhatsApp/Facebook.
- אזהרה על title או description כפולים.
- אזהרה על canonical שגוי.
- אזהרה על תמונה ללא alt.
- אזהרה על תוכן דל או ללא קישורים פנימיים.

## SEO טכני

### חובה

- Sitemap index דינמי.
- Sitemaps נפרדים למאמרים, מוצרים, קטגוריות, מותגים ותמונות.
- robots.txt לפי אתר.
- canonical עצמי לכל עמוד אינדקסבילי.
- Redirects 301 לאחר שינוי slug.
- עמוד ניהול Redirects.
- דוח 404.
- Breadcrumbs.
- RSS לבלוג.
- pagination תקינה.
- טיפול ב־noindex לעמודי חיפוש פנימי, חשבון, סל ו־Checkout.
- כל הקישורים הפנימיים החשובים יהיו `<a href>`.

### Faceted navigation

- פרמטרי סינון אינם אינדקסביליים כברירת מחדל.
- שילובי פילטרים לא רצויים נחסמים ב־robots או מקבלים canonical לקטגוריה הראשית.
- רק דפי Landing ייעודיים ומאושרים יוכלו להיות אינדקסביליים.
- שילוב פילטר ריק או לא חוקי יחזיר 404 אמיתי.

## Structured Data

ה־CRM יפיק JSON-LD מהנתונים:

- `Article`
- `BreadcrumbList`
- `Organization`
- `Person`
- `Product`
- `ProductGroup`
- `Offer`
- `AggregateRating`
- מדיניות משלוח והחזרות

Schema יוצג רק אם המידע קיים גם בעמוד. אין לייצר ביקורות, דירוגים או FAQ שאינם מוצגים למשתמש.

## קישורים פנימיים

- הצעות אוטומטיות לפי אשכול, ישויות ומילות מפתח.
- בחירת Anchor Text ידנית.
- התראה על עמוד ללא קישורים נכנסים.
- התראה על קישור שבור.
- קשר דו־כיווני בין מאמרים למוצרים, מותגים וקטגוריות.

## Workflow

1. כתיבה.
2. בדיקת SEO אוטומטית.
3. בדיקת מקורות.
4. אישור עורך.
5. תצוגה מקדימה.
6. פרסום או תזמון.
7. יצירת Sitemap ועדכון Cache.
8. שמירת היסטוריית גרסאות.

## מדיה

- alt text חובה לתמונה משמעותית.
- caption וקרדיט.
- focal point.
- יצירת WebP/AVIF וגדלים responsive.
- URL יציב.
- זיהוי תמונות כבדות או כפולות.

## אינטגרציות ודוחות

- Google Search Console נפרד לכל אתר.
- GA4 נפרד לכל אתר.
- Google Merchant Center לחנויות.
- דשבורד: קליקים, חשיפות, CTR, מיקום, עמודים מאונדקסים ושגיאות Schema.
- Content decay: סימון מאמרים שאיבדו תנועה או לא עודכנו.
- חיפושים ללא תוצאה באתר.

## API

נדרשים endpoints לקריאה לפי:

- slug.
- סטטוס.
- קטגוריה.
- תגית.
- מחבר.
- אשכול.
- מוצר קשור.
- תאריך עדכון.

כל response כולל `updated_at` ו־cache tag. פרסום או שינוי תוכן שולח Webhook לאתר לביטול Cache נקודתי.

## הרשאות

- Writer.
- Editor.
- SEO manager.
- Publisher.
- Admin.

מחיקה תעבור דרך Archive ו־Trash לפני מחיקה סופית.

## קריטריוני קבלה

- אפשר ליצור, לבדוק, לתזמן ולפרסם מאמר בלי מתכנת.
- לכל מאמר יש Preview מלא.
- שינוי slug יוצר Redirect 301.
- Article ו־Breadcrumb Schema עוברים Rich Results Test.
- Sitemap מתעדכן אחרי פרסום.
- מאמר יכול לקשר למוצרים ולמאמרים אחרים.
- אין title, slug או canonical כפולים ללא התראה.
- עמודי סינון וחיפוש אינם יוצרים אינסוף URLs לאינדוקס.
- כל אתר שומר הגדרות SEO, נתונים ואנליטיקה בנפרד.

