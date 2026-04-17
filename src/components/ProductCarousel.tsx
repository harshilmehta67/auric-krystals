"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Carousel from "./Carousel";
import { Product } from "@/types";

export default function ProductCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      } catch (err) {
        console.error("ProductCarousel fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-[0_0_20rem] h-80 bg-surface-container-lowest rounded-2xl animate-pulse ring-1 ring-black/5" />
        ))}
      </div>
    );
  }

  if (error || products.length === 0) return null;

  return (
    <Carousel>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} variant="carousel" />
      ))}
    </Carousel>
  );
}
