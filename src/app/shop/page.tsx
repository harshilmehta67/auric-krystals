import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Shop — Auric Krystals",
  description: "Shop ethically sourced crystals, bracelets, and specimens at Auric Krystals.",
};

export default function ShopPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-8 max-w-screen-2xl mx-auto ak-mesh min-h-screen">
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
      </header>
      <ProductGrid />
    </div>
  );
}
