"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { Product } from "@/types";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const images = [product.image_url, product.image_url_2].filter(Boolean) as string[];

  return (
    <div className="pt-28 sm:pt-32 pb-16 sm:pb-20">
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-8 mb-8 text-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2 opacity-50">/</span>
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="text-primary font-medium">{product.title}</span>
      </nav>

      <section className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="relative group lg:sticky lg:top-36 space-y-3">
          <div
            className="absolute -inset-3 bg-gradient-to-br from-primary-fixed/35 to-secondary-fixed/15 rounded-3xl blur-2xl -z-10 opacity-80"
            aria-hidden="true"
          />
          <Image
            src={images[activeImage]}
            alt={product.title}
            width={800}
            height={800}
            className="w-full aspect-square max-h-[min(85vw,32rem)] lg:max-h-none object-cover rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-black/5 ak-card mx-auto lg:mx-0"
            priority
          />
          {images.length > 1 && (
            <div className="flex gap-3 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden ring-2 transition-all ${
                    activeImage === i ? "ring-primary" : "ring-transparent hover:ring-primary/40"
                  }`}
                >
                  <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div>
            <p className="text-secondary font-label text-xs sm:text-sm uppercase tracking-widest mb-2">
              {product.subtitle}
            </p>
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-primary mb-3 leading-tight">
              {product.title}
            </h1>
            {product.category_name && (
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
                {product.category_name}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-3xl sm:text-4xl font-bold text-primary">{"\u20B9"}{product.price.toFixed(2)}</p>
            <span className="text-sm text-on-surface-variant">
              Tax calculated at checkout
            </span>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-on-surface">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <AddToCartButton product={product} />
            <Link
              href="/shop"
              className="flex-1 inline-flex justify-center px-8 py-4 border-2 border-secondary text-secondary rounded-full font-bold hover:bg-secondary-fixed/30 transition-colors text-center"
            >
              Back to shop
            </Link>
          </div>

          <div className="space-y-8 pt-8 border-t border-outline-variant/40">
            <div>
              <h3 className="font-headline text-lg text-primary mb-3">Metaphysical notes</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li>· Divine wisdom — supports introspection and rest</li>
                <li>· Emotional ease — often chosen for bedrooms &amp; meditation</li>
                <li>· Protective aura — a favorite for sensitive spaces</li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg text-primary mb-3">Specifications</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-on-surface-variant">Origin:</span>{" "}
                  <span className="text-on-surface">Ethically sourced lots, documented chain</span>
                </li>
                <li>
                  <span className="text-on-surface-variant">Care:</span>{" "}
                  <span className="text-on-surface">
                    Dry cloth · avoid prolonged sun on color-sensitive varieties
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
