"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CircleGauge, SlidersHorizontal, X } from "lucide-react";
import type { Product, StrengthLevel } from "@/lib/catalog/model";
import { ProductCard } from "@/components/product/product-card";

const strengthOptions: Array<{ value: StrengthLevel; label: string }> = [
  { value: "mild", label: "עדין" },
  { value: "medium", label: "בינוני" },
  { value: "strong", label: "חזק" },
  { value: "extra-strong", label: "חזק מאוד" },
];
const strengthGuides: Record<StrengthLevel, { range: string; title: string; description: string }> = {
  mild: { range: "עד 8 מ״ג", title: "עוצמה עדינה", description: "העוצמה הנמוכה בקטלוג. אם אינכם בטוחים איזו רמה מתאימה לכם, מומלץ להתחיל נמוך ולבחון בהדרגה." },
  medium: { range: "9–16 מ״ג", title: "עוצמה בינונית", description: "רמה מאוזנת למשתמשים שכבר מכירים מוצרי ניקוטין ומעדיפים נוכחות מורגשת אך לא מקסימלית." },
  strong: { range: "17–30 מ״ג", title: "עוצמה חזקה", description: "מוצרים בעלי ריכוז גבוה, המיועדים למשתמשי ניקוטין מנוסים בלבד." },
  "extra-strong": { range: "31+ מ״ג", title: "עוצמה חזקה מאוד", description: "הרמה הגבוהה ביותר בקטלוג. מיועדת למשתמשים מנוסים שמכירים היטב את הסבילות האישית שלהם." },
};
const flavorFilters = [
  { id: "mint", terms: ["מנט", "mint", "spearmint"] },
  { id: "ice", terms: ["אייס", "ice", "קפוא"] },
  { id: "fruit", terms: ["פטל", "מנגו", "אבטיח", "ענב", "לימון", "דובדבן", "berry", "grape", "mango", "lemon"] },
];

function getSearchParam(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

export function ShopCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState(() => {
    const requested = getSearchParam("brand");
    return requested && products.some((product) => product.brand === requested) ? requested : "";
  });
  const [strength, setStrength] = useState(() => {
    const requested = getSearchParam("strength");
    return strengthOptions.some((option) => option.value === requested) ? requested as StrengthLevel : "";
  });
  const [flavor, setFlavor] = useState(() => {
    const requested = getSearchParam("flavor");
    return requested && flavorFilters.some((option) => option.id === requested) ? requested : "";
  });
  const [sort, setSort] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const focusSearchWhenReady = useRef(false);
  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))], [products]);

  const revealSearch = useCallback(() => {
    focusSearchWhenReady.current = true;
    if (window.matchMedia("(max-width: 850px)").matches) {
      setFiltersOpen(true);
      return;
    }
    searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    searchInputRef.current?.focus();
    focusSearchWhenReady.current = false;
  }, []);

  useEffect(() => {
    if (getSearchParam("search") !== "open") return;
    const timeout = window.setTimeout(revealSearch, 0);
    return () => window.clearTimeout(timeout);
  }, [revealSearch]);

  useEffect(() => {
    function handleOpenSearch() {
      revealSearch();
    }
    window.addEventListener("open-catalog-search", handleOpenSearch);
    return () => window.removeEventListener("open-catalog-search", handleOpenSearch);
  }, [revealSearch]);

  useEffect(() => {
    if (!filtersOpen || !focusSearchWhenReady.current) return;
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      focusSearchWhenReady.current = false;
    });
  }, [filtersOpen]);

  function changeStrength(value: string) {
    setStrength(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("strength", value);
    else url.searchParams.delete("strength");
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const searchable = `${product.name} ${product.brand} ${product.flavor || ""}`.toLowerCase();
      return (!normalized || searchable.includes(normalized)) &&
        (!brand || product.brand === brand) &&
        (!strength || product.strengthLevel === strength) &&
        (!flavor || flavorFilters.find((option) => option.id === flavor)?.terms.some((term) => searchable.includes(term)));
    });
    if (sort === "price-asc") result.sort((a, b) => a.retailPrice - b.retailPrice);
    if (sort === "price-desc") result.sort((a, b) => b.retailPrice - a.retailPrice);
    return result;
  }, [products, query, brand, strength, flavor, sort]);

  const activeFilters = [brand, strength, flavor, query].filter(Boolean).length;
  function resetFilters() {
    setQuery("");
    setBrand("");
    setFlavor("");
    changeStrength("");
    setSort("");
  }

  const controls = (
    <>
      <label><span>חיפוש</span><input ref={searchInputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="טעם, מוצר או מותג" aria-label="חיפוש" /></label>
      <label><span>מותג</span><select value={brand} onChange={(event) => setBrand(event.target.value)} aria-label="מותג"><option value="">כל המותגים</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>עוצמה</span><select value={strength} onChange={(event) => changeStrength(event.target.value)} aria-label="עוצמה"><option value="">כל העוצמות</option>{strengthOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
      <label><span>מיון</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="מיון"><option value="">מומלצים</option><option value="price-asc">מחיר: נמוך לגבוה</option><option value="price-desc">מחיר: גבוה לנמוך</option></select></label>
      {activeFilters > 0 && <button className="filter-reset" onClick={resetFilters}>ניקוי סינון</button>}
    </>
  );

  return (
    <div className="shop-catalog">
      <button className="mobile-filter-trigger" onClick={() => setFiltersOpen(true)}><SlidersHorizontal /> סינון ומיון {activeFilters > 0 && <span>{activeFilters}</span>}</button>
      <aside className="filters desktop-filters" aria-label="סינון מוצרים">{controls}</aside>
      {filtersOpen && <div className="filter-sheet-layer"><button className="drawer-scrim" aria-label="סגירת סינון" onClick={() => setFiltersOpen(false)} /><aside className="filter-sheet" role="dialog" aria-modal="true" aria-label="סינון ומיון"><header><strong>סינון ומיון</strong><button className="icon-button" aria-label="סגירת סינון" onClick={() => setFiltersOpen(false)}><X /></button></header><div>{controls}</div><button className="button" onClick={() => setFiltersOpen(false)}>הצגת {visible.length} מוצרים</button></aside></div>}

      <div className="shop-results">
        {strength && strengthGuides[strength as StrengthLevel] && <section className={`strength-explainer strength-${strength}`}>
          <CircleGauge />
          <div><p className="eyebrow">הסינון הפעיל</p><h2>{strengthGuides[strength as StrengthLevel].title}</h2><strong>{strengthGuides[strength as StrengthLevel].range}</strong><p>{strengthGuides[strength as StrengthLevel].description}</p></div>
          <Link href="/blog/strength-guide">איך בוחרים עוצמה?</Link>
        </section>}
        <div className="results-bar"><strong>{visible.length} מוצרים</strong><span>המחירים כוללים מע״מ</span></div>
        {activeFilters > 0 && <div className="active-filter-chips">
          {query && <button onClick={() => setQuery("")}>חיפוש: {query} <X /></button>}
          {brand && <button onClick={() => setBrand("")}>{brand} <X /></button>}
          {flavor && <button onClick={() => setFlavor("")}>טעם מסונן <X /></button>}
          {strength && <button onClick={() => changeStrength("")}>עוצמה: {strengthOptions.find((item) => item.value === strength)?.label} <X /></button>}
        </div>}
        {visible.length ? <div className="product-grid">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-results"><h2>לא מצאנו מוצרים</h2><p>נסו להסיר מסנן או לחפש טעם אחר.</p><button className="button" onClick={resetFilters}>הצגת כל המוצרים</button></div>}
      </div>
    </div>
  );
}
