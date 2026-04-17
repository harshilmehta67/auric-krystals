import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Auric Krystals",
  description: "Vedic Kundali readings and Janmakshar nakshatra guidance — Auric Krystals.",
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
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden ak-card ring-1 ring-black/5 flex flex-col">
              <div className="relative aspect-[16/10] bg-surface-container">
                <Image
                  src="https://images.unsplash.com/photo-1618644952181-db8e1bcb2c04?w=1200&h=750&fit=crop"
                  alt="Zodiac wheel — Vedic Kundali"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-8 sm:p-10 space-y-5 flex-1 flex flex-col">
                <h2 className="font-headline text-2xl sm:text-3xl text-primary">Kundali readings</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Your Kundali is a cosmic blueprint cast from the exact moment and place of your birth. A Vedic birth-chart reading decodes the placement of planets across the twelve houses and zodiac signs — revealing life purpose, relationship dynamics, career timing, health patterns, and karmic lessons through classical Jyotish principles.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Personality &amp; life-path analysis</li>
                  <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Relationships &amp; compatibility (Guna Milan)</li>
                  <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Career, finance &amp; growth timing</li>
                  <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Dasha &amp; transit-based predictions</li>
                  <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Doshas, remedies &amp; karmic patterns</li>
                </ul>
                <Link href="/contact" className="inline-flex ak-btn-primary px-8 py-3.5 bg-primary text-on-primary rounded-full font-bold self-start">
                  Book a reading
                </Link>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden ak-card ring-1 ring-black/5 flex flex-col">
              <div className="relative aspect-[16/10] bg-surface-container">
                <Image
                  src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=750&fit=crop"
                  alt="Starlit sky — nakshatra and Janmakshar"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-8 sm:p-10 space-y-5 flex-1 flex flex-col">
                <h2 className="font-headline text-2xl sm:text-3xl text-primary">Janmakshar readings</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Janmakshar is the auspicious birth-letter derived from the Moon&apos;s nakshatra and pada at the time of birth — the foundation for your true Vedic name and lunar identity. A Janmakshar reading reveals your ruling nakshatra, its presiding deity, innate traits, and guides name selection, rashi-aligned remedies, and rituals in harmony with your cosmic signature.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Nakshatra &amp; pada identification</li>
                  <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Authentic Janmakshar &amp; name suggestions</li>
                  <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Rashi &amp; presiding-deity insights</li>
                  <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Nakshatra strengths &amp; doshas</li>
                  <li className="flex gap-3"><span className="text-secondary font-bold">✓</span> Remedies, mantras &amp; ritual alignment</li>
                </ul>
                <Link href="/contact" className="inline-flex ak-btn-primary px-8 py-3.5 bg-primary text-on-primary rounded-full font-bold self-start">
                  Request reading
                </Link>
              </div>
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
