"use client";

import Image from "next/image";
import Link from "next/link";
import { offerings } from "@/lib/site-data";
import Carousel from "./Carousel";

export default function OfferingCarousel() {
  // Single-offering spotlight — a polished feature card instead of a one-item carousel.
  if (offerings.length === 1) {
    const o = offerings[0];
    return (
      <Link
        href={o.href}
        className="group block bg-surface-container-lowest rounded-3xl overflow-hidden ak-card ring-1 ring-black/5 hover:ring-primary/30 transition-all"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[22rem] bg-surface-container">
            <Image
              src={o.img}
              alt={o.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
              priority={false}
            />
          </div>
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="text-secondary text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.22em] mb-3">
              Featured service
            </p>
            <h3 className="font-headline text-2xl sm:text-3xl text-primary mb-4 italic">
              {o.title}
            </h3>
            <p className="text-on-surface-variant leading-relaxed mb-6 text-sm sm:text-base">
              {o.blurb}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
              Explore sittings
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Carousel>
      {offerings.map((o) => (
        <Link
          key={o.title}
          href={o.href}
          className="group flex flex-col flex-[0_0_min(100%,17.5rem)] sm:flex-[0_0_20rem] lg:flex-[0_0_21rem] bg-surface-container-lowest rounded-2xl overflow-hidden ak-card ring-1 ring-black/5 hover:ring-primary/30"
        >
          <div className="overflow-hidden aspect-[4/3]">
            <Image
              src={o.img}
              alt=""
              width={400}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-headline text-lg text-primary mb-2">{o.title}</h3>
            <p className="text-sm text-on-surface-variant flex-1">{o.blurb}</p>
            <span className="mt-4 text-sm font-bold text-secondary group-hover:text-primary transition-colors">
              Learn more →
            </span>
          </div>
        </Link>
      ))}
    </Carousel>
  );
}
