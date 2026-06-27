-- ── TABLAS PARA TORTAS JIMMY ───────────────────────────────────────────────

CREATE TABLE tj_categories (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  submenus   JSONB DEFAULT '[]',
  image_url  TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tj_products (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC NOT NULL DEFAULT 0,
  category       TEXT,
  sub_category   TEXT,
  sub_category_2 TEXT,
  image          TEXT,
  emoji          TEXT,
  unidad         TEXT,
  especial       BOOLEAN DEFAULT FALSE,
  ribbon         TEXT,
  has_notes      BOOLEAN DEFAULT FALSE,
  flavors        JSONB DEFAULT '[]',
  guisos         JSONB DEFAULT '[]',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tj_orders (
  id                TEXT PRIMARY KEY,
  customer_name     TEXT,
  customer_phone    TEXT,
  customer_city     TEXT,
  delivery_notes    TEXT,
  payment_method    TEXT,
  payment_reference TEXT,
  items             JSONB DEFAULT '[]',
  total_amount      NUMERIC DEFAULT 0,
  status            TEXT DEFAULT 'pending',  -- pending | in-process | delayed | delivered
  internal_notes    JSONB DEFAULT '[]',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tj_settings (
  id              TEXT PRIMARY KEY,
  bank_name       TEXT,
  account_holder  TEXT,
  clabe           TEXT,
  account_number  TEXT,
  card_number     TEXT,
  instructions    TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas de Seguridad (RLS)
CREATE POLICY "Public read tj_categories" ON tj_categories FOR SELECT USING (true);
CREATE POLICY "Public read tj_products" ON tj_products   FOR SELECT USING (true);
CREATE POLICY "Public read tj_orders" ON tj_orders     FOR SELECT USING (true);
CREATE POLICY "Public read tj_settings" ON tj_settings   FOR SELECT USING (true);

CREATE POLICY "Anon write tj_categories" ON tj_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write tj_products" ON tj_products   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write tj_orders" ON tj_orders     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write tj_settings" ON tj_settings   FOR ALL USING (true) WITH CHECK (true);

-- Semilla de datos (Categorías)
INSERT INTO tj_categories (id, name, sort_order) VALUES 
('tortas', '🍴 Tortas', 1),
('antojitos', '🌮 Antojitos', 2),
('bebidas', '🥤 Bebidas', 3)
ON CONFLICT (id) DO NOTHING;

-- Semilla de datos (Ajustes de banco)
INSERT INTO tj_settings (id, bank_name, account_holder, clabe, account_number, instructions) 
VALUES ('bank', 'BBVA', 'Tortas Jimmy', '012345678901234567', '0123456789', 'Envía tu comprobante por WhatsApp al terminar.') 
ON CONFLICT (id) DO NOTHING;
