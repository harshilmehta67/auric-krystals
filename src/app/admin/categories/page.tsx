"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../layout";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const { token } = useAdmin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", { headers });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      setNewName("");
      setNewDesc("");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), description: editDesc.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      setEditId(null);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? Products in this category will become uncategorized.`)) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE", headers });
      fetchCategories();
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-headline text-primary mb-6">Categories</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleCreate} className="bg-white rounded-xl p-5 ring-1 ring-black/5 mb-6 space-y-3">
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Add Category</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            required
            className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-lg border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm"
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-lg border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm"
          />
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
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-3 block">category</span>
          No categories yet
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl p-4 ring-1 ring-black/5 flex items-center gap-4">
              {editId === cat.id ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/25 focus:border-primary outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Description"
                    className="flex-1 px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/25 focus:border-primary outline-none text-sm"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(cat.id)} disabled={saving} className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-bold">Save</button>
                    <button onClick={() => setEditId(null)} className="px-3 py-2 bg-surface-container text-on-surface-variant rounded-lg text-xs font-bold">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-on-surface">{cat.name}</p>
                    {cat.description && <p className="text-xs text-on-surface-variant mt-0.5">{cat.description}</p>}
                    <p className="text-[10px] text-on-surface-variant/60 mt-0.5 font-mono">/{cat.slug}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setEditId(cat.id); setEditName(cat.name); setEditDesc(cat.description || ""); }}
                      className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
