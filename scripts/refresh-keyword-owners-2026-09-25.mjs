const apiBase = process.env.AGENT_API_BASE_URL ?? "https://www.ducks.co.il/api/nic-pouch/agent";
const apiKey = process.env.AGENT_API_KEY;
const apply = process.argv.includes("--apply");

if (!apiKey) throw new Error("AGENT_API_KEY is required");

const headers = { "x-api-key": apiKey, "content-type": "application/json" };
async function request(path, init = {}) {
  const response = await fetch(`${apiBase}${path}`, { ...init, headers: { ...headers, ...(init.headers ?? {}) } });
  if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

const writableFields = [
  "title", "slug", "excerpt", "primaryKeyword", "metaTitle", "metaDescription", "directAnswer",
  "tags", "featuredImage", "ogImage", "faq", "relatedBlogIds", "relatedProductIds", "body",
  "status", "indexable", "canonicalUrl", "authorName", "authorRole", "reviewedBy", "contentType",
];

function toWritablePayload(post) {
  return Object.fromEntries(writableFields.flatMap((field) =>
    post[field] === undefined ? [] : [[field, post[field]]],
  ));
}

const changes = {
  "snus-price-guide": (post) => ({
    ...post,
    title: "סנוס ושקיקי ניקוטין מחיר: איך משווים נכון?",
    primaryKeyword: "סנוס מחיר",
    metaTitle: "סנוס ושקיקי ניקוטין מחיר: השוואת מחיר",
    metaDescription: "סנוס מחיר ושקיקי ניקוטין מחיר: כך משווים מחיר ליחידה, מדרגות כמות ומשלוח לפני הזמנה באתר.",
    excerpt: "מחפשים סנוס מחיר או שקיקי ניקוטין מחיר? כך משווים מחיר ליחידה, כמות ומשלוח בלי להתבלבל בין יחידה למארז.",
    directAnswer: "כדי להשוות סנוס מחיר או שקיקי ניקוטין מחיר, בודקים מחיר ליחידה באותה כמות, מוסיפים משלוח וקופון תקף, ומשווים את הסכום הסופי בסל.",
    body: post.body.replace(
      'בחיפוש אחר "סנוס מחיר"',
      'בחיפוש אחר "סנוס מחיר" או "שקיקי ניקוטין מחיר"',
    ),
  }),
  "nicotine-pouch-brands-israel-guide": (post) => ({
    ...post,
    title: "מותגי סנוס ושקיקי ניקוטין בישראל: ZYN, QWEET ועוד",
    primaryKeyword: "שקיקי ניקוטין בישראל",
    metaTitle: "שקיקי ניקוטין בישראל: ZYN, QWEET ומותגים",
    metaDescription: "אילו מותגי סנוס ושקיקי ניקוטין נמכרים בישראל? סקירה של NOIS, HQD, PABLO, KILLA, CUBA, ZYN, QWEET, VELO ועוד.",
    excerpt: "סקירת מותגי שקיקי ניקוטין בישראל, כולל ZYN, QWEET, VELO, NOIS, HQD, PABLO, KILLA ו־CUBA, והפרטים שצריך לבדוק לפני השוואה.",
    directAnswer: "בישראל נמכרים מותגי שקיקי ניקוטין שונים בחנויות שונות, ובהם NOIS, HQD, PABLO, KILLA, CUBA, ZYN, QWEET ו־VELO. זמינות של מותג או טעם משתנה לפי החנות, ולכן דף המוצר והמלאי באתר הם הקובעים.",
    body: `${post.body}<h2>ZYN ו־QWEET בישראל: מה בודקים?</h2><p>ZYN ו־QWEET מופיעים בחלק מחנויות שקיקי הניקוטין בישראל, אך אינם מוצגים כעת כמוצרים פעילים בקטלוג NIC POUCH. לכן אין כאן קישור לרכישה שלהם. מי שמשווה מותגים צריך לבדוק שם מוצר מלא, טעם, סימון ניקוטין, יחידת מדידה, מחיר ומלאי בחנות שבה הוא קונה.</p><p>ב־NIC POUCH אפשר להמשיך ל<a href="/shop">מוצרים הזמינים כרגע</a> ולבחור לפי מותג, טעם וסימון. המדריך אינו מדרג מותגים ואינו טוען שמותג שאינו במלאי באתר זמין לרכישה בו.</p>`,
  }),
};

const posts = await request("/blogs");

for (const [slug, transform] of Object.entries(changes)) {
  const post = posts.find((item) => item.slug === slug);
  if (!post) throw new Error(`Blog not found for slug: ${slug}`);
  const next = transform(post);
  console.log(JSON.stringify({ slug, title: next.title, metaTitle: next.metaTitle, words: next.body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length, action: apply ? "update" : "would-update" }));
  if (apply) await request(`/blogs/${post.id}`, { method: "PATCH", body: JSON.stringify(toWritablePayload(next)) });
}
