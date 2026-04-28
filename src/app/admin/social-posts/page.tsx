"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import { SocialPost } from "@/types";

const inputClass =
  "w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface text-sm";
const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5";

interface FormState {
  link_url: string;
  caption: string;
  sort_order: string;
  is_active: boolean;
}

const emptyForm: FormState = {
  link_url: "",
  caption: "",
  sort_order: "0",
  is_active: true,
};

export default function AdminSocialPostsPage() {
  const { token } = useAdmin();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/social-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function onPickImage(file: File) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
  function onPickEditImage(file: File) {
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.link_url.trim() || !imageFile) {
      setError("Image and link URL are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("link_url", form.link_url);
      fd.append("caption", form.caption);
      fd.append("sort_order", form.sort_order || "0");
      fd.append("is_active", form.is_active ? "true" : "false");
      fd.append("image", imageFile);

      const res = await fetch("/api/admin/social-posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      setForm(emptyForm);
      setImageFile(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(post: SocialPost) {
    setEditId(post.id);
    setEditForm({
      link_url: post.link_url,
      caption: post.caption || "",
      sort_order: post.sort_order.toString(),
      is_active: post.is_active,
    });
    setEditImageFile(null);
    setEditImagePreview(post.image_url);
  }

  async function handleUpdate(post: SocialPost) {
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("link_url", editForm.link_url);
      fd.append("caption", editForm.caption);
      fd.append("sort_order", editForm.sort_order || "0");
      fd.append("is_active", editForm.is_active ? "true" : "false");
      if (editImageFile) {
        fd.append("image", editImageFile);
      } else {
        fd.append("image_url", post.image_url);
      }

      const res = await fetch(`/api/admin/social-posts/${post.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      setEditId(null);
      setEditImageFile(null);
      setEditImagePreview(null);
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(post: SocialPost) {
    if (!confirm("Delete this social post?")) return;
    try {
      await fetch(`/api/admin/social-posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-headline text-primary mb-6">Social Strip</h1>

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
          Add post
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-5">
          <div>
            <label className={labelClass}>Image *</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-outline-variant/40 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 hover:bg-primary-fixed/10 transition-all aspect-square flex items-center justify-center"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div>
                  <span className="material-symbols-outlined text-3xl text-outline-variant mb-1 block">
                    cloud_upload
                  </span>
                  <p className="text-xs text-on-surface-variant">Click to upload</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && onPickImage(e.target.files[0])
              }
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Link URL *</label>
              <input
                type="url"
                value={form.link_url}
                onChange={(e) =>
                  setForm({ ...form, link_url: e.target.value })
                }
                required
                className={inputClass}
                placeholder="https://instagram.com/p/..."
              />
            </div>
            <div>
              <label className={labelClass}>Caption</label>
              <input
                type="text"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                maxLength={80}
                className={inputClass}
                placeholder="Behind the scenes — moon charging"
              />
              <p className="text-[10px] text-on-surface-variant/60 mt-1">
                {form.caption.length}/80
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <label className="flex items-center gap-3 cursor-pointer mt-7">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-primary"
                />
                <span className="text-sm text-on-surface">Active</span>
              </label>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-95 disabled:opacity-50 shrink-0"
            >
              {saving ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-3 block">
            photo_library
          </span>
          No social posts yet — add 4-6 to fill the strip on the home page.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => {
            const isEditing = editId === post.id;
            return (
              <div
                key={post.id}
                className="bg-white rounded-xl p-4 ring-1 ring-black/5 space-y-3"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-surface-container">
                  <Image
                    src={isEditing && editImagePreview ? editImagePreview : post.image_url}
                    alt={post.caption || ""}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={editForm.link_url}
                      onChange={(e) =>
                        setEditForm({ ...editForm, link_url: e.target.value })
                      }
                      placeholder="Link URL"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={editForm.caption}
                      onChange={(e) =>
                        setEditForm({ ...editForm, caption: e.target.value })
                      }
                      maxLength={80}
                      placeholder="Caption"
                      className={inputClass}
                    />
                    <div className="grid grid-cols-2 gap-2">
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
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.is_active}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              is_active: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded accent-primary"
                        />
                        <span className="text-xs text-on-surface">Active</span>
                      </label>
                    </div>
                    <button
                      onClick={() => editFileRef.current?.click()}
                      type="button"
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Replace image
                    </button>
                    <input
                      ref={editFileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        onPickEditImage(e.target.files[0])
                      }
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(post)}
                        disabled={saving}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="flex-1 px-3 py-2 bg-surface-container text-on-surface-variant rounded-lg text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      {post.caption && (
                        <p className="text-sm text-on-surface line-clamp-2">
                          {post.caption}
                        </p>
                      )}
                      <p className="text-xs text-on-surface-variant truncate">
                        <span className="material-symbols-outlined text-xs align-middle mr-1">
                          link
                        </span>
                        {post.link_url}
                      </p>
                      <div className="flex items-center gap-2">
                        {!post.is_active && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                            Hidden
                          </span>
                        )}
                        <span className="text-[10px] text-on-surface-variant">
                          Sort: {post.sort_order}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(post)}
                        className="flex-1 p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className="flex-1 p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
