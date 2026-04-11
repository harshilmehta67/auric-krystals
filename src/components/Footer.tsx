import Link from "next/link";
import Image from "next/image";
import { social } from "@/lib/site-data";

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200/80 pt-14 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 sm:px-12 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/AURIC KRYSTALS LOGO.png"
              alt=""
              width={120}
              height={32}
              className="h-8 w-auto object-contain opacity-80"
            />
            <div className="text-base font-headline text-primary italic">
              Auric Krystals
            </div>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed max-w-xs uppercase tracking-widest">
            A celestial sanctuary for earth-born treasures &amp; cosmic wisdom.
          </p>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h5 className="font-headline font-bold text-primary text-xs tracking-widest uppercase mb-3">
              Explore
            </h5>
            <ul className="space-y-2 text-xs uppercase tracking-widest">
              <li>
                <Link
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="/shop"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="/services"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-headline font-bold text-primary text-xs tracking-widest uppercase mb-3">
              Rituals
            </h5>
            <ul className="space-y-2 text-xs uppercase tracking-widest">
              <li>
                <Link
                  className="text-on-surface-variant hover:text-secondary transition-colors"
                  href="/shop"
                >
                  Collection
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-headline font-bold text-primary text-xs tracking-widest uppercase mb-3">
              Connect
            </h5>
            <div className="flex flex-wrap gap-2">
              {social.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary-fixed/30 flex items-center justify-center text-primary transition-colors"
                  aria-label={s.shortLabel}
                >
                  <span className="material-symbols-outlined text-lg">
                    {s.icon}
                  </span>
                </a>
              ))}
              <a
                href="mailto:astrokrupa16@gmail.com"
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary-fixed/30 flex items-center justify-center text-primary transition-colors"
                aria-label="Email"
              >
                <span className="material-symbols-outlined text-lg">mail</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-stone-200/60 max-w-7xl mx-auto px-4 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-on-surface-variant/80 text-[0.6rem] uppercase tracking-[0.2em]">
          © 2026 Auric Krystals · Crafted with intention
        </p>
      </div>
    </footer>
  );
}
