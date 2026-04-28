"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { Product, Category, INTENT_TAGS, IntentTag, QUIZ_RESULT_LABELS, QuizResultKey } from "@/types";

const UNCATEGORIZED_SLUG = "other";

type SortMode = "default" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "default", label: "Curated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest first" },
];

function applySort(items: Product[], mode: SortMode): Product[] {
  const arr = [...items];
  switch (mode) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "newest":
      return arr.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    case "default":
    default:
      return arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }
}

export default function ProductGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedSlugs, setMatchedSlugs] = useState<string[] | null>(null);
  const hasScrolledToHash = useRef(false);

  const matchKey = (searchParams.get("match") || "").toUpperCase() as QuizResultKey | "";
  const validMatch = matchKey === "A" || matchKey === "B" || matchKey === "C" || matchKey === "D";

  const tagParam = searchParams.get("tag");
  const activeTags = useMemo(
    () => (tagParam ? tagParam.split(",").filter(Boolean) : []) as IntentTag[],
    [tagParam]
  );
  const sort = (searchParams.get("sort") as SortMode) || "default";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(
          (data.products || []).map((p: Product) => ({
            ...p,
            price: Number(p.price) || 0,
            tags: p.tags || [],
          }))
        );
        setCategories(data.categories || []);
      } catch (err) {
        console.error("ProductGrid fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Quiz-match mode: fetch the curated product list for the result key.
  useEffect(() => {
    if (!validMatch) {
      setMatchedSlugs(null);
      return;
    }
    fetch(`/api/quiz-mappings/${matchKey}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const slugs: string[] = (d?.products || []).map((p: Product) => p.slug);
        setMatchedSlugs(slugs);
      })
      .catch(() => setMatchedSlugs([]));
  }, [matchKey, validMatch]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    // Keep canonical INTENT_TAGS order; append any custom tags after.
    const ordered = [...INTENT_TAGS].filter((t) => set.has(t));
    const extras = [...set].filter((t) => !INTENT_TAGS.includes(t as IntentTag)).sort();
    return [...ordered, ...extras];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (validMatch && matchedSlugs) {
      const slugSet = new Set(matchedSlugs);
      list = list.filter((p) => slugSet.has(p.slug));
    }
    if (activeTags.length > 0) {
      list = list.filter((p) => activeTags.every((t) => p.tags?.includes(t)));
    }
    return applySort(list, sort);
  }, [products, validMatch, matchedSlugs, activeTags, sort]);

  const inFilterMode = activeTags.length > 0 || validMatch;

  const sections = useMemo(() => {
    if (inFilterMode) return [];
    if (categories.length === 0 && products.length === 0) return [];

    const byCategory = new Map<
      string,
      { slug: string; name: string; products: Product[] }
    >();

    for (const c of categories) {
      byCategory.set(c.id, { slug: c.slug, name: c.name, products: [] });
    }

    const orphans: Product[] = [];
    for (const p of products) {
      const bucket = p.category_id ? byCategory.get(p.category_id) : null;
      if (bucket) bucket.products.push(p);
      else orphans.push(p);
    }

    const ordered = categories
      .map((c) => byCategory.get(c.id)!)
      .filter((b) => b.products.length > 0)
      .map((b) => ({ ...b, products: applySort(b.products, sort) }));

    if (orphans.length > 0) {
      ordered.push({
        slug: UNCATEGORIZED_SLUG,
        name: "Other",
        products: applySort(orphans, sort),
      });
    }

    return ordered;
  }, [products, categories, inFilterMode, sort]);

  // Honour any #slug hash by scrolling its section into view (browse mode only).
  useEffect(() => {
    if (loading || hasScrolledToHash.current) return;
    if (typeof window === "undefined") return;
    if (inFilterMode) return;

    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        hasScrolledToHash.current = true;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [loading, sections, inFilterMode]);

  const updateUrl = useCallback(
    (next: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(next)) {
        if (v === null || v === "") params.delete(k);
        else params.set(k, v);
      }
      const qs = params.toString();
      router.replace(qs ? `/shop?${qs}` : `/shop`, { scroll: false });
    },
    [router, searchParams]
  );

  function toggleTag(tag: string) {
    const next = activeTags.includes(tag as IntentTag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag as IntentTag];
    updateUrl({ tag: next.length ? next.join(",") : null });
  }

  function clearAll() {
    updateUrl({ tag: null, match: null });
  }

  if (loading) {
    return (
      <div className="space-y-10">
        {[...Array(2)].map((_, s) => (
          <div key={s} className="space-y-6">
            <div className="h-6 w-40 bg-surface-container rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-2xl h-80 animate-pulse ring-1 ring-black/5"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl mb-4 block">
          inventory_2
        </span>
        <p>No products available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Filter / sort bar */}
      <div className="space-y-4">
        {validMatch && (
          <div className="rounded-2xl bg-primary-fixed/40 ring-1 ring-primary/15 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-primary shrink-0 mt-0.5">
                psychology
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-secondary font-semibold">
                  Your quiz match
                </p>
                <p className="text-sm sm:text-base font-headline text-primary">
                  {QUIZ_RESULT_LABELS[matchKey as QuizResultKey]}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Hand-picked by Krupali for this energy.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateUrl({ match: null })}
              className="self-start sm:self-auto inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white/70 ring-1 ring-black/5 text-xs font-bold uppercase tracking-widest text-primary hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
              Clear match
            </button>
          </div>
        )}

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-on-surface-variant mr-1">
              Filter by intent
            </span>
            {allTags.map((tag) => {
              const active = activeTags.includes(tag as IntentTag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ring-1 ${
                    active
                      ? "bg-primary text-on-primary ring-primary"
                      : "bg-surface-container-lowest text-on-surface-variant ring-black/5 hover:ring-primary/30 hover:text-primary"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
            {(activeTags.length > 0 || validMatch) && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-1 text-xs text-on-surface-variant hover:text-primary underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-on-surface-variant">
            {inFilterMode
              ? `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"} match`
              : `${products.length} ${products.length === 1 ? "piece" : "pieces"} across ${categories.length} ${categories.length === 1 ? "category" : "categories"}`}
          </p>
          <label className="inline-flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="font-semibold uppercase tracking-widest">Sort</span>
            <select
              value={sort}
              onChange={(e) => updateUrl({ sort: e.target.value === "default" ? null : e.target.value })}
              className="px-3 py-2 rounded-lg bg-surface-container-lowest ring-1 ring-black/5 text-sm text-on-surface focus:ring-primary outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Filter mode: single combined grid */}
      {inFilterMode && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-surface-container-lowest/60 ring-1 ring-black/5">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-3 block">
                search_off
              </span>
              <p className="text-on-surface-variant mb-4">
                No pieces match those filters yet.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-widest"
              >
                See all pieces
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} variant="grid" />
              ))}
            </div>
          )}
        </>
      )}

      {/* Browse mode: grouped by category */}
      {!inFilterMode && sections.length > 0 && (
        <>
          {sections.length > 1 && (
            <nav
              aria-label="Jump to category"
              className="flex flex-wrap gap-2"
            >
              {sections.map((s) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-container-lowest text-on-surface-variant hover:bg-primary-fixed/50 hover:text-primary ring-1 ring-black/5 transition-colors"
                >
                  {s.name}
                  <span className="ml-2 text-[0.65rem] text-on-surface-variant/60">
                    {s.products.length}
                  </span>
                </a>
              ))}
            </nav>
          )}

          {sections.map((section) => (
            <section
              key={section.slug}
              id={section.slug}
              className="scroll-mt-24"
            >
              <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <p className="text-secondary text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.22em] mb-2">
                    Collection
                  </p>
                  <h2 className="font-headline text-2xl sm:text-3xl text-primary italic">
                    {section.name}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant/80 hidden sm:block">
                  {section.products.length}{" "}
                  {section.products.length === 1 ? "piece" : "pieces"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.products.map((p) => (
                  <ProductCard key={p.id} product={p} variant="grid" />
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      {/* Take-the-quiz nudge if user lands cold */}
      {!inFilterMode && (
        <div className="rounded-3xl bg-gradient-to-br from-primary-fixed/40 to-secondary-fixed/20 ring-1 ring-primary/10 p-6 sm:p-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-secondary font-semibold mb-2">
            Not sure where to start?
          </p>
          <h3 className="font-headline text-xl sm:text-2xl text-primary mb-3">
            Take the 60-second crystal quiz
          </h3>
          <p className="text-sm text-on-surface-variant mb-5 max-w-md mx-auto">
            Answer 7 quick questions and Krupali will match you to the stones aligned with your current season.
          </p>
          <Link
            href="/?quiz=1"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-widest hover:opacity-95 transition-opacity"
          >
            <span className="material-symbols-outlined text-base">psychology</span>
            Find my crystal
          </Link>
        </div>
      )}
    </div>
  );
}
