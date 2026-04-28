"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import {
  Product,
  QUIZ_RESULT_KEYS,
  QUIZ_RESULT_LABELS,
  QuizResultKey,
} from "@/types";

type Mappings = Record<QuizResultKey, string[]>;

const emptyMappings: Mappings = { A: [], B: [], C: [], D: [] };

export default function AdminQuizMappingsPage() {
  const { token } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [mappings, setMappings] = useState<Mappings>(emptyMappings);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<QuizResultKey | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [mapRes, prodRes] = await Promise.all([
        fetch("/api/admin/quiz-mappings", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (mapRes.ok) {
        const d: { mappings: Mappings } = await mapRes.json();
        setMappings({
          A: d.mappings?.A || [],
          B: d.mappings?.B || [],
          C: d.mappings?.C || [],
          D: d.mappings?.D || [],
        });
      }
      if (prodRes.ok) {
        const d: { products: Product[] } = await prodRes.json();
        setProducts(d.products || []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const productMap = useMemo(() => {
    const m = new Map<string, Product>();
    for (const p of products) m.set(p.id, p);
    return m;
  }, [products]);

  function addProduct(key: QuizResultKey, productId: string) {
    setMappings((prev) => {
      if (prev[key].includes(productId)) return prev;
      return { ...prev, [key]: [...prev[key], productId] };
    });
  }
  function removeProduct(key: QuizResultKey, productId: string) {
    setMappings((prev) => ({
      ...prev,
      [key]: prev[key].filter((id) => id !== productId),
    }));
  }
  function moveProduct(key: QuizResultKey, idx: number, dir: -1 | 1) {
    setMappings((prev) => {
      const arr = [...prev[key]];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...prev, [key]: arr };
    });
  }

  async function saveMapping(key: QuizResultKey) {
    setSavingKey(key);
    setError("");
    try {
      const res = await fetch("/api/admin/quiz-mappings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ result_key: key, product_ids: mappings[key] }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      setToast(`Saved ${QUIZ_RESULT_LABELS[key].split(" — ")[0]}`);
      setTimeout(() => setToast(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="relative">
      <h1 className="text-2xl font-headline text-primary mb-2">
        Quiz Mappings
      </h1>
      <p className="text-sm text-on-surface-variant mb-6 max-w-2xl">
        Pick the products customers will see when they get each quiz result.
        The &ldquo;Shop your match&rdquo; CTA on the result screen will surface
        these.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {QUIZ_RESULT_KEYS.map((key) => (
            <MappingCard
              key={key}
              resultKey={key}
              productIds={mappings[key]}
              allProducts={products}
              productMap={productMap}
              onAdd={(id) => addProduct(key, id)}
              onRemove={(id) => removeProduct(key, id)}
              onMove={(idx, dir) => moveProduct(key, idx, dir)}
              onSave={() => saveMapping(key)}
              saving={savingKey === key}
            />
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-3 bg-green-600 text-white rounded-xl shadow-lg text-sm font-semibold animate-pulse z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

interface MappingCardProps {
  resultKey: QuizResultKey;
  productIds: string[];
  allProducts: Product[];
  productMap: Map<string, Product>;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (idx: number, dir: -1 | 1) => void;
  onSave: () => void;
  saving: boolean;
}

function MappingCard({
  resultKey,
  productIds,
  allProducts,
  productMap,
  onAdd,
  onRemove,
  onMove,
  onSave,
  saving,
}: MappingCardProps) {
  const [search, setSearch] = useState("");

  const available = useMemo(() => {
    const selected = new Set(productIds);
    const term = search.trim().toLowerCase();
    return allProducts.filter(
      (p) =>
        !selected.has(p.id) &&
        (term === "" || p.title.toLowerCase().includes(term))
    );
  }, [allProducts, productIds, search]);

  return (
    <div className="bg-white rounded-xl p-5 ring-1 ring-black/5 space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-headline text-lg text-primary leading-tight">
          {QUIZ_RESULT_LABELS[resultKey]}
        </h2>
        <span className="text-xs font-mono text-on-surface-variant">
          {resultKey}
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
          Selected ({productIds.length})
        </p>
        {productIds.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">
            No products mapped yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {productIds.map((id, idx) => {
              const p = productMap.get(id);
              return (
                <div
                  key={id}
                  className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 bg-primary-fixed/40 rounded-full text-xs"
                >
                  {p?.image_url ? (
                    <Image
                      src={p.image_url}
                      alt=""
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-surface-container" />
                  )}
                  <span className="text-on-surface font-medium max-w-[10rem] truncate">
                    {p?.title || `(missing) ${id.slice(0, 6)}`}
                  </span>
                  <button
                    onClick={() => onMove(idx, -1)}
                    disabled={idx === 0}
                    className="text-on-surface-variant disabled:opacity-30 hover:text-primary"
                    aria-label="Move up"
                  >
                    <span className="material-symbols-outlined text-sm">
                      arrow_upward
                    </span>
                  </button>
                  <button
                    onClick={() => onMove(idx, 1)}
                    disabled={idx === productIds.length - 1}
                    className="text-on-surface-variant disabled:opacity-30 hover:text-primary"
                    aria-label="Move down"
                  >
                    <span className="material-symbols-outlined text-sm">
                      arrow_downward
                    </span>
                  </button>
                  <button
                    onClick={() => onRemove(id)}
                    className="text-red-500 hover:text-red-600"
                    aria-label="Remove"
                  >
                    <span className="material-symbols-outlined text-sm">
                      close
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm"
        />
      </div>

      <div className="max-h-56 overflow-y-auto -mx-1 px-1">
        {available.length === 0 ? (
          <p className="text-xs text-on-surface-variant italic py-3 text-center">
            {search ? "No matches" : "All products are already mapped."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {available.map((p) => (
              <button
                key={p.id}
                onClick={() => onAdd(p.id)}
                className="flex items-center gap-2 px-2 py-1.5 bg-surface-container-low hover:bg-primary-fixed/30 rounded-lg text-left transition-colors"
              >
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded object-cover shrink-0"
                  />
                ) : (
                  <span className="w-8 h-8 rounded bg-surface-container shrink-0" />
                )}
                <span className="text-xs text-on-surface truncate">
                  {p.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="w-full px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-95 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save mapping"}
      </button>
    </div>
  );
}
