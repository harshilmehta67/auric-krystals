"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SocialPost, AboutSettings } from "@/types";

export default function SocialStrip() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [about, setAbout] = useState<AboutSettings | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/social-posts").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/api/about").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([p, a]) => {
      if (p?.posts) setPosts(p.posts);
      if (a?.about) setAbout(a.about);
    });
  }, []);

  if (posts.length === 0 && !about?.instagram_url && !about?.whatsapp_link) {
    return null;
  }

  const igUrl = about?.instagram_url || "https://instagram.com";
  const waUrl =
    about?.whatsapp_link ||
    (about?.whatsapp_number
      ? `https://wa.me/${about.whatsapp_number.replace(/\D/g, "")}`
      : null);

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-secondary font-label text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold mb-2">
              Follow the journey
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl text-primary">
              Inside the studio
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {about?.instagram_url && (
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 text-white text-xs font-bold uppercase tracking-widest hover:opacity-95 transition-opacity"
              >
                <span className="material-symbols-outlined text-base">photo_camera</span>
                Instagram
              </a>
            )}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors"
              >
                <span className="material-symbols-outlined text-base">forum</span>
                WhatsApp circle
              </a>
            )}
          </div>
        </div>

        {posts.length > 0 ? (
          <ul
            role="list"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3"
          >
            {posts.slice(0, 6).map((p) => (
              <li key={p.id}>
                <a
                  href={p.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-2xl ring-1 ring-black/5"
                >
                  <Image
                    src={p.image_url}
                    alt={p.caption || "Social post"}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    {p.caption && (
                      <p className="text-white text-[11px] leading-tight line-clamp-2">
                        {p.caption}
                      </p>
                    )}
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-2 text-white/90 material-symbols-outlined text-base drop-shadow"
                  >
                    open_in_new
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-on-surface-variant italic text-sm">
            New posts coming soon — check back shortly.
          </p>
        )}
      </div>
    </section>
  );
}
