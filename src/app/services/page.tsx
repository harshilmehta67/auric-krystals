import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Auric Krystals",
  description: "Kundali readings, horoscopes, and spiritual wellness — Auric Krystals.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="pt-32 sm:pt-36 pb-16 sm:pb-20 text-center px-4 sm:px-8 ak-mesh">
        <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-4">Guidance</p>
        <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl text-primary leading-tight mb-6 max-w-4xl mx-auto">
          Cosmic Guidance &amp; Wellness Services
        </h1>
        <div className="ak-headline-accent mx-auto" />
        <p className="text-on-surface-variant text-base sm:text-lg max-w-2xl mx-auto mt-8 leading-relaxed">
          Personalized astrology and spiritual wellness consultations tailored to your blueprint — delivered with clarity and care.
        </p>
      </section>

      <section className="py-16 sm:py-24 bg-surface-bright border-y border-outline-variant/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <div className="bg-surface-container-lowest rounded-2xl p-8 sm:p-10 ak-card ring-1 ring-black/5 space-y-6">
              <h2 className="font-headline text-2xl sm:text-3xl text-primary">Kundali readings</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Vedic birth chart work to clarify purpose, timing, and recurring themes in your life path.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Personality &amp; life path</li>
                <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Compatibility analysis</li>
                <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Career &amp; finance insights</li>
                <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Health &amp; vitality timing</li>
                <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Karmic patterns</li>
              </ul>
              <Link href="/contact" className="inline-flex ak-btn-primary px-8 py-3.5 bg-primary text-on-primary rounded-full font-bold">
                Book a reading
              </Link>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-8 sm:p-10 ak-card ring-1 ring-black/5 space-y-6">
              <h2 className="font-headline text-2xl sm:text-3xl text-primary">Horoscope analysis</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Month-by-month and yearly forecasts anchored in transits, retrogrades, and lunar rhythm.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Monthly forecasts</li>
                <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Yearly predictions</li>
                <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Retrograde insights</li>
                <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Lunar phase guidance</li>
                <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Ritual recommendations</li>
              </ul>
              <Link href="/contact" className="inline-flex ak-btn-primary px-8 py-3.5 bg-primary text-on-primary rounded-full font-bold">
                Request analysis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="font-headline text-2xl sm:text-3xl text-primary text-center mb-12">Additional services</h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-surface-container-lowest rounded-2xl p-8 ak-card ring-1 ring-black/5">
              <h3 className="font-headline text-xl text-primary mb-3">Compatibility check</h3>
              <p className="text-on-surface-variant mb-6 text-sm sm:text-base leading-relaxed">
                Synastry-focused sessions for couples or partnerships seeking grounded insight.
              </p>
              <Link href="/contact" className="inline-flex px-6 py-2.5 border-2 border-primary text-primary rounded-full font-bold text-sm hover:bg-primary-fixed/40 transition-colors">
                Learn more
              </Link>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-8 ak-card ring-1 ring-black/5">
              <h3 className="font-headline text-xl text-primary mb-3">Ritual guidance</h3>
              <p className="text-on-surface-variant mb-6 text-sm sm:text-base leading-relaxed">
                Lunar-aligned practices and simple rituals to support your current season.
              </p>
              <Link href="/contact" className="inline-flex px-6 py-2.5 border-2 border-primary text-primary rounded-full font-bold text-sm hover:bg-primary-fixed/40 transition-colors">
                Discover
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="font-headline text-3xl sm:text-4xl mb-4">Begin your journey</h2>
          <p className="text-base sm:text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Connect for personalized guidance — we respond with next steps and transparent pricing.
          </p>
          <Link href="/contact" className="inline-flex ak-btn-primary px-10 py-4 bg-secondary text-on-secondary rounded-full font-bold text-base hover:opacity-95 transition-opacity">
            Get started
          </Link>
        </div>
      </section>
    </>
  );
}
