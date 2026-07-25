"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/catalog/model";
import type { ProductDetailVariant } from "@/lib/catalog/product-page-variant";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  products: Product[];
  variant: ProductDetailVariant;
}

export function RelatedProducts({ products, variant }: RelatedProductsProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scroll(direction: 1 | -1) {
    carouselRef.current?.scrollBy({
      left: direction * carouselRef.current.clientWidth * 0.78,
      behavior: "smooth",
    });
  }

  return (
    <section className="section section-alt pd-related" data-testid="related-products">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">עוד מהחנות</p>
            <h2>{variant === "balanced" ? "מוצרים נוספים מהקטלוג" : "לקוחות התעניינו גם"}</h2>
          </div>
          <div className="carousel-controls" aria-label="ניווט בין מוצרים">
            <button type="button" onClick={() => scroll(1)} aria-label="מוצרים קודמים"><ChevronRight /></button>
            <button type="button" onClick={() => scroll(-1)} aria-label="מוצרים הבאים"><ChevronLeft /></button>
          </div>
        </div>
        <div ref={carouselRef} className="product-carousel" data-testid="related-products-carousel">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
