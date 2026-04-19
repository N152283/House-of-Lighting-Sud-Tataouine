-- SUPABASE SETUP SCRIPT (FULL E-COMMERCE)

-- 0. Enable pgcrypto extension (REQUIRED for password hashing)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 0.1. Create Admin User
-- Run this to create the admin user for authentication
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  'admin@houseoflight.tn',
  crypt('Admin123', gen_salt('bf')),
  now(),
  jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
  '{}'::jsonb,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@houseoflight.tn'
);

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  coupon_code TEXT,
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  product_image_url TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Existing projects: keep order item snapshots so admin PDFs still show names
-- even if a product is renamed or deleted after the order is placed.
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image_url TEXT;

UPDATE order_items oi
SET
  product_name = COALESCE(oi.product_name, p.name),
  product_image_url = COALESCE(oi.product_image_url, p.image_url)
FROM products p
WHERE oi.product_id = p.id
  AND (oi.product_name IS NULL OR oi.product_image_url IS NULL);

-- 5. Create Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL CHECK (discount_percent >= 1 AND discount_percent <= 100),
  is_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE
);

-- 6. Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 7. Policies for Public Access (Read-only for shop)
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public Add Coupons" ON coupons FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Coupons" ON coupons FOR DELETE USING (true);
CREATE POLICY "Public Update Coupons" ON coupons FOR UPDATE USING (true) WITH CHECK (true);

-- 8. Policies for Customer Actions (Write-only for orders/messages)
CREATE POLICY "Public Add Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Add Order Items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Add Messages" ON messages FOR INSERT WITH CHECK (true);

-- The current admin panel uses the public Supabase anon client plus a local
-- admin session, so it must be able to read order items for order details/PDFs.
-- Run this on existing databases if order details show "Aucun article".
DROP POLICY IF EXISTS "Public Read Order Items" ON order_items;
CREATE POLICY "Public Read Order Items" ON order_items FOR SELECT USING (true);

-- 9. Policies for Admin Access (Requires Auth)
-- We assume the admin user has a specific email or is identified in a separate 'admins' logic/table
-- For simplicity, we can use a role-based check if roles are set up, 
-- or just check if user is authenticated for admin paths.
-- But standard RLS for admin usually checks auth.uid() or a custom claim.

-- Example: Only authenticated admins can do CRUD on everything
CREATE POLICY "Admins full access on categories" ON categories
  TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access on products" ON products
  TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access on orders" ON orders
  TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access on order_items" ON order_items
  TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins full access on messages" ON messages
  TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 10. Initial Data
INSERT INTO categories (name) VALUES 
('Lustres de Luxe'), 
('Éclairage LED'), 
('Appliques Murales'), 
('Éclairage Extérieur'), 
('Matériel Électrique'),
('Accessoires')
ON CONFLICT (name) DO NOTHING;
