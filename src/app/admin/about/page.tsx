"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import { AboutSettings } from "@/types";

const inputClass =
  "w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface text-sm";
const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5";

export default function AdminAboutPage() {
  const { token } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [bioShort, setBioShort] = useState("");
  const [bioLong, setBioLong] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/about", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d: { about: AboutSettings | null }) => {
        if (!mounted) return;
        if (d.about) {
          setBioShort(d.about.bio_short || "");
          setBioLong(d.about.bio_long || "");
          setInstagramUrl(d.about.instagram_url || "");
          setWhatsappLink(d.about.whatsapp_link || "");
          setWhatsappNumber(d.about.whatsapp_number || "");
          setPhotoUrl(d.about.photo_url);
          setPhotoPreview(d.about.photo_url);
        }
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [token]);

  function onPickPhoto(file: File) {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const fd = new FormData();
    fd.append("bio_short", bioShort);
    fd.append("bio_long", bioLong);
    fd.append("instagram_url", instagramUrl);
    fd.append("whatsapp_link", whatsappLink);
    fd.append("whatsapp_number", whatsappNumber);
    if (photoFile) {
      fd.append("photo", photoFile);
    } else if (photoUrl) {
      fd.append("photo_url", photoUrl);
    }

    try {
      const res = await fetch("/api/admin/about", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      const d: { about: AboutSettings } = await res.json();
      setPhotoUrl(d.about.photo_url);
      setPhotoFile(null);
      setSuccess("Saved");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-on-surface-variant">Loading...</div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-headline text-primary mb-6">About / Krupali</h1>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">Portrait</h2>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-outline-variant/40 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 hover:bg-primary-fixed/10 transition-all w-44 h-44 flex items-center justify-center shrink-0"
            >
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Krupali portrait"
                  width={176}
                  height={176}
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
              onChange={(e) => e.target.files?.[0] && onPickPhoto(e.target.files[0])}
              className="hidden"
            />
            <p className="text-xs text-on-surface-variant">
              Square format works best. Shown on the home page and the dedicated
              About section.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">Bio</h2>
          <div>
            <label className={labelClass}>Short bio (1 line, ~120 chars)</label>
            <input
              type="text"
              value={bioShort}
              onChange={(e) => setBioShort(e.target.value)}
              maxLength={120}
              className={inputClass}
              placeholder="Crystal healer & Reiki master sourcing one-of-a-kind pieces from the Himalayas."
            />
            <p className="text-[10px] text-on-surface-variant/60 mt-1">
              {bioShort.length}/120
            </p>
          </div>
          <div>
            <label className={labelClass}>Long bio</label>
            <textarea
              value={bioLong}
              onChange={(e) => setBioLong(e.target.value)}
              rows={4}
              className={inputClass + " resize-y"}
              placeholder="Krupali has been working with crystals for..."
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">Contact links</h2>
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className={inputClass}
              placeholder="https://instagram.com/aurickrystals"
            />
          </div>
          <div>
            <label className={labelClass}>WhatsApp link (group / chat)</label>
            <input
              type="url"
              value={whatsappLink}
              onChange={(e) => setWhatsappLink(e.target.value)}
              className={inputClass}
              placeholder="https://chat.whatsapp.com/..."
            />
          </div>
          <div>
            <label className={labelClass}>WhatsApp number (click-to-chat)</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className={inputClass}
              placeholder="918758848867"
            />
            <p className="text-[10px] text-on-surface-variant/60 mt-1">
              Country code + number, no symbols. Used for wa.me click-to-chat.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-95 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
