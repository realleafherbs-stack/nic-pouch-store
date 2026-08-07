# מפרט למתכנת — מוצרים ודפי מוצר רב־אתריים

## מטרה

לבנות ב־CRM מערכת Product Information Management גמישה לכל סוג מוצר ולכל אתר. הוספת סוג מוצר, מאפיין או וריאציה לא תדרוש שינוי בסיס נתונים או שינוי קוד ייעודי.

## עקרונות

- שדות הליבה אוניברסליים.
- מאפיינים נוספים מוגדרים מתוך ה־CRM.
- מוצר מקור מופרד מהתצוגה והמחיר בכל אתר.
- מחיר, מלאי, תוכן ו־SEO ניתנים לדריסה לפי אתר.
- אינטגרציות Payper וסליקה נפרדות לכל אתר.
- כל שינוי נשמר בהיסטוריה וניתן לתצוגה מקדימה.

## מודל נתונים

### Product

- `id`
- `name`
- `internal_sku`
- `supplier_sku`
- `gtin`
- `product_type_id`
- `brand_id`
- `status`
- `default_description`
- `default_media`
- `created_at`
- `updated_at`

### ProductType

מגדיר תבנית למוצר, למשל משקפיים, וופורייזר, כבל, פאוץ' או מכונת קפה.

- שם.
- מאפייני חובה ורשות.
- בלוקי תוכן רלוונטיים.
- מאפייני סינון והשוואה.
- מאפיינים שיוצרים וריאציות.

### AttributeDefinition

- `code`
- `label`
- `data_type`: text, number, unit, boolean, single_select, multi_select, color, date, url
- `unit`
- `allowed_values`
- `required`
- `filterable`
- `comparable`
- `searchable`
- `variant_axis`
- `show_on_card`
- `show_in_specs`
- `sort_order`

### ProductAttributeValue

- `product_id`
- `attribute_definition_id`
- ערך typed לפי סוג השדה.

### Variant

- `id`
- `product_id`
- `sku`
- `gtin`
- `attribute_values`
- `price`
- `compare_at_price`
- `cost_price`
- `stock_quantity`
- `backorder_policy`
- `weight`
- `dimensions`
- `image_id`
- `active`

### SiteProduct

- `site_id`
- `product_id`
- `slug`
- `active`
- `site_name`
- `short_description`
- `long_description`
- `retail_price`
- `compare_at_price`
- `site_stock_override`
- `category_ids`
- `collection_ids`
- `badge`
- `featured`
- `bestseller`
- `new_product`
- `sort_priority`
- `content_blocks`
- `seo_fields`

## סוגי מוצר נתמכים

- מוצר פשוט.
- מוצר עם וריאציות.
- Bundle.
- מארז קבוע.
- מארז לבחירה.
- מוצר משלים.
- מוצר דיגיטלי.
- מוצר חיצוני.

## תוכן דף מוצר

### מעל הקפל

- Breadcrumbs.
- שם מוצר.
- מותג.
- גלריה.
- מחיר ומחיר קודם.
- זמינות.
- אפשרויות וריאציה.
- כמות.
- הוספה לסל.
- משלוח והחזרות.
- אזהרה או מגבלת גיל לפי הצורך.

### מתחת לקפל

- תקציר.
- תיאור מלא.
- יתרונות.
- מפרט מובנה.
- מה בקופסה.
- הוראות שימוש.
- רכיבים או חומרים.
- אזהרות.
- FAQ.
- ביקורות מאומתות.
- מוצרים חלופיים.
- מוצרים משלימים.
- תוכן ומאמרים קשורים.

כל אזור יהיה Block שניתן להפעיל, לכבות ולסדר לפי ProductType או SiteProduct.

## קטגוריות, מותגים ואוספים

- קטגוריות היררכיות.
- Brand הוא ישות עם לוגו, תיאור, SEO ועמוד מותג.
- Collection היא קבוצה שיווקית שאינה משנה קטגוריה.
- תגיות משמשות לניהול פנימי ולחוקים, לא כתחליף למאפיינים.

## סינון, חיפוש והשוואה

- פילטרים נגזרים מ־AttributeDefinition.
- הצגת מספר תוצאות לכל אפשרות.
- סינון לפי מלאי, מחיר, מותג ומאפיינים.
- חיפוש בעברית ובאנגלית.
- מילון מילים נרדפות ושגיאות כתיב.
- השוואה רק בין מאפיינים שהוגדרו `comparable`.
- תוצאות ריקות מספקות הצעות חלופיות.

## תמחור ומלאי

- הפרדה בין `cost_price`, `retail_price` ו־`compare_at_price`.
- מחיר ומלאי לכל וריאציה.
- מחיר ומלאי נפרדים לפי אתר.
- היסטוריית מחיר.
- מבצעים לפי תאריך, אתר, מוצר, קטגוריה או כמות.
- מניעת מכירה מתחת למלאי זמין.
- Webhooks idempotent לעדכוני מחיר ומלאי.

## קשרים בין מוצרים

- Similar.
- Alternative.
- Accessory.
- Frequently bought together.
- Manual cross-sell.
- Rule-based cross-sell.

בחירה ידנית גוברת על בחירה אוטומטית.

## SEO מוצר

- Meta title ו־description.
- canonical.
- index/noindex.
- OG image.
- Breadcrumbs.
- Product ו־Offer Schema.
- ProductGroup ווריאציות.
- מחיר, מטבע, מלאי, SKU, GTIN ומותג ב־Schema.
- כתובת URL יציבה.
- Redirect 301 לאחר שינוי slug.
- פיד Google Merchant Center.
- alt text לכל תמונה.

## מדיה

- תמונה ראשית וגלריה.
- שיוך תמונה לווריאציה.
- alt text, caption ו־focal point.
- יצירת גדלים responsive.
- WebP/AVIF.
- סדר תמונות ידני.
- מניעת מחיקה כאשר מדיה בשימוש.

## ביקורות

- דירוג וטקסט.
- סטטוס moderation.
- `verified_purchase`.
- שיוך למוצר ולווריאציה.
- תגובת מנהל.
- AggregateRating רק מביקורות מוצגות ואמיתיות.

## אינטגרציות

### Payper

- Webhook נפרד לכל אתר.
- סוד אימות נפרד.
- קטגוריות מורשות.
- מיפוי SKU מקור ל־Product.
- מוצר חדש מגיע inactive.
- עדכון מקור אינו דורס תוכן, SEO או דריסות אתר.
- לוג הצלחות, שגיאות ו־retry.

### אתר

- API ציבורי לקריאת מוצר, קטגוריה, מותג, מלאי ומחיר.
- Preview API מאובטח לטיוטות.
- Webhook לביטול Cache אחרי שינוי.

### הזמנות וסליקה

- Order נשמר לפני מעבר לסליקה.
- מסוף HYP נפרד לכל אתר.
- Webhook סליקה מאומת.
- עדכון סטטוס idempotent.
- אין שמירת פרטי כרטיס ב־CRM.

## מאפייני NIC POUCH

אלה הגדרות דרך המנגנון הכללי, לא עמודות קשיחות:

- מותג.
- טעם בעברית ובאנגלית.
- משפחת טעם.
- ניקוטין במ"ג לפאוץ'.
- רמת חוזק.
- מספר פאוצ'ים.
- פורמט.
- משקל נקי.
- מדינת ייצור.
- רכיבים.
- אזהרות.
- הגבלת גיל.

## Workflow והרשאות

- Import.
- Draft.
- Review.
- Active.
- Inactive.
- Archived.

תפקידים:

- Catalog editor.
- Merchandiser.
- SEO editor.
- Inventory manager.
- Publisher.
- Admin.

## קריטריוני קבלה

- ניתן ליצור ProductType ומאפיין חדש ללא שינוי קוד או Migration.
- ניתן ליצור מוצר עם וריאציות ומלאי נפרד.
- אותו מוצר יכול לקבל מחיר, תוכן וסטטוס שונים בכל אתר.
- Payper אינו דורס תוכן שיווקי או SEO.
- Product Schema עובר Rich Results Test.
- פילטר חדש מופיע באתר מתוך הגדרת מאפיין.
- שינוי slug יוצר Redirect 301.
- מוצר חסר שדה חובה אינו יכול לעבור ל־Active.
- כל שינוי נשמר בהיסטוריה.
- כל אתר מבודד בהגדרות, בנתונים ובאינטגרציות.

