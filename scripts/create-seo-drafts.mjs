const apiBase = process.env.AGENT_API_BASE_URL ?? "https://www.ducks.co.il/api/nic-pouch/agent";
const apiKey = process.env.AGENT_API_KEY;
const shouldApply = process.argv.includes("--apply");

if (!apiKey) throw new Error("AGENT_API_KEY is required");

const warning = "ניקוטין הוא חומר ממכר. המוצרים מיועדים לבגירים בלבד. מי שאינו משתמש בניקוטין לא צריך להתחיל.";

const drafts = [
  {
    title: "סנוס: השפעות, תופעות לוואי ומה חשוב לדעת",
    slug: "snus-effects-and-side-effects",
    excerpt: "מידע אחראי על השפעות ניקוטין, תופעות אפשריות וההבדל בין סנוס מסורתי לשקיקי ניקוטין ללא טבק.",
    primaryKeyword: "סנוס השפעות",
    metaTitle: "סנוס: השפעות ותופעות לוואי — מה חשוב לדעת",
    metaDescription: "מהן ההשפעות האפשריות של ניקוטין, מה ההבדל בין סנוס מסורתי לשקיקי ניקוטין ללא טבק ומתי חשוב להפסיק ולפנות לייעוץ.",
    directAnswer: "ניקוטין הוא חומר ממכר. שקיקי ניקוטין אינם מכילים עלי טבק, אך עדיין מכילים ניקוטין; המחקר על השפעותיהם ארוכות הטווח עדיין מתפתח.",
    tags: ["סנוס", "ניקוטין", "השפעות", "מידע ואזהרות"],
    faq: [
      { question: "האם שקיקי ניקוטין נטולי סיכון?", answer: "לא. הם אינם מכילים עלי טבק, אך מכילים ניקוטין ממכר, והמחקר על ההשפעות ארוכות הטווח עדיין מתפתח." },
      { question: "האם שקיקי ניקוטין מיועדים לגמילה?", answer: "ה־CDC מציין כי ה־FDA לא אישר שקיקי ניקוטין כאמצעי לגמילה מעישון." },
      { question: "למי המוצרים אינם מיועדים?", answer: "לקטינים, למי שאינו משתמש בניקוטין, ובהתאם להנחיות רפואיות גם לאוכלוסיות שעבורן ניקוטין מסוכן במיוחד." },
    ],
    body: `<p class="article-lead">המילה "סנוס" משמשת בישראל לעיתים גם לתיאור שקיקי ניקוטין ללא טבק. חשוב להבדיל: סנוס מסורתי מכיל טבק, ואילו שקיקי ניקוטין אינם מכילים עלי טבק — אבל בשני המקרים עשוי להיות ניקוטין.</p>
<h2>התשובה הקצרה</h2><p>ניקוטין הוא חומר ממכר. לפי ה־CDC, שקיקי ניקוטין יכולים להכיל רמות גבוהות של ניקוטין, והידע המחקרי על ההשפעות קצרות וארוכות הטווח עדיין מתפתח. היעדר עלי טבק אינו הופך מוצר המכיל ניקוטין לנטול סיכון.</p>
<h2>אילו השפעות עשויות להופיע?</h2><p>התגובה לניקוטין משתנה מאדם לאדם ותלויה בין היתר במוצר, בכמות הניקוטין ובאופן השימוש. אם מופיעה תחושה חריגה או לא נעימה, יש להפסיק את השימוש ולפנות לייעוץ רפואי מתאים. במקרה של חשד לחשיפה או בליעה בידי ילד יש לפנות מיד לקבלת עזרה רפואית.</p>
<h2>מה ידוע על התמכרות?</h2><p>ניקוטין ממכר. שימוש חוזר עלול ליצור תלות, ולכן אין להציג שקיקי ניקוטין כמוצר בריאות או כפתרון גמילה. ה־CDC מציין כי שקיקי ניקוטין לא אושרו בידי ה־FDA כאמצעי לגמילה מעישון.</p>
<h2>מי צריך להימנע?</h2><p>המוצרים אינם מיועדים לקטינים או למי שאינו משתמש בניקוטין. ניקוטין מסוכן במיוחד לצעירים ולנשים בהריון. כאשר קיים מצב רפואי, טיפול תרופתי או ספק אחר, יש להתייעץ עם איש מקצוע רפואי ולא להסתמך על תוכן מסחרי.</p>
<h2>אחסון בטוח</h2><p>יש לשמור את המוצר באריזה המקורית, סגור והרחק מהישג ידם ומטווח ראייתם של ילדים ובעלי חיים. ה־FDA מזהיר מפני חשיפה מקרית וממליץ לא להעביר את השקיקים לכלי אחר.</p>
<h2>מקורות</h2><ul><li><a href="https://www.cdc.gov/tobacco/nicotine-pouches/index.html" rel="noreferrer">CDC — Nicotine Pouches</a></li><li><a href="https://www.fda.gov/consumers/consumer-updates/properly-store-nicotine-pouches-prevent-accidental-exposure-children-and-pets" rel="noreferrer">FDA — אחסון בטוח ומניעת חשיפה</a></li><li><a href="https://www.gov.il/he/service/smoking-call-center-rehab" rel="noreferrer">משרד הבריאות — תוכניות גמילה מעישון</a></li></ul><div class="warning"><strong>אזהרה:</strong> ${warning}</div>`,
  },
  {
    title: "מחיר סנוס ושקיקי ניקוטין: איך משווים נכון?",
    slug: "snus-price-guide",
    excerpt: "איך לקרוא מחיר ליחידה, להבין מדרגות כמות ולהשוות שקיקי ניקוטין בלי להתבלבל בין יחידה למארז.",
    primaryKeyword: "סנוס מחיר",
    metaTitle: "סנוס מחיר: השוואת מחיר ליחידה ולכמות",
    metaDescription: "מדריך להשוואת מחיר סנוס ושקיקי ניקוטין: מחיר ליחידה, הנחות כמות, משלוח וההבדל בין מוצר בודד למארז.",
    directAnswer: "כדי להשוות מחיר שקיקי ניקוטין, בדקו את המחיר ליחידה, את מספר היחידות שנבחר, את עלות המשלוח ואת המחיר הסופי בסל.",
    tags: ["סנוס", "מחיר", "שקיקי ניקוטין", "מדריך קנייה"],
    faq: [
      { question: "איך משווים מחיר בין מוצרים?", answer: "משווים את המחיר ליחידה באותה כמות, ולא רק את הסכום הכולל שמופיע בכרטיס." },
      { question: "האם המחיר בחבילה תמיד נמוך יותר?", answer: "לא בהכרח. יש לבדוק את המחיר ליחידה ואת הסכום הסופי בסל לפני ההזמנה." },
      { question: "איפה רואים את המחיר הקובע?", answer: "המחיר הסופי, כולל הכמות והמשלוח, מוצג בסל ובשלב סיכום ההזמנה." },
    ],
    body: `<p class="article-lead">בחיפוש אחר "סנוס מחיר" קל להתבלבל בין מחיר של יחידה אחת לבין מחיר של כמה יחידות. באתר NIC POUCH כל פריט מייצג מוצר בודד, והלקוח בוחר את הכמות הרצויה.</p>
<h2>בדקו קודם את המחיר ליחידה</h2><p>בחרו 1, 5 או 10 יחידות ובדקו מהו המחיר ליחידה בכל מדרגה. סכום גבוה יותר בסל לא בהכרח מצביע על מוצר יקר יותר — לעיתים הוא פשוט משקף כמות גדולה יותר.</p>
<h2>מה עוד משפיע על המחיר הסופי?</h2><p>המחיר הסופי עשוי לכלול את הכמות שנבחרה, קופון תקף ועלות משלוח לפי תנאי האתר. הסכום הקובע הוא זה שמוצג בסיכום ההזמנה לפני התשלום.</p>
<h2>אל תשוו מוצרים שונים כאילו הם זהים</h2><p>מותג, טעם וכמות ניקוטין הם מאפיינים שונים. השוואת מחיר מועילה רק כאשר מבינים איזה מוצר ואיזו כמות נבחרו. יש לקרוא את שם המוצר ואת סימון האריזה, ולא להסתמך רק על תמונה או צבע.</p>
<h2>יחידה בודדת מול מארז</h2><p>בחנות מוצגים מוצרים בודדים. בחירת 5 או 10 משנה את הכמות של אותו מוצר ואינה יוצרת מוצר קטלוג נפרד. כך אפשר לראות באופן ברור כמה יחידות נוספו ומה המחיר הכולל.</p>
<h2>לפני שמאשרים הזמנה</h2><ul><li>בדקו את שם המוצר והמותג.</li><li>בדקו את הכמות שנבחרה.</li><li>בדקו מחיר ליחידה וסכום ביניים.</li><li>בדקו משלוח וקופון בסיכום ההזמנה.</li></ul><div class="warning"><strong>אזהרה:</strong> ${warning}</div>`,
  },
];

const headers = { "x-api-key": apiKey, "content-type": "application/json" };
const response = await fetch(`${apiBase}/blogs`, { headers });
if (!response.ok) throw new Error(`Could not list blogs: ${response.status}`);
const existing = await response.json();
const existingSlugs = new Set(existing.map((post) => post.slug));
const pending = drafts.filter((draft) => !existingSlugs.has(draft.slug));

console.log(JSON.stringify({ mode: shouldApply ? "apply" : "dry-run", existing: existing.length, toCreate: pending.map(({ slug }) => slug) }, null, 2));

if (shouldApply) {
  for (const draft of pending) {
    const createResponse = await fetch(`${apiBase}/blogs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...draft,
        status: "DRAFT",
        indexable: false,
        canonicalUrl: `https://nicpouch.co.il/blog/${draft.slug}`,
        authorName: "מערכת NIC POUCH",
        authorRole: "צוות תוכן",
        reviewedBy: "ממתין לאישור",
        contentType: "GUIDE",
      }),
    });
    if (!createResponse.ok) throw new Error(`Could not create ${draft.slug}: ${createResponse.status} ${await createResponse.text()}`);
    const created = await createResponse.json();
    console.log(`created ${created.slug ?? draft.slug}`);
  }
}
