"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import { Product, Category } from "@/types";

const UNCATEGORIZED_SLUG = "other";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const hasScrolledToHash = useRef(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(
          (data.products || []).map((p: Product) => ({
            ...p,
            price: Number(p.price) || 0,
          }))
        );
        setCategories(data.categories || []);
      } catch (err) {
        console.error("ProductGrid fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Group products by category slug; include an "other" bucket for products without a category.
  const sections = useMemo(() => {
    if (categories.length === 0 && products.length === 0) return [];

    const byCategory = new Map<
      string,
      { slug: string; name: string; products: Product[] }
    >();

    for (const c of categories) {
      byCategory.set(c.id, { slug: c.slug, name: c.name, products: [] });
    }

    const orphans: Product[] = [];
    for (const p of products) {
      const bucket = p.category_id ? byCategory.get(p.category_id) : null;
      if (bucket) bucket.products.push(p);
      else orphans.push(p);
    }

    const ordered = categories
      .map((c) => byCategory.get(c.id)!)
      .filter((b) => b.products.length > 0);

    if (orphans.length > 0) {
      ordered.push({ slug: UNCATEGORIZED_SLUG, name: "Other", products: orphans });
    }

    return ordered;
  }, [products, categories]);

  // After products load, honour any #slug hash by scrolling its section into view.
  useEffect(() => {
    if (loading || hasScrolledToHash.current) return;
    if (typeof window === "undefined") return;

    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    // Wait one paint so the section DOM is committed before scrolling.
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        hasScrolledToHash.current = true;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [loading, sections]);

  if (loading) {
    return (
      <div className="space-y-10">
        {[...Array(2)].map((_, s) => (
          <div key={s} className="space-y-6">
            <div className="h-6 w-40 bg-surface-container rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-2xl h-80 animate-pulse ring-1 ring-black/5"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-16 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl mb-4 block">
          inventory_2
        </span>
        <p>No products available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Quick-jump nav — sticks to category anchors */}
      {sections.length > 1 && (
        <nav
          aria-label="Jump to category"
          className="flex flex-wrap gap-2 -mt-4"
        >
          {sections.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-container-lowest text-on-surface-variant hover:bg-primary-fixed/50 hover:text-primary ring-1 ring-black/5 transition-colors"
            >
              {s.name}
              <span className="ml-2 text-[0.65rem] text-on-surface-variant/60">
                {s.products.length}
              </span>
            </a>
          ))}
        </nav>
      )}

      {sections.map((section) => (
        <section
          key={section.slug}
          id={section.slug}
          className="scroll-mt-24"
        >
          <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-secondary text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.22em] mb-2">
                Collection
              </p>
              <h2 className="font-headline text-2xl sm:text-3xl text-primary italic">
                {section.name}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant/80 hidden sm:block">
              {section.products.length}{" "}
              {section.products.length === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.products.map((p) => (
              <ProductCard key={p.id} product={p} variant="grid" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
