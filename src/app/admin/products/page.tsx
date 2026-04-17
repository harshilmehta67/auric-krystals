"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdmin } from "../layout";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const { token } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function toggleActive(product: Product) {
    const formData = new FormData();
    formData.append("is_active", product.is_active ? "false" : "true");
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    fetchProducts();
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  }

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-headline text-primary">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Product
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or categories..."
          className="w-full sm:w-80 px-4 py-2.5 bg-white rounded-lg border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm ring-1 ring-black/5"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-3 block">inventory_2</span>
          {search ? "No products match your search" : "No products yet"}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-4 ring-1 ring-black/5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                {product.image_url ? (
                  <Image src={product.image_url} alt="" width={56} height={56} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-on-surface truncate">{product.title}</p>
                  {!product.is_active && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">Draft</span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {product.category_name || "Uncategorized"} · {"\u20B9"}{product.price.toFixed(2)}
                </p>
              </div>

              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(product)}
                  title={product.is_active ? "Hide from store" : "Show on store"}
                  className={`p-2 rounded-lg transition-colors ${product.is_active ? "text-green-600 hover:bg-green-50" : "text-on-surface-variant hover:bg-surface-container"}`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {product.is_active ? "visibility" : "visibility_off"}
                  </span>
                </button>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </Link>
                <button
                  onClick={() => handleDelete(product)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
