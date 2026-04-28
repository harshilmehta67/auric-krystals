"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, Category, ServicesSettings } from "@/types";
import { SERVICES_DEFAULTS } from "@/lib/services-defaults";

interface CategoryTile {
  slug: string;
  name: string;
  blurb: string;
  images: string[];
}

// Cross-fade interval + the stagger between tiles so they don't all flip at once.
const ROTATE_MS = 4500;
const STAGGER_MS = 900;

export default function CategoryAttractions() {
  const [tiles, setTiles] = useState<CategoryTile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const products: Product[] = data.products || [];
        const categories: Category[] = data.categories || [];

        const byCat = new Map<string, { cat: Category; imgs: string[] }>();
        for (const c of categories) {
          byCat.set(c.id, { cat: c, imgs: [] });
        }
        for (const p of products) {
          if (!p.category_id) continue;
          const bucket = byCat.get(p.category_id);
          if (!bucket) continue;
          if (p.image_url) bucket.imgs.push(p.image_url);
          if (p.image_url_2) bucket.imgs.push(p.image_url_2);
        }

        const built: CategoryTile[] = categories
          .map((c) => byCat.get(c.id))
          .filter((b): b is { cat: Category; imgs: string[] } => !!b && b.imgs.length > 0)
          .map(({ cat, imgs }) => ({
            slug: cat.slug,
            name: cat.name,
            blurb: cat.description || "Hand-selected pieces",
            images: imgs,
          }));

        setTiles(built);
      } catch (err) {
        console.error("CategoryAttractions fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const skeletonCount = 3;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(skeletonCount)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl min-h-[14rem] bg-surface-container animate-pulse ring-1 ring-black/5"
          />
        ))}
        <ServicesTile />
      </div>
    );
  }

  if (tiles.length === 0) {
    // No categories have products yet — just surface Services on its own.
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-xl">
        <ServicesTile />
      </div>
    );
  }

  // Make the first tile wide on larger screens for a richer editorial rhythm.
  const firstClass = "sm:col-span-2";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {tiles.map((tile, idx) => (
        <CategoryTileCard
          key={tile.slug}
          tile={tile}
          delay={idx * STAGGER_MS}
          wide={idx === 0}
          className={idx === 0 ? firstClass : undefined}
        />
      ))}
      <ServicesTile className={tiles.length % 2 === 1 ? "sm:col-span-2 lg:col-span-1" : undefined} />
    </div>
  );
}

interface CategoryTileCardProps {
  tile: CategoryTile;
  delay: number;
  wide?: boolean;
  className?: string;
}

function CategoryTileCard({ tile, delay, wide, className }: CategoryTileCardProps) {
  const [active, setActive] = useState(0);
  const hasMultiple = tile.images.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      setActive((i) => (i + 1) % tile.images.length);
      intervalId = setInterval(() => {
        setActive((i) => (i + 1) % tile.images.length);
      }, ROTATE_MS);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [delay, hasMultiple, tile.images.length]);

  const minH = wide ? "min-h-[14rem] sm:min-h-[18rem]" : "min-h-[14rem]";

  return (
    <Link
      href={`/shop#${tile.slug}`}
      className={`group relative rounded-2xl overflow-hidden bg-surface-container ${minH} ak-card ring-1 ring-black/5 ${
        className ?? ""
      }`}
      aria-label={`Browse ${tile.name}`}
    >
      {/* Stacked cross-fade images */}
      <div className="absolute inset-0">
        {tile.images.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt=""
            fill
            sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
            className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            } ${i === 0 ? "group-hover:scale-[1.03] transition-transform duration-300" : ""}`}
            priority={false}
          />
        ))}
      </div>

      {/* Soft gradient overlay — lighter so product imagery underneath stays cinematic, not muddy. */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent pointer-events-none" />

      {/* Image-count pip row (only if >1 image) */}
      {hasMultiple && (
        <div className="absolute top-3 right-3 flex gap-1">
          {tile.images.map((_, i) => (
            <span
              key={i}
              className={`block h-1 rounded-full transition-all duration-500 ${
                i === active ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
        <h3 className="font-headline text-xl sm:text-2xl text-white mb-1">
          {tile.name}
        </h3>
        {tile.blurb && (
          <p className="text-white/85 text-xs sm:text-sm line-clamp-2">
            {tile.blurb}
          </p>
        )}
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/95 group-hover:gap-2.5 transition-all">
          Browse collection
          <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}

function ServicesTile({ className }: { className?: string }) {
  // Initial render uses the bundled defaults so SSR is already on-message
  // (cosmic image + four-discipline eyebrow). On mount we hydrate with the
  // live admin-edited values from /api/services, so any change in
  // /admin/services flows through here too within the home-page revalidate
  // window (~60s).
  const [image, setImage] = useState<string>(SERVICES_DEFAULTS.hero_image_url);
  const [blurb, setBlurb] = useState<string>(SERVICES_DEFAULTS.hero_eyebrow);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/services")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { services: ServicesSettings } | null) => {
        if (cancelled || !d?.services) return;
        if (d.services.hero_image_url) setImage(d.services.hero_image_url);
        if (d.services.hero_eyebrow) setBlurb(d.services.hero_eyebrow);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link
      href="/services"
      className={`group relative rounded-2xl overflow-hidden bg-surface-container min-h-[14rem] ak-card ring-1 ring-black/5 ${
        className ?? ""
      }`}
      aria-label="Browse Services"
    >
      <Image
        alt=""
        className="w-full h-full object-cover min-h-[14rem] group-hover:scale-[1.03] transition-transform duration-300"
        src={image}
        width={800}
        height={800}
        sizes="(min-width: 1024px) 25vw, 50vw"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
        <h3 className="font-headline text-xl sm:text-2xl text-white mb-1">Services</h3>
        <p className="text-white/85 text-xs sm:text-sm line-clamp-2">{blurb}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/95 group-hover:gap-2.5 transition-all">
          Explore sittings
          <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}
