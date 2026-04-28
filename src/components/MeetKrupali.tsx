"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AboutSettings } from "@/types";

const FALLBACK: AboutSettings = {
  id: 1,
  bio_short:
    "Vedic astrologer & crystal curator. Hand-picks every piece in the shop and offers personal Kundali sittings.",
  bio_long: "",
  photo_url: "/assets/kundali-reading.jpg",
  instagram_url: null,
  whatsapp_link: null,
  whatsapp_number: null,
  updated_at: "",
};

export default function MeetKrupali() {
  const [about, setAbout] = useState<AboutSettings>(FALLBACK);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.about) setAbout(d.about);
      })
      .catch(() => {});
  }, []);

  if (!about.bio_short && !about.photo_url) return null;

  return (
    <section className="py-16 sm:py-24 bg-background border-y border-outline-variant/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 grid md:grid-cols-[minmax(0,1fr)_1.4fr] gap-10 sm:gap-14 items-center">
        <div className="relative">
          <div
            className="absolute -inset-4 bg-gradient-to-br from-primary-fixed/35 to-secondary-fixed/15 rounded-3xl blur-2xl -z-10 opacity-80"
            aria-hidden="true"
          />
          {about.photo_url && (
            <Image
              src={about.photo_url}
              alt="Krupali R., Vedic astrologer & crystal curator"
              width={600}
              height={750}
              sizes="(min-width: 768px) 30vw, 80vw"
              className="w-full aspect-[4/5] object-cover object-top rounded-3xl ring-1 ring-black/5 shadow-2xl ak-card"
            />
          )}
        </div>

        <div className="space-y-5 sm:space-y-6">
          <p className="text-secondary font-label text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold">
            Meet your guide
          </p>
          <h2 className="font-headline text-3xl sm:text-4xl text-primary leading-tight">
            Krupali R.
          </h2>
          <div className="ak-headline-accent" />
          <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed">
            {about.bio_short}
          </p>
          {about.bio_long && (
            <p className="text-on-surface-variant/90 text-sm sm:text-base leading-relaxed">
              {about.bio_long}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/services"
              className="ak-btn-primary inline-flex justify-center items-center px-7 py-3.5 bg-primary text-on-primary rounded-full font-bold text-sm tracking-widest uppercase"
            >
              Book a sitting
            </Link>
            <Link
              href="/contact"
              className="inline-flex justify-center items-center px-7 py-3.5 border-2 border-primary text-primary rounded-full font-bold text-sm tracking-widest uppercase hover:bg-primary-fixed/40 transition-colors"
            >
              Ask Krupali
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
