-- Add specs column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs TEXT[];

-- Update existing products with empty specs array if null
UPDATE products SET specs = '{}' WHERE specs IS NULL;

CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND
  auth.role() = 'authenticated'
); 