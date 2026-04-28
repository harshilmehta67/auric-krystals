"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import { Testimonial } from "@/types";

const inputClass =
  "w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface text-sm";
const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5";

interface FormState {
  name: string;
  city: string;
  quote: string;
  rating: string;
  is_featured: boolean;
  sort_order: string;
}

const emptyForm: FormState = {
  name: "",
  city: "",
  quote: "",
  rating: "",
  is_featured: true,
  sort_order: "0",
};

export default function AdminTestimonialsPage() {
  const { token } = useAdmin();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>(emptyForm);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(
    null
  );
  const editFileRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.testimonials || []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function buildFormData(state: FormState, file: File | null, existingUrl?: string | null) {
    const fd = new FormData();
    fd.append("name", state.name);
    fd.append("city", state.city);
    fd.append("quote", state.quote);
    fd.append("rating", state.rating);
    fd.append("is_featured", state.is_featured ? "true" : "false");
    fd.append("sort_order", state.sort_order || "0");
    if (file) {
      fd.append("avatar", file);
    } else if (existingUrl) {
      fd.append("avatar_url", existingUrl);
    }
    return fd;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: buildFormData(form, avatarFile),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      setForm(emptyForm);
      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(t: Testimonial) {
    setEditId(t.id);
    setEditForm({
      name: t.name,
      city: t.city || "",
      quote: t.quote,
      rating: t.rating?.toString() || "",
      is_featured: t.is_featured,
      sort_order: t.sort_order.toString(),
    });
    setEditAvatarFile(null);
    setEditAvatarPreview(t.avatar_url);
  }

  async function handleUpdate(id: string) {
    if (!editForm.name.trim() || !editForm.quote.trim()) return;
    setSaving(true);
    setError("");
    try {
      const existing = items.find((i) => i.id === id);
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: buildFormData(
          editForm,
          editAvatarFile,
          existing?.avatar_url || null
        ),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      setEditId(null);
      setEditAvatarFile(null);
      setEditAvatarPreview(null);
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(t: Testimonial) {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    try {
      await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch {
      /* ignore */
    }
  }

  function onPickAvatar(file: File) {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function onPickEditAvatar(file: File) {
    setEditAvatarFile(file);
    setEditAvatarPreview(URL.createObjectURL(file));
  }

  return (
    <div>
      <h1 className="text-2xl font-headline text-primary mb-6">Testimonials</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-xl p-5 ring-1 ring-black/5 mb-6 space-y-4"
      >
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">
          Add testimonial
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className={inputClass}
              placeholder="Priya S."
            />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={inputClass}
              placeholder="Mumbai"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Quote *</label>
          <textarea
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            required
            rows={3}
            className={inputClass + " resize-y"}
            placeholder="My rose quartz heart has shifted my whole..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Rating (1-5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className={inputClass}
              placeholder="5"
            />
          </div>
          <div>
            <label className={labelClass}>Sort order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) =>
                setForm({ ...form, sort_order: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Avatar</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-outline-variant/40 rounded-xl p-3 text-center cursor-pointer hover:border-primary/40 hover:bg-primary-fixed/10 transition-all min-h-[3rem] flex items-center justify-center gap-2"
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Preview"
                  width={48}
                  height={48}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-xl text-outline-variant">
                  cloud_upload
                </span>
              )}
              <span className="text-xs text-on-surface-variant">
                {avatarFile ? avatarFile.name : "Click to upload"}
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onPickAvatar(e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) =>
                setForm({ ...form, is_featured: e.target.checked })
              }
              className="h-4 w-4 rounded accent-primary"
            />
            <span className="text-sm text-on-surface">
              Featured (visible on home)
            </span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-95 disabled:opacity-50 shrink-0"
          >
            {saving ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-3 block">
            format_quote
          </span>
          No testimonials yet
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((t) => {
            const isPlaceholder = t.quote.startsWith("[PLACEHOLDER]");
            const isEditing = editId === t.id;
            return (
              <div
                key={t.id}
                className="bg-white rounded-xl p-4 ring-1 ring-black/5"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Name"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) =>
                          setEditForm({ ...editForm, city: e.target.value })
                        }
                        placeholder="City"
                        className={inputClass}
                      />
                    </div>
                    <textarea
                      value={editForm.quote}
                      onChange={(e) =>
                        setEditForm({ ...editForm, quote: e.target.value })
                      }
                      rows={3}
                      className={inputClass + " resize-y"}
                      placeholder="Quote"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={editForm.rating}
                        onChange={(e) =>
                          setEditForm({ ...editForm, rating: e.target.value })
                        }
                        placeholder="Rating"
                        className={inputClass}
                      />
                      <input
                        type="number"
                        value={editForm.sort_order}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            sort_order: e.target.value,
                          })
                        }
                        placeholder="Sort"
                        className={inputClass}
                      />
                      <div
                        onClick={() => editFileRef.current?.click()}
                        className="border-2 border-dashed border-outline-variant/40 rounded-xl p-3 text-center cursor-pointer hover:border-primary/40 hover:bg-primary-fixed/10 transition-all flex items-center justify-center gap-2"
                      >
                        {editAvatarPreview ? (
                          <Image
                            src={editAvatarPreview}
                            alt="Preview"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-xl text-outline-variant">
                            cloud_upload
                          </span>
                        )}
                        <span className="text-xs text-on-surface-variant">
                          {editAvatarFile ? editAvatarFile.name : "Replace avatar"}
                        </span>
                      </div>
                      <input
                        ref={editFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] && onPickEditAvatar(e.target.files[0])
                        }
                        className="hidden"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.is_featured}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              is_featured: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded accent-primary"
                        />
                        <span className="text-sm text-on-surface">Featured</span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(t.id)}
                          disabled={saving}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-4 py-2 bg-surface-container text-on-surface-variant rounded-lg text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container">
                      {t.avatar_url ? (
                        <Image
                          src={t.avatar_url}
                          alt=""
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-on-surface">{t.name}</p>
                        {t.city && (
                          <span className="text-xs text-on-surface-variant">
                            · {t.city}
                          </span>
                        )}
                        {t.is_featured && (
                          <span className="px-1.5 py-0.5 bg-primary-fixed/40 text-primary text-[10px] font-bold rounded uppercase">
                            Featured
                          </span>
                        )}
                        {isPlaceholder && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                            Replace before launch
                          </span>
                        )}
                        {typeof t.rating === "number" && (
                          <span className="text-xs text-amber-500">
                            {"\u2605".repeat(t.rating)}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          isPlaceholder
                            ? "italic text-on-surface-variant"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {t.quote.length > 100
                          ? t.quote.slice(0, 100) + "…"
                          : t.quote}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(t)}
                        className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-lg">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(t)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
