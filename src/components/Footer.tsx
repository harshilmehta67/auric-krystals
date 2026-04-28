"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { social } from "@/lib/site-data";
import { useOpenQuiz } from "./QuizUIContext";
import { Category } from "@/types";

export default function Footer() {
  const openQuiz = useOpenQuiz();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : { categories: [] }))
      .then((data) => {
        if (cancelled) return;
        const cats: Category[] = data.categories || [];
        setCategories(cats.slice(0, 6));
      })
      .catch(() => {
        // Footer should never block — silently fall back to no category list.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="bg-stone-50 border-t border-stone-200/80 pt-14 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 px-4 sm:px-12 max-w-7xl mx-auto">
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/AURIC KRYSTALS LOGO.png"
              alt=""
              width={120}
              height={32}
              className="h-8 w-auto object-contain opacity-80"
            />
            <div className="text-base font-headline text-primary italic">
              Auric Krystals
            </div>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed max-w-xs uppercase tracking-widest">
            A celestial sanctuary for earth-born treasures &amp; cosmic wisdom.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {social.map((s) => (
              <a
                key={s.id}
                href={s.url}
                rel="noopener noreferrer"
                target="_blank"
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary-fixed/30 flex items-center justify-center text-primary transition-colors"
                aria-label={s.label}
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                  {s.icon}
                </span>
              </a>
            ))}
            <a
              href="mailto:astrokrupa16@gmail.com"
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary-fixed/30 flex items-center justify-center text-primary transition-colors"
              aria-label="Email Auric Krystals"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">mail</span>
            </a>
          </div>
        </div>

        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h5 className="font-headline font-bold text-primary text-xs tracking-widest uppercase mb-3">
              Shop
            </h5>
            <ul className="space-y-2 text-xs uppercase tracking-widest">
              <li>
                <Link
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="/shop"
                >
                  All pieces
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    className="text-on-surface-variant hover:text-secondary transition-colors"
                    href={`/shop#${c.slug}`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-headline font-bold text-primary text-xs tracking-widest uppercase mb-3">
              Guidance
            </h5>
            <ul className="space-y-2 text-xs uppercase tracking-widest">
              <li>
                {openQuiz ? (
                  <button
                    type="button"
                    onClick={openQuiz}
                    className="text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest text-xs bg-transparent border-none p-0 cursor-pointer text-left"
                  >
                    Find your crystal
                  </button>
                ) : (
                  <Link
                    className="text-on-surface-variant hover:text-secondary transition-colors"
                    href="/#quiz"
                  >
                    Find your crystal
                  </Link>
                )}
              </li>
              <li>
                <Link
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="/services"
                >
                  Kundali sittings
                </Link>
              </li>
              <li>
                <Link
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="/contact"
                >
                  Order help
                </Link>
              </li>
              <li>
                <Link
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-headline font-bold text-primary text-xs tracking-widest uppercase mb-3">
              About
            </h5>
            <ul className="space-y-2 text-xs uppercase tracking-widest">
              <li>
                <Link
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="/services"
                >
                  Meet Krupali
                </Link>
              </li>
              <li>
                <Link
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="/terms"
                >
                  Terms &amp; privacy
                </Link>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="mailto:astrokrupa16@gmail.com"
                >
                  Email us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-stone-200/60 max-w-7xl mx-auto px-4 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-on-surface-variant/80 text-[0.6rem] uppercase tracking-[0.2em]">
          © 2026 Auric Krystals · Crafted with intention
        </p>
        <p className="text-on-surface-variant/80 text-[0.6rem] uppercase tracking-[0.2em]">
          Hand-selected · Energy-cleansed · Ships from India
        </p>
      </div>
    </footer>
  );
}
