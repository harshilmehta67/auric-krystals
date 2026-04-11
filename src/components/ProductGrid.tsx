"use client";

import { products } from "@/lib/site-data";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} variant="grid" />
      ))}
    </div>
  );
}
