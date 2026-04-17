"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAdmin } from "../layout";
import { Product, Category } from "@/types";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const { token } = useAdmin();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(product?.title || "");
  const [subtitle, setSubtitle] = useState(product?.subtitle || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [blurb, setBlurb] = useState(product?.blurb || "");
  const [description, setDescription] = useState(product?.description || "");
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(product?.sort_order?.toString() || "0");

  const [preview1, setPreview1] = useState<string | null>(product?.image_url || null);
  const [preview2, setPreview2] = useState<string | null>(product?.image_url_2 || null);
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, [token]);

  function handleFile(n: 1 | 2, file: File) {
    const url = URL.createObjectURL(file);
    if (n === 1) { setFile1(file); setPreview1(url); }
    else { setFile2(file); setPreview2(url); }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("price", price);
    formData.append("blurb", blurb);
    formData.append("description", description);
    formData.append("category_id", categoryId);
    formData.append("is_active", isActive ? "true" : "false");
    formData.append("sort_order", sortOrder);

    if (file1) {
      formData.append("image", file1);
    } else if (product?.image_url) {
      formData.append("image_url", product.image_url);
    }

    if (file2) {
      formData.append("image2", file2);
    } else if (product?.image_url_2) {
      formData.append("image_url_2", product.image_url_2);
    }

    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to save");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface text-sm";

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl p-6 ring-1 ring-black/5 space-y-5">
        <h2 className="font-headline text-lg text-primary">Basic Info</h2>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} placeholder="Rose Quartz Heart" />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">Subtitle</label>
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputClass} placeholder="Polished heart — heart chakra" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">Price ({"\u20B9"}) *</label>
            <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required className={inputClass} placeholder="24.99" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
              <option value="">Uncategorized</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">Sort Order</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">Short Description (card blurb)</label>
          <input type="text" value={blurb} onChange={(e) => setBlurb(e.target.value)} className={inputClass} placeholder="Polished heart-shaped rose quartz" />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">Full Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputClass + " resize-y"} placeholder="Detailed product description..." />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
          <span className="text-sm text-on-surface">Active (visible on store)</span>
        </label>
      </div>

      <div className="bg-white rounded-xl p-6 ring-1 ring-black/5 space-y-5">
        <h2 className="font-headline text-lg text-primary">Images</h2>
        <p className="text-xs text-on-surface-variant">Upload up to 2 images. First image is the primary one shown on cards.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Image 1 */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">Primary Image</label>
            <div
              onClick={() => fileRef1.current?.click()}
              className="border-2 border-dashed border-outline-variant/40 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 hover:bg-primary-fixed/10 transition-all min-h-[10rem] flex items-center justify-center"
            >
              {preview1 ? (
                <Image src={preview1} alt="Preview" width={200} height={200} className="max-h-40 w-auto rounded-lg object-contain" />
              ) : (
                <div>
                  <span className="material-symbols-outlined text-3xl text-outline-variant mb-1 block">cloud_upload</span>
                  <p className="text-xs text-on-surface-variant">Click to upload</p>
                </div>
              )}
            </div>
            <input ref={fileRef1} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(1, e.target.files[0])} className="hidden" />
          </div>

          {/* Image 2 */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">Secondary Image (optional)</label>
            <div
              onClick={() => fileRef2.current?.click()}
              className="border-2 border-dashed border-outline-variant/40 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 hover:bg-primary-fixed/10 transition-all min-h-[10rem] flex items-center justify-center"
            >
              {preview2 ? (
                <Image src={preview2} alt="Preview" width={200} height={200} className="max-h-40 w-auto rounded-lg object-contain" />
              ) : (
                <div>
                  <span className="material-symbols-outlined text-3xl text-outline-variant mb-1 block">cloud_upload</span>
                  <p className="text-xs text-on-surface-variant">Click to upload</p>
                </div>
              )}
            </div>
            <input ref={fileRef2} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(2, e.target.files[0])} className="hidden" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-95 disabled:opacity-50"
        >
          {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-8 py-3 border-2 border-outline-variant text-on-surface-variant rounded-xl font-bold hover:bg-surface-container transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
