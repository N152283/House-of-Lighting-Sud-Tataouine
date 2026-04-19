-- Replace broken product image URLs with active links.
-- Run this in Supabase SQL Editor if product cards show 404 images.

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop'
WHERE id IN (
  'facb7884-5e31-42cf-afd7-f35b56175971',
  '7686e951-c263-4676-a043-43d9f1813d2d',
  'c2463726-ba6c-4713-8c6c-f6e74fc4eea1'
);

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop'
WHERE id IN (
  '7fc94c26-fa7e-4c15-a985-cc211b53fae1',
  'fa3bf8ec-8234-48ca-aa12-ea1237b97e66'
);

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop'
WHERE id IN (
  '29af6952-d42d-47fa-9a73-557583b74553',
  '01887581-2e75-41d7-ba49-92c377505bc2'
);

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=800&auto=format&fit=crop'
WHERE id IN (
  'f471963f-1c44-4dbb-b5f1-6e63298fbd28',
  '36302c02-a420-4129-b847-cb66e8b3888b'
);

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop'
WHERE id = 'e9c60eef-21b2-47f9-b241-cd57a51cffc1';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop'
WHERE id IN (
  'c4f6f967-b08c-4f99-8f67-cb2474635ef6',
  'a5772c99-d3be-4415-8482-fdee1a3a3b0e'
);

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop'
WHERE id = '388f64c4-13aa-4d35-963b-b5789ce4e8ba';

UPDATE products SET image_url = 'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE id = 'ca2ec4b7-61cf-4c05-8462-4330a709a8df';

UPDATE products SET image_url = 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE id = 'ff63f881-ccd9-4c18-aeea-6b4ae84a9257';

UPDATE products SET image_url = 'https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE id IN (
  'f1a4c52f-e751-4844-a978-5dbaa8c35e3b',
  'd46a1229-985f-40d8-8f55-65d664702eb4'
);

-- Keep order detail image snapshots aligned with the repaired product images.
UPDATE order_items oi
SET product_image_url = p.image_url
FROM products p
WHERE oi.product_id = p.id;
