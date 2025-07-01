/*
  # Fix database policies and constraints

  1. Policy Updates
    - Remove recursive policy on profiles table that causes infinite recursion
    - Simplify admin policy to avoid self-referencing
    
  2. Foreign Key Constraints
    - Add missing foreign key constraint between products and profiles tables
    - Ensure proper naming for application queries
    
  3. Security
    - Maintain proper RLS policies without recursion
    - Ensure data access remains secure
*/

-- First, drop the problematic policies on profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new, non-recursive policies for profiles table
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create a simpler admin policy that doesn't cause recursion
CREATE POLICY "Service role can manage all profiles"
  ON profiles
  FOR ALL
  TO service_role
  USING (true);

-- Add the missing foreign key constraint between products and profiles
-- First check if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_vendor_id_fkey' 
    AND table_name = 'products'
  ) THEN
    ALTER TABLE products 
    ADD CONSTRAINT products_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update products policies to ensure they work correctly
DROP POLICY IF EXISTS "Vendors can create products" ON products;
DROP POLICY IF EXISTS "Vendors can update own products" ON products;
DROP POLICY IF EXISTS "Vendors can view own products" ON products;

-- Recreate vendor policies with proper checks
CREATE POLICY "Vendors can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = vendor_id AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'vendor'
    )
  );

CREATE POLICY "Vendors can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can view own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (auth.uid() = vendor_id);