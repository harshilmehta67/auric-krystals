"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "./CartProvider";

interface ProductCardProps {
  product: Product;
  variant?: "carousel" | "grid";
}

export default function ProductCard({ product, variant = "carousel" }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (justAdded) return;
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  const cardClass =
    variant === "carousel"
      ? "group flex flex-col flex-[0_0_min(100%,17.5rem)] sm:flex-[0_0_20rem] lg:flex-[0_0_21rem] bg-surface-container-lowest rounded-2xl overflow-hidden ak-card ring-1 ring-black/5 hover:ring-primary/30"
      : "group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden ak-card ring-1 ring-black/5 hover:ring-primary/30";

  return (
    <div className={`${cardClass} transition-shadow duration-300 ${justAdded ? "ring-2 ring-green-400/60 shadow-lg shadow-green-200/30" : ""}`}>
      <Link href={`/product/${product.slug}`} className="overflow-hidden aspect-[4/3]">
        <Image
          src={product.image_url}
          alt={product.title}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-headline text-lg text-primary mb-1">{product.title}</h3>
        </Link>
        <p className="text-sm text-on-surface-variant mb-4 flex-1">{product.blurb}</p>
        <div className="flex justify-between items-center gap-3">
          <span className="text-secondary font-bold">{"\u20B9"}{Number(product.price).toFixed(2)}</span>
          <div className="flex gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold hover:opacity-95 transition-opacity"
            >
              View
            </Link>
            <button
              type="button"
              onClick={handleAdd}
              className={`px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                justAdded
                  ? "bg-green-500 text-white scale-110"
                  : "bg-secondary-fixed text-on-secondary-container hover:bg-secondary-container"
              }`}
              aria-label={`Add ${product.title} to cart`}
            >
              <span
                className={`material-symbols-outlined text-base leading-none transition-transform duration-300 ${
                  justAdded ? "rotate-0" : ""
                }`}
              >
                {justAdded ? "check" : "add_shopping_cart"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
