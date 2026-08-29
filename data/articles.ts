export type GuideCategory = "beginner" | "strength" | "flavors-brands" | "use-storage";

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  number: string;
  title: string;
  excerpt: string;
  primaryKeyword: string;
  category: GuideCategory;
  readingTime: number;
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  published: string;
  modified: string;
  updated: string;
  featured?: boolean;
  image?: { src: string; alt: string };
  takeaways: string[];
  sections: GuideSection[];
  faq: GuideFaq[];
  sources: string[];
  relatedGuideSlugs: string[];
  relatedProductIds?: string[];
  relatedLinks: { label: string; href: string }[];
}

export const guideCategoryLabels: Record<GuideCategory, string> = {
  beginner: "מתחילים כאן",
  strength: "עוצמות",
  "flavors-brands": "טעמים ומותגים",
  "use-storage": "שימוש ואחסון",
};

export const articles: Guide[] = [
  {
    slug: "nicotine-pouch-guide",
    number: "01",
    title: "איך לבחור סנוס ושקיקי ניקוטין ללא טבק?",
    excerpt: "מדריך מעשי להשוואת מותגים, טעמים ועוצמות ולהבנת הנתונים שמופיעים על אריזת שקיקי ניקוטין.",
    primaryKeyword: "איך לבחור שקיקי ניקוטין",
    category: "beginner",
    readingTime: 6,
    readTime: "6 דקות",
    updated: "23.07.2026",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-26",
    published: "2026-07-23",
    modified: "2026-07-26",
    featured: true,
    image: {
      src: "/generated/guide-choosing-editorial-v3.jpg",
      alt: "צילום אווירה של השוואת טעמים ועוצמות לפני בחירה",
    },
    takeaways: [
      "להבדיל בין סנוס מסורתי לבין שקיקי ניקוטין ללא טבק.",
      "לקרוא נכון את סימון העוצמה והניקוטין על האריזה.",
      "להשוות מותגים וטעמים בלי להסתמך רק על צבע האריזה.",
    ],
    sections: [
      {
        id: "before",
        title: "מה ההבדל בין סנוס לשקיקי ניקוטין?",
        paragraphs: [
          "בישראל משתמשים לעיתים במילה סנוס כשם כללי למוצרים שמונחים מתחת לשפה. סנוס מסורתי מכיל טבק, ואילו המוצרים הנמכרים באתר הם שקיקי ניקוטין ללא טבק.",
          "לפני בחירה בדקו שלושה נתונים שמופיעים בדף המוצר: מותג, טעם ורמת ניקוטין. אל תבחרו לפי צבע האריזה בלבד.",
        ],
      },
      {
        id: "strength",
        title: "איך בוחרים עוצמת ניקוטין?",
        paragraphs: [
          "מספר המ״ג מציג את נתון הניקוטין לפי סימון המוצר. ככל שהמספר גבוה יותר, העוצמה עשויה להיות מורגשת יותר. האתר אינו נותן המלצת מינון; יש לפעול לפי הוראות היצרן, ובמקרה של ספק בריאותי לפנות לאיש מקצוע.",
          "הסינון בחנות מחלק את המוצרים לעדין, בינוני, חזק וחזק מאוד כדי להקל על ההשוואה, אך סימון האריזה הוא המקור הקובע.",
        ],
      },
      {
        id: "flavor",
        title: "איך בוחרים טעם ומותג?",
        paragraphs: [
          "טעמי מנטה וקירור מתאימים למי שמעדיף תחושה רעננה. טעמי פירות כוללים דובדבן, מנגו, פטל, אבטיח ופירות טרופיים.",
          "בעמודי המותגים אפשר להשוות את כל מוצרי NOIS, HQD, PABLO ו־KILLA במקום אחד, ולראות אילו עוצמות וטעמים זמינים כעת.",
        ],
      },
    ],
    faq: [
      { question: "האם סנוס ושקיקי ניקוטין הם אותו מוצר?", answer: "לא בדיוק. סנוס מסורתי מכיל טבק; המוצרים באתר הם שקיקי ניקוטין ללא טבק. בישראל המילה סנוס משמשת לעיתים גם כשם חיפוש כללי." },
      { question: "מה חשוב לבדוק לפני שקונים?", answer: "בדקו את כמות הניקוטין, רמת העוצמה, הטעם, המותג והזמינות. הנתונים בדפי המוצר מבוססים על הקטלוג וסימון האריזה." },
      { question: "איזו עוצמה מתאימה למתחילים?", answer: "האתר אינו נותן המלצת מינון. יש לקרוא את סימון היצרן; ניקוטין הוא חומר ממכר והמוצרים מיועדים לבגירים שכבר משתמשים בניקוטין." },
    ],
    sources: [
      "נתוני היצרן והמידע המופיע על אריזת המוצר",
      "קטלוג המוצרים המאושר של NIC POUCH",
      "CDC — Nicotine Pouches: https://www.cdc.gov/tobacco/nicotine-pouches/index.html",
    ],
    relatedGuideSlugs: ["strength-guide", "how-to-use"],
    relatedLinks: [
      { label: "לכל שקיקי הניקוטין", href: "/shop" },
      { label: "לבחירה לפי עוצמה", href: "/strength/medium" },
      { label: "מדריך למספר המ״ג", href: "/blog/strength-guide" },
    ],
  },
  {
    slug: "strength-guide",
    number: "02",
    title: "מה אומר מספר המ״ג בסנוס ובשקיקי ניקוטין?",
    excerpt: "הסבר ברור על מספר המ״ג, ההבדל בין עוצמה עדינה, בינונית, חזקה וחזקה מאוד ואיך משווים נכון בין מוצרים.",
    primaryKeyword: "עוצמות שקיקי ניקוטין",
    category: "strength",
    readingTime: 5,
    readTime: "5 דקות",
    updated: "23.07.2026",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-26",
    published: "2026-07-23",
    modified: "2026-07-26",
    image: {
      src: "/generated/guide-strength-editorial-v3.jpg",
      alt: "צילום אווירה של ארבע רמות עוצמה וכלי מדידה",
    },
    takeaways: [
      "להבין מה מספר המ״ג מציין ומה הוא אינו מציין.",
      "להשוות רק נתונים שנמדדו באותה יחידה.",
      "להכיר את ארבע רמות העוצמה המשמשות לסינון באתר.",
    ],
    sections: [
      {
        id: "before",
        title: "מה מציין מספר המ״ג?",
        paragraphs: [
          "מספר המ״ג הוא נתון הניקוטין שמופיע בשם המוצר או על האריזה. באתר איננו משלימים נתונים חסרים בעצמנו, ולכן כאשר אין מידע מאומת אנו מפנים לסימון היצרן.",
          "חשוב להשוות מוצרים לפי אותו סוג נתון. סימונים שונים בין יצרנים עלולים להתייחס למנה, לשקיק או למשקל אחר.",
        ],
      },
      {
        id: "strength",
        title: "סולם העוצמות באתר",
        paragraphs: [
          "עד 8 מ״ג מסווג כעדין, 9–16 מ״ג כבינוני, 17–30 מ״ג כחזק ו־31 מ״ג ומעלה כחזק מאוד.",
          "הסולם נועד לעזור בסינון והשוואה בלבד. הוא אינו המלצה רפואית, ומוצרים חזקים מאוד מיועדים למשתמשי ניקוטין מנוסים בלבד.",
        ],
      },
      {
        id: "flavor",
        title: "למה הטעם אינו מעיד על העוצמה?",
        paragraphs: [
          "טעם מנטה או קירור עשוי להרגיש בולט, אבל התחושה אינה מחליפה את נתון הניקוטין. שני מוצרים באותו טעם יכולים להגיע בעוצמות שונות.",
          "בדף המוצר מוצגים הטעם והעוצמה בשדות נפרדים כדי למנוע בלבול.",
        ],
      },
    ],
    faq: [
      { question: "האם יותר מ״ג תמיד אומר מוצר חזק יותר?", answer: "בדרך כלל מספר גבוה יותר מציין יותר ניקוטין לפי סימון המוצר, אך יש להשוות את יחידת המדידה והוראות היצרן." },
      { question: "מה נחשב שקיק ניקוטין חזק?", answer: "בסולם האתר 17–30 מ״ג מוגדר חזק ו־31 מ״ג ומעלה חזק מאוד." },
      { question: "האם טעם מנטה הוא בהכרח חזק?", answer: "לא. הטעם והעוצמה הם נתונים נפרדים. יש לבדוק את מספר המ״ג בדף המוצר ועל האריזה." },
    ],
    sources: [
      "סימון הניקוטין ויחידת המדידה שמפרסם היצרן",
      "סולם העוצמות האחיד המשמש לסינון באתר NIC POUCH",
      "CDC — Nicotine Pouches: https://www.cdc.gov/tobacco/nicotine-pouches/index.html",
    ],
    relatedGuideSlugs: ["nicotine-pouch-guide", "how-to-use"],
    relatedLinks: [
      { label: "מוצרים בעוצמה בינונית", href: "/strength/medium" },
      { label: "מוצרים חזקים", href: "/strength/strong" },
      { label: "מוצרים חזקים מאוד", href: "/strength/extra-strong" },
    ],
  },
  {
    slug: "how-to-use",
    number: "03",
    title: "איך משתמשים בשקיקי ניקוטין ללא טבק?",
    excerpt: "מדריך לשימוש אחראי בשקיקי ניקוטין, קריאת הוראות היצרן, אחסון נכון והשלכה בטוחה.",
    primaryKeyword: "איך משתמשים בשקיקי ניקוטין",
    category: "use-storage",
    readingTime: 5,
    readTime: "5 דקות",
    updated: "23.07.2026",
    publishedAt: "2026-07-23",
    updatedAt: "2026-07-26",
    published: "2026-07-23",
    modified: "2026-07-26",
    image: {
      src: "/generated/guide-storage-editorial-v3.jpg",
      alt: "צילום אווירה של אחסון נעול והשלכה אחראית",
    },
    takeaways: [
      "מה לבדוק על האריזה לפני השימוש.",
      "איך לפעול בהתאם להוראות היצרן ולהקשיב לגוף.",
      "איך לאחסן ולהשליך שקיקים באופן אחראי.",
    ],
    sections: [
      {
        id: "before",
        title: "לפני השימוש",
        paragraphs: [
          "קראו את הוראות היצרן ואת האזהרות שעל האריזה. ודאו שהמוצר סגור, שלם ומתאים לעוצמה שבחרתם.",
          "המוצרים מיועדים לבגירים שכבר משתמשים בניקוטין. ניקוטין הוא חומר ממכר ואינו מתאים לקטינים.",
        ],
      },
      {
        id: "strength",
        title: "שימוש אחראי והקשבה לגוף",
        paragraphs: [
          "השתמשו במוצר רק בהתאם להוראות היצרן. אין ללעוס או לבלוע את השקיק ואין להשתמש באריזה פגומה.",
          "אם מתפתחת תחושה לא נעימה, הפסיקו את השימוש. במקרה של חשש רפואי יש לפנות לאיש מקצוע מתאים.",
        ],
      },
      {
        id: "flavor",
        title: "אחסון והשלכה",
        paragraphs: [
          "שמרו את האריזה סגורה במקום קריר ויבש, הרחק מחום, לחות ושמש ישירה.",
          "יש להרחיק את המוצר מילדים ומבעלי חיים ולהשליך שקיק משומש לפח סגור בהתאם להוראות האריזה.",
        ],
      },
    ],
    faq: [
      { question: "האם לועסים שקיק ניקוטין?", answer: "לא. יש להשתמש במוצר רק לפי הוראות היצרן ואין ללעוס או לבלוע את השקיק." },
      { question: "כיצד מאחסנים את האריזה?", answer: "במקום קריר ויבש, באריזה סגורה והרחק מילדים, בעלי חיים, חום ולחות." },
      { question: "מה עושים עם שקיק משומש?", answer: "משליכים לפח סגור ובהתאם להוראות שמופיעות על האריזה. אין להשאיר שקיקים משומשים בהישג ידם של ילדים או בעלי חיים." },
    ],
    sources: [
      "הוראות השימוש והאזהרות שמפרסם היצרן",
      "כללי האחסון והשירות של NIC POUCH",
      "FDA — Properly Store Nicotine Pouches: https://www.fda.gov/consumers/consumer-updates/properly-store-nicotine-pouches-prevent-accidental-exposure-children-and-pets",
    ],
    relatedGuideSlugs: ["nicotine-pouch-guide", "strength-guide"],
    relatedLinks: [
      { label: "הצהרת אזהרות ניקוטין", href: "/nicotine-information" },
      { label: "מדריך לבחירת מוצר", href: "/blog/nicotine-pouch-guide" },
      { label: "לכל המוצרים", href: "/shop" },
    ],
  }
];

export function guideBySlug(slug: string) {
  return articles.find((guide) => guide.slug === slug) ?? null;
}

export function relatedGuidesFor(guide: Guide) {
  return guide.relatedGuideSlugs
    .map((slug) => guideBySlug(slug))
    .filter((related): related is Guide => related !== null);
}
