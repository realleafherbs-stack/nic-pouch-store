import { readFile } from 'node:fs/promises'

const apiBase = process.env.AGENT_API_BASE_URL ?? 'https://www.ducks.co.il/api/nic-pouch/agent'
const apiKey = process.env.AGENT_API_KEY
const publish = process.argv.includes('--publish')

if (!apiKey) throw new Error('AGENT_API_KEY is required')

const deliveryImage = 'https://nicpouch.co.il/generated/guide-choosing-editorial-v3.jpg'
const cherryImage = 'https://app.payper.co.il/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOTZnVlE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--0c137929b2009ea034bcc42e50798499a8e1d9e8/%D7%A0%D7%95%D7%99%D7%A1%20%D7%93%D7%95%D7%91%D7%93%D7%91%D7%9F%20%D7%90%D7%A7%D7%A1%D7%98%D7%A8%D7%99%D7%9D%2050%20%D7%9E%D7%92.png'

const articles = [
  {
    title: 'סנוס משלוח עד הבית: כך מזמינים שקיקי ניקוטין אונליין בישראל',
    slug: 'snus-delivery-israel-online-order-guide',
    excerpt: 'מדריך להזמנת סנוס ושקיקי ניקוטין במשלוח: מה בודקים לפני התשלום, מתי מתקבל מעקב, איך מחושבת עלות המשלוח ומה עושים אם צריך עזרה.',
    primaryKeyword: 'סנוס משלוח',
    metaTitle: 'סנוס משלוח עד הבית: הזמנה אונליין בישראל | NIC POUCH',
    metaDescription: 'מחפשים סנוס משלוח? כך מזמינים שקיקי ניקוטין אונליין, בודקים כתובת, מחיר, זמני אספקה ומעקב משלוחים לפני התשלום.',
    directAnswer: 'להזמנת שקיקי ניקוטין במשלוח, בוחרים את המוצר המדויק, מאמתים כמות, כתובת וטלפון, ובודקים את הסכום הסופי בסל. ב־NIC POUCH משלוח חינם בקנייה מעל 199 ₪; להזמנות אחרות העלות מוצגת לפני אישור ההזמנה.',
    tags: ['סנוס משלוח', 'סנוס משלוח עד הבית', 'שקיקי ניקוטין משלוח', 'הזמנת סנוס אונליין'],
    featuredImage: deliveryImage,
    ogImage: deliveryImage,
    faq: [
      { question: 'האם יש משלוח חינם?', answer: 'ב־NIC POUCH משלוח ללא עלות בקנייה מעל 199 ₪. בהזמנה נמוכה יותר העלות מופיעה בסל לפני אישור ההזמנה.' },
      { question: 'מתי מקבלים קישור למעקב?', answer: 'לאחר קליטת החבילה אצל חברת השליחויות נשלח עדכון עם קישור למעקב למספר הטלפון שהוזן בהזמנה.' },
      { question: 'כמה זמן לוקחת אספקה?', answer: 'לפי מדיניות המשלוחים, זמן האספקה הוא עד 3 ימי עסקים. ביישובים מרוחקים עלולים להיות עיכובים.' },
    ],
    bodyPath: new URL('./article-content/snus-delivery-israel-online-order-guide.html', import.meta.url),
  },
  {
    title: 'סנוס דובדבן: NOIS, HQD ו־CUBA — טעמים ומוצרים זמינים',
    slug: 'cherry-snus-nicotine-pouches-israel-guide',
    excerpt: 'מדריך לסנוס ושקיקי ניקוטין בטעם דובדבן: NOIS, HQD ו־CUBA, ההבדל בין שמות הגרסאות ומה בודקים לפני הזמנה.',
    primaryKeyword: 'סנוס דובדבן',
    metaTitle: 'סנוס דובדבן: NOIS, HQD ו־CUBA בישראל | NIC POUCH',
    metaDescription: 'מחפשים סנוס דובדבן? מדריך למוצרי NOIS, HQD ו־CUBA בטעם דובדבן, עם קישורים למוצרים, סימונים ומה לבדוק לפני הזמנה.',
    directAnswer: 'בקטלוג NIC POUCH מופיעים כיום שקיקי ניקוטין בטעם דובדבן של NOIS, HQD ו־CUBA. כדי לבחור נכון, בודקים את המותג, שם הגרסה המלא, הסימון שעל האריזה, הכמות והמחיר בסל — ולא מסתמכים רק על המילה דובדבן.',
    tags: ['סנוס דובדבן', 'שקיקי ניקוטין דובדבן', 'NOIS דובדבן', 'HQD דובדבן', 'CUBA צ׳רי'],
    featuredImage: cherryImage,
    ogImage: cherryImage,
    faq: [
      { question: 'אילו מותגים בטעם דובדבן קיימים באתר?', answer: 'בזמן פרסום המאמר, מופיעים בקטלוג NOIS דובדבן קרח ודובדבן אקסטרים, HQD דובדבן ו־CUBA Black ו־White Cherry. מלאי משתנה ולכן עמוד המוצר הוא המקור הקובע.' },
      { question: 'האם Cherry, Cherry Ice ו־Cherry Extreme הם אותו מוצר?', answer: 'לא. אלה שמות גרסה שונים. יש לבדוק תמיד את המותג, הסדרה והסימון המלא שעל האריזה.' },
      { question: 'איך משווים בין מוצרי דובדבן?', answer: 'משווים שם גרסה מלא, יחידת מדידה, כמות שקיקים כאשר היא מצוינת, מחיר ומלאי. אין להסיק התאמה אישית על בסיס המספר בלבד.' },
    ],
    bodyPath: new URL('./article-content/cherry-snus-nicotine-pouches-israel-guide.html', import.meta.url),
  },
]

const prepared = await Promise.all(articles.map(async ({ bodyPath, ...article }) => ({
  ...article,
  body: await readFile(bodyPath, 'utf8'),
})))

const headers = { 'x-api-key': apiKey, 'content-type': 'application/json' }
async function request(path, init = {}) {
  const response = await fetch(apiBase + path, { ...init, headers: { ...headers, ...(init.headers ?? {}) } })
  if (!response.ok) throw new Error(path + ': ' + response.status + ' ' + await response.text())
  return response.status === 204 ? null : response.json()
}

const existing = await request('/blogs')
console.log(JSON.stringify(prepared.map((article) => ({
  slug: article.slug,
  title: article.title,
  words: article.body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
  action: existing.some((item) => item.slug === article.slug) ? 'update' : 'create',
  status: publish ? 'PUBLISHED' : 'DRY_RUN',
})), null, 2))

if (!publish) process.exit(0)

for (const article of prepared) {
  const found = existing.find((item) => item.slug === article.slug)
  const payload = {
    ...article,
    status: 'PUBLISHED',
    indexable: true,
    canonicalUrl: 'https://nicpouch.co.il/blog/' + article.slug,
    authorName: 'מערכת NIC POUCH',
    authorRole: 'צוות תוכן',
    reviewedBy: 'בדיקת מערכת NIC POUCH',
    contentType: 'GUIDE',
  }
  const saved = found
    ? await request('/blogs/' + found.id, { method: 'PATCH', body: JSON.stringify(payload) })
    : await request('/blogs', { method: 'POST', body: JSON.stringify(payload) })
  console.log((found ? 'updated ' : 'created ') + (saved.slug ?? article.slug))
}
