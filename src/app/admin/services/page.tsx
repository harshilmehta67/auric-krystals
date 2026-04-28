"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import { SERVICES_DEFAULTS } from "@/lib/services-defaults";
import type {
  ServicesPillar,
  ServicesSettings,
  ServicesStep,
  ServicesTier,
} from "@/types";

const inputClass =
  "w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface text-sm";
const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-primary mb-1.5";

// Number of pillars/tiers/steps is fixed by design. We never grow or shrink
// these arrays in the UI — admin edits only.
const PILLAR_COUNT = SERVICES_DEFAULTS.pillars.length;
const TIER_COUNT = SERVICES_DEFAULTS.tiers.length;
const STEP_COUNT = SERVICES_DEFAULTS.steps.length;

export default function AdminServicesPage() {
  const { token } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Hero block.
  const [heroImageUrl, setHeroImageUrl] = useState(SERVICES_DEFAULTS.hero_image_url);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(
    SERVICES_DEFAULTS.hero_image_url
  );
  const heroFileRef = useRef<HTMLInputElement>(null);

  const [heroEyebrow, setHeroEyebrow] = useState(SERVICES_DEFAULTS.hero_eyebrow);
  const [heroTitle, setHeroTitle] = useState(SERVICES_DEFAULTS.hero_title);
  const [heroTitle2, setHeroTitle2] = useState(SERVICES_DEFAULTS.hero_title_2);
  const [heroBlurb, setHeroBlurb] = useState(SERVICES_DEFAULTS.hero_blurb);

  // Pillars block.
  const [pillarsEyebrow, setPillarsEyebrow] = useState(SERVICES_DEFAULTS.pillars_eyebrow);
  const [pillarsTitle, setPillarsTitle] = useState(SERVICES_DEFAULTS.pillars_title);
  const [pillars, setPillars] = useState<ServicesPillar[]>(SERVICES_DEFAULTS.pillars);

  // Sittings block.
  const [sittingsEyebrow, setSittingsEyebrow] = useState(SERVICES_DEFAULTS.sittings_eyebrow);
  const [sittingsTitle, setSittingsTitle] = useState(SERVICES_DEFAULTS.sittings_title);
  const [sittingsBlurb, setSittingsBlurb] = useState(SERVICES_DEFAULTS.sittings_blurb);
  const [sittingsFooter, setSittingsFooter] = useState(SERVICES_DEFAULTS.sittings_footer);
  const [tiers, setTiers] = useState<ServicesTier[]>(SERVICES_DEFAULTS.tiers);

  // Steps block.
  const [stepsEyebrow, setStepsEyebrow] = useState(SERVICES_DEFAULTS.steps_eyebrow);
  const [stepsTitle, setStepsTitle] = useState(SERVICES_DEFAULTS.steps_title);
  const [steps, setSteps] = useState<ServicesStep[]>(SERVICES_DEFAULTS.steps);

  // CTA block.
  const [ctaTitle, setCtaTitle] = useState(SERVICES_DEFAULTS.cta_title);
  const [ctaBlurb, setCtaBlurb] = useState(SERVICES_DEFAULTS.cta_blurb);
  const [ctaLabel, setCtaLabel] = useState(SERVICES_DEFAULTS.cta_label);

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/services", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d: { services: ServicesSettings | null }) => {
        if (!mounted || !d.services) return;
        const s = d.services;
        setHeroImageUrl(s.hero_image_url);
        setHeroImagePreview(s.hero_image_url);
        setHeroEyebrow(s.hero_eyebrow);
        setHeroTitle(s.hero_title);
        setHeroTitle2(s.hero_title_2);
        setHeroBlurb(s.hero_blurb);
        setPillarsEyebrow(s.pillars_eyebrow);
        setPillarsTitle(s.pillars_title);
        // Pad / trim to exactly the right count (defensive).
        setPillars(
          Array.from({ length: PILLAR_COUNT }, (_, i) =>
            s.pillars?.[i] ?? SERVICES_DEFAULTS.pillars[i]
          )
        );
        setSittingsEyebrow(s.sittings_eyebrow);
        setSittingsTitle(s.sittings_title);
        setSittingsBlurb(s.sittings_blurb);
        setSittingsFooter(s.sittings_footer);
        setTiers(
          Array.from({ length: TIER_COUNT }, (_, i) =>
            s.tiers?.[i] ?? SERVICES_DEFAULTS.tiers[i]
          )
        );
        setStepsEyebrow(s.steps_eyebrow);
        setStepsTitle(s.steps_title);
        setSteps(
          Array.from({ length: STEP_COUNT }, (_, i) =>
            s.steps?.[i] ?? SERVICES_DEFAULTS.steps[i]
          )
        );
        setCtaTitle(s.cta_title);
        setCtaBlurb(s.cta_blurb);
        setCtaLabel(s.cta_label);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [token]);

  function onPickHero(file: File) {
    setHeroImageFile(file);
    setHeroImagePreview(URL.createObjectURL(file));
  }

  function updatePillar(idx: number, patch: Partial<ServicesPillar>) {
    setPillars((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  }

  function updateTier(idx: number, patch: Partial<ServicesTier>) {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  }

  function updateStep(idx: number, patch: Partial<ServicesStep>) {
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const fd = new FormData();
    fd.append("hero_image_url", heroImageUrl);
    fd.append("hero_eyebrow", heroEyebrow);
    fd.append("hero_title", heroTitle);
    fd.append("hero_title_2", heroTitle2);
    fd.append("hero_blurb", heroBlurb);
    fd.append("pillars_eyebrow", pillarsEyebrow);
    fd.append("pillars_title", pillarsTitle);
    fd.append("pillars", JSON.stringify(pillars));
    fd.append("sittings_eyebrow", sittingsEyebrow);
    fd.append("sittings_title", sittingsTitle);
    fd.append("sittings_blurb", sittingsBlurb);
    fd.append("sittings_footer", sittingsFooter);
    fd.append("tiers", JSON.stringify(tiers));
    fd.append("steps_eyebrow", stepsEyebrow);
    fd.append("steps_title", stepsTitle);
    fd.append("steps", JSON.stringify(steps));
    fd.append("cta_title", ctaTitle);
    fd.append("cta_blurb", ctaBlurb);
    fd.append("cta_label", ctaLabel);
    if (heroImageFile) fd.append("hero_image", heroImageFile);

    try {
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      const d: { services: ServicesSettings } = await res.json();
      setHeroImageUrl(d.services.hero_image_url);
      setHeroImagePreview(d.services.hero_image_url);
      setHeroImageFile(null);
      setSuccess("Saved");
      setTimeout(() => setSuccess(""), 2200);
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
    <div className="max-w-4xl">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-2xl font-headline text-primary">Services page</h1>
        <a
          href="/services"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-on-surface-variant hover:text-primary"
        >
          View live page →
        </a>
      </div>
      <p className="text-sm text-on-surface-variant mb-6">
        Edit copy and the hero image. Sections (4 disciplines, 2 sitting tiers, 3
        process steps) are fixed by design — only their content is editable.
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero */}
        <section className="bg-white rounded-xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">Hero</h2>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div
              onClick={() => heroFileRef.current?.click()}
              className="border-2 border-dashed border-outline-variant/40 rounded-xl p-2 cursor-pointer hover:border-primary/40 hover:bg-primary-fixed/10 transition-all w-44 h-44 flex items-center justify-center shrink-0 overflow-hidden"
            >
              {heroImagePreview ? (
                <Image
                  src={heroImagePreview}
                  alt="Services hero"
                  width={176}
                  height={176}
                  className="w-full h-full rounded-lg object-cover"
                  unoptimized={heroImagePreview.startsWith("blob:")}
                />
              ) : (
                <div className="text-center">
                  <span className="material-symbols-outlined text-3xl text-outline-variant mb-1 block">
                    cloud_upload
                  </span>
                  <p className="text-xs text-on-surface-variant">Click to upload</p>
                </div>
              )}
            </div>
            <input
              ref={heroFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onPickHero(e.target.files[0])}
              className="hidden"
            />
            <p className="text-xs text-on-surface-variant">
              Square or 3:4 portrait works best. Displayed at the top of /services.
              Existing image stays unless you upload a new one.
            </p>
          </div>

          <div>
            <label className={labelClass}>Eyebrow (small uppercase)</label>
            <input
              type="text"
              value={heroEyebrow}
              onChange={(e) => setHeroEyebrow(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title — line 1 (italic)</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Title — line 2</label>
              <input
                type="text"
                value={heroTitle2}
                onChange={(e) => setHeroTitle2(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Blurb</label>
            <textarea
              value={heroBlurb}
              onChange={(e) => setHeroBlurb(e.target.value)}
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>
        </section>

        {/* Pillars (the 4 disciplines) */}
        <section className="bg-white rounded-xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">Four disciplines</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                type="text"
                value={pillarsEyebrow}
                onChange={(e) => setPillarsEyebrow(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Section title</label>
              <input
                type="text"
                value={pillarsTitle}
                onChange={(e) => setPillarsTitle(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pillars.map((p, idx) => (
              <div
                key={p.key}
                className="rounded-xl border border-outline-variant/30 p-4 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant">
                  <span className="material-symbols-outlined text-base text-secondary">
                    {p.icon}
                  </span>
                  Pillar {idx + 1} · <span className="font-mono">{p.key}</span>
                </div>
                <div>
                  <label className={labelClass}>Icon (Material Symbol name)</label>
                  <input
                    type="text"
                    value={p.icon}
                    onChange={(e) => updatePillar(idx, { icon: e.target.value })}
                    className={inputClass}
                    placeholder="auto_awesome"
                  />
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => updatePillar(idx, { title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Body</label>
                  <textarea
                    value={p.body}
                    onChange={(e) => updatePillar(idx, { body: e.target.value })}
                    rows={3}
                    className={inputClass + " resize-y"}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sittings */}
        <section className="bg-white rounded-xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">Sitting tiers</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                type="text"
                value={sittingsEyebrow}
                onChange={(e) => setSittingsEyebrow(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Section title</label>
              <input
                type="text"
                value={sittingsTitle}
                onChange={(e) => setSittingsTitle(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Section blurb</label>
            <textarea
              value={sittingsBlurb}
              onChange={(e) => setSittingsBlurb(e.target.value)}
              rows={2}
              className={inputClass + " resize-y"}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {tiers.map((t, idx) => (
              <div
                key={t.key}
                className="rounded-xl border border-outline-variant/30 p-4 space-y-3"
              >
                <div className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Tier {idx + 1} · <span className="font-mono">{t.key}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Eyebrow</label>
                    <input
                      type="text"
                      value={t.eyebrow}
                      onChange={(e) => updateTier(idx, { eyebrow: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      value={t.title}
                      onChange={(e) => updateTier(idx, { title: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Price label</label>
                    <input
                      type="text"
                      value={t.price_label}
                      onChange={(e) => updateTier(idx, { price_label: e.target.value })}
                      className={inputClass}
                      placeholder="₹5,000"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Price unit</label>
                    <input
                      type="text"
                      value={t.price_unit}
                      onChange={(e) => updateTier(idx, { price_unit: e.target.value })}
                      className={inputClass}
                      placeholder="/ sitting"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Duration</label>
                  <input
                    type="text"
                    value={t.duration}
                    onChange={(e) => updateTier(idx, { duration: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Blurb</label>
                  <textarea
                    value={t.blurb}
                    onChange={(e) => updateTier(idx, { blurb: e.target.value })}
                    rows={2}
                    className={inputClass + " resize-y"}
                  />
                </div>
                <div>
                  <label className={labelClass}>Features (one per line)</label>
                  <textarea
                    value={t.features.join("\n")}
                    onChange={(e) =>
                      updateTier(idx, {
                        features: e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    rows={6}
                    className={inputClass + " resize-y font-mono text-xs"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>CTA label</label>
                    <input
                      type="text"
                      value={t.cta_label}
                      onChange={(e) => updateTier(idx, { cta_label: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>CTA query</label>
                    <input
                      type="text"
                      value={t.cta_query}
                      onChange={(e) => updateTier(idx, { cta_query: e.target.value })}
                      className={inputClass}
                      placeholder="service=essential"
                    />
                  </div>
                </div>
                {idx === 1 && (
                  <div>
                    <label className={labelClass}>Badge label (Tier 2 only)</label>
                    <input
                      type="text"
                      value={t.badge_label ?? ""}
                      onChange={(e) =>
                        updateTier(idx, {
                          badge_label: e.target.value || undefined,
                        })
                      }
                      className={inputClass}
                      placeholder="Most detailed"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className={labelClass}>Footer note (under tiers)</label>
            <textarea
              value={sittingsFooter}
              onChange={(e) => setSittingsFooter(e.target.value)}
              rows={2}
              className={inputClass + " resize-y"}
            />
          </div>
        </section>

        {/* Steps */}
        <section className="bg-white rounded-xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">How a sitting works</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                type="text"
                value={stepsEyebrow}
                onChange={(e) => setStepsEyebrow(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Section title</label>
              <input
                type="text"
                value={stepsTitle}
                onChange={(e) => setStepsTitle(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((s, idx) => (
              <div
                key={s.step}
                className="rounded-xl border border-outline-variant/30 p-4 space-y-3"
              >
                <div className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Step {s.step}
                </div>
                <div>
                  <label className={labelClass}>Step number</label>
                  <input
                    type="text"
                    value={s.step}
                    onChange={(e) => updateStep(idx, { step: e.target.value })}
                    className={inputClass}
                    maxLength={3}
                  />
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    value={s.title}
                    onChange={(e) => updateStep(idx, { title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Body</label>
                  <textarea
                    value={s.body}
                    onChange={(e) => updateStep(idx, { body: e.target.value })}
                    rows={4}
                    className={inputClass + " resize-y"}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-xl p-6 ring-1 ring-black/5 space-y-5">
          <h2 className="font-headline text-lg text-primary">Closing CTA</h2>
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Blurb</label>
            <textarea
              value={ctaBlurb}
              onChange={(e) => setCtaBlurb(e.target.value)}
              rows={2}
              className={inputClass + " resize-y"}
            />
          </div>
          <div>
            <label className={labelClass}>Button label</label>
            <input
              type="text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              className={inputClass}
            />
          </div>
        </section>

        <div className="sticky bottom-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:opacity-95 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save services page"}
          </button>
        </div>
      </form>
    </div>
  );
}
