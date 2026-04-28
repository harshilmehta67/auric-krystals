import type { Metadata } from "next";
import Link from "next/link";
import { social } from "@/lib/site-data";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Auric Krystals",
  description: "Contact Auric Krystals — crystals, astrology, and bespoke orders.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center overflow-hidden pt-32 pb-12 sm:pt-36 ak-mesh">
        <div
          className="absolute top-[-15%] right-[-15%] w-[min(70vw,24rem)] h-[min(70vw,24rem)] bg-primary/12 rounded-full blur-[80px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 sm:px-8 z-10 max-w-4xl text-center space-y-6">
          <p className="text-secondary text-xs font-semibold uppercase tracking-[0.25em]">Connect</p>
          <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl text-primary leading-tight">Get in touch</h1>
          <div className="ak-headline-accent mx-auto" />
          <p className="text-on-surface-variant text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Questions about crystals, astrology services, or bespoke orders — we read every message.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-surface-bright border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="font-headline text-2xl sm:text-4xl text-primary mb-2">Send a message</h2>
                <p className="text-on-surface-variant text-sm sm:text-base">
                  Opens your email client with your note — no data is stored on our servers.
                </p>
              </div>
              <ContactForm />
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="font-headline text-2xl sm:text-4xl text-primary mb-2">Contact information</h2>
                <p className="text-on-surface-variant text-sm sm:text-base">Reach us through any channel below.</p>
              </div>
              <div className="space-y-4">
                <div className="bg-surface-container-lowest rounded-2xl p-6 ak-card ring-1 ring-black/5 flex gap-4">
                  <span className="text-secondary text-xl shrink-0">✉️</span>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Email</p>
                    <a href="mailto:astrokrupa16@gmail.com" className="font-semibold text-primary hover:text-secondary transition-colors break-all">
                      astrokrupa16@gmail.com
                    </a>
                  </div>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl p-6 ak-card ring-1 ring-black/5 flex gap-4">
                  <span className="text-secondary text-xl shrink-0">💬</span>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">WhatsApp group</p>
                    <a href="https://chat.whatsapp.com/G7y78B5CoFh5a5W8ap8MsL" rel="noopener noreferrer" target="_blank" className="font-semibold text-primary hover:text-secondary transition-colors break-all">
                      Join the community
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-primary-fixed/40 rounded-2xl p-6 sm:p-8 border border-primary/10">
                <h3 className="font-headline text-primary text-lg mb-4">Follow along</h3>
                <p className="text-sm text-on-surface-variant mb-5">Instagram, Facebook, YouTube — updates, lives, and cosmic guidance.</p>
                <div className="flex flex-wrap gap-3">
                  {social.map((s) => (
                    <a key={s.id} href={s.url} rel="noopener noreferrer" target="_blank"
                      className="w-12 h-12 rounded-full bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 flex items-center justify-center text-primary transition-colors"
                      aria-label={s.shortLabel}>
                      <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="font-headline text-2xl sm:text-3xl mb-6">Ready to curate your space?</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="inline-flex justify-center px-8 py-3.5 bg-secondary text-on-secondary rounded-full font-bold hover:opacity-95 transition-opacity">
              Explore crystals
            </Link>
            <Link href="/services" className="inline-flex justify-center px-8 py-3.5 border-2 border-white/90 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
              Discover services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
