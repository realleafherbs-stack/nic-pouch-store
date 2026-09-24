const apiBase = process.env.AGENT_API_BASE_URL ?? "https://www.ducks.co.il/api/nic-pouch/agent";
const apiKey = process.env.AGENT_API_KEY;
const apply = process.argv.includes("--apply");

if (!apiKey) throw new Error("AGENT_API_KEY is required");

const pages = [
  {
    page: "snus",
    patch: {
      focusKeyword: "סנוס ושקיקי ניקוטין",
      metaTitle: "סנוס ושקיקי ניקוטין: מה זה וההבדל מטבק",
      metaDescription: "מה זה סנוס ושקיקי ניקוטין ללא טבק? הסבר על המונחים פאוץ׳ ושקית ניקוטין, ומה בודקים לפני בחירה באתר בישראל.",
      heading: "מה זה סנוס ושקיקי ניקוטין?",
      summary: "ההבדל בין סנוס מסורתי לבין שקיקי הניקוטין ללא טבק שנמכרים באתר בישראל.",
      directAnswer: "סנוס מסורתי הוא מוצר טבק לשימוש בפה. בישראל המילה סנוס משמשת לעיתים גם לתיאור שקיקי ניקוטין ללא טבק, אך אלה מוצרים שונים.",
      canonicalUrl: "https://nicpouch.co.il/snus",
      indexable: true,
      schemaType: "Article",
    },
  },
  {
    page: "shop",
    patch: {
      focusKeyword: "סנוס למכירה",
      metaTitle: "סנוס ושקיקי ניקוטין למכירה | מחיר ומלאי",
      metaDescription: "סנוס ושקיקי ניקוטין למכירה באתר: בחרו לפי מותג, טעם ועוצמה, ובדקו מחיר, כמות ומלאי לפני התשלום.",
      heading: "סנוס ושקיקי ניקוטין – מוצרים זמינים",
      summary: "קטלוג שקיקי ניקוטין ללא טבק למבוגרים בלבד, עם סינון לפי מותג, טעם ועוצמה ובדיקת מחיר ומלאי לפני תשלום.",
      directAnswer: "בחנות מוצגים סנוס ושקיקי ניקוטין למכירה ממספר מותגים. אפשר להשוות לפי טעם, עוצמה ומחיר ולבדוק מלאי לפני ההזמנה.",
      canonicalUrl: "https://nicpouch.co.il/shop",
      indexable: true,
      schemaType: "CollectionPage",
    },
  },
];

for (const { page, patch } of pages) {
  console.log(JSON.stringify({ page, action: apply ? "update" : "would-update", metaTitle: patch.metaTitle }));
  if (!apply) continue;
  const response = await fetch(`${apiBase}/seo/pages/${encodeURIComponent(page)}`, {
    method: "PATCH",
    headers: { "x-api-key": apiKey, "content-type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!response.ok) throw new Error(`${page}: ${response.status} ${await response.text()}`);
}
