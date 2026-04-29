import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { getServiceClient } from "@/lib/admin-auth";
import { SERVICES_DEFAULTS } from "@/lib/services-defaults";
import type { ServicesSettings, ServicesTier } from "@/types";

// Note: this route is dynamic per-request because we read the visitor's
// country from request headers (x-vercel-ip-country) to decide between
// INR and USD pricing for the sitting tiers. The data fetch itself is
// cheap (single Supabase row).
export const dynamic = "force-dynamic";

// Render the right currency label per visitor. Falls back to INR if a
// USD label hasn't been set, or if we can't detect the country.
function priceFor(tier: ServicesTier, isIndia: boolean): string {
  if (isIndia) return tier.price_label;
  return tier.price_label_usd?.trim() || tier.price_label;
}

async function detectIsIndia(): Promise<boolean> {
  try {
    const h = await headers();
    // Vercel sets x-vercel-ip-country (ISO 3166-1 alpha-2). When
    // running locally the header is missing — default to true so India
    // pricing shows during dev / unknown-origin requests.
    const country = (h.get("x-vercel-ip-country") || "").trim().toUpperCase();
    if (!country) return true;
    return country === "IN";
  } catch {
    return true;
  }
}

async function fetchServices(): Promise<ServicesSettings> {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("services_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return SERVICES_DEFAULTS;
    // Defensive: ensure JSONB array lengths match the fixed structure
    // even if someone hand-edited the DB.
    return {
      ...SERVICES_DEFAULTS,
      ...data,
      pillars:
        Array.isArray(data.pillars) && data.pillars.length === SERVICES_DEFAULTS.pillars.length
          ? data.pillars
          : SERVICES_DEFAULTS.pillars,
      tiers:
        Array.isArray(data.tiers) && data.tiers.length === SERVICES_DEFAULTS.tiers.length
          ? data.tiers
          : SERVICES_DEFAULTS.tiers,
      steps:
        Array.isArray(data.steps) && data.steps.length === SERVICES_DEFAULTS.steps.length
          ? data.steps
          : SERVICES_DEFAULTS.steps,
    } as ServicesSettings;
  } catch {
    return SERVICES_DEFAULTS;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await fetchServices();
  const titleLine = `${s.hero_title} ${s.hero_title_2}`.replace(/\s+/g, " ").trim();
  return {
    title: `${titleLine} — Auric Krystals`,
    description: s.hero_blurb,
  };
}

export default async function ServicesPage() {
  const [s, isIndia] = await Promise.all([fetchServices(), detectIsIndia()]);
  const [tierEssential, tierDeepDive] = s.tiers;
  const tierEssentialPrice = priceFor(tierEssential, isIndia);
  const tierDeepDivePrice = priceFor(tierDeepDive, isIndia);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-8 ak-mesh">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              {s.hero_eyebrow}
            </p>
            <h1 className="font-headline text-3xl sm:text-5xl lg:text-[3.5rem] text-primary leading-[1.05] mb-6 italic">
              {s.hero_title}
              <br />
              <span className="not-italic">{s.hero_title_2}</span>
            </h1>
            <div className="ak-headline-accent" />
            <p className="text-on-surface-variant text-base sm:text-lg max-w-xl mt-7 leading-relaxed">
              {s.hero_blurb}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="#sittings"
                className="inline-flex ak-btn-primary px-8 py-3.5 bg-primary text-on-primary rounded-full font-bold text-sm tracking-wide"
              >
                View sittings
              </Link>
              <Link
                href="/contact"
                className="inline-flex px-8 py-3.5 border-2 border-primary text-primary rounded-full font-bold text-sm tracking-wide hover:bg-primary-fixed/40 transition-colors"
              >
                Speak to us
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto rounded-[2rem] overflow-hidden ak-card ring-1 ring-black/10 bg-surface-container">
              <Image
                src={s.hero_image_url}
                alt={`${s.hero_title} ${s.hero_title_2}`}
                fill
                sizes="(min-width: 768px) 42vw, 80vw"
                className="object-cover"
                priority
              />
            </div>
            <div
              aria-hidden
              className="hidden sm:block absolute -top-4 -left-4 w-24 h-24 rounded-full bg-gradient-to-br from-secondary/30 to-transparent blur-2xl pointer-events-none"
            />
            <div
              aria-hidden
              className="hidden sm:block absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-2xl pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* Pillars — the 4 disciplines */}
      <section className="py-14 sm:py-20 bg-surface-bright border-y border-outline-variant/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              {s.pillars_eyebrow}
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-primary">
              {s.pillars_title}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {s.pillars.map((item) => (
              <div
                key={item.key}
                className="bg-surface-container-lowest rounded-2xl p-6 ring-1 ring-black/5 ak-card"
              >
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-2xl text-secondary mb-3 block"
                >
                  {item.icon}
                </span>
                <h3 className="font-headline text-lg text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sitting tiers */}
      <section id="sittings" className="py-16 sm:py-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              {s.sittings_eyebrow}
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-primary mb-3">
              {s.sittings_title}
            </h2>
            <div className="ak-headline-accent mx-auto" />
            <p className="text-on-surface-variant text-sm sm:text-base max-w-2xl mx-auto mt-6 leading-relaxed">
              {s.sittings_blurb}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Tier 1 — Essential */}
            <article className="relative bg-surface-container-lowest rounded-3xl p-8 sm:p-10 ring-1 ring-outline-variant/20 ak-card flex flex-col">
              <div className="mb-6">
                <p className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant mb-3">
                  {tierEssential.eyebrow}
                </p>
                <h3 className="font-headline text-2xl sm:text-3xl text-primary mb-4">
                  {tierEssential.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-4xl sm:text-5xl text-primary">
                    {tierEssentialPrice}
                  </span>
                  <span className="text-sm text-on-surface-variant">
                    {tierEssential.price_unit}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant/70 mt-2">
                  {tierEssential.duration}
                </p>
              </div>

              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                {tierEssential.blurb}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {tierEssential.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-on-surface">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-base text-secondary mt-0.5 shrink-0"
                    >
                      check_circle
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact?${tierEssential.cta_query}`}
                className="block text-center w-full py-3.5 border-2 border-primary text-primary rounded-full font-bold text-sm tracking-wide hover:bg-primary-fixed/40 transition-colors"
              >
                {tierEssential.cta_label}
              </Link>
            </article>

            {/* Tier 2 — Deep-Dive */}
            <article className="relative bg-gradient-to-br from-primary to-[#503f66] text-on-primary rounded-3xl p-8 sm:p-10 ring-1 ring-primary/30 shadow-[0_24px_56px_-12px_rgba(104,86,130,0.35)] flex flex-col overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/80 to-transparent"
              />
              <div
                aria-hidden
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-secondary/20 blur-3xl pointer-events-none"
              />

              <div className="relative flex items-start justify-between gap-3 mb-6">
                <div>
                  <p className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.22em] text-secondary mb-3">
                    {tierDeepDive.eyebrow}
                  </p>
                  <h3 className="font-headline text-2xl sm:text-3xl mb-4">
                    {tierDeepDive.title}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline text-4xl sm:text-5xl">
                      {tierDeepDivePrice}
                    </span>
                    <span className="text-sm text-white/75">{tierDeepDive.price_unit}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-2">{tierDeepDive.duration}</p>
                </div>
                {tierDeepDive.badge_label && (
                  <span className="shrink-0 inline-flex items-center gap-1.5 bg-secondary text-on-secondary text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
                    <span aria-hidden="true" className="material-symbols-outlined text-xs">
                      auto_awesome
                    </span>
                    {tierDeepDive.badge_label}
                  </span>
                )}
              </div>

              <p className="text-sm text-white/85 leading-relaxed mb-6 relative">
                {tierDeepDive.blurb}
              </p>

              <ul className="space-y-3 mb-8 flex-1 relative">
                {tierDeepDive.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-base text-secondary mt-0.5 shrink-0"
                    >
                      auto_awesome
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact?${tierDeepDive.cta_query}`}
                className="relative block text-center w-full py-3.5 bg-secondary text-on-secondary rounded-full font-bold text-sm tracking-wide hover:opacity-95 transition-opacity"
              >
                {tierDeepDive.cta_label}
              </Link>
            </article>
          </div>

          <p className="text-center text-xs text-on-surface-variant/70 mt-8 max-w-xl mx-auto">
            {s.sittings_footer}
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 sm:py-20 bg-surface-bright border-y border-outline-variant/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              {s.steps_eyebrow}
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-primary">
              {s.steps_title}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {s.steps.map((item) => (
              <div
                key={item.step}
                className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 ring-1 ring-black/5 ak-card"
              >
                <span className="font-headline text-3xl text-secondary/70 italic">
                  {item.step}
                </span>
                <h3 className="font-headline text-lg text-primary mt-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="font-headline text-3xl sm:text-4xl mb-4">{s.cta_title}</h2>
          <p className="text-base sm:text-lg mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            {s.cta_blurb}
          </p>
          <Link
            href="/contact"
            className="inline-flex ak-btn-primary px-10 py-4 bg-secondary text-on-secondary rounded-full font-bold text-base hover:opacity-95 transition-opacity"
          >
            {s.cta_label}
          </Link>
        </div>
      </section>
    </>
  );
}
