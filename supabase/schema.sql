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

-- Storage bucket for payment screenshots (run via Supabase dashboard or API)
-- CREATE POLICY on storage.objects for public read access

-- Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_registrations ENABLE ROW LEVEL SECURITY;

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
