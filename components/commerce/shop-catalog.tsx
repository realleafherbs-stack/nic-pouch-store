"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Product, StrengthLevel } from "@/lib/catalog/model";
import { ProductCard } from "@/components/product/product-card";

const strengthOptions: Array<{ value: StrengthLevel; label: string }> = [
  { value: "mild", label: "עדין" },
  { value: "medium", label: "בינוני" },
  { value: "strong", label: "חזק" },
  { value: "extra-strong", label: "חזק מאוד" },
];

export function ShopCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [strength, setStrength] = useState("");
  const [sort, setSort] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))], [products]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const searchable = `${product.name} ${product.brand} ${product.flavor || ""}`.toLowerCase();
      return (!normalized || searchable.includes(normalized)) &&
        (!brand || product.brand === brand) &&
        (!strength || product.strengthLevel === strength);
    });
    if (sort === "price-asc") result.sort((a, b) => a.retailPrice - b.retailPrice);
    if (sort === "price-desc") result.sort((a, b) => b.retailPrice - a.retailPrice);
    return result;
  }, [products, query, brand, strength, sort]);

  const activeFilters = [brand, strength, query].filter(Boolean).length;
  function resetFilters() {
    setQuery("");
    setBrand("");
    setStrength("");
    setSort("");
  }

  const controls = (
    <>
      <label><span>חיפוש</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="טעם, מוצר או מותג" aria-label="חיפוש" /></label>
      <label><span>מותג</span><select value={brand} onChange={(event) => setBrand(event.target.value)} aria-label="מותג"><option value="">כל המותגים</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>עוצמה</span><select value={strength} onChange={(event) => setStrength(event.target.value)} aria-label="עוצמה"><option value="">כל העוצמות</option>{strengthOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
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
        <div className="results-bar"><strong>{visible.length} מוצרים</strong><span>המחירים כוללים מע״מ</span></div>
        {activeFilters > 0 && <div className="active-filter-chips">
          {query && <button onClick={() => setQuery("")}>חיפוש: {query} <X /></button>}
          {brand && <button onClick={() => setBrand("")}>{brand} <X /></button>}
          {strength && <button onClick={() => setStrength("")}>עוצמה: {strengthOptions.find((item) => item.value === strength)?.label} <X /></button>}
        </div>}
        {visible.length ? <div className="product-grid">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-results"><h2>לא מצאנו מוצרים</h2><p>נסו להסיר מסנן או לחפש טעם אחר.</p><button className="button" onClick={resetFilters}>הצגת כל המוצרים</button></div>}
      </div>
    </div>
  );
}
