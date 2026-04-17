-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number SERIAL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  order_notes TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin settings (singleton row)
CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  notification_email TEXT DEFAULT 'astrokrupa16@gmail.com',
  notification_phone TEXT DEFAULT '8758848867',
  upi_id TEXT DEFAULT '',
  telegram_bot_token TEXT,
  telegram_chat_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin settings
INSERT INTO admin_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Quiz registrations (users who registered to see quiz results)
CREATE TABLE IF NOT EXISTS quiz_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dob DATE NOT NULL,
  marketing_optin BOOLEAN DEFAULT false,
  quiz_result TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table (replaces hardcoded products in site-data.ts)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  blurb TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  image_url_2 TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default category
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Crystals', 'crystals', 'Natural crystal specimens', 0),
  ('Bracelets', 'bracelets', 'Healing crystal bracelets', 1)
ON CONFLICT (slug) DO NOTHING;

-- Seed existing products
INSERT INTO products (slug, title, subtitle, price, blurb, description, image_url, category_id, sort_order) VALUES
  ('rose-quartz-heart', 'Rose Quartz Heart', 'Polished heart — heart chakra', 24.99, 'Polished heart-shaped rose quartz', 'Polished heart-shaped rose quartz, ideal for self-love rituals and gentle emotional support. Each piece is hand-selected for clarity and soft pink tone.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop', (SELECT id FROM categories WHERE slug='crystals'), 0),
  ('amethyst-cluster', 'Amethyst Cluster', 'Natural specimen — calm & intuition', 34.99, 'Natural amethyst crystal cluster', 'Natural amethyst crystal cluster for meditation and restful energy. Deep violet tones with balanced formation.', 'https://images.unsplash.com/photo-1599644732595-52ea526ce5f0?w=800&h=800&fit=crop', (SELECT id FROM categories WHERE slug='crystals'), 1),
  ('citrine-bracelet', 'Citrine Bracelet', 'Beaded — abundance & joy', 29.99, 'Beaded citrine healing bracelet', 'Warm citrine beads strung for daily wear; associated with optimism, confidence, and bright creative flow.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', (SELECT id FROM categories WHERE slug='bracelets'), 2),
  ('black-tourmaline', 'Black Tourmaline', 'Raw specimens — grounding', 19.99, 'Raw black tourmaline specimens', 'Raw black tourmaline pieces chosen for protective, grounding energy. Perfect for entryways or workspace corners.', 'https://images.unsplash.com/photo-1512138010189-873d58c53143?w=800&h=800&fit=crop', (SELECT id FROM categories WHERE slug='crystals'), 3),
  ('clear-quartz-point', 'Clear Quartz Point', 'Polished point — clarity', 22.99, 'Polished clear quartz point', 'A polished clear quartz point to amplify intention and pair with other stones in your practice.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop', (SELECT id FROM categories WHERE slug='crystals'), 4),
  ('rose-quartz-bracelet', 'Rose Quartz Bracelet', 'Delicate beads — compassion', 26.99, 'Delicate rose quartz beaded bracelet', 'Delicate rose quartz beads for everyday wear; supports gentle heart-opening and emotional balance.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', (SELECT id FROM categories WHERE slug='bracelets'), 5)
ON CONFLICT (slug) DO NOTHING;

-- Storage bucket for payment screenshots and product images (run via Supabase dashboard or API)
-- CREATE POLICY on storage.objects for public read access

-- Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (API routes use service role key)
CREATE POLICY "Service role full access on orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on admin_settings"
  ON admin_settings FOR ALL
  USING (auth.role() = 'service_role');

-- Allow authenticated admins to read orders
CREATE POLICY "Authenticated users can read orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow anyone to insert orders (customers placing orders)
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Quiz registrations: service role full access, anyone can insert
CREATE POLICY "Service role full access on quiz_registrations"
  ON quiz_registrations FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can insert quiz_registrations"
  ON quiz_registrations FOR INSERT
  WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Categories & products: service role full access, public can read active
CREATE POLICY "Service role full access on categories"
  ON categories FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Service role full access on products"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Public read active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
