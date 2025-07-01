/*
  # Add foreign key relationship between products and profiles

  1. Changes
    - Add foreign key constraint from products.vendor_id to profiles.id
    - This enables proper joins between products and profiles tables
    - Named as products_vendor_id_profiles_fkey to distinguish from existing users FK

  2. Security
    - No changes to existing RLS policies
    - Maintains data integrity with proper referential constraints
*/

-- Add foreign key constraint from products.vendor_id to profiles.id
-- This allows proper joins between products and vendor profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_vendor_id_profiles_fkey'
    AND table_name = 'products'
  ) THEN
    ALTER TABLE products 
    ADD CONSTRAINT products_vendor_id_profiles_fkey 
    FOREIGN KEY (vendor_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;