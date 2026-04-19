-- Fix "Aucun article enregistré" in the admin order details/PDF
-- when the dashboard uses the legacy local admin login.
--
-- Your current admin login is not a real Supabase Auth session, so Supabase
-- sees the dashboard as the anon role. This policy lets the dashboard read
-- order_items again.
--
-- Run this in Supabase SQL Editor.

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Order Items" ON order_items;
CREATE POLICY "Public Read Order Items"
ON order_items
FOR SELECT
USING (true);

-- Optional but useful: backfill article names/images for old orders.
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image_url TEXT;

UPDATE order_items oi
SET
  product_name = COALESCE(oi.product_name, p.name),
  product_image_url = COALESCE(oi.product_image_url, p.image_url)
FROM products p
WHERE oi.product_id = p.id
  AND (oi.product_name IS NULL OR oi.product_image_url IS NULL);
