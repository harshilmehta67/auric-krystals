-- =====================================================================
-- Services-page editorial settings (singleton)
-- ---------------------------------------------------------------------
-- Idempotent. Re-runnable. The services page (/services) reads from this
-- table; admin updates everything via /admin/services. Structure is fixed
-- (no add/remove of pillars, tiers or steps) — admin can only edit text +
-- the hero image. JSONB fields hold the fixed-length arrays.
-- =====================================================================

CREATE TABLE IF NOT EXISTS services_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  hero_image_url TEXT NOT NULL DEFAULT '/assets/services-cosmic.jpg',
  hero_eyebrow   TEXT NOT NULL DEFAULT 'Astrology · Numerology · Tarot · Vastu',
  hero_title     TEXT NOT NULL DEFAULT 'Cosmic guidance',
  hero_title_2   TEXT NOT NULL DEFAULT 'across four traditions',
  hero_blurb     TEXT NOT NULL DEFAULT 'Vedic Jyotish, ancient numerology, intuitive tarot and Vastu Shastra — woven into a single, grounded sitting with astrologer Krupali R. Each consultation begins with the lens that fits your question and works outward from there.',

  pillars_eyebrow TEXT NOT NULL DEFAULT 'Four lenses, one consultation',
  pillars_title   TEXT NOT NULL DEFAULT 'A personal map of your cosmos',
  -- Exactly four pillar cards. Admin updates titles/bodies/icons; cannot add or remove.
  pillars JSONB NOT NULL DEFAULT $j$[
    {
      "key": "astrology",
      "icon": "auto_awesome",
      "title": "Astrology",
      "body": "Vedic chart analysis — Lagna, dashas, transits, divisional charts, doshas, and timing for the milestones that matter."
    },
    {
      "key": "numerology",
      "icon": "calculate",
      "title": "Numerology",
      "body": "Birth numbers, name energy and karmic cycles (3, 6, 8, 9) decoded into practical, daily-life direction."
    },
    {
      "key": "tarot",
      "icon": "style",
      "title": "Tarot card reading",
      "body": "An intuitive lens for situations where the chart needs nuance — relationships, decisions, blocked timelines, gut-level cross-checks."
    },
    {
      "key": "vastu",
      "icon": "explore",
      "title": "Vastu Shastra",
      "body": "Energy flow of your home, workspace or business — directional analysis with non-invasive remedies you can actually integrate."
    }
  ]$j$::jsonb,

  sittings_eyebrow TEXT NOT NULL DEFAULT 'Choose your sitting',
  sittings_title   TEXT NOT NULL DEFAULT 'Two ways to experience your reading',
  sittings_blurb   TEXT NOT NULL DEFAULT 'Book the format that best suits the depth and clarity you''re seeking. Both sittings are conducted personally by astrologer Krupali R.',
  -- Exactly two sitting tiers. Admin updates copy/features; cannot add or remove.
  tiers JSONB NOT NULL DEFAULT $j$[
    {
      "key": "essential",
      "eyebrow": "Essential sitting",
      "title": "Focused consultation",
      "price_label": "₹5,000",
      "price_unit": "/ sitting",
      "duration": "~45 min · one-on-one",
      "blurb": "A focused, clarifying session built around the area of life that matters most to you right now — read through the lens(es) that fit.",
      "features": [
        "One focus area (career · relationships · health · finance)",
        "Birth-chart overview tailored to that focus",
        "Tarot or numerology cross-check where it adds clarity",
        "Current Mahadasha & immediate transits",
        "1–2 personalised remedies to begin with"
      ],
      "cta_label": "Book Essential sitting",
      "cta_query": "service=essential"
    },
    {
      "key": "deepdive",
      "eyebrow": "Deep-Dive sitting",
      "title": "Comprehensive consultation",
      "price_label": "₹11,000",
      "price_unit": "/ sitting",
      "duration": "~90 min · one-on-one + written summary",
      "blurb": "The complete experience — chart-wide analysis across every sphere of life, with numerology, tarot and Vastu woven in, plus a written follow-up.",
      "features": [
        "Everything in the Essential sitting",
        "Divisional charts (D-9, D-10, D-12) read in depth",
        "Numerology profile & name energy review",
        "Vastu pointers for home or workspace",
        "Complete life-area review — career, love, family, health, wealth",
        "Dasha-level forecast for the next 3 years",
        "Written PDF summary + one follow-up clarification"
      ],
      "badge_label": "Most detailed",
      "cta_label": "Book Deep-Dive sitting",
      "cta_query": "service=deepdive"
    }
  ]$j$::jsonb,
  sittings_footer TEXT NOT NULL DEFAULT 'Share your date, time, and place of birth when booking. Sittings are conducted in Hindi, Gujarati or English. Online & in-person both available.',

  steps_eyebrow TEXT NOT NULL DEFAULT 'Process',
  steps_title   TEXT NOT NULL DEFAULT 'How a sitting works',
  -- Exactly three process steps. Admin updates titles/bodies; cannot add or remove.
  steps JSONB NOT NULL DEFAULT $j$[
    {
      "step": "01",
      "title": "Share your details",
      "body": "Date, exact time and place of birth — plus the area of life you''re seeking clarity on."
    },
    {
      "step": "02",
      "title": "Confirm your sitting",
      "body": "We schedule a mutually convenient slot and send across a gentle prep note for the session."
    },
    {
      "step": "03",
      "title": "Receive your reading",
      "body": "A clear, compassionate walkthrough across the lenses that fit your question — with remedies you can actually integrate."
    }
  ]$j$::jsonb,

  cta_title TEXT NOT NULL DEFAULT 'Begin your sitting',
  cta_blurb TEXT NOT NULL DEFAULT 'Whether it''s a focused area or a chart-wide consultation, reach out and we''ll match you to the right format.',
  cta_label TEXT NOT NULL DEFAULT 'Get started',

  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at trigger (reuses update_updated_at() from supabase/schema.sql).
DROP TRIGGER IF EXISTS services_settings_updated_at ON services_settings;
CREATE TRIGGER services_settings_updated_at
  BEFORE UPDATE ON services_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS: public can read the single row; only service role writes.
ALTER TABLE services_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read services settings" ON services_settings;
CREATE POLICY "Public can read services settings"
  ON services_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed the singleton if missing.
INSERT INTO services_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
