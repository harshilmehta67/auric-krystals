import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kundali Readings — Auric Krystals",
  description:
    "Personalised Vedic Kundali readings with astrologer Krupali R. — two sitting formats (Essential ₹5,000 & Deep-Dive ₹11,000).",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-8 ak-mesh">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Vedic Jyotish · Guidance
            </p>
            <h1 className="font-headline text-3xl sm:text-5xl lg:text-[3.5rem] text-primary leading-[1.05] mb-6 italic">
              Kundali readings<br />
              <span className="not-italic">with clarity &amp; care</span>
            </h1>
            <div className="ak-headline-accent" />
            <p className="text-on-surface-variant text-base sm:text-lg max-w-xl mt-7 leading-relaxed">
              Your Kundali is a cosmic blueprint cast from the exact moment and place of your birth. Decoded through classical Jyotish — planet by planet, house by house — to reveal purpose, timing, relationships, and karmic patterns in language you can act on.
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
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-[2rem] overflow-hidden ak-card ring-1 ring-black/10 bg-surface-container">
              <Image
                src="/assets/kundali-reading.jpg"
                alt="Astrologer analysing a Kundali chart"
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

      {/* What your Kundali reveals */}
      <section className="py-14 sm:py-20 bg-surface-bright border-y border-outline-variant/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              What your chart reveals
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-primary italic">
              A personal map of your cosmos
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: "self_improvement",
                title: "Life path & purpose",
                body: "Lagna, Rashi, and core personality placements — your inherent strengths and life direction.",
              },
              {
                icon: "favorite",
                title: "Relationships & Guna Milan",
                body: "Compatibility analysis, 7th-house dynamics, and timing for meaningful partnerships.",
              },
              {
                icon: "trending_up",
                title: "Career & finance timing",
                body: "Dashas and transits that indicate windows of growth, risk, and stability in your professional life.",
              },
              {
                icon: "schedule",
                title: "Dasha & gochar predictions",
                body: "Mahadasha–Antardasha cycles and current transit effects — what to expect and when.",
              },
              {
                icon: "healing",
                title: "Doshas & remedies",
                body: "Mangal, Kaal-sarp, Shani doshas identified with practical, tradition-rooted remedies.",
              },
              {
                icon: "auto_awesome",
                title: "Karmic patterns",
                body: "Rahu–Ketu axis and ancestral karma decoded into clear, conscious next steps.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface-container-lowest rounded-2xl p-6 ring-1 ring-black/5 ak-card"
              >
                <span className="material-symbols-outlined text-2xl text-secondary mb-3 block">
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
              Choose your sitting
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-primary italic mb-3">
              Two ways to experience your reading
            </h2>
            <div className="ak-headline-accent mx-auto" />
            <p className="text-on-surface-variant text-sm sm:text-base max-w-2xl mx-auto mt-6 leading-relaxed">
              Book the format that best suits the depth and clarity you&apos;re seeking. Both sittings are conducted personally by astrologer Krupali R.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Tier 1 — Essential */}
            <article className="relative bg-surface-container-lowest rounded-3xl p-8 sm:p-10 ring-1 ring-outline-variant/20 ak-card flex flex-col">
              <div className="mb-6">
                <p className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant mb-3">
                  Essential sitting
                </p>
                <h3 className="font-headline text-2xl sm:text-3xl text-primary mb-4">
                  Kundali Basic
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-4xl sm:text-5xl text-primary">
                    ₹5,000
                  </span>
                  <span className="text-sm text-on-surface-variant">/ sitting</span>
                </div>
                <p className="text-xs text-on-surface-variant/70 mt-2">
                  ~45 min · one-on-one
                </p>
              </div>

              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                A focused, clarifying session to read your birth chart and address the area of life that matters most to you right now.
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Full Lagna, Rashi & Navamsha overview",
                  "One focus area (career · relationships · health · finance)",
                  "Current Mahadasha & immediate transits",
                  "Core strengths and blind-spots",
                  "1–2 personalised remedies to begin with",
                ].map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-base text-secondary mt-0.5 shrink-0">
                      check_circle
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact?service=kundali-basic"
                className="block text-center w-full py-3.5 border-2 border-primary text-primary rounded-full font-bold text-sm tracking-wide hover:bg-primary-fixed/40 transition-colors"
              >
                Book Essential sitting
              </Link>
            </article>

            {/* Tier 2 — Deep-Dive (featured) */}
            <article className="relative bg-gradient-to-br from-primary to-[#503f66] text-on-primary rounded-3xl p-8 sm:p-10 ring-1 ring-primary/30 shadow-[0_24px_56px_-12px_rgba(104,86,130,0.35)] flex flex-col overflow-hidden">
              {/* Shimmer accent */}
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
                    Deep-Dive sitting
                  </p>
                  <h3 className="font-headline text-2xl sm:text-3xl mb-4">
                    Kundali Premium
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline text-4xl sm:text-5xl">₹11,000</span>
                    <span className="text-sm text-white/75">/ sitting</span>
                  </div>
                  <p className="text-xs text-white/60 mt-2">
                    ~90 min · one-on-one + written summary
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 bg-secondary text-on-secondary text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-xs">
                    auto_awesome
                  </span>
                  Most detailed
                </span>
              </div>

              <p className="text-sm text-white/85 leading-relaxed mb-6 relative">
                The complete experience — a deep, chart-wide analysis across every sphere of life, with a written follow-up so you can return to your reading anytime.
              </p>

              <ul className="space-y-3 mb-8 flex-1 relative">
                {[
                  "Everything in Kundali Basic",
                  "Divisional charts (D-9, D-10, D-12) read in depth",
                  "Complete life-area review — career, love, family, health, wealth",
                  "Dasha-level forecast for the next 3 years",
                  "Doshas diagnosed with layered remedial guidance",
                  "Compatibility & muhurat check (1 relationship / event)",
                  "Written PDF summary + one follow-up clarification",
                ].map((f) => (
                  <li key={f} className="flex gap-3 text-sm">
                    <span className="material-symbols-outlined text-base text-secondary mt-0.5 shrink-0">
                      auto_awesome
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact?service=kundali-premium"
                className="relative block text-center w-full py-3.5 bg-secondary text-on-secondary rounded-full font-bold text-sm tracking-wide hover:opacity-95 transition-opacity"
              >
                Book Deep-Dive sitting
              </Link>
            </article>
          </div>

          <p className="text-center text-xs text-on-surface-variant/70 mt-8 max-w-xl mx-auto">
            Share your date, time, and place of birth when booking. Readings are conducted in Hindi, Gujarati or English. Online &amp; in-person both available.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 sm:py-20 bg-surface-bright border-y border-outline-variant/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              Process
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-primary italic">
              How a sitting works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                step: "01",
                title: "Share your birth details",
                body: "Date, exact time, and place of birth — the three anchors needed to cast an accurate Kundali.",
              },
              {
                step: "02",
                title: "Confirm your sitting",
                body: "We schedule a mutually convenient slot and send across a gentle prep note for the session.",
              },
              {
                step: "03",
                title: "Receive your reading",
                body: "A clear, compassionate walkthrough of your chart with remedies you can actually integrate.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 ring-1 ring-black/5 ak-card"
              >
                <span className="font-headline text-3xl text-secondary/70 italic">
                  {s.step}
                </span>
                <h3 className="font-headline text-lg text-primary mt-2 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="font-headline text-3xl sm:text-4xl mb-4 italic">
            Begin your journey
          </h2>
          <p className="text-base sm:text-lg mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re seeking a clear direction or a deep, chart-wide understanding — reach out and we&apos;ll help you choose the right sitting.
          </p>
          <Link
            href="/contact"
            className="inline-flex ak-btn-primary px-10 py-4 bg-secondary text-on-secondary rounded-full font-bold text-base hover:opacity-95 transition-opacity"
          >
            Get started
          </Link>
        </div>
      </section>
    </>
  );
}
