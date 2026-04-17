"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product, Category } from "@/types";

interface ProductGridProps {
  categoryFilter?: string;
}

export default function ProductGrid({ categoryFilter }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState(categoryFilter || "all");
  const [loading, setLoading] = useState(true);

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

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => {
        const cat = categories.find((c) => c.id === p.category_id);
        return cat?.slug === activeCategory;
      });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-2xl h-80 animate-pulse ring-1 ring-black/5" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-on-primary"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container ring-1 ring-black/5"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                activeCategory === cat.slug
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container ring-1 ring-black/5"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-4 block">inventory_2</span>
          <p>No products available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
