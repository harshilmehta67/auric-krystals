import Image from "next/image";
import Link from "next/link";
import ProductCarousel from "@/components/ProductCarousel";
import OfferingCarousel from "@/components/OfferingCarousel";
import QuizAutoStart from "@/components/QuizAutoStart";
import FindYourCrystalButton from "@/components/FindYourCrystalButton";

export default function HomePage() {
  return (
    <>
      <QuizAutoStart />
      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-28 pb-16 sm:pt-32 ak-mesh">
        <div
          className="absolute top-[-15%] right-[-20%] w-[min(90vw,36rem)] h-[min(90vw,36rem)] bg-primary/15 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-20%] left-[-15%] w-[min(80vw,28rem)] h-[min(80vw,28rem)] bg-secondary-fixed/20 rounded-full blur-[90px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 sm:px-8 z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 ak-animate-in">
            <p className="text-secondary font-label text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold">
              Welcome to Auric Krystals
            </p>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-primary leading-[1.12] tracking-tight">
              Where Earth&apos;s Treasures Meet{" "}
              <span className="ak-shimmer-text">Cosmic Wisdom</span>
            </h1>
            <div className="ak-headline-accent" />
            <p className="text-on-surface-variant text-base sm:text-lg max-w-xl leading-relaxed">
              Discover ethically sourced crystals, intentional bracelets, and
              personalized astrology guidance — curated for a calm, elevated
              ritual at home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link
                href="/shop"
                className="ak-btn-primary inline-flex justify-center items-center px-8 py-4 bg-primary text-on-primary rounded-full font-bold text-sm tracking-widest uppercase"
              >
                Explore Crystals
              </Link>
              <FindYourCrystalButton />
            </div>
          </div>
          <div
            className="lg:col-span-6 relative ak-animate-in"
            style={{ animationDelay: "0.12s" }}
          >
            <div
              className="absolute -inset-4 bg-gradient-to-br from-primary-fixed/40 to-secondary-fixed/20 rounded-3xl blur-2xl opacity-75 -z-10"
              aria-hidden="true"
            />
            <Image
              alt="Amethyst crystal specimen"
              className="w-full h-auto object-cover rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-black/5 ak-card"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8aGtvJmszyYdGkWfu74x0wRjKPcQZpPlIK6u-YbQ10f2EVnVGuSSagyCcBrJj7L3rtXKYnUmWDwbVd2VEU2_CQM10J8KdLKeF-eg8XTrxwLGi2aGE-K12rDsCmen0IWw-w3gxEJV1niGBWs20-suicvH3xwOa8FgcW5UP_EsbQ6rwf9hgSsxzPCpzWjvJHo-ML3Jw2Eh2nPXQTmz2hHqRtZeuf3-gM-SOg5xplx4iRpPG5fXAaRwZeqyQPHV_2GlJxhlsc13Pys1i"
              width={800}
              height={1000}
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured pieces */}
      <section className="py-14 sm:py-20 bg-background border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div>
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                Collection
              </p>
              <h2 className="font-headline text-2xl sm:text-4xl text-primary italic">
                Featured pieces
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base mt-2 max-w-xl">
                Browse cards below — arrows or swipe. Opens the full product page.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex justify-center px-6 py-3 bg-secondary-fixed text-on-secondary-container rounded-full text-xs font-bold tracking-widest uppercase hover:bg-secondary-container transition-colors shrink-0"
            >
              Shop all
            </Link>
          </div>
          <ProductCarousel />
        </div>
      </section>

      {/* Cosmic offerings */}
      <section className="py-14 sm:py-20 bg-surface-bright border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div>
              <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                Guidance
              </p>
              <h2 className="font-headline text-2xl sm:text-4xl text-primary italic">
                Cosmic offerings
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base mt-2 max-w-xl">
                Astrology and crystal support — explore services or reach out.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex justify-center px-6 py-3 border-2 border-primary text-primary rounded-full text-xs font-bold tracking-widest uppercase hover:bg-primary-fixed/40 transition-colors shrink-0"
            >
              All services
            </Link>
          </div>
          <OfferingCarousel />
        </div>
      </section>

      {/* Key Attractions */}
      <section className="py-20 sm:py-28 bg-surface-bright border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-16">
            <div className="max-w-xl">
              <h2 className="font-headline text-3xl sm:text-4xl text-primary mb-4 italic">
                Key Attractions
              </h2>
              <p className="text-on-surface-variant font-light tracking-wide text-sm sm:text-base leading-relaxed">
                Premium crystals, wearable energy, and cosmic guidance — unified under one refined
                aesthetic.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex justify-center px-8 py-3.5 bg-secondary-fixed text-on-secondary-container rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-secondary-container transition-colors shrink-0"
            >
              Shop All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Link
              href="/shop"
              className="sm:col-span-2 group relative rounded-2xl overflow-hidden bg-surface-container min-h-[14rem] sm:min-h-[16rem] ak-card ring-1 ring-black/5"
            >
              <Image
                alt="Premium crystals"
                className="w-full h-full object-cover min-h-[14rem] sm:min-h-[16rem] group-hover:scale-[1.03] transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwoX4tdXZ6eOQ_3-Y4odnBlPrtZ7WfFOHUxbqisdpPbC6_SkvJUgg-o8SLaLT2rLoeh7DJ8rC28VVpU9dPmxwA_j6vN5tzreAEtw6gijJC8U5akazNSkKQ48EoqhKi05CIqnM8Iz8pPPzb5OiDx9LU3RLyKegITv-DCDXDMe7brZZoXJYK7JBh0ItvUFXrlxBSwfxgJb_fPjCRj4kTtgklxkxDrs2331jjrjxAWkCrHqBIU6bEhbHcIVbeFcMxsKjJ-2mrOv9UcpDe"
                width={800}
                height={400}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7">
                <h3 className="font-headline text-xl sm:text-2xl text-white mb-1">Premium Crystals</h3>
                <p className="text-white/85 text-xs sm:text-sm">Ethically sourced specimens</p>
              </div>
            </Link>
            <Link
              href="/shop"
              className="group relative rounded-2xl overflow-hidden bg-surface-container min-h-[14rem] ak-card ring-1 ring-black/5"
            >
              <Image
                alt="Bracelets"
                className="w-full h-full object-cover min-h-[14rem] group-hover:scale-[1.03] transition-transform duration-700"
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop"
                width={500}
                height={500}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <h3 className="font-headline text-lg text-white">Bracelets</h3>
              </div>
            </Link>
            <Link
              href="/shop"
              className="group relative rounded-2xl overflow-hidden bg-surface-container min-h-[14rem] ak-card ring-1 ring-black/5"
            >
              <Image
                alt="Gemstones"
                className="w-full h-full object-cover min-h-[14rem] group-hover:scale-[1.03] transition-transform duration-700"
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop"
                width={500}
                height={500}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <h3 className="font-headline text-lg text-white">Gemstones</h3>
              </div>
            </Link>
            <Link
              href="/services"
              className="group relative rounded-2xl overflow-hidden bg-surface-container min-h-[14rem] ak-card ring-1 ring-black/5 sm:col-span-2 lg:col-span-1"
            >
              <Image
                alt="Astrology services"
                className="w-full h-full object-cover min-h-[14rem] group-hover:scale-[1.03] transition-transform duration-700"
                src="https://images.unsplash.com/photo-1618644952181-db8e1bcb2c04?w=500&h=500&fit=crop"
                width={500}
                height={500}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <h3 className="font-headline text-lg text-white">Services</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 sm:py-32 relative">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-8">
          <p className="font-headline text-2xl sm:text-3xl md:text-4xl text-primary leading-snug italic mb-10">
            &ldquo;Auric Krystals isn&apos;t just a gallery; it&apos;s a sensory bridge to the
            earth&apos;s most quiet, powerful treasures.&rdquo;
          </p>
          <div className="flex flex-col items-center gap-1">
            <span className="font-label text-xs uppercase tracking-[0.35em] font-bold text-primary">
              Elena Vanhoutte
            </span>
            <span className="text-[0.65rem] text-on-surface-variant uppercase tracking-widest">
              Collector &amp; Antiquarian
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
