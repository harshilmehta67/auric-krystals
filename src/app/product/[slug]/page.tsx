import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products, getProduct } from "@/lib/site-data";
import AddToCartButton from "@/components/AddToCartButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product — Auric Krystals" };
  return {
    title: `${product.title} — Auric Krystals`,
    description: product.desc,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="pt-28 sm:pt-32 pb-16 sm:pb-20">
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-8 mb-8 text-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="text-primary font-medium">{product.title}</span>
      </nav>

      <section className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="relative group lg:sticky lg:top-36">
          <div
            className="absolute -inset-3 bg-gradient-to-br from-primary-fixed/35 to-secondary-fixed/15 rounded-3xl blur-2xl -z-10 opacity-80"
            aria-hidden="true"
          />
          <Image
            src={product.img}
            alt={product.title}
            width={800}
            height={800}
            className="w-full aspect-square max-h-[min(85vw,32rem)] lg:max-h-none object-cover rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-black/5 ak-card mx-auto lg:mx-0"
            priority
          />
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div>
            <p className="text-secondary font-label text-xs sm:text-sm uppercase tracking-widest mb-2">
              {product.subtitle}
            </p>
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-primary mb-3 leading-tight">
              {product.title}
            </h1>
            <p className="text-amber-700/90 text-sm font-semibold tracking-wide">
              ★★★★★ · Trusted by collectors worldwide
            </p>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-3xl sm:text-4xl font-bold text-primary">{product.price}</p>
            <span className="text-sm text-on-surface-variant">
              Tax calculated at checkout · Free shipping over $75
            </span>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-on-surface">{product.desc}</p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <AddToCartButton product={product} />
            <Link
              href="/shop"
              className="flex-1 inline-flex justify-center px-8 py-4 border-2 border-secondary text-secondary rounded-full font-bold hover:bg-secondary-fixed/30 transition-colors text-center"
            >
              Back to shop
            </Link>
          </div>

          <div className="space-y-8 pt-8 border-t border-outline-variant/40">
            <div>
              <h3 className="font-headline text-lg text-primary mb-3">Metaphysical notes</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li>· Divine wisdom — supports introspection and rest</li>
                <li>· Emotional ease — often chosen for bedrooms &amp; meditation</li>
                <li>· Protective aura — a favorite for sensitive spaces</li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg text-primary mb-3">Specifications</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-on-surface-variant">Origin:</span>{" "}
                  <span className="text-on-surface">Ethically sourced lots, documented chain</span>
                </li>
                <li>
                  <span className="text-on-surface-variant">Care:</span>{" "}
                  <span className="text-on-surface">
                    Dry cloth · avoid prolonged sun on color-sensitive varieties
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 mt-20 sm:mt-28">
        <h2 className="font-headline text-2xl sm:text-3xl text-primary mb-8">Harmonious pairings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 text-center ak-card ring-1 ring-black/5">
            <h3 className="font-headline text-primary mb-2">Clear Quartz</h3>
            <p className="text-sm text-on-surface-variant">
              Amplifies intention alongside your centerpiece stone
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-6 text-center ak-card ring-1 ring-black/5">
            <h3 className="font-headline text-primary mb-2">Rose Quartz</h3>
            <p className="text-sm text-on-surface-variant">
              Softens energy with compassion and warmth
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-6 text-center ak-card ring-1 ring-black/5">
            <h3 className="font-headline text-primary mb-2">Selenite</h3>
            <p className="text-sm text-on-surface-variant">
              Cleansing, luminous presence for display or altar
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
