import Image from "next/image";
import Link from "next/link";
import ProductCarousel from "@/components/ProductCarousel";
import OfferingCarousel from "@/components/OfferingCarousel";
import CategoryAttractions from "@/components/CategoryAttractions";
import QuizAutoStart from "@/components/QuizAutoStart";
import FindYourCrystalButton from "@/components/FindYourCrystalButton";
import TrustBar from "@/components/TrustBar";
import MeetKrupali from "@/components/MeetKrupali";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import SocialStrip from "@/components/SocialStrip";

export default function HomePage() {
  return (
    <>
      <QuizAutoStart />
      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-32 pb-16 sm:pt-36 ak-mesh">
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
              <span className="ak-section-label--ornament">Welcome to Auric Krystals</span>
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
            <div className="pt-6">
              <TrustBar />
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
              alt="Heart-shaped amethyst geode"
              className="w-full h-auto object-cover rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-black/5 ak-card"
              src="/assets/amethyst-heart.jpg"
              width={768}
              height={1024}
              sizes="(min-width: 1024px) 42vw, 100vw"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQAAwDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAhEAACAQMEAwEAAAAAAAAAAAABAgMEBREABhIhMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAaEQACAwEBAAAAAAAAAAAAAAAAAQIRAxIx/9oADAMBAAIRAxEAPwCe2FtuTcMt5kvE0kdFFGxiijJDSt0CR3jOAB8yfWqpuW2oNmXClnsM01HHMjHwl2KkMOhHcDr+0aTRFJYjiAAA9DTqJaikkqf/2Q=="
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
              <h2 className="font-headline text-2xl sm:text-4xl text-primary">
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
              <h2 className="font-headline text-2xl sm:text-4xl text-primary">
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

      {/* Meet Krupali */}
      <MeetKrupali />

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* Key Attractions */}
      <section className="py-20 sm:py-28 bg-surface-bright border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-16">
            <div className="max-w-xl">
              <h2 className="font-headline text-3xl sm:text-4xl text-primary mb-4">
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
          <CategoryAttractions />
        </div>
      </section>

      {/* Social strip */}
      <SocialStrip />

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
