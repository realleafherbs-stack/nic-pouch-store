const apiBase = process.env.AGENT_API_BASE_URL ?? "https://www.ducks.co.il/api/nic-pouch/agent";
const apiKey = process.env.AGENT_API_KEY;
const apply = process.argv.includes("--apply");
const publish = process.argv.includes("--publish");

if (!apiKey) throw new Error("AGENT_API_KEY is required");

const warning = "ניקוטין הוא חומר ממכר. המוצרים מיועדים לבגירים בלבד. מי שאינו משתמש בניקוטין לא צריך להתחיל.";
const pabloImage = "https://app.payper.co.il/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeVNRTHc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--f238c1d3bd01c7c567b70153a808fc38d9a98d7e/5744000761626_%D7%A4%D7%90%D7%95%D7%A6'%20%D7%A0%D7%99%D7%A7%D7%95%D7%98%D7%99%D7%9F%20PABLO%20%D7%A2%D7%A0%D7%91%D7%99%D7%9D%20%D7%90%D7%99%D7%99%D7%A1%2016%20%D7%9E%D7%92%20-%201%20%D7%99%D7%97'.jpg";
const cubaImage = "https://app.payper.co.il/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBekhzVUE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--b79cda9cba7f558b932717737c856ade54dd3c0e/WhatsApp%20Image%202026-04-09%20at%2012.%20(3).jpg";
const killaImage = "https://app.payper.co.il/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMTZRTHc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--631af7bb086eba8bf6b88a3c4111a3690a0d3265/5744000760131_%D7%A4%D7%90%D7%95%D7%A6'%20%D7%A0%D7%99%D7%A7%D7%95%D7%98%D7%99%D7%9F%20KILLA%20%D7%A0%D7%A2%D7%A0%D7%A2%2016%20%D7%9E%D7%92%20-%201%20%D7%99%D7%97'.jpg";
const genericFlavorImage = "https://cmhstyptzkoiwswbhzen.supabase.co/storage/v1/object/public/crm-images/general/1790287654466-sxkcep0md3e.webp";
const hqdImage = "https://cmhstyptzkoiwswbhzen.supabase.co/storage/v1/object/public/crm-images/general/1790287663441-3ds76laxuzf.webp";

function article({ title, slug, excerpt, keyword, metaTitle, metaDescription, image, tags, faq, body }) {
  return {
    title,
    slug,
    excerpt,
    primaryKeyword: keyword,
    metaTitle,
    metaDescription,
    directAnswer: excerpt,
    tags,
    featuredImage: image,
    ogImage: image,
    faq,
    body: `${body}<h2>לפני הזמנה</h2><ol><li>ודאו את שם המותג, הסדרה והטעם.</li><li>קראו את סימון המ״ג ואת יחידת המדידה שעל האריזה.</li><li>בדקו מלאי, מחיר וכמות בסל לפני התשלום.</li><li>שמרו את המוצרים סגורים והרחק מילדים ומחיות מחמד.</li></ol><p>לעיון בכל המוצרים הפעילים עברו ל<a href="/shop">קטלוג שקיקי הניקוטין</a>.</p><div class="warning"><strong>אזהרה:</strong> ${warning}</div>`,
  };
}

const articles = [
  article({
    title: "PABLO סנוס ושקיקי ניקוטין: טעמים 50 מ״ג בישראל",
    slug: "pablo-snus-flavors-50-israel-guide",
    excerpt: "מדריך PABLO בישראל: שבעה טעמים עם סימון 50 מ״ג בקטלוג NIC POUCH, ומה צריך לבדוק לפני השוואה או הזמנה.",
    keyword: "PABLO סנוס",
    metaTitle: "PABLO סנוס: טעמים 50 מ״ג בישראל | NIC POUCH",
    metaDescription: "PABLO סנוס ושקיקי ניקוטין בישראל: ענבים אייס, פטל כחול, מנגו, קיווי ועוד. מדריך לנתוני המלאי והסימון לפני הזמנה.",
    image: pabloImage,
    tags: ["PABLO סנוס", "PABLO 50 מ״ג", "PABLO טעמים"],
    faq: [
      { question: "אילו טעמי PABLO קיימים בקטלוג?", answer: "בבדיקת קטלוג NIC POUCH נמצאו ענבים אייס, פטל כחול, מנטה, מנגו אייס, פסיפלורה, קיווי וטרופיקל פאנץ׳." },
      { question: "מה פירוש 50 מ״ג ב־PABLO?", answer: "זהו הסימון שמופיע בדפי המוצרים שנבדקו. יש לקרוא את יחידת המדידה על האריזה ולהשוות רק מוצרים שבהם היחידה זהה." },
      { question: "האם כל טעם של PABLO זמין תמיד?", answer: "לא. הזמינות משתנה, ולכן דף המוצר והסל הם המקור הקובע בזמן ההזמנה." },
    ],
    body: `<p class="article-lead">PABLO הוא אחד השמות המבוקשים בחיפושי שקיקי ניקוטין בישראל. מי שמחפש “PABLO סנוס” מחפש בדרך כלל טעם מסוים, את הסימון שעל הקופסה ומקום שבו אפשר לאמת מלאי לפני הזמנה.</p><p><strong>התשובה הקצרה:</strong> בבדיקת קטלוג NIC POUCH ב־25 בספטמבר 2026 נמצאו שבע גרסאות PABLO פעילות, כולן עם סימון 50 מ״ג בשם המוצר: ענבים אייס, פטל כחול, מנטה, מנגו אייס, פסיפלורה, קיווי וטרופיקל פאנץ׳. הסימון על האריזה הוא הקובע.</p><h2>אילו טעמי PABLO נמצאים באתר?</h2><table><thead><tr><th>טעם</th><th>קישור למוצר</th></tr></thead><tbody><tr><td>ענבים אייס</td><td><a href="/shop/pablo-grape-ice-50">PABLO ענבים אייס</a></td></tr><tr><td>פטל כחול</td><td><a href="/shop/pablo-blue-raspberry-50">PABLO פטל כחול</a></td></tr><tr><td>מנטה</td><td><a href="/shop/pablo-mint-50">PABLO מנטה</a></td></tr><tr><td>מנגו אייס</td><td><a href="/shop/pablo-mango-ice-50">PABLO מנגו אייס</a></td></tr><tr><td>פסיפלורה</td><td><a href="/shop/pablo-passionfruit-50">PABLO פסיפלורה</a></td></tr><tr><td>קיווי</td><td><a href="/shop/pablo-kiwi-50">PABLO קיווי</a></td></tr><tr><td>טרופיקל פאנץ׳</td><td><a href="/shop/pablo-tropical-punch-50">PABLO טרופיקל פאנץ׳</a></td></tr></tbody></table><h2>איך מבדילים בין הטעמים?</h2><p>ענבים אייס ומנגו אייס משלבים שם פרי עם “אייס”; מנטה היא משפחת טעם נפרדת; ופסיפלורה, קיווי וטרופיקל פאנץ׳ מתארים פרופילי פרי אחרים. שם הטעם אינו מעיד על עוצמה. הוא נועד לזהות את הגרסה המדויקת.</p><p>מי שמחפש פטל כחול צריך להבחין בין Blue Raspberry לבין Blueberry. אלה שמות שונים, ולשם ההשוואה המלאה אפשר לקרוא את <a href="/blog/blueberry-blue-raspberry-blackberry-guide">מדריך בלוברי, פטל כחול ופטל שחור</a>.</p><h2>מה בודקים מול סימון 50 מ״ג?</h2><p>אין להסיק מהמספר לבדו מהי הכמות בשקיק. יצרנים יכולים להציג ריכוז לגרם או נתון לשקיק. לפני השוואה מול מוצר של מותג אחר, קראו את יחידת המדידה שעל האריזה ואת מפרט דף המוצר. ההסבר המלא נמצא ב<a href="/blog/nicotine-mg-per-pouch-vs-per-gram">מ״ג לשקיק לעומת מ״ג לגרם</a>.</p><h2>איפה רואים PABLO זמין?</h2><p>פתחו את דף הטעם הרצוי, בדקו שהשם והסימון תואמים למה שחיפשתם, ורק אז הוסיפו לסל. המחיר והזמינות יכולים להשתנות. למדריך על השוואת עלות לפי כמות ראו <a href="/blog/snus-price-guide">מחיר סנוס ושקיקי ניקוטין</a>.</p>`,
  }),
  article({
    title: "CUBA סנוס ושקיקי ניקוטין: Black מול White, טעמים וסימונים",
    slug: "cuba-snus-black-white-flavors-israel-guide",
    excerpt: "מדריך CUBA בישראל: סדרת Black עם סימון 43 מ״ג וסדרת White עם סימון 16 מ״ג, טעמים פעילים ומה לבדוק לפני הזמנה.",
    keyword: "CUBA סנוס",
    metaTitle: "CUBA סנוס: Black מול White וטעמים | NIC POUCH",
    metaDescription: "CUBA שקיקי ניקוטין בישראל: ההבדל בין Black 43 ל־White 16, טעמי בלוברי, דובדבן, ענבים, אבטיח ועוד.",
    image: cubaImage,
    tags: ["CUBA סנוס", "CUBA Black", "CUBA White", "CUBA 43 מ״ג"],
    faq: [
      { question: "מה ההבדל בין CUBA Black ל־CUBA White?", answer: "בקטלוג שנבדק, מוצרי Black מסומנים 43 מ״ג ומוצרי White מסומנים 16 מ״ג. יש לאמת את יחידת המדידה על האריזה." },
      { question: "אילו טעמים קיימים בשתי הסדרות?", answer: "בלוברי, דובדבן, קולד דריי, דאבל פרש, ענבים ואבטיח מופיעים בקטלוג בהתאם לסדרה." },
      { question: "איך משווים מוצרי CUBA?", answer: "משווים רק את שם הגרסה המלא, יחידת המדידה, המחיר והמלאי. Black ו־White אינן אותה גרסה." },
    ],
    body: `<p class="article-lead">בחיפוש “CUBA סנוס” מופיעים בדרך כלל שני שמות: Black ו־White. הם נראים דומים בשם המותג, אבל בקטלוג יש להם סימונים שונים ולכן כדאי לקרוא את השם המלא לפני בחירה.</p><p><strong>התשובה הקצרה:</strong> ב־NIC POUCH נמצאו שש גרסאות CUBA Black עם סימון 43 מ״ג ושש גרסאות CUBA White עם סימון 16 מ״ג. בשתי הסדרות מופיעים בלוברי, דובדבן, קולד דריי, דאבל פרש, ענבים ואבטיח. הסימון שעל האריזה קובע.</p><h2>Black מול White: ההבדל שמופיע בקטלוג</h2><table><thead><tr><th>סדרה</th><th>סימון בדפי המוצר</th><th>טעמים</th></tr></thead><tbody><tr><td>CUBA Black</td><td>43 מ״ג</td><td>בלוברי, צ׳רי, קולד דריי, דאבל פרש, ענבים, אבטיח</td></tr><tr><td>CUBA White</td><td>16 מ״ג</td><td>ענבים, צ׳רי, קולד דריי, בלוברי, דאבל פרש, אבטיח</td></tr></tbody></table><p>המספרים מוצגים כפי שהם מופיעים בדפי המוצר. לפני השוואה בין 43 ל־16 יש לוודא את יחידת המדידה. המאמר אינו נותן המלצת עוצמה אישית.</p><h2>טעמי CUBA בקטלוג</h2><p>אפשר לפתוח ישירות את <a href="/shop/cuba-black-blueberry-43">CUBA Black בלוברי 43</a>, <a href="/shop/cuba-white-blueberry-16">CUBA White בלוברי 16</a>, <a href="/shop/cuba-black-grape-43">CUBA Black ענבים 43</a> או <a href="/shop/cuba-white-grape-16">CUBA White ענבים 16</a>. דפים אלה מאפשרים לאמת את הסדרה, הטעם והמחיר בזמן הקנייה.</p><p>“קולד דריי” ו“דאבל פרש” הם שמות מסחריים של גרסאות טעם. אין להסיק מהם את כמות הניקוטין או את מספר השקיקים.</p><h2>כיצד להשוות CUBA בצורה מדויקת?</h2><p>מתחילים בסדרה: Black או White. ממשיכים לטעם ולסימון, ובודקים מול האריזה אם הערך מסומן לשקיק או לגרם. רק לאחר מכן משווים מחיר לאותה כמות בסל. לא כל קופסה של CUBA היא אותה גרסה.</p><p>לסקירה רחבה יותר של משפחות הטעם באתר ראו <a href="/blog/snus-flavors-guide">סנוס בטעמים: מנטה, פירות ואייס</a>.</p><h2>מלאי, מחיר ומשלוח</h2><p>המחיר הקובע הוא המחיר בדף המוצר ובסיכום ההזמנה. כאשר בוחרים כמה יחידות, בדקו את העלות ליחידה ואת עלות המשלוח. מידע כללי על קנייה אונליין נמצא ב<a href="/blog/buy-snus-online-israel-guide">מדריך לקניית סנוס בישראל</a>.</p>`,
  }),
  article({
    title: "KILLA סנוס ושקיקי ניקוטין: טעמי 16 מ״ג בישראל",
    slug: "killa-snus-flavors-16-israel-guide",
    excerpt: "מדריך KILLA בישראל: נענע, לימונדה, אוכמניות, אבטיח, מנגו אייס ומנטה עם סימון 16 מ״ג בקטלוג הפעיל.",
    keyword: "KILLA סנוס",
    metaTitle: "KILLA סנוס: טעמי 16 מ״ג בישראל | NIC POUCH",
    metaDescription: "KILLA שקיקי ניקוטין בישראל: שישה טעמים עם סימון 16 מ״ג, קישורים למוצרים והבדיקה הנכונה לפני הזמנה.",
    image: killaImage,
    tags: ["KILLA סנוס", "KILLA 16 מ״ג", "KILLA טעמים"],
    faq: [
      { question: "אילו טעמי KILLA מופיעים באתר?", answer: "נענע, לימונדה, אוכמניות, אבטיח, מנגו אייס ומנטה." },
      { question: "מה הסימון של מוצרי KILLA בקטלוג?", answer: "בדפי KILLA הפעילים שנבדקו מופיע סימון 16 מ״ג. יש לבדוק את האריזה ליחידת המדידה." },
      { question: "האם נענע ומנטה הם אותו מוצר?", answer: "לא. אלו שתי גרסאות עם שמות טעם שונים, ולכן יש לבדוק את שם המוצר המדויק." },
    ],
    body: `<p class="article-lead">KILLA מופיע בישראל בחיפושי טעם, מנטה, מנגו ואבטיח. כדי למצוא את המוצר המדויק, כדאי להשתמש בשם הגרסה המלא ולא להסתמך על צבע הקופסה.</p><p><strong>התשובה הקצרה:</strong> בקטלוג NIC POUCH שנבדק ב־25 בספטמבר 2026 נמצאו שישה מוצרי KILLA פעילים: נענע, לימונדה, אוכמניות, אבטיח, מנגו אייס ומנטה. בכל הדפים מופיע סימון 16 מ״ג.</p><h2>ששת טעמי KILLA הפעילים</h2><ul><li><a href="/shop/killa-spearmint-16">KILLA נענע 16 מ״ג</a></li><li><a href="/shop/killa-lemonade-16">KILLA לימונדה 16 מ״ג</a></li><li><a href="/shop/killa-blueberry-16">KILLA אוכמניות 16 מ״ג</a></li><li><a href="/shop/killa-watermelon-16">KILLA אבטיח 16 מ״ג</a></li><li><a href="/shop/killa-mango-ice-16">KILLA מנגו אייס 16 מ״ג</a></li><li><a href="/shop/killa-mint-16">KILLA מנטה 16 מ״ג</a></li></ul><h2>נענע מול מנטה</h2><p>השם Spearmint מתורגם בדרך כלל לנענע, ו־Mint למנטה. שני השמות מציינים גרסאות נפרדות בקטלוג, גם אם שתיהן שייכות למשפחת טעמי המנטה. בדקו את שם המוצר ואת התמונה בעמוד לפני שמוסיפים לסל.</p><h2>פירות, אייס ולימונדה</h2><p>אוכמניות ואבטיח הם טעמי פרי; Mango Ice משלב פרי עם “אייס”; ולימונדה היא שם טעם נפרד. אין קשר הכרחי בין סוג הטעם לבין הסימון. מדריך ההבדלים בין שמות פירות נמצא ב<a href="/blog/blueberry-blue-raspberry-blackberry-guide">מדריך בלוברי, פטל כחול ופטל שחור</a>.</p><h2>מה פירוש 16 מ״ג?</h2><p>המספר מופיע בדפי המוצר שנבדקו, אך יש לקרוא את יחידת המדידה על האריזה. להשוואה מול מוצר ממותג אחר, צריך קודם לוודא ששני המספרים מתייחסים לאותה יחידה. פירוט נמצא במאמר <a href="/blog/nicotine-mg-per-pouch-vs-per-gram">מ״ג לשקיק לעומת מ״ג לגרם</a>.</p><h2>איך מזמינים KILLA אונליין?</h2><p>בחרו את הטעם, ודאו שהסימון הוא 16 מ״ג כפי שחיפשתם, ובדקו מחיר ומלאי. המחיר בעמוד ובסל הוא הקובע. למידע על מחירים לפי כמות ראו <a href="/blog/snus-price-guide">מדריך מחיר סנוס</a>.</p>`,
  }),
  article({
    title: "RABBIT שקיקי ניקוטין: טעמי 26 ו־50 מ״ג בישראל",
    slug: "rabbit-nicotine-pouches-flavors-israel-guide",
    excerpt: "מדריך RABBIT בישראל: Blue Ice ו־Blueberry עם סימון 26 מ״ג, לצד Bad Apple, Cola ו־Peppermint עם סימון 50 מ״ג.",
    keyword: "RABBIT סנוס",
    metaTitle: "RABBIT סנוס: טעמי 26 ו־50 מ״ג | NIC POUCH",
    metaDescription: "RABBIT שקיקי ניקוטין בישראל: בלו אייס, בלוברי, באד אפל, קולה ופפרמינט. בדקו את הסימון והיחידה לפני הזמנה.",
    image: genericFlavorImage,
    tags: ["RABBIT סנוס", "RABBIT 50 מ״ג", "RABBIT טעמים"],
    faq: [
      { question: "אילו מוצרי RABBIT נמצאים בקטלוג?", answer: "Blue Ice ו־Blueberry עם סימון 26 מ״ג, ו־Bad Apple, Cola ו־Peppermint עם סימון 50 מ״ג." },
      { question: "האם 50 מ״ג תמיד אומר יותר לשקיק?", answer: "לא בהכרח. יש לקרוא את יחידת המדידה על האריזה לפני כל השוואה." },
      { question: "מה ההבדל בין Blue Ice ל־Blueberry?", answer: "אלה שני שמות טעם שונים: Blue Ice הוא שם מסחרי, ו־Blueberry מתייחס לבלוברי או אוכמניות." },
    ],
    body: `<p class="article-lead">RABBIT הוא מותג עם טווח טעמים קצר וברור בקטלוג NIC POUCH. ההבדל המרכזי בין הדפים אינו רק הטעם: חלקם מסומנים 26 מ״ג וחלקם 50 מ״ג.</p><p><strong>התשובה הקצרה:</strong> בבדיקת הקטלוג הפעיל נמצאו Blue Ice ו־Blueberry עם סימון 26 מ״ג, וכן Bad Apple, Cola ו־Peppermint עם סימון 50 מ״ג. יש לוודא את יחידת המדידה על האריזה, משום שמספרים ממותגים שונים אינם בהכרח בני השוואה ישירה.</p><h2>מפת מוצרי RABBIT</h2><table><thead><tr><th>גרסה</th><th>סימון שמופיע בשם</th></tr></thead><tbody><tr><td><a href="/shop/rabbit-blue-ice-26">Blue Ice</a></td><td>26 מ״ג</td></tr><tr><td><a href="/shop/rabbit-blueberry-26">Blueberry</a></td><td>26 מ״ג</td></tr><tr><td><a href="/shop/rabbit-bad-apple-50">Bad Apple</a></td><td>50 מ״ג</td></tr><tr><td><a href="/shop/rabbit-cola-50">Cola</a></td><td>50 מ״ג</td></tr><tr><td><a href="/shop/rabbit-peppermint-50">Peppermint</a></td><td>50 מ״ג</td></tr></tbody></table><h2>איך קוראים את שמות הטעם?</h2><p>Blueberry הוא בלוברי או אוכמניות. Peppermint שייך למשפחת המנטה. Cola הוא שם טעם נפרד, ו־Bad Apple הוא שם מסחרי של גרסת תפוח. Blue Ice אינו זהה לבלוברי גם אם שני השמות מתחילים ב־Blue.</p><p>למי שמחפש פירות דומים בין מותגים שונים, <a href="/blog/blueberry-blue-raspberry-blackberry-guide">מדריך שמות הפירות</a> מסביר את ההבדל בין בלוברי, פטל כחול ופטל שחור.</p><h2>26 מול 50: איך בודקים לפני השוואה?</h2><p>המספר צריך להיקרא יחד עם יחידת המדידה. אל תשתמשו בו לבדו כדי להסיק איזו גרסה “חזקה יותר”. עמוד המוצר והאריזה מאפשרים לבדוק מה היצרן מסמן. המדריך <a href="/blog/nicotine-mg-per-pouch-vs-per-gram">מ״ג לשקיק מול מ״ג לגרם</a> מפרט מדוע הדבר חשוב.</p><h2>מתי רואים מחיר וזמינות?</h2><p>פתחו את גרסת RABBIT המדויקת, בחרו כמות ובדקו את הסכום הסופי בסל. מלאי ומחירים יכולים להשתנות, ולכן אינם נקבעים לפי מאמר זה.</p>`,
  }),
  article({
    title: "BIT Cold Mint 30 מ״ג: מידע על שקיק הניקוטין שבקטלוג",
    slug: "bit-cold-mint-30-nicotine-pouch-guide",
    excerpt: "מדריך ממוקד ל־BIT Cold Mint: טעם קולד מינט, סימון 30 מ״ג, ומה לבדוק בעמוד המוצר ובאריזה לפני הזמנה.",
    keyword: "BIT Cold Mint 30 מ״ג",
    metaTitle: "BIT Cold Mint 30 מ״ג | מידע ומלאי | NIC POUCH",
    metaDescription: "BIT Cold Mint 30 מ״ג: מידע על טעם קולד מינט, סימון הניקוטין, בדיקת יחידת המדידה, מלאי ומחיר לפני הזמנה.",
    image: genericFlavorImage,
    tags: ["BIT סנוס", "BIT Cold Mint", "BIT 30 מ״ג"],
    faq: [
      { question: "איזה מוצר BIT קיים בקטלוג?", answer: "בבדיקה נמצא BIT Cold Mint עם סימון 30 מ״ג בשם המוצר." },
      { question: "מה פירוש Cold Mint?", answer: "זהו שם הטעם של הגרסה. הוא אינו מחליף את בדיקת סימון המ״ג ויחידת המדידה." },
      { question: "איפה בודקים מלאי של BIT?", answer: "בדף המוצר ובסל בזמן ההזמנה. המלאי עשוי להשתנות." },
    ],
    body: `<p class="article-lead">מי שמחפש BIT סנוס או BIT Cold Mint צריך לוודא את שם הגרסה המדויק ואת הסימון שמופיע עליה. המותג מופיע בקטלוג NIC POUCH עם מוצר אחד פעיל, ולכן מאמר זה ממוקד בעמוד המוצר הזה.</p><p><strong>התשובה הקצרה:</strong> BIT Cold Mint הוא שקיק ניקוטין ללא טבק עם סימון 30 מ״ג בשם המוצר. “Cold Mint” מתאר את כיוון הטעם; הסימון והיחידה על האריזה הם הנתונים שמאפשרים השוואה מדויקת.</p><h2>BIT Cold Mint: מה מופיע בדף המוצר?</h2><p>בדף <a href="/shop/bit-cold-mint-30">BIT Cold Mint 30 מ״ג</a> אפשר לראות את שם המוצר, מחיר, זמינות וסימון. לפני רכישה יש לוודא שהכותרת והפרטים תואמים לגרסה שחיפשתם, משום שבמותגים שונים שמות דומים עשויים לתאר מוצרים אחרים.</p><h2>מה משמעות השם Cold Mint?</h2><p>Cold Mint הוא שם טעם ממשפחת המנטה. הוא אינו מציין את העוצמה ואינו אומר כמה ניקוטין יש בכל שקיק. מוצרים נוספים יכולים להיקרא Mint, Peppermint או Ice, אך אלו שמות נפרדים שיש לבדוק לצד המותג והסימון.</p><h2>איך לקרוא סימון 30 מ״ג?</h2><p>המספר 30 מ״ג צריך להופיע לצד יחידת מדידה על האריזה. אם משווים BIT למוצר אחר, יש לוודא ששני המספרים מתייחסים לאותה יחידה. הסבר נוסף מופיע ב<a href="/blog/nicotine-mg-per-pouch-vs-per-gram">מדריך יחידות המדידה</a>.</p><h2>חלופות לפי משפחת טעם</h2><p>בקטלוג מופיעים גם טעמי מנטה של HQD, NOIS, PABLO, KILLA ו־RABBIT. הטעמים אינם אותו מוצר, ולכן יש לבצע השוואה לפי מותג, שם מלא וסימון. סקירה של משפחות הטעם נמצאת ב<a href="/blog/snus-flavors-guide">מדריך סנוס בטעמים</a>.</p>`,
  }),
  article({
    title: "סנוס 50 מ״ג: מה חשוב לבדוק במוצרים המסומנים 50",
    slug: "snus-50-mg-guide-israel",
    excerpt: "מדריך לסנוס ושקיקי ניקוטין עם סימון 50 מ״ג: PABLO, NOIS ו־RABBIT בקטלוג, יחידת מדידה והבדיקות החשובות לפני הזמנה.",
    keyword: "סנוס 50 מ״ג",
    metaTitle: "סנוס 50 מ״ג: PABLO, NOIS ו־RABBIT | NIC POUCH",
    metaDescription: "מחפשים סנוס 50 מ״ג? מדריך למוצרים המסומנים 50 מ״ג בקטלוג NIC POUCH ולבדיקת יחידת המדידה לפני השוואה או הזמנה.",
    image: pabloImage,
    tags: ["סנוס 50 מ״ג", "שקיקי ניקוטין 50 מ״ג", "PABLO 50 מ״ג", "NOIS Extreme"],
    faq: [
      { question: "אילו מותגים מסומנים 50 מ״ג באתר?", answer: "בבדיקת הקטלוג נמצאו דגמי PABLO, NOIS Extreme ודגמי RABBIT מסוימים עם סימון 50 מ״ג." },
      { question: "האם אפשר להשוות 50 מ״ג בין מותגים?", answer: "רק לאחר שמוודאים שהיחידה זהה. הסימון עשוי להתייחס לשקיק או לגרם." },
      { question: "האם 50 מ״ג מתאים למי שלא משתמש בניקוטין?", answer: "לא. מי שאינו משתמש בניקוטין לא צריך להתחיל. המוצרים מיועדים לבגירים בלבד." },
    ],
    body: `<p class="article-lead">“סנוס 50 מ״ג” הוא ביטוי חיפוש נפוץ, אך המספר הגדול על האריזה אינו מספיק כדי להשוות מוצרים. קודם צריך להבין מה הוא מודד ולוודא את שם המותג והגרסה.</p><p><strong>התשובה הקצרה:</strong> בקטלוג NIC POUCH נמצאים מוצרים של PABLO, NOIS ו־RABBIT שמסומנים 50 מ״ג בשם המוצר. אין להשוות את המספר בין קופסאות לפני שבודקים אם הוא מתייחס לשקיק או לגרם.</p><h2>מוצרים מסומני 50 מ״ג בקטלוג</h2><p>ב־PABLO כל שבע הגרסאות הפעילות שנבדקו נושאות סימון 50 מ״ג, למשל <a href="/shop/pablo-grape-ice-50">ענבים אייס</a> ו<a href="/shop/pablo-blue-raspberry-50">פטל כחול</a>. ב־NOIS קיימות גרסאות Extreme 50, כגון <a href="/shop/nois-mint-extreme-50">Mint Extreme</a> ו<a href="/shop/nois-cherry-extreme-50">Cherry Extreme</a>. ב־RABBIT קיימים Bad Apple, Cola ו־Peppermint עם סימון 50.</p><h2>למה יחידת המדידה חשובה?</h2><p>מ״ג לשקיק ומ״ג לגרם אינם אותו דבר. אם מוצר אחד מציג ריכוז לגרם ומוצר אחר כמות לשקיק, המספרים אינם ברי השוואה ישירה. קראו את האריזה ואת <a href="/blog/nicotine-mg-per-pouch-vs-per-gram">מדריך יחידות המדידה</a> לפני בחירה.</p><h2>הטעם לא מספר על הסימון</h2><p>מנטה, פטל כחול, דובדבן וענבים הם טעמים. גם אם שני מוצרים נושאים שם טעם דומה, הם יכולים להגיע ממותגים שונים ובסימון שונה. למשל, PABLO Blue Raspberry ו־NOIS Blueberry Extreme אינם אותו מוצר.</p><h2>קנייה אחראית אונליין</h2><p>פתחו תמיד את עמוד המוצר הספציפי, בדקו מלאי ומחיר, וקראו את סימון היצרן. מדריך <a href="/blog/buy-snus-online-israel-guide">קניית סנוס אונליין בישראל</a> מסביר אילו פרטים כדאי לאמת לפני התשלום.</p>`,
  }),
  article({
    title: "סנוס מנטה: מותגים, טעמים וסימונים שקיימים באתר",
    slug: "mint-snus-nicotine-pouches-israel-guide",
    excerpt: "מדריך לשקיקי ניקוטין בטעמי מנטה: HQD, NOIS, PABLO, KILLA, RABBIT ו־BIT, והדרך לקרוא שם טעם וסימון בנפרד.",
    keyword: "סנוס מנטה",
    metaTitle: "סנוס מנטה: מותגים וסימונים בישראל | NIC POUCH",
    metaDescription: "מחפשים סנוס מנטה? ריכוז מותגי שקיקי ניקוטין בטעמי מנטה באתר, כולל HQD, NOIS, PABLO, KILLA, RABBIT ו־BIT.",
    image: hqdImage,
    tags: ["סנוס מנטה", "שקיקי ניקוטין מנטה", "Mint", "Peppermint"],
    faq: [
      { question: "אילו מותגים מציעים טעם מנטה באתר?", answer: "HQD, NOIS, PABLO, KILLA, RABBIT ו־BIT מופיעים בקטלוג עם גרסאות ממשפחת המנטה." },
      { question: "מה ההבדל בין Mint, Spearmint ו־Peppermint?", answer: "אלה שמות טעם שונים. חשוב לזהות גם את המותג והגרסה, ולא להניח שהם אותו מוצר." },
      { question: "האם מנטה קובעת עוצמה?", answer: "לא. טעם וסימון ניקוטין הם נתונים נפרדים." },
    ],
    body: `<p class="article-lead">חיפוש “סנוס מנטה” יכול להוביל למוצרים עם שמות כמו Mint, Spearmint, Peppermint, Cold Mint או Lemon Mint. כולם שייכים למשפחת טעם דומה, אך אינם אותו מוצר.</p><p><strong>התשובה הקצרה:</strong> בקטלוג NIC POUCH נמצאו מוצרי מנטה של HQD, NOIS, PABLO, KILLA, RABBIT ו־BIT. כדי לבחור נכון קוראים שלושה נתונים יחד: מותג, שם טעם מדויק וסימון הניקוטין.</p><h2>מפת טעמי המנטה לפי מותג</h2><table><thead><tr><th>מותג</th><th>דוגמאות בקטלוג</th></tr></thead><tbody><tr><td>HQD</td><td><a href="/shop/hqd-mint-6">Mint</a>, Lemon Mint</td></tr><tr><td>NOIS</td><td><a href="/shop/nois-mint-8">Mint</a>, Mint Extreme</td></tr><tr><td>PABLO</td><td><a href="/shop/pablo-mint-50">Mint</a></td></tr><tr><td>KILLA</td><td><a href="/shop/killa-spearmint-16">Spearmint</a>, <a href="/shop/killa-mint-16">Mint</a></td></tr><tr><td>RABBIT</td><td><a href="/shop/rabbit-peppermint-50">Peppermint</a></td></tr><tr><td>BIT</td><td><a href="/shop/bit-cold-mint-30">Cold Mint</a></td></tr></tbody></table><h2>האם Mint, Spearmint ו־Peppermint זה אותו דבר?</h2><p>לא. הם מתארים פרופילי טעם שונים בתוך משפחת המנטה. גם אם השמות דומים, יש להשוות לפי שם המוצר המלא. אותו מותג יכול להציע יותר מגרסת מנטה אחת, למשל KILLA נענע ו־KILLA מנטה.</p><h2>למה אין לבחור לפי צבע מכסה?</h2><p>צבע האריזה אינו מפרט טכני. רק דף המוצר והאריזה מציגים את שם הגרסה ואת סימון המ״ג. מנטה אינה מעידה על כמות ניקוטין, מספר שקיקים או מחיר.</p><h2>בחירה לפי טעם, אחר כך נתונים</h2><p>התחילו בשם הטעם הרצוי, עברו לדף מוצר ורק אז בדקו סימון, יחידת מדידה ומלאי. למדריך עקרוני על שמות טעם נוספים ראו <a href="/blog/snus-flavors-guide">סנוס בטעמים</a>.</p>`,
  }),
  article({
    title: "סנוס אוכמניות ובלוברי: מוצרים וטעמים באתר",
    slug: "blueberry-snus-nicotine-pouches-israel-guide",
    excerpt: "מדריך לשקיקי ניקוטין בטעמי אוכמניות ובלוברי: HQD, NOIS, CUBA, KILLA ו־RABBIT, ואיך להבדיל מפטל כחול ופטל שחור.",
    keyword: "סנוס אוכמניות",
    metaTitle: "סנוס אוכמניות ובלוברי: מוצרים בישראל | NIC POUCH",
    metaDescription: "מחפשים סנוס אוכמניות או בלוברי? מדריך למוצרי HQD, NOIS, CUBA, KILLA ו־RABBIT והבדל בין Blueberry לפטל כחול.",
    image: cubaImage,
    tags: ["סנוס אוכמניות", "סנוס בלוברי", "Blueberry", "שקיקי ניקוטין אוכמניות"],
    faq: [
      { question: "אילו מותגים מציעים אוכמניות או בלוברי?", answer: "בקטלוג נמצאו HQD, NOIS, CUBA, KILLA ו־RABBIT עם גרסאות בשם Blueberry או אוכמניות." },
      { question: "האם אוכמניות ופטל כחול זה אותו טעם?", answer: "לא. Blueberry הוא אוכמניות או בלוברי; Blue Raspberry הוא פטל כחול." },
      { question: "איך משווים בין מוצרי בלוברי?", answer: "לפי מותג, שם גרסה מלא, סימון, יחידת מדידה, מלאי ומחיר." },
    ],
    body: `<p class="article-lead">“סנוס אוכמניות” ו“סנוס בלוברי” מובילים למוצרים ממותגים שונים. הצעד החשוב הוא לאתר אם חיפשתם Blueberry, Blue Raspberry או Blackberry, משום שאלה שמות טעם שונים.</p><p><strong>התשובה הקצרה:</strong> בקטלוג NIC POUCH נמצאו טעמי Blueberry או אוכמניות של HQD, NOIS, CUBA, KILLA ו־RABBIT. כל אחד הוא מוצר נפרד עם סימון משלו.</p><h2>מוצרי אוכמניות ובלוברי שנמצאו באתר</h2><ul><li><a href="/shop/hqd-blueberry-12">HQD אוכמניות 12 מ״ג</a></li><li><a href="/shop/nois-blueberry-25">NOIS בלוברי 25 מ״ג</a></li><li><a href="/shop/nois-blueberry-extreme-50">NOIS בלוברי Extreme 50</a></li><li><a href="/shop/cuba-black-blueberry-43">CUBA Black בלוברי 43</a></li><li><a href="/shop/cuba-white-blueberry-16">CUBA White בלוברי 16</a></li><li><a href="/shop/killa-blueberry-16">KILLA אוכמניות 16</a></li><li><a href="/shop/rabbit-blueberry-26">RABBIT Blueberry 26</a></li></ul><h2>בלוברי, פטל כחול ופטל שחור</h2><p>Blueberry מתורגם לבלוברי או אוכמניות. Blue Raspberry הוא פטל כחול ו־Blackberry הוא פטל שחור. אין להחליף ביניהם רק בגלל צבע האריזה או המילה “Blue”. להסבר מלא ראו <a href="/blog/blueberry-blue-raspberry-blackberry-guide">המדריך לשמות פירות כחולים</a>.</p><h2>מה משתנה בין המותגים?</h2><p>הטעם הוא רק חלק מהשם. מוצרי HQD, NOIS, CUBA, KILLA ו־RABBIT מציגים סימונים שונים. יש לקרוא את יחידת המדידה ולבדוק את עמוד המוצר, ולא להסיק את הכמות רק מהמספר הגדול בשם.</p><h2>כך מוצאים את הגרסה הרצויה</h2><p>חפשו לפי המותג והשם המלא, פתחו את עמוד המוצר, ואמתו מלאי ומחיר לפני הזמנה. מי שרוצה להרחיב לעוד טעמי פירות יכול להשתמש ב<a href="/blog/snus-flavors-guide">מדריך הטעמים</a>.</p>`,
  }),
  article({
    title: "סנוס מנגו: HQD, PABLO ו־KILLA בטעמי מנגו",
    slug: "mango-snus-nicotine-pouches-israel-guide",
    excerpt: "מדריך לשקיקי ניקוטין בטעמי מנגו בישראל: HQD מנגו, PABLO מנגו אייס ו־KILLA מנגו אייס, ומה בודקים לפני הזמנה.",
    keyword: "סנוס מנגו",
    metaTitle: "סנוס מנגו: HQD, PABLO ו־KILLA | NIC POUCH",
    metaDescription: "סנוס ושקיקי ניקוטין בטעם מנגו: HQD, PABLO ו־KILLA. השוו את שם הגרסה, הסימון ויחידת המדידה לפני הזמנה.",
    image: hqdImage,
    tags: ["סנוס מנגו", "HQD מנגו", "PABLO מנגו אייס", "KILLA מנגו"],
    faq: [
      { question: "אילו מותגי מנגו קיימים באתר?", answer: "HQD מנגו, PABLO Mango Ice ו־KILLA Mango Ice נמצאו בקטלוג הפעיל." },
      { question: "מה ההבדל בין Mango ל־Mango Ice?", answer: "Mango מתאר מנגו; Mango Ice הוא שם גרסה שכולל גם אייס. אין להסיק ממנו את הסימון." },
      { question: "האם אותם טעמי מנגו זהים בין מותגים?", answer: "לא. מדובר במוצרים שונים ולכן בודקים את שם המותג, הסימון והאריזה." },
    ],
    body: `<p class="article-lead">סנוס מנגו הוא חיפוש שעשוי להוביל ל־HQD Mango, PABLO Mango Ice או KILLA Mango Ice. השם הקרוב אינו אומר שמדובר באותו טעם או באותו סימון.</p><p><strong>התשובה הקצרה:</strong> בקטלוג NIC POUCH נמצאים HQD מנגו בכמה סימונים, PABLO מנגו אייס עם סימון 50 מ״ג ו־KILLA מנגו אייס עם סימון 16 מ״ג. צריך לבדוק את יחידת המדידה בכל מוצר.</p><h2>שלוש גרסאות מנגו בקטלוג</h2><table><thead><tr><th>מותג</th><th>שם הגרסה</th><th>סימון בדף</th></tr></thead><tbody><tr><td>HQD</td><td><a href="/shop/hqd-mango-12">Mango</a></td><td>קיימים 6, 12 ו־25 מ״ג לפי דפי המוצר הפעילים</td></tr><tr><td>PABLO</td><td><a href="/shop/pablo-mango-ice-50">Mango Ice</a></td><td>50 מ״ג</td></tr><tr><td>KILLA</td><td><a href="/shop/killa-mango-ice-16">Mango Ice</a></td><td>16 מ״ג</td></tr></tbody></table><h2>Mango מול Mango Ice</h2><p>המילה Ice היא חלק מהשם המסחרי של הגרסה ואינה סימון עוצמה. היא אינה הופכת מוצר של מותג אחד לשווה למוצר מנגו של מותג אחר. כדי להשוות, בדקו קודם את יחידת המדידה ואת הנתון שעל האריזה.</p><h2>טעם זה לא מדד לעוצמה</h2><p>אפשר למצוא מנגו עם מספרים שונים בין מותגים ואף באותו מותג. אין לבחור לפי צבע או שם הפרי בלבד. המדריך <a href="/blog/nicotine-mg-per-pouch-vs-per-gram">מ״ג לשקיק ומ״ג לגרם</a> מסביר כיצד לקרוא נתוני מוצר נכון.</p><h2>מה בודקים בעמוד המוצר?</h2><p>מלאי, מחיר, שם מדויק וסימון הם ארבעת הפרטים שצריך לאמת לפני תשלום. למחירים לפי כמות ראו <a href="/blog/snus-price-guide">מדריך המחיר</a>.</p>`,
  }),
  article({
    title: "סנוס ענבים: PABLO, NOIS ו־CUBA בטעמי ענבים",
    slug: "grape-snus-nicotine-pouches-israel-guide",
    excerpt: "מדריך לשקיקי ניקוטין בטעם ענבים בישראל: PABLO Grape Ice, NOIS Grape Ice ו־CUBA Grape, עם בדיקת סימונים ומלאי.",
    keyword: "סנוס ענבים",
    metaTitle: "סנוס ענבים: PABLO, NOIS ו־CUBA | NIC POUCH",
    metaDescription: "מחפשים סנוס ענבים? מדריך למוצרי PABLO Grape Ice, NOIS Grape Ice ו־CUBA Grape באתר NIC POUCH.",
    image: pabloImage,
    tags: ["סנוס ענבים", "PABLO Grape Ice", "NOIS ענבים", "CUBA ענבים"],
    faq: [
      { question: "אילו מותגי ענבים יש באתר?", answer: "PABLO Grape Ice, NOIS Grape Ice ו־CUBA Grape מופיעים בקטלוג, בהתאם למלאי." },
      { question: "מה פירוש Grape Ice?", answer: "ענבים אייס הוא שם טעם. יש לקרוא גם את שם המותג והסימון." },
      { question: "האם ענבים של CUBA Black ו־White הם אותו מוצר?", answer: "לא. אלו סדרות שונות עם סימונים שונים בדפי הקטלוג." },
    ],
    body: `<p class="article-lead">סנוס ענבים מופיע בקטלוג תחת כמה מותגים ושמות: Grape Ice של PABLO, Grape Ice של NOIS ו־Grape של CUBA. השם המשותף אינו מבטל את ההבדלים בין הסדרות.</p><p><strong>התשובה הקצרה:</strong> PABLO Grape Ice מסומן 50 מ״ג, NOIS Grape Ice מופיע בגרסת 25 ובגרסת Extreme 50, ו־CUBA Grape מופיע בסדרות White 16 ו־Black 43. יש לאמת את היחידה על האריזה לפני השוואה.</p><h2>מוצרי ענבים באתר</h2><ul><li><a href="/shop/pablo-grape-ice-50">PABLO ענבים אייס 50</a></li><li><a href="/shop/nois-grape-ice-25">NOIS ענבים קרח 25</a></li><li><a href="/shop/nois-grape-extreme-50">NOIS ענבים Extreme 50</a></li><li><a href="/shop/cuba-white-grape-16">CUBA White ענבים 16</a></li><li><a href="/shop/cuba-black-grape-43">CUBA Black ענבים 43</a></li></ul><h2>אותו טעם, סדרות שונות</h2><p>Grape Ice ו־Grape אינם בהכרח אותה חוויית טעם, ובוודאי אינם אותו מוצר. PABLO, NOIS ו־CUBA מציגים את המותג, הסדרה והסימון שלהם בנפרד. חשוב לבחור את השילוב המדויק שהופיע בחיפוש.</p><h2>למה צריך לקרוא יחידת מדידה?</h2><p>50, 43, 25 ו־16 הם מספרים שמופיעים בדפי המוצרים, אך השוואה אפשרית רק כאשר מבינים אם היחידה זהה. אל תסיקו ממתג מספרי בלבד. קראו את <a href="/blog/nicotine-mg-per-pouch-vs-per-gram">הסבר יחידות המדידה</a> לפני קנייה.</p><h2>בחירת ענבים בקנייה אונליין</h2><p>פתחו את עמוד המוצר, ודאו טעם, סדרה וסימון, והשוו מחיר לפי כמות. אפשר גם לעבור אל <a href="/blog/nois-flavors-strengths-guide">מדריך NOIS</a> ואל <a href="/blog/pablo-snus-flavors-50-israel-guide">מדריך PABLO</a> לקבלת פרטי המותג.</p>`,
  }),
  article({
    title: "PABLO מול NOIS: איך משווים שקיקי ניקוטין עם סימון 50",
    slug: "pablo-vs-nois-50-mg-comparison-guide",
    excerpt: "השוואה עניינית בין PABLO ל־NOIS לפי הטעמים והסימונים שמופיעים בקטלוג. כך בודקים יחידת מדידה ומפרט לפני הזמנה.",
    keyword: "PABLO מול NOIS",
    metaTitle: "PABLO מול NOIS: השוואת טעמים וסימונים | NIC POUCH",
    metaDescription: "PABLO מול NOIS: השוואת טעמים, סימוני 50 מ״ג והבדיקה הנכונה של יחידת המדידה לפני הזמנה של שקיקי ניקוטין.",
    image: pabloImage,
    tags: ["PABLO מול NOIS", "PABLO 50 מ״ג", "NOIS Extreme", "השוואת סנוס"],
    faq: [
      { question: "האם PABLO ו־NOIS 50 הם אותו מוצר?", answer: "לא. אלו מותגים וסדרות שונים, גם כאשר הסימון בשם דומה." },
      { question: "איך משווים PABLO ל־NOIS?", answer: "בודקים שם טעם מלא, יחידת מדידה, מספר שקיקים כאשר הוא מאומת, מחיר ומלאי." },
      { question: "איזה טעמים חופפים?", answer: "מנטה, ענבים, בלוברי או אוכמניות ופירות נוספים עשויים להופיע בשני המותגים, אך בגרסאות שונות." },
    ],
    body: `<p class="article-lead">PABLO מול NOIS היא השוואה שמתחילה במותג ובטעם, לא במספר הגדול על הקופסה. שני המותגים מציעים כמה מוצרים שמסומנים 50 מ״ג, אך אלו אינם אותו מוצר.</p><p><strong>התשובה הקצרה:</strong> PABLO מופיע בקטלוג עם שבעה טעמים שמסומנים 50 מ״ג. ב־NOIS קיימות גרסאות Extreme מסומנות 50 לצד גרסאות אחרות עם סימונים שונים. ההשוואה הנכונה היא בין טעם, סדרה ויחידת מדידה.</p><h2>מה מופיע בכל מותג?</h2><table><thead><tr><th>PABLO</th><th>NOIS</th></tr></thead><tbody><tr><td>ענבים אייס, פטל כחול, מנטה, מנגו אייס, פסיפלורה, קיווי, טרופיקל פאנץ׳</td><td>Mint Extreme, Cherry Extreme, Grape Extreme, Blueberry Extreme, לצד גרסאות 8, 25 ו־35</td></tr></tbody></table><p>לפרטים מלאים, עברו אל <a href="/blog/pablo-snus-flavors-50-israel-guide">מדריך PABLO</a> ואל <a href="/blog/nois-flavors-strengths-guide">מדריך NOIS</a>.</p><h2>איך משווים טעמים דומים?</h2><p>PABLO Grape Ice ו־NOIS Grape Extreme חולקים כיוון של ענבים אך שונים בשם הגרסה ובמותג. כך גם PABLO Mint מול NOIS Mint Extreme. אין להניח זהות בין אריזות רק בגלל מילה משותפת.</p><h2>סימון 50 אינו מסיים את ההשוואה</h2><p>המספר צריך להיות מוצג באותה יחידת מדידה כדי להשוות אותו. עיינו באריזה וב<a href="/blog/nicotine-mg-per-pouch-vs-per-gram">מדריך יחידות המדידה</a>. המאמר לא קובע איזו גרסה מתאימה לאדם מסוים.</p><h2>מחיר ומלאי בזמן אמת</h2><p>פתחו את דף PABLO או NOIS הרצוי, בחרו כמות ובדקו את הסכום בסל. מחיר, מלאי ומבצעי כמות עשויים להשתנות.</p>`,
  }),
].slice(0, 10);

const headers = { "x-api-key": apiKey, "content-type": "application/json" };
async function request(path, init = {}) {
  const response = await fetch(`${apiBase}${path}`, { ...init, headers: { ...headers, ...(init.headers ?? {}) } });
  if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

const existing = await request("/blogs");
const summary = articles.map((item) => ({
  slug: item.slug,
  action: existing.some((blog) => blog.slug === item.slug) ? (apply ? "update" : "would-update") : (apply ? "create" : "would-create"),
  words: item.body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
  status: publish ? "PUBLISHED" : "DRAFT",
}));
console.log(JSON.stringify(summary, null, 2));
if (!apply) process.exit(0);

for (const item of articles) {
  const found = existing.find((blog) => blog.slug === item.slug);
  const payload = {
    ...item,
    status: publish ? "PUBLISHED" : "DRAFT",
    indexable: true,
    canonicalUrl: `https://nicpouch.co.il/blog/${item.slug}`,
    authorName: "מערכת NIC POUCH",
    authorRole: "צוות תוכן",
    reviewedBy: "בדיקת מערכת NIC POUCH",
    contentType: "GUIDE",
  };
  const saved = found
    ? await request(`/blogs/${found.id}`, { method: "PATCH", body: JSON.stringify(payload) })
    : await request("/blogs", { method: "POST", body: JSON.stringify(payload) });
  console.log(`${found ? "updated" : "created"} ${saved.slug ?? item.slug} (${payload.status})`);
}
