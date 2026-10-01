const apiBase = process.env.AGENT_API_BASE_URL ?? "https://www.ducks.co.il/api/nic-pouch/agent";
const apiKey = process.env.AGENT_API_KEY;
const apply = process.argv.includes("--apply");
const publish = process.argv.includes("--publish");

if (!apiKey) throw new Error("AGENT_API_KEY is required");

const headers = { "x-api-key": apiKey, "content-type": "application/json" };

async function request(path, init = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

const warning = "המוצרים מיועדים לבגירים בלבד ומכילים ניקוטין, חומר ממכר. יש לקרוא את האזהרות והוראות היצרן ולשמור סגור, הרחק מילדים ומבעלי חיים.";
const siteUrl = "https://nicpouch.co.il";

const articles = [
  {
    title: "סנוס 25 מ״ג: HQD ו־NOIS — טעמים, סימונים ומוצרים זמינים",
    slug: "snus-25-mg-hqd-nois-israel-guide",
    excerpt: "מחפשים סנוס 25 מ״ג? מדריך מעשי למוצרי HQD ו־NOIS עם סימון 25 מ״ג, טעמים פעילים, השוואת נתונים וקישורים ישירים למלאי.",
    primaryKeyword: "סנוס 25 מ״ג",
    metaTitle: "סנוס 25 מ״ג: HQD ו־NOIS בישראל | NIC POUCH",
    metaDescription: "סנוס ושקיקי ניקוטין 25 מ״ג: מוצרי HQD ו־NOIS, טעמים פעילים, מה לבדוק על האריזה וקישורים למלאי באתר NIC POUCH.",
    directAnswer: "בבדיקת קטלוג NIC POUCH ב־1 באוקטובר 2026 נמצאו מוצרי HQD ו־NOIS פעילים עם סימון 25 מ״ג. לפני הזמנה בודקים מותג, טעם, יחידת מדידה, מחיר ומלאי בדף המוצר.",
    tags: ["סנוס 25 מ״ג", "שקיקי ניקוטין 25 מ״ג", "HQD 25 מ״ג", "NOIS 25 מ״ג"],
    featuredImage: `${siteUrl}/generated/blog/snus-25-mg-guide-october-2026.png`,
    ogImage: `${siteUrl}/generated/blog/snus-25-mg-guide-october-2026.png`,
    relatedProductIds: [
      "cmsjejnac000604jt93h3utk6", "cmsjejqfk000c04jtc8jklxjp", "cmsjejocs000804jt811xaamf",
      "cmsjejpek000a04jtse9wvvtj", "cmsjejovz000904jtntumae94", "cmsjejnt3000704jt24perz32",
      "cmsjeklls001z04jtuq5h9vep", "cmsjel606003204jt4li3vqh6", "cmsjekmnf002104jtyhu3mbvc", "cmsjekm4a002004jt1zopqi99",
    ],
    faq: [
      { question: "אילו מותגים עם סימון 25 מ״ג יש באתר?", answer: "בבדיקת הקטלוג נמצאו HQD ו־NOIS עם גרסאות פעילות שמסומנות 25 מ״ג. המלאי משתנה, ולכן דף המוצר הוא המקור העדכני." },
      { question: "האם כל מוצר 25 מ״ג זהה?", answer: "לא. יש להשוות מותג, שם גרסה, יחידת מדידה, מספר שקיקים כאשר הוא מאומת ומחיר. המספר לבדו אינו מספיק להשוואה." },
      { question: "האם טעם אייס או מנטה מציין את עוצמת המוצר?", answer: "לא. שם הטעם והסימון הם נתונים נפרדים. צריך לבדוק את שניהם בדף המוצר ועל האריזה." },
      { question: "איפה רואים את המחיר והמלאי?", answer: "בדף המוצר ובסל בזמן ההזמנה. המחיר, המלאי ומדרגות הכמות עשויים להשתנות." },
    ],
    body: `<p class="article-lead">מי שמחפש “סנוס 25 מ״ג” מחפש בדרך כלל מוצר מסוים, טעם זמין ודרך ברורה לבדוק מה מופיע על האריזה לפני הזמנה. בקטלוג NIC POUCH יש גרסאות HQD ו־NOIS עם סימון 25 מ״ג, אבל לא כל מוצר באותו מספר הוא אותו מוצר.</p>
<p><strong>התשובה הקצרה:</strong> בבדיקת הקטלוג ב־1 באוקטובר 2026 נמצאו מוצרי HQD ו־NOIS פעילים עם סימון 25 מ״ג. ב־HQD מופיעים מנטה, לימון־מנטה, בריזה טרופית, פסיפלורה מתוקה, אוכמניות, מנגו ולימונדה כחולה. ב־NOIS נמצאו מנטה, בלוברי, ענבים קרח ודובדבן קרח. לפני הזמנה יש לבדוק את יחידת המדידה שעל האריזה ואת המלאי בדף המוצר.</p>
<h2>מוצרי 25 מ״ג שנמצאו בקטלוג</h2>
<table><thead><tr><th>מותג</th><th>טעם או גרסה</th><th>קישור למוצר</th></tr></thead><tbody>
<tr><td>HQD</td><td>מנטה</td><td><a href="/shop/hqd-mint-25">HQD מנטה 25 מ״ג</a></td></tr>
<tr><td>HQD</td><td>לימון־מנטה</td><td><a href="/shop/hqd-lemon-mint-25">HQD לימון־מנטה 25 מ״ג</a></td></tr>
<tr><td>HQD</td><td>לימונדה כחולה</td><td><a href="/shop/hqd-blue-lemonade-25">HQD לימונדה כחולה 25 מ״ג</a></td></tr>
<tr><td>HQD</td><td>מנגו</td><td><a href="/shop/hqd-mango-25">HQD מנגו 25 מ״ג</a></td></tr>
<tr><td>HQD</td><td>פסיפלורה מתוקה</td><td><a href="/shop/hqd-sweet-passionfruit-25">HQD פסיפלורה מתוקה 25 מ״ג</a></td></tr>
<tr><td>HQD</td><td>בריזה טרופית</td><td><a href="/shop/hqd-tropical-breeze-25">HQD בריזה טרופית 25 מ״ג</a></td></tr>
<tr><td>NOIS</td><td>מנטה</td><td><a href="/shop/nois-mint-25">NOIS מנטה 25 מ״ג</a></td></tr>
<tr><td>NOIS</td><td>בלוברי</td><td><a href="/shop/nois-blueberry-25">NOIS בלוברי 25 מ״ג</a></td></tr>
<tr><td>NOIS</td><td>ענבים קרח</td><td><a href="/shop/nois-grape-ice-25">NOIS ענבים קרח 25 מ״ג</a></td></tr>
<tr><td>NOIS</td><td>דובדבן קרח</td><td><a href="/shop/nois-cherry-ice-25">NOIS דובדבן קרח 25 מ״ג</a></td></tr>
</tbody></table>
<p>הרשימה משקפת את המוצרים הפעילים בזמן הבדיקה. דף מוצר עלול להשתנות למצב חוסר מלאי, ולכן כדאי לפתוח את הקישור, לוודא את השם המלא ולבדוק את הסל לפני תשלום.</p>
<h2>HQD 25 מ״ג: איך מזהים את הגרסה הנכונה?</h2>
<p>HQD מופיע בכמה משפחות טעם עם סימון 25 מ״ג. מנטה ולימון־מנטה הם שמות שונים, וגם בריזה טרופית, פסיפלורה מתוקה ולימונדה כחולה הן גרסאות שונות. השם המלא עוזר לזהות את המוצר המדויק; צבע הקופסה אינו מפרט טכני.</p>
<p>מי שמחפש טעם פרי יכול להשוות בין <a href="/shop/hqd-blueberry-25">אוכמניות</a>, <a href="/shop/hqd-mango-25">מנגו</a> ו־<a href="/shop/hqd-tropical-breeze-25">בריזה טרופית</a>. מי שמחפש מנטה יכול להתחיל ב<a href="/shop/hqd-mint-25">מנטה</a> או ב<a href="/shop/hqd-lemon-mint-25">לימון־מנטה</a>. אלה קישורים למוצרים, לא המלצה על טעם או על עוצמה.</p>
<h2>NOIS 25 מ״ג: מנטה ופירות</h2>
<p>ב־NOIS הופיעו ארבע גרסאות פעילות עם סימון 25 מ״ג: מנטה, בלוברי, ענבים קרח ודובדבן קרח. “קרח” או “אייס” הם חלק משם הטעם. הם אינם יחידת מדידה ואינם מציינים כמה ניקוטין יש בשקיק.</p>
<p>לפרטים רחבים על המותג אפשר לקרוא את <a href="/blog/nois-flavors-strengths-guide">מדריך NOIS לטעמים ולעוצמות</a>. לחיפוש לפי משפחת טעם, <a href="/blog/mint-snus-nicotine-pouches-israel-guide">מדריך סנוס מנטה</a> ו<a href="/blog/blueberry-snus-nicotine-pouches-israel-guide">מדריך אוכמניות ובלוברי</a> עוזרים להבדיל בין שמות קרובים.</p>
<h2>מה צריך לבדוק כשמשווים מוצרים עם סימון 25 מ״ג?</h2>
<ol>
<li><strong>יחידת המדידה:</strong> מספר מ״ג יכול להתייחס לשקיק, לגרם או לנתון אחר של היצרן. משווים מספרים רק כאשר היחידה זהה.</li>
<li><strong>שם הגרסה המלא:</strong> מותג, סדרה וטעם. שתי אריזות עם צבע דומה יכולות להיות מוצרים שונים.</li>
<li><strong>מספר שקיקים ומשקל:</strong> אם הנתונים מאומתים ומופיעים על האריזה או בדף המוצר, בודקים אותם לפני השוואת מחיר.</li>
<li><strong>מחיר לפי הכמות שנבחרה:</strong> המחיר ליחידה עשוי להשתנות כאשר מוסיפים כמה יחידות לסל.</li>
<li><strong>מלאי בזמן אמת:</strong> אל תסתמכו על אזכור במאמר בלבד; דף המוצר וסיכום ההזמנה הם הקובעים.</li>
</ol>
<p>הסבר מפורט נמצא במדריך <a href="/blog/nicotine-mg-per-pouch-vs-per-gram">מ״ג לשקיק לעומת מ״ג לגרם</a>. המאמר אינו נותן המלצת מינון או התאמה אישית.</p>
<h2>קנייה אונליין: כך מגיעים למוצר המדויק</h2>
<p>פתחו את המוצר הרצוי מהטבלה, בדקו שהמותג, הטעם והסימון תואמים למה שחיפשתם, ואמתו מחיר ומלאי. אם רוצים לראות חלופות פעילות, עברו אל <a href="/brands/hqd">כל מוצרי HQD</a>, אל <a href="/brands/nois">כל מוצרי NOIS</a> או אל <a href="/shop">קטלוג שקיקי הניקוטין</a>.</p>
<p>לפני תשלום, בדקו את המחיר הסופי לפי הכמות שבחרתם ואת המשלוח. המדריך <a href="/blog/snus-price-guide">סנוס ושקיקי ניקוטין מחיר</a> מסביר איך להשוות עלות בצורה עקבית.</p>
<div class="warning"><strong>אזהרה:</strong> ${warning}</div>`,
  },
  {
    title: "סנוס 16 מ״ג: KILLA ו־CUBA White — השוואת טעמים ומלאי",
    slug: "snus-16-mg-killa-cuba-white-israel-guide",
    excerpt: "מחפשים סנוס 16 מ״ג? השוואה בין KILLA ל־CUBA White, טעמים פעילים, סימוני מוצר, קישורים למלאי ומה לבדוק לפני הזמנה.",
    primaryKeyword: "סנוס 16 מ״ג",
    metaTitle: "סנוס 16 מ״ג: KILLA ו־CUBA White | NIC POUCH",
    metaDescription: "סנוס ושקיקי ניקוטין 16 מ״ג: KILLA ו־CUBA White עם טעמי מנטה, לימונדה, אוכמניות, אבטיח ועוד. קישורים למוצרים זמינים.",
    directAnswer: "בבדיקת קטלוג NIC POUCH ב־1 באוקטובר 2026 נמצאו KILLA ו־CUBA White עם גרסאות פעילות המסומנות 16 מ״ג. יש לבדוק שם גרסה, יחידת מדידה, מחיר ומלאי בדף המוצר לפני הזמנה.",
    tags: ["סנוס 16 מ״ג", "שקיקי ניקוטין 16 מ״ג", "KILLA 16 מ״ג", "CUBA White 16 מ״ג"],
    featuredImage: `${siteUrl}/generated/blog/snus-16-mg-guide-october-2026.png`,
    ogImage: `${siteUrl}/generated/blog/snus-16-mg-guide-october-2026.png`,
    relatedProductIds: [
      "cmsjekiu8001u04jtvrkr3nm1", "cmsjekhri001s04jtu05bqriw", "cmsjekiab001t04jtwfcwffqb", "cmsjekh8x001r04jtp603ix4w", "cmsjekg72001p04jt9surkqdp", "cmsjekgpu001q04jtgv45iinc",
      "cmsjeky9f002n04jtaq1qql0y", "cmsjekwmc002j04jtzbx4sx45", "cmsjekys5002o04jt7k10r269", "cmsjekx4s002l04jtv7hrd4le", "cmsjekxqe002m04jthutut9mm", "cmsjel4z5003004jt7dt94ytb",
    ],
    faq: [
      { question: "אילו מותגים עם סימון 16 מ״ג יש באתר?", answer: "בבדיקת הקטלוג נמצאו KILLA ו־CUBA White עם גרסאות פעילות שמסומנות 16 מ״ג. הזמינות עשויה להשתנות." },
      { question: "האם KILLA ו־CUBA White הם אותו מוצר?", answer: "לא. אלה מותגים וסדרות שונות. יש להשוות שם גרסה, טעם, יחידת מדידה, מספר שקיקים כאשר הוא מאומת ומחיר." },
      { question: "אילו טעמים של KILLA מופיעים עם 16 מ״ג?", answer: "בבדיקה נמצאו נענע, לימונדה, אוכמניות, אבטיח, מנגו אייס ומנטה." },
      { question: "מה ההבדל בין CUBA White ל־CUBA Black?", answer: "בקטלוג שנבדק CUBA White מסומן 16 מ״ג, בעוד CUBA Black מסומן 43 מ״ג. יש לאמת את יחידת המדידה על האריזה." },
    ],
    body: `<p class="article-lead">חיפוש “סנוס 16 מ״ג” מוביל בדרך כלל למותג, לטעם ולמוצר שניתן להזמין. באתר NIC POUCH נמצאו שתי משפחות מוצרים פעילות עם סימון זה: KILLA ו־CUBA White. הן חולקות חלק מהטעמים, אך מדובר במותגים ובסדרות שונות.</p>
<p><strong>התשובה הקצרה:</strong> בבדיקת הקטלוג ב־1 באוקטובר 2026 נמצאו שישה מוצרי KILLA ושישה מוצרי CUBA White עם סימון 16 מ״ג. KILLA כולל נענע, לימונדה, אוכמניות, אבטיח, מנגו אייס ומנטה. ב־CUBA White נמצאו ענבים, דובדבן, קולד דריי, בלוברי, דאבל פרש ואבטיח. המלאי והמחיר בדף המוצר הם הקובעים.</p>
<h2>KILLA 16 מ״ג: שישה טעמים פעילים</h2>
<table><thead><tr><th>טעם</th><th>קישור למוצר</th></tr></thead><tbody>
<tr><td>נענע</td><td><a href="/shop/killa-spearmint-16">KILLA נענע 16 מ״ג</a></td></tr>
<tr><td>לימונדה</td><td><a href="/shop/killa-lemonade-16">KILLA לימונדה 16 מ״ג</a></td></tr>
<tr><td>אוכמניות</td><td><a href="/shop/killa-blueberry-16">KILLA אוכמניות 16 מ״ג</a></td></tr>
<tr><td>אבטיח</td><td><a href="/shop/killa-watermelon-16">KILLA אבטיח 16 מ״ג</a></td></tr>
<tr><td>מנגו אייס</td><td><a href="/shop/killa-mango-ice-16">KILLA מנגו אייס 16 מ״ג</a></td></tr>
<tr><td>מנטה</td><td><a href="/shop/killa-mint-16">KILLA מנטה 16 מ״ג</a></td></tr>
</tbody></table>
<p>נענע ומנטה הן שתי גרסאות שונות בשם המוצר. גם Mango Ice הוא שם טעם מסחרי, ולא הסבר על כמות הניקוטין. כדי לזהות את המוצר הנכון, חפשו את שם הגרסה המלא ולא רק את צבע האריזה.</p>
<h2>CUBA White 16 מ״ג: מה נמצא באתר?</h2>
<table><thead><tr><th>טעם</th><th>קישור למוצר</th></tr></thead><tbody>
<tr><td>ענבים</td><td><a href="/shop/cuba-white-grape-16">CUBA White ענבים 16 מ״ג</a></td></tr>
<tr><td>דובדבן</td><td><a href="/shop/cuba-white-cherry-16">CUBA White דובדבן 16 מ״ג</a></td></tr>
<tr><td>קולד דריי</td><td><a href="/shop/cuba-white-cold-dry-16">CUBA White קולד דריי 16 מ״ג</a></td></tr>
<tr><td>בלוברי</td><td><a href="/shop/cuba-white-blueberry-16">CUBA White בלוברי 16 מ״ג</a></td></tr>
<tr><td>דאבל פרש</td><td><a href="/shop/cuba-white-double-fresh-16">CUBA White דאבל פרש 16 מ״ג</a></td></tr>
<tr><td>אבטיח</td><td><a href="/shop/cuba-watermelon-16">CUBA White אבטיח 16 מ״ג</a></td></tr>
</tbody></table>
<p>CUBA White ו־CUBA Black הן סדרות שונות. בזמן הבדיקה, CUBA White מוצג עם סימון 16 מ״ג בעוד CUBA Black מוצג עם סימון 43 מ״ג. השוואה נכונה מתחילה בשם הסדרה, ממשיכה בטעם ורק אחר כך בנתון המ״ג וביחידת המדידה.</p>
<h2>טעמים שחופפים בין KILLA ל־CUBA White</h2>
<p>אבטיח, אוכמניות או בלוברי ומנטה הם שמות שעשויים להופיע ביותר ממותג אחד. חפיפה בשם אינה אומרת שמדובר באותו מוצר, באותו פורמט או באותה יחידת מדידה. לדוגמה, KILLA אוכמניות ו־CUBA White בלוברי שייכים לשני מותגים נפרדים, ולכן יש לקרוא את עמוד המוצר הספציפי.</p>
<p>מי שמחפש משפחת טעמים מסוימת יכול להרחיב ב<a href="/blog/mint-snus-nicotine-pouches-israel-guide">מדריך סנוס מנטה</a>, ב<a href="/blog/blueberry-snus-nicotine-pouches-israel-guide">מדריך אוכמניות ובלוברי</a>, ב<a href="/blog/mango-snus-nicotine-pouches-israel-guide">מדריך מנגו</a> וב<a href="/blog/grape-snus-nicotine-pouches-israel-guide">מדריך ענבים</a>.</p>
<h2>איך משווים KILLA מול CUBA White?</h2>
<ol>
<li><strong>מזהים את הסדרה:</strong> KILLA או CUBA White. אין להחליף את CUBA White ב־CUBA Black.</li>
<li><strong>קוראים את הטעם המדויק:</strong> מנטה, נענע, קולד דריי ודאבל פרש אינם אותו שם מוצר.</li>
<li><strong>בודקים את יחידת המדידה:</strong> המספר 16 מ״ג ניתן להשוואה רק כאשר ברור לאיזו יחידה הוא מתייחס.</li>
<li><strong>בודקים מפרט ואריזה:</strong> מספר שקיקים, משקל ואזהרות נבדקים לפי המידע המאומת שמוצג.</li>
<li><strong>מאמתים מחיר ומלאי:</strong> אלה הנתונים שמופיעים בדף המוצר ובסל בזמן ההזמנה.</li>
</ol>
<p>מדריך <a href="/blog/strength-guide">מה אומר מספר המ״ג</a> מסביר את סולם העוצמות באתר, ומדריך <a href="/blog/nicotine-mg-per-pouch-vs-per-gram">מ״ג לשקיק לעומת מ״ג לגרם</a> מסביר מדוע צריך לקרוא את היחידה. המאמר אינו נותן המלצה אישית על עוצמה.</p>
<h2>מוצרים זמינים, מחיר וסל</h2>
<p>כדי לקנות מוצר ספציפי, פתחו את הקישור מהטבלאות, בדקו את השם והסימון, וודאו את המחיר והמלאי. אפשר לראות את כל הגרסאות גם בעמודי <a href="/brands/killa">KILLA</a> ו־<a href="/brands/cuba">CUBA</a>, או לעבור אל <a href="/shop">כל המוצרים הזמינים</a>.</p>
<p>למחיר ההשוואתי לפי כמות יש מדריך נפרד: <a href="/blog/snus-price-guide">סנוס ושקיקי ניקוטין מחיר</a>. הסכום הסופי בסל הוא הנתון הקובע לפני תשלום.</p>
<div class="warning"><strong>אזהרה:</strong> ${warning}</div>`,
  },
];

const writableFields = [
  "title", "slug", "excerpt", "primaryKeyword", "metaTitle", "metaDescription", "directAnswer",
  "tags", "featuredImage", "ogImage", "faq", "relatedBlogIds", "relatedProductIds", "body",
  "status", "indexable", "canonicalUrl", "authorName", "authorRole", "reviewedBy", "contentType",
];

function toPayload(article) {
  const full = {
    ...article,
    status: publish ? "PUBLISHED" : "DRAFT",
    indexable: true,
    canonicalUrl: `${siteUrl}/blog/${article.slug}`,
    authorName: "מערכת NIC POUCH",
    authorRole: "צוות תוכן",
    reviewedBy: "בדיקת מערכת NIC POUCH",
    contentType: "GUIDE",
  };
  return Object.fromEntries(writableFields.flatMap((field) => full[field] === undefined ? [] : [[field, full[field]]]))
}

const existing = await request("/blogs");
for (const article of articles) {
  const found = existing.find((post) => post.slug === article.slug);
  const payload = toPayload(article);
  console.log(JSON.stringify({
    slug: article.slug,
    title: article.title,
    action: found ? (apply ? "update" : "would-update") : (apply ? "create" : "would-create"),
    status: payload.status,
    words: article.body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
    productLinks: [...article.body.matchAll(/href="(\/shop\/[^\"]+)"/g)].map((match) => match[1]).length,
  }));
  if (!apply) continue;
  if (found) await request(`/blogs/${found.id}`, { method: "PATCH", body: JSON.stringify(payload) });
  else await request("/blogs", { method: "POST", body: JSON.stringify(payload) });
}
