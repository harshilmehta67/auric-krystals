import Image from "next/image";
import Link from "next/link";
import { getServiceClient } from "@/lib/admin-auth";
import { SERVICES_DEFAULTS } from "@/lib/services-defaults";
import type { AboutSettings, ServicesSettings } from "@/types";

// The "Cosmic offerings" spotlight on the home page is now driven by the
// same admin-editable settings that power /services and /admin/about. The
// left portrait comes from About settings (Krupali's photo), the right
// companion image comes from Services settings (the cosmic hero), and all
// copy comes from Services settings — so updating either admin page
// automatically refreshes this strip.

const FALLBACK_PORTRAIT = "/assets/kundali-reading.jpg";

async function fetchSpotlight(): Promise<{
  services: ServicesSettings;
  portrait: string;
}> {
  try {
    const supabase = getServiceClient();
    const [servicesRes, aboutRes] = await Promise.all([
      supabase.from("services_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("about_settings").select("photo_url").eq("id", 1).maybeSingle(),
    ]);
    const services = (servicesRes.data as ServicesSettings | null) ?? SERVICES_DEFAULTS;
    const portrait =
      (aboutRes.data as Pick<AboutSettings, "photo_url"> | null)?.photo_url ||
      FALLBACK_PORTRAIT;
    return { services, portrait };
  } catch {
    return { services: SERVICES_DEFAULTS, portrait: FALLBACK_PORTRAIT };
  }
}

export default async function OfferingCarousel() {
  const { services, portrait } = await fetchSpotlight();

  return (
    <Link
      href="/services"
      className="group block bg-surface-container-lowest rounded-3xl overflow-hidden ak-card ring-1 ring-black/5 hover:ring-primary/30 transition-all"
    >
      <div className="grid md:grid-cols-[1.15fr_1fr]">
        {/* Visual panel: portrait + companion image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 bg-surface-container">
          <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[22rem] md:min-h-[26rem] overflow-hidden">
            <Image
              src={portrait}
              alt="Astrologer Krupali R."
              fill
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 30vw, 100vw"
              className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
          <div className="relative hidden sm:block sm:min-h-[22rem] md:min-h-[26rem] overflow-hidden border-l border-white/40">
            <Image
              src={services.hero_image_url}
              alt=""
              fill
              sizes="(min-width: 1024px) 28vw, 30vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            />
            {/* Soft gradient overlay to tie into the card palette */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10 mix-blend-soft-light"
            />
          </div>
        </div>

        {/* Text panel */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <p className="text-secondary text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.22em] mb-3">
            {services.hero_eyebrow}
          </p>
          <h3 className="font-headline text-2xl sm:text-3xl text-primary mb-4 italic">
            {services.hero_title}
          </h3>
          <p className="text-on-surface-variant leading-relaxed mb-6 text-sm sm:text-base">
            {services.hero_blurb}
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
            Explore sittings
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              arrow_forward
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
