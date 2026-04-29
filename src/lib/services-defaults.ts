import type { ServicesSettings } from "@/types";

// Mirrors the SQL seed in supabase/migrations/2026-04-28-services.sql.
// Used as the SSR fallback if the DB row is missing (first deploy before
// migration is applied, or transient fetch failure).
export const SERVICES_DEFAULTS: ServicesSettings = {
  id: 1,
  hero_image_url: "/assets/services-cosmic.jpg",
  hero_eyebrow: "Astrology · Numerology · Tarot · Vastu",
  hero_title: "Cosmic guidance",
  hero_title_2: "across four traditions",
  hero_blurb:
    "Vedic Jyotish, ancient numerology, intuitive tarot and Vastu Shastra — woven into a single, grounded sitting with astrologer Krupali R. Each consultation begins with the lens that fits your question and works outward from there.",
  pillars_eyebrow: "Four lenses, one consultation",
  pillars_title: "A personal map of your cosmos",
  pillars: [
    {
      key: "astrology",
      icon: "auto_awesome",
      title: "Astrology",
      body: "Vedic chart analysis — Lagna, dashas, transits, divisional charts, doshas, and timing for the milestones that matter.",
    },
    {
      key: "numerology",
      icon: "calculate",
      title: "Numerology",
      body: "Birth numbers, name energy and karmic cycles (3, 6, 8, 9) decoded into practical, daily-life direction.",
    },
    {
      key: "tarot",
      icon: "style",
      title: "Tarot card reading",
      body: "An intuitive lens for situations where the chart needs nuance — relationships, decisions, blocked timelines, gut-level cross-checks.",
    },
    {
      key: "vastu",
      icon: "explore",
      title: "Vastu Shastra",
      body: "Energy flow of your home, workspace or business — directional analysis with non-invasive remedies you can actually integrate.",
    },
  ],
  sittings_eyebrow: "Choose your sitting",
  sittings_title: "Two ways to experience your reading",
  sittings_blurb:
    "Book the format that best suits the depth and clarity you're seeking. Both sittings are conducted personally by astrologer Krupali R.",
  tiers: [
    {
      key: "essential",
      eyebrow: "Essential sitting",
      title: "Focused consultation",
      price_label: "₹4,999",
      price_label_usd: "$1,111",
      price_unit: "/ sitting",
      duration: "~45 min · one-on-one",
      blurb:
        "A focused, clarifying session built around the area of life that matters most to you right now — read through the lens(es) that fit.",
      features: [
        "One focus area (career · relationships · health · finance)",
        "Birth-chart overview tailored to that focus",
        "Tarot or numerology cross-check where it adds clarity",
        "Current Mahadasha & immediate transits",
        "1–2 personalised remedies to begin with",
      ],
      cta_label: "Book Essential sitting",
      cta_query: "service=essential",
    },
    {
      key: "deepdive",
      eyebrow: "Deep-Dive sitting",
      title: "Comprehensive consultation",
      price_label: "₹11,111",
      price_label_usd: "$2,499",
      price_unit: "/ sitting",
      duration: "~90 min · one-on-one + written summary",
      blurb:
        "The complete experience — chart-wide analysis across every sphere of life, with numerology, tarot and Vastu woven in, plus a written follow-up.",
      features: [
        "Everything in the Essential sitting",
        "Divisional charts (D-9, D-10, D-12) read in depth",
        "Numerology profile & name energy review",
        "Vastu pointers for home or workspace",
        "Complete life-area review — career, love, family, health, wealth",
        "Dasha-level forecast for the next 3 years",
        "Written PDF summary + one follow-up clarification",
      ],
      badge_label: "Most detailed",
      cta_label: "Book Deep-Dive sitting",
      cta_query: "service=deepdive",
    },
  ],
  sittings_footer:
    "Share your date, time, and place of birth when booking. Sittings are conducted in Hindi, Gujarati or English. Online & in-person both available.",
  steps_eyebrow: "Process",
  steps_title: "How a sitting works",
  steps: [
    {
      step: "01",
      title: "Share your details",
      body: "Date, exact time and place of birth — plus the area of life you're seeking clarity on.",
    },
    {
      step: "02",
      title: "Confirm your sitting",
      body: "We schedule a mutually convenient slot and send across a gentle prep note for the session.",
    },
    {
      step: "03",
      title: "Receive your reading",
      body: "A clear, compassionate walkthrough across the lenses that fit your question — with remedies you can actually integrate.",
    },
  ],
  cta_title: "Begin your sitting",
  cta_blurb:
    "Whether it's a focused area or a chart-wide consultation, reach out and we'll match you to the right format.",
  cta_label: "Get started",
  updated_at: new Date(0).toISOString(),
};
