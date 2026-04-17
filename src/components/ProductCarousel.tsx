"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Carousel from "./Carousel";
import { Product } from "@/types";

export default function ProductCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch {
        /* graceful */
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

  if (products.length === 0) return null;

  return (
    <Carousel>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} variant="carousel" />
      ))}
    </Carousel>
  );
}
