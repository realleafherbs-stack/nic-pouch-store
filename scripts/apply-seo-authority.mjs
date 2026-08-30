import { pathToFileURL } from "node:url";

const defaultApiBase = "https://www.ducks.co.il/api/nic-pouch/agent";
const defaultSiteUrl = "https://nicpouch.co.il";

const pageDefinitions = [
  {
    page: "shop",
    focusKeyword: "שקיקי ניקוטין ללא טבק",
    metaTitle: "שקיקי ניקוטין ללא טבק – כל המותגים | NIC POUCH",
    metaDescription: "כל שקיקי הניקוטין ללא טבק בחנות NIC POUCH, מסודרים לפי מותג, טעם ועוצמה. מחיר ליחידה והנחות כמות מוצגים לפני ההזמנה.",
    heading: "שקיקי ניקוטין ללא טבק – כל המוצרים",
    summary: "קטלוג שקיקי ניקוטין למבוגרים בלבד, עם סינון לפי מותג, טעם ועוצמה ומחיר ברור לכל כמות.",
    directAnswer: "בחנות מוצגים שקיקי ניקוטין ללא טבק ממספר מותגים. אפשר להשוות לפי טעם, עוצמה ומחיר ולבחור יחידה אחת, 5 או 10 יחידות.",
    schemaType: "CollectionPage",
  },
  {
    page: "snus",
    focusKeyword: "מה זה סנוס",
    metaTitle: "מה זה סנוס? ההבדל משקיקי ניקוטין ללא טבק",
    metaDescription: "מה זה סנוס, מה ההבדל בין סנוס מסורתי לשקיקי ניקוטין ללא טבק ואילו פרטים חשוב לבדוק על האריזה לפני בחירה.",
    heading: "מה זה סנוס?",
    summary: "הסבר אחראי על ההבדל בין סנוס מסורתי שמכיל טבק לבין שקיקי הניקוטין ללא טבק הנמכרים באתר.",
    directAnswer: "סנוס מסורתי הוא מוצר טבק לשימוש בפה. בישראל המילה סנוס משמשת לעיתים גם לתיאור שקיקי ניקוטין ללא טבק, אך אלה מוצרים שונים.",
    schemaType: "Article",
  },
  {
    page: "blog",
    focusKeyword: "מדריכים על שקיקי ניקוטין",
    metaTitle: "מדריכים על סנוס ושקיקי ניקוטין | NIC GUIDE",
    metaDescription: "מדריכים אחראיים על סנוס ושקיקי ניקוטין ללא טבק: קריאת מ״ג, השוואת עוצמות, אחסון בטוח, שימוש ומידע על מותגים.",
    heading: "מדריכים על סנוס ושקיקי ניקוטין",
    summary: "מרכז ידע למבוגרים עם הסברים ברורים, מקורות וקישורים למידע נוסף.",
    directAnswer: "NIC GUIDE מרכז מידע על שקיקי ניקוטין ללא טבק, לרבות סימון מ״ג, עוצמות, אחסון בטוח והבדלים בין סוגי מוצרים.",
    schemaType: "CollectionPage",
  },
  ...[
    ["nois", "NOIS"], ["hqd", "HQD"], ["pablo", "PABLO"],
    ["killa", "KILLA"], ["cuba", "CUBA"], ["bit", "BIT"],
  ].map(([slug, brand]) => ({
    page: `brands/${slug}`,
    focusKeyword: `${brand} שקיקי ניקוטין`,
    metaTitle: `${brand} שקיקי ניקוטין ללא טבק | טעמים ועוצמות`,
    metaDescription: `כל מוצרי ${brand} הזמינים ב־NIC POUCH: שקיקי ניקוטין ללא טבק לפי טעם, עוצמה ומחיר. למבוגרים בלבד.`,
    heading: `${brand} שקיקי ניקוטין`,
    summary: `כל מוצרי ${brand} הפעילים בחנות, עם נתוני טעם, עוצמה ומחיר כפי שמופיעים בקטלוג ובסימון האריזה.`,
    directAnswer: `בעמוד זה מרוכזים מוצרי ${brand} הזמינים כעת בחנות. בכל דף מוצר מוצגים הטעם, נתון המ״ג, המחיר והזמינות.`,
    schemaType: "CollectionPage",
  })),
  {
    page: "faq",
    focusKeyword: "שאלות על שקיקי ניקוטין",
    metaTitle: "שאלות נפוצות על שקיקי ניקוטין | NIC POUCH",
    metaDescription: "תשובות לשאלות נפוצות על הזמנה, משלוח, עוצמות, סימון מ״ג, אחסון ושקיקי ניקוטין ללא טבק.",
    heading: "שאלות נפוצות",
    summary: "תשובות קצרות וברורות בנושאי מוצרים, הזמנה, משלוח ושימוש אחראי.",
    directAnswer: "כאן תמצאו תשובות על נתוני המוצרים, הזמנה, משלוח, אחסון בטוח וההבדל בין סנוס מסורתי לשקיקי ניקוטין ללא טבק.",
    schemaType: "FAQPage",
  },
  {
    page: "about",
    focusKeyword: "אודות NIC POUCH",
    metaTitle: "אודות NIC POUCH | שקיפות, שירות ומידע אחראי",
    metaDescription: "הכירו את NIC POUCH, את עקרונות בחירת המידע באתר ואת המחויבות לשקיפות, שירות ומכירה למבוגרים בלבד.",
    heading: "אודות NIC POUCH",
    summary: "חנות ישראלית לשקיקי ניקוטין ללא טבק, עם דגש על מידע ברור, שירות ושקיפות.",
    directAnswer: "NIC POUCH היא חנות ישראלית לשקיקי ניקוטין ללא טבק, הפועלת למבוגרים בלבד ומציגה נתוני מוצר על בסיס הקטלוג וסימון היצרן.",
    schemaType: "AboutPage",
  },
  {
    page: "contact",
    focusKeyword: "יצירת קשר NIC POUCH",
    metaTitle: "יצירת קשר ושירות לקוחות | NIC POUCH",
    metaDescription: "צרו קשר עם שירות הלקוחות של NIC POUCH בנושאי מוצרים, הזמנות, משלוחים והחזרות.",
    heading: "יצירת קשר",
    summary: "ערוצי השירות של NIC POUCH לשאלות על מוצרים והזמנות.",
    directAnswer: "אפשר לפנות לשירות הלקוחות של NIC POUCH בנושאי מוצרים, הזמנות, משלוחים והחזרות באמצעות פרטי הקשר המופיעים בעמוד.",
    schemaType: "ContactPage",
  },
];

export function buildPageSeoPlan(siteUrl = defaultSiteUrl) {
  const base = siteUrl.replace(/\/$/, "");
  return pageDefinitions.map(({ page, ...patch }) => ({
    page,
    patch: { ...patch, canonicalUrl: `${base}/${page}`, indexable: true },
  }));
}

export function buildBlogAuthorityPatch(post, relatedBlogIds) {
  return {
    canonicalUrl: post.canonicalUrl || `${defaultSiteUrl}/blog/${post.slug}`,
    contentType: post.contentType || "GUIDE",
    reviewedBy: post.reviewedBy || "ממתין לאישור",
    relatedBlogIds: relatedBlogIds.filter((id) => id !== post.id),
    indexable: post.status === "PUBLISHED",
  };
}

export function buildProductFaqRaw(product) {
  const name = String(product.name ?? "המוצר").trim();
  const brand = String(product.brand ?? "NIC POUCH").trim().toUpperCase();
  const fromAttributes = Number(product.attributes?.nicotineMg);
  const match = name.match(/(\d+(?:\.\d+)?)\s*מ["״׳']?ג/);
  const mg = Number.isFinite(fromAttributes) && fromAttributes > 0 ? fromAttributes : match ? Number(match[1]) : null;
  const nicotineAnswer = mg
    ? `לפי סימון המוצר, הנתון הוא ${mg} מ״ג. יש לבדוק תמיד גם את הסימון שעל האריזה.`
    : "נתון הניקוטין מופיע בדף המוצר ועל האריזה; יש להסתמך על סימון היצרן.";
  return [
    `כמה ניקוטין יש ב־${name}?|${nicotineAnswer}`,
    `מי היצרן או המותג של ${name}?|המותג המופיע בקטלוג הוא ${brand}. פרטי המוצר מבוססים על הקטלוג וסימון האריזה.`,
    "האם המוצר מכיל טבק?|לא. זהו שקיק ניקוטין ללא טבק למבוגרים בלבד. המוצר מכיל ניקוטין — חומר ממכר.",
    "כיצד שומרים את המוצר?|יש לשמור באריזה המקורית, סגורה, במקום קריר ויבש והרחק מהישג ידם ומטווח ראייתם של ילדים ובעלי חיים.",
  ].join("\n");
}

async function requestJson(url, apiKey, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: { "x-api-key": apiKey, "content-type": "application/json", ...init.headers },
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}: ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

async function run() {
  const apply = process.argv.includes("--apply");
  const apiKey = process.env.AGENT_API_KEY;
  const apiBase = (process.env.AGENT_API_BASE_URL ?? defaultApiBase).replace(/\/$/, "");
  const siteUrl = (process.env.SITE_URL ?? defaultSiteUrl).replace(/\/$/, "");
  if (!apiKey) throw new Error("AGENT_API_KEY is required");

  const [blogs, products, sitemapXml] = await Promise.all([
    requestJson(`${apiBase}/blogs`, apiKey),
    requestJson(`${apiBase}/products`, apiKey),
    fetch(`${siteUrl}/sitemap.xml`).then(async (response) => {
      if (!response.ok) throw new Error(`sitemap returned HTTP ${response.status}`);
      return response.text();
    }),
  ]);
  const pages = buildPageSeoPlan(siteUrl);
  const blogIds = blogs.map((post) => post.id);
  const activeSuffixes = new Set([...sitemapXml.matchAll(/<loc>[^<]+\/shop\/([^<]+)<\/loc>/g)].map((match) => decodeURIComponent(match[1]).split("-").pop()));
  const productJobs = products.filter((product) => activeSuffixes.has(String(product.id).slice(-8)) && !String(product.faqRaw ?? "").trim());
  console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", pages: pages.length, draftBlogs: blogs.filter((post) => post.status === "DRAFT").length, productFaqs: productJobs.length }, null, 2));
  if (!apply) return;

  for (const { page, patch } of pages) {
    await requestJson(`${apiBase}/seo/pages/${encodeURIComponent(page)}`, apiKey, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    console.log(`page ${page}`);
  }
  for (const post of blogs.filter((item) => item.status === "DRAFT")) {
    await requestJson(`${apiBase}/blogs/${post.id}`, apiKey, {
      method: "PATCH",
      body: JSON.stringify(buildBlogAuthorityPatch(post, blogIds)),
    });
    console.log(`draft ${post.slug}`);
  }
  for (let index = 0; index < productJobs.length; index += 5) {
    const batch = productJobs.slice(index, index + 5);
    await Promise.all(batch.map((product) => requestJson(`${apiBase}/products/${product.id}`, apiKey, {
      method: "PATCH",
      body: JSON.stringify({ faqRaw: buildProductFaqRaw(product) }),
    })));
    console.log(`product FAQs ${Math.min(index + batch.length, productJobs.length)}/${productJobs.length}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
