-- ==============================================================================
-- 1. MODIFICAR LA TABLA products EXISTENTE
-- ==============================================================================
-- Agregamos las columnas necesarias para que un producto pueda ser digital
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS is_digital BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS drive_url TEXT;

-- ==============================================================================
-- 2. CREAR LA TABLA digital_orders
-- ==============================================================================
-- Esta tabla vincula un pedido con el producto digital y un token único
CREATE TABLE IF NOT EXISTS digital_orders (
  id             BIGSERIAL PRIMARY KEY,
  product_id     BIGINT, -- Referencia al producto digital
  download_token UUID DEFAULT gen_random_uuid(),
  status         TEXT DEFAULT 'pending', -- pending | paid
  download_count INTEGER DEFAULT 0,
  max_downloads  INTEGER DEFAULT 1,
  internal_notes TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Crear un índice único en el token para búsquedas rápidas en la Edge Function
CREATE UNIQUE INDEX IF NOT EXISTS digital_orders_download_token_idx ON digital_orders(download_token);

-- ==============================================================================
-- 3. POLÍTICAS DE SEGURIDAD (RLS)
-- ==============================================================================
-- Habilitar RLS
ALTER TABLE digital_orders ENABLE ROW LEVEL SECURITY;

-- Lectura anónima (el admin panel y la edge function la van a leer)
CREATE POLICY "Anon read digital_orders" 
  ON digital_orders FOR SELECT 
  USING (true);

-- Inserción anónima (cuando el cliente hace el pedido)
CREATE POLICY "Anon insert digital_orders" 
  ON digital_orders FOR INSERT 
  WITH CHECK (true);

-- Actualización anónima (el admin panel actualiza status, y la Edge Function incrementa el contador)
CREATE POLICY "Anon update digital_orders" 
  ON digital_orders FOR UPDATE 
  USING (true) WITH CHECK (true);
