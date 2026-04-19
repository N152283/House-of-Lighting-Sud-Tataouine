-- Harden admin/client separation.
-- Run this after confirming your admin user can sign in with Supabase Auth.
--
-- Public visitors should be able to:
-- - read categories/products/coupons for the shop
-- - insert orders/order_items/messages from checkout/contact
--
-- Public visitors should NOT be able to:
-- - update/delete products, categories, orders, order_items, messages
-- - read orders/order_items directly

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Remove public read access to private order data only after admin uses Supabase Auth.
-- If you still use the legacy local admin login, do NOT drop Public Read Order Items,
-- or order details/PDFs will show "Aucun article enregistré".
DROP POLICY IF EXISTS "Public Read Orders" ON orders;
-- DROP POLICY IF EXISTS "Public Read Order Items" ON order_items;

-- Remove common public write-policy names if they exist.
DROP POLICY IF EXISTS "Public Update Categories" ON categories;
DROP POLICY IF EXISTS "Public Delete Categories" ON categories;
DROP POLICY IF EXISTS "Public Add Categories" ON categories;
DROP POLICY IF EXISTS "Public Update Products" ON products;
DROP POLICY IF EXISTS "Public Delete Products" ON products;
DROP POLICY IF EXISTS "Public Add Products" ON products;
DROP POLICY IF EXISTS "Public Update Orders" ON orders;
DROP POLICY IF EXISTS "Public Delete Orders" ON orders;
DROP POLICY IF EXISTS "Public Update Order Items" ON order_items;
DROP POLICY IF EXISTS "Public Delete Order Items" ON order_items;
DROP POLICY IF EXISTS "Public Update Messages" ON messages;
DROP POLICY IF EXISTS "Public Delete Messages" ON messages;

-- Catch any other accidental anon/public UPDATE or DELETE policies on admin tables.
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('categories', 'products', 'orders', 'order_items', 'messages')
      AND cmd IN ('UPDATE', 'DELETE')
      AND roles::text ~ '(public|anon)'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- Required public customer/shop policies.
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Add Orders" ON orders;
CREATE POLICY "Public Add Orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Add Order Items" ON order_items;
CREATE POLICY "Public Add Order Items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Add Messages" ON messages;
CREATE POLICY "Public Add Messages" ON messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Coupons" ON coupons;
CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT USING (true);

-- TODO: replace this with a SECURITY DEFINER RPC for one-time coupon redemption.
-- It is kept for now because checkout marks coupons as used from the public client.
DROP POLICY IF EXISTS "Public Update Coupons" ON coupons;
CREATE POLICY "Public Update Coupons" ON coupons FOR UPDATE USING (true) WITH CHECK (true);

-- Authenticated admin policies.
DROP POLICY IF EXISTS "Admins full access on categories" ON categories;
CREATE POLICY "Admins full access on categories" ON categories
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access on products" ON products;
CREATE POLICY "Admins full access on products" ON products
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access on orders" ON orders;
CREATE POLICY "Admins full access on orders" ON orders
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access on order_items" ON order_items;
CREATE POLICY "Admins full access on order_items" ON order_items
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access on messages" ON messages;
CREATE POLICY "Admins full access on messages" ON messages
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access on coupons" ON coupons;
CREATE POLICY "Admins full access on coupons" ON coupons
  TO authenticated USING (true) WITH CHECK (true);
