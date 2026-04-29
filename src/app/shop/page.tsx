import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Shop — Auric Krystals",
  description: "Shop ethically sourced crystals, bracelets, and specimens at Auric Krystals.",
};

export default function ShopPage() {
  return (
    <div className="pt-32 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 max-w-screen-2xl mx-auto ak-mesh min-h-screen">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant/85"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="opacity-60">
            /
          </li>
          <li>
            <span className="text-primary" aria-current="page">
              Shop
            </span>
          </li>
        </ol>
      </nav>
      <header className="mb-10 sm:mb-14 max-w-3xl">
        <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-3">
          Collection
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-semibold text-primary mb-4 leading-tight">
          Crystal Treasures &amp; Mystical Bracelets
        </h1>
        <div className="ak-headline-accent" />
        <p className="text-on-surface-variant mt-6 text-base sm:text-lg leading-relaxed">
          Ethically sourced minerals and healing bracelets — each piece is hand-selected and ready to
          ship.
        </p>
        <div className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-secondary/15 ring-1 ring-secondary/40 px-4 py-2 text-xs sm:text-sm font-semibold text-primary">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-base text-secondary"
          >
            local_shipping
          </span>
          Free delivery on orders above ₹2,500
        </div>
      </header>
      <Suspense fallback={null}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
