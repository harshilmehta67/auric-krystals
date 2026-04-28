"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../layout";
import { TrustBarItem } from "@/types";

const inputClass =
  "w-full px-4 py-2.5 bg-surface-container-low rounded-lg border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm";
const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5";

interface DraftItem {
  id?: string;
  icon_name: string;
  title: string;
  subtitle: string;
  is_active: boolean;
}

const MAX_ITEMS = 4;

const blankItem = (): DraftItem => ({
  icon_name: "verified",
  title: "",
  subtitle: "",
  is_active: true,
});

export default function AdminTrustBarPage() {
  const { token } = useAdmin();
  const [items, setItems] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/trust-bar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: { items: TrustBarItem[] } = await res.json();
        setItems(
          (data.items || []).map((i) => ({
            id: i.id,
            icon_name: i.icon_name,
            title: i.title,
            subtitle: i.subtitle,
            is_active: i.is_active,
          }))
        );
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

  function updateItem(idx: number, patch: Partial<DraftItem>) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function addItem() {
    if (items.length >= MAX_ITEMS) return;
    setItems((prev) => [...prev, blankItem()]);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        items: items.map((it, idx) => ({
          id: it.id,
          icon_name: it.icon_name.trim() || "verified",
          title: it.title.trim(),
          subtitle: it.subtitle.trim(),
          sort_order: idx,
          is_active: it.is_active,
        })),
      };
      const res = await fetch("/api/admin/trust-bar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      setSuccess("Saved");
      setTimeout(() => setSuccess(""), 2000);
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-headline text-primary mb-2">Trust Bar</h1>
      <p className="text-sm text-on-surface-variant mb-6">
        Three short reassurance points shown above the fold. Use any{" "}
        <span className="font-mono">Material Symbols</span> icon name —
        browse them at{" "}
        <span className="font-mono text-primary">
          https://fonts.google.com/icons
        </span>
        .
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading...</div>
      ) : (
        <div className="space-y-3">
          {items.map((it, idx) => (
            <div
              key={it.id ?? `new-${idx}`}
              className="bg-white rounded-xl p-5 ring-1 ring-black/5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                  Row {idx + 1}
                </span>
                <button
                  onClick={() => removeItem(idx)}
                  className="text-xs text-red-500 hover:text-red-600 font-semibold"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-start">
                <div className="flex flex-col items-center gap-2 sm:w-32">
                  <label className={labelClass}>Icon</label>
                  <input
                    type="text"
                    value={it.icon_name}
                    onChange={(e) =>
                      updateItem(idx, { icon_name: e.target.value })
                    }
                    placeholder="verified"
                    className={inputClass + " text-center font-mono"}
                  />
                  <div className="w-12 h-12 rounded-lg bg-primary-fixed/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-primary">
                      {it.icon_name || "help"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      value={it.title}
                      onChange={(e) =>
                        updateItem(idx, { title: e.target.value })
                      }
                      placeholder="Energetically cleansed"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subtitle</label>
                    <input
                      type="text"
                      value={it.subtitle}
                      onChange={(e) =>
                        updateItem(idx, { subtitle: e.target.value })
                      }
                      placeholder="Smudged & moon-charged before dispatch"
                      className={inputClass}
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={it.is_active}
                      onChange={(e) =>
                        updateItem(idx, { is_active: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-primary"
                    />
                    <span className="text-sm text-on-surface">
                      Active (shown on site)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={addItem}
              disabled={items.length >= MAX_ITEMS}
              className="px-4 py-2.5 border-2 border-outline-variant text-on-surface-variant rounded-lg text-sm font-bold hover:bg-surface-container disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base align-middle mr-1">
                add
              </span>
              Add row
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-95 disabled:opacity-50 shrink-0"
            >
              {saving ? "Saving..." : "Save all"}
            </button>
            <span className="text-xs text-on-surface-variant ml-auto">
              {items.length}/{MAX_ITEMS} rows
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
