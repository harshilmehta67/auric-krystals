"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Testimonial } from "@/types";

const ROTATE_MS = 7000;

export default function TestimonialsCarousel() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.testimonials?.length) setItems(d.testimonials);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  const t = items[active];

  return (
    <section className="py-16 sm:py-24 bg-surface-container-lowest">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
        <p className="text-secondary font-label text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold mb-3">
          Kind words from the circle
        </p>
        <h2 className="font-headline text-2xl sm:text-3xl text-primary mb-2">
          What people are saying
        </h2>
        <div className="ak-headline-accent mx-auto mb-10" />

        <figure key={t.id} className="ak-animate-in">
          {t.rating && (
            <div
              className="flex justify-center gap-0.5 mb-5"
              aria-label={`${t.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`material-symbols-outlined text-lg ${
                    i < (t.rating || 0)
                      ? "text-amber-500"
                      : "text-outline-variant/40"
                  }`}
                  aria-hidden="true"
                  style={{
                    fontVariationSettings: i < (t.rating || 0) ? "'FILL' 1" : undefined,
                  }}
                >
                  star
                </span>
              ))}
            </div>
          )}
          <blockquote className="text-lg sm:text-xl text-on-surface leading-relaxed italic">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center gap-3">
            {t.avatar_url ? (
              <Image
                src={t.avatar_url}
                alt={t.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-black/10"
              />
            ) : (
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-full bg-primary-fixed/40 text-primary flex items-center justify-center font-headline italic"
              >
                {t.name.charAt(0)}
              </span>
            )}
            <div className="text-left">
              <p className="text-sm font-semibold text-on-surface">{t.name}</p>
              {t.city && (
                <p className="text-xs text-on-surface-variant">{t.city}</p>
              )}
            </div>
          </figcaption>
        </figure>

        {items.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-8 bg-primary" : "w-2 bg-outline-variant/40 hover:bg-outline-variant/70"
                }`}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
