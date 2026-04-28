-- Polish-sprint migration: testimonials, about, trust bar, social posts,
-- product tags (intent filtering), and explicit quiz->product mappings.
-- Idempotent: safe to re-run.

-- =========================================================
-- 1. Testimonials
-- =========================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  quote TEXT NOT NULL,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on testimonials" ON testimonials;
CREATE POLICY "Service role full access on testimonials"
  ON testimonials FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public read featured testimonials" ON testimonials;
CREATE POLICY "Public read featured testimonials"
  ON testimonials FOR SELECT
  USING (is_featured = true);

DROP TRIGGER IF EXISTS testimonials_updated_at ON testimonials;
CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed three [PLACEHOLDER] entries so the carousel design is visible.
-- Admin should replace these with real testimonials before launch.
INSERT INTO testimonials (name, city, quote, rating, sort_order, is_featured)
SELECT * FROM (VALUES
  ('Aanya M.', 'Mumbai',
   '[PLACEHOLDER] My amethyst cluster from Krupali shifted the energy of my home overnight. The packaging felt like a ritual. Will be back for the rose quartz.',
   5::SMALLINT, 0, true),
  ('Riya S.', 'Bengaluru',
   '[PLACEHOLDER] The Kundali sitting was the most grounded reading I''ve had. Clear, kind, no upselling — just real guidance. Highly recommend.',
   5::SMALLINT, 1, true),
  ('Devanshi P.', 'Ahmedabad',
   '[PLACEHOLDER] Ordered the bracelet for my mother''s birthday. She wears it every single day. Quality is exactly what was promised.',
   5::SMALLINT, 2, true)
) AS v(name, city, quote, rating, sort_order, is_featured)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

-- =========================================================
-- 2. About settings (singleton — bio + social links)
-- =========================================================
CREATE TABLE IF NOT EXISTS about_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  bio_short TEXT NOT NULL DEFAULT '',
  bio_long TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  instagram_url TEXT,
  whatsapp_link TEXT,
  whatsapp_number TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE about_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on about_settings" ON about_settings;
CREATE POLICY "Service role full access on about_settings"
  ON about_settings FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public read about_settings" ON about_settings;
CREATE POLICY "Public read about_settings"
  ON about_settings FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS about_settings_updated_at ON about_settings;
CREATE TRIGGER about_settings_updated_at
  BEFORE UPDATE ON about_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed default Krupali bio + social links (admin can edit live from /admin/about).
INSERT INTO about_settings (id, bio_short, bio_long, photo_url, instagram_url, whatsapp_link)
VALUES (
  1,
  'Vedic astrologer & crystal curator. Hand-picks every piece in the shop and offers personal Kundali sittings.',
  'Krupali R. has been studying Vedic astrology and crystal energetics for over a decade. Each stone in the Auric Krystals shop is hand-selected by her, energy-cleansed, and matched to the intention you bring. Beyond the shop, Krupali offers private Kundali sittings — a quiet, no-upsell space to map planetary placements onto the season of life you''re actually living.',
  '/assets/kundali-reading.jpg',
  'https://www.instagram.com/auric_krystals?igsh=eWJwaW5td3RtN293',
  'https://chat.whatsapp.com/G7y78B5CoFh5a5W8ap8MsL'
)
ON CONFLICT (id) DO NOTHING;

-- Backfill social links if a previous run of this migration left them empty.
-- Safe to run repeatedly; only writes when the column is currently null/blank.
UPDATE about_settings
SET
  instagram_url = COALESCE(NULLIF(instagram_url, ''), 'https://www.instagram.com/auric_krystals?igsh=eWJwaW5td3RtN293'),
  whatsapp_link = COALESCE(NULLIF(whatsapp_link, ''), 'https://chat.whatsapp.com/G7y78B5CoFh5a5W8ap8MsL')
WHERE id = 1
  AND (
    instagram_url IS NULL OR instagram_url = ''
    OR whatsapp_link IS NULL OR whatsapp_link = ''
  );

-- =========================================================
-- 3. Trust bar items
-- =========================================================
CREATE TABLE IF NOT EXISTS trust_bar_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name TEXT NOT NULL DEFAULT 'verified',
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trust_bar_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on trust_bar_items" ON trust_bar_items;
CREATE POLICY "Service role full access on trust_bar_items"
  ON trust_bar_items FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public read active trust_bar_items" ON trust_bar_items;
CREATE POLICY "Public read active trust_bar_items"
  ON trust_bar_items FOR SELECT
  USING (is_active = true);

DROP TRIGGER IF EXISTS trust_bar_items_updated_at ON trust_bar_items;
CREATE TRIGGER trust_bar_items_updated_at
  BEFORE UPDATE ON trust_bar_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO trust_bar_items (icon_name, title, subtitle, sort_order)
SELECT * FROM (VALUES
  ('diamond',    'Hand-selected pieces',          'Every stone personally chosen by Krupali',      0),
  ('water_drop', 'Energy-cleansed before shipping', 'Smudged & moonlight-rested before they leave', 1),
  ('verified',   'Manual order verification',     'Each order reviewed within 12 hours',           2)
) AS v(icon_name, title, subtitle, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM trust_bar_items);

-- =========================================================
-- 4. Social posts (admin-managed Instagram / WhatsApp strip)
-- =========================================================
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on social_posts" ON social_posts;
CREATE POLICY "Service role full access on social_posts"
  ON social_posts FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public read active social_posts" ON social_posts;
CREATE POLICY "Public read active social_posts"
  ON social_posts FOR SELECT
  USING (is_active = true);

DROP TRIGGER IF EXISTS social_posts_updated_at ON social_posts;
CREATE TRIGGER social_posts_updated_at
  BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================================
-- 5. Products: add `tags` for intent filtering
-- =========================================================
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN (tags);

-- =========================================================
-- 6. Quiz result -> products explicit mapping
-- =========================================================
CREATE TABLE IF NOT EXISTS quiz_result_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  result_key TEXT NOT NULL CHECK (result_key IN ('A','B','C','D')),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(result_key, product_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_result_products_key
  ON quiz_result_products(result_key, sort_order);

ALTER TABLE quiz_result_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on quiz_result_products" ON quiz_result_products;
CREATE POLICY "Service role full access on quiz_result_products"
  ON quiz_result_products FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public read quiz_result_products" ON quiz_result_products;
CREATE POLICY "Public read quiz_result_products"
  ON quiz_result_products FOR SELECT
  USING (true);
