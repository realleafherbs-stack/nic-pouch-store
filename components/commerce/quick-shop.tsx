"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Plus, SlidersHorizontal } from "lucide-react";
import type { Product, StrengthLevel } from "@/lib/catalog/model";
import { linePrice, PURCHASE_QUANTITIES, type PurchaseQuantity, unitPriceForQuantity } from "@/lib/catalog/pricing";
import { useCart } from "@/components/commerce/cart-provider";

type FinderMode = "popular" | "flavor" | "strength" | "brand";

const modes: { id: FinderMode; label: string }[] = [
  { id: "popular", label: "נמכרים" },
  { id: "flavor", label: "לפי טעם" },
  { id: "strength", label: "לפי עוצמה" },
  { id: "brand", label: "לפי מותג" },
];

const strengthLabels: Record<StrengthLevel, string> = {
  mild: "עדין",
  medium: "בינוני",
  strong: "חזק",
  "extra-strong": "חזק מאוד",
};

const flavorFilters = [
  { id: "mint", label: "מנטה", terms: ["מנט", "mint", "spearmint"] },
  { id: "ice", label: "אייס", terms: ["אייס", "ice", "קפוא"] },
  { id: "fruit", label: "פירות", terms: ["פטל", "מנגו", "אבטיח", "ענב", "לימון", "דובדבן", "berry", "grape", "mango", "lemon"] },
];

export function QuickShop({ products }: { products: Product[] }) {
  const [mode, setMode] = useState<FinderMode>("popular");
  const [filter, setFilter] = useState("");

  const choices = useMemo(() => {
    if (mode === "brand") return [...new Set(products.map((product) => product.brand))].slice(0, 5).map((brand) => ({ id: brand, label: brand }));
    if (mode === "strength") return (Object.entries(strengthLabels) as [StrengthLevel, string][]).map(([id, label]) => ({ id, label }));
    if (mode === "flavor") return flavorFilters.map(({ id, label }) => ({ id, label }));
    return [];
  }, [mode, products]);

  const filteredProducts = useMemo(() => {
    const singleUnits = products.filter((product) => product.active && product.packSize === 1);
    let result = singleUnits;
    if (mode === "brand" && filter) result = singleUnits.filter((product) => product.brand === filter);
    if (mode === "strength" && filter) result = singleUnits.filter((product) => product.strengthLevel === filter);
    if (mode === "flavor" && filter) {
      const selected = flavorFilters.find((item) => item.id === filter);
      result = singleUnits.filter((product) => selected?.terms.some((term) => `${product.flavor} ${product.name}`.toLowerCase().includes(term)));
    }
    if (mode === "popular") {
      const nois = singleUnits.filter((product) => product.brand === "NOIS");
      const others = singleUnits.filter((product) => product.brand !== "NOIS");
      result = [...new Map(
        [nois[0], others[0], others[8], nois[1], ...others]
          .filter((product): product is Product => Boolean(product))
          .map((product) => [product.id, product]),
      ).values()];
    }
    return result;
  }, [filter, mode, products]);
  const matches = filteredProducts.slice(0, 3);

  const allProductsHref = useMemo(() => {
    const params = new URLSearchParams();
    if (mode === "brand" && filter) params.set("brand", filter);
    if (mode === "strength" && filter) params.set("strength", filter);
    if (mode === "flavor" && filter) params.set("flavor", filter);
    const query = params.toString();
    return query ? `/shop?${query}` : "/shop";
  }, [filter, mode]);

  function changeMode(nextMode: FinderMode) {
    setMode(nextMode);
    setFilter("");
  }

  return (
    <section className="quick-shop-section" aria-labelledby="quick-shop-title">
      <div className="container">
        <header className="quick-shop-heading">
          <div>
            <p className="eyebrow">קנייה בלי להסתבך</p>
            <h2 id="quick-shop-title">מה מתאים לך עכשיו?</h2>
          </div>
          <p>בחרו דרך אחת לסנן. אנחנו נציג מיד שלוש התאמות שאפשר להוסיף לעגלה.</p>
        </header>

        <div className="quick-shop-panel">
          <nav className="quick-shop-tabs" aria-label="איך תרצו לבחור מוצר">
            {modes.map((item) => (
              <button key={item.id} className={mode === item.id ? "active" : ""} onClick={() => changeMode(item.id)} aria-pressed={mode === item.id}>
                {item.label}
              </button>
            ))}
          </nav>

          {choices.length > 0 && (
            <div className="quick-shop-filters" aria-label="אפשרויות סינון">
              <SlidersHorizontal aria-hidden="true" />
              {choices.map((choice) => (
                <button key={choice.id} className={filter === choice.id ? "active" : ""} onClick={() => setFilter(choice.id)} aria-pressed={filter === choice.id}>
                  {choice.label}
                </button>
              ))}
            </div>
          )}

          <div className="quick-shop-results" aria-live="polite">
            {matches.map((product, index) => <QuickProduct key={product.id} product={product} index={index + 1} />)}
          </div>

          <Link className="quick-shop-all" href={allProductsHref}>
            לכל {filteredProducts.length} המוצרים{filter ? " בסינון הזה" : ""} <ArrowLeft aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function QuickProduct({ product, index }: { product: Product; index: number }) {
  const [quantity, setQuantity] = useState<PurchaseQuantity>(1);
  const [added, setAdded] = useState(false);
  const { dispatch } = useCart();

  function add() {
    if (product.stock <= 0) return;
    dispatch({ type: "add", product, quantity });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="quick-product">
      <span className="quick-product-number">0{index}</span>
      <a className="quick-product-image" href={`/shop/${product.slug}`}>
        {product.images[0] && <img src={product.images[0]} alt={product.name} loading="lazy" />}
      </a>
      <div className="quick-product-copy">
        <p>{product.brand}</p>
        <h3><a href={`/shop/${product.slug}`}>{product.flavor || product.name}</a></h3>
        <span>{product.strengthLevel ? strengthLabels[product.strengthLevel] : "עוצמה לא צוינה"}{product.nicotineMg ? ` · ${product.nicotineMg} מ״ג` : ""}</span>
      </div>
      <div className="quick-product-buy">
        <div className="quick-quantity" aria-label="כמות">
          {PURCHASE_QUANTITIES.map((amount) => (
            <button key={amount} onClick={() => setQuantity(amount)} className={quantity === amount ? "active" : ""} aria-pressed={quantity === amount}>
              {amount}
            </button>
          ))}
        </div>
        <div className="quick-price"><strong>{linePrice(product, quantity).toFixed(2)} ₪</strong><small>{unitPriceForQuantity(product, quantity).toFixed(2)} ₪ ליח׳</small></div>
        <button disabled={product.stock <= 0} className={added ? "quick-add added" : "quick-add"} onClick={add}>
          {product.stock <= 0 ? null : added ? <Check /> : <Plus />}<span>{product.stock <= 0 ? "אזל מהמלאי" : added ? "נוסף לעגלה" : "הוספה"}</span>
        </button>
      </div>
    </article>
  );
}
