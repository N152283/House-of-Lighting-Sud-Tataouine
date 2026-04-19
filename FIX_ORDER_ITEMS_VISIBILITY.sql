-- Fix empty "Articles" in Gestion des Commandes and PDFs.
-- Run this once in Supabase SQL Editor for an existing project.

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image_url TEXT;

UPDATE order_items oi
SET
  product_name = COALESCE(oi.product_name, p.name),
  product_image_url = COALESCE(oi.product_image_url, p.image_url)
FROM products p
WHERE oi.product_id = p.id
  AND (oi.product_name IS NULL OR oi.product_image_url IS NULL);

DROP POLICY IF EXISTS "Public Read Order Items" ON order_items;
CREATE POLICY "Public Read Order Items"
ON order_items
FOR SELECT
USING (true);
