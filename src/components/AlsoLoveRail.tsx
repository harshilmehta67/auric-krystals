"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

interface AlsoLoveRailProps {
  currentSlug: string;
  categoryId: string | null;
}

export default function AlsoLoveRail({ currentSlug, categoryId }: AlsoLoveRailProps) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const all: Product[] = (d?.products || []).map((p: Product) => ({
          ...p,
          price: Number(p.price) || 0,
        }));
        const sameCategory = categoryId
          ? all.filter((p) => p.category_id === categoryId && p.slug !== currentSlug)
          : [];
        const others = all.filter((p) => p.slug !== currentSlug);
        const pool = sameCategory.length >= 3 ? sameCategory : others;
        const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
        setItems(picked);
      })
      .catch(() => setItems([]));
  }, [currentSlug, categoryId]);

  if (items.length === 0) return null;

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 mt-20 sm:mt-28">
      <div className="mb-8 sm:mb-10">
        <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-2">
          You may also love
        </p>
        <h2 className="font-headline text-2xl sm:text-3xl text-primary italic">
          Carry the energy further
        </h2>
        <div className="ak-headline-accent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} variant="grid" />
        ))}
      </div>
    </section>
  );
}
