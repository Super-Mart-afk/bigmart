/*
  # Seed Initial Data for SuperMarket

  1. Categories and Subcategories
    - Insert predefined categories with subcategories
  
  2. Admin User Setup
    - Note: Admin user must be created through Supabase Auth first
*/

-- Insert Categories
INSERT INTO categories (id, name, slug, icon, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Electronics & Computers', 'electronics-computers', 'Laptop', 'Latest technology and computer equipment'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Fashion & Beauty', 'fashion-beauty', 'Shirt', 'Clothing, accessories, and beauty products'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Home & Kitchen', 'home-kitchen', 'Home', 'Home improvement and kitchen essentials'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Health & Personal Care', 'health-personal-care', 'Heart', 'Health, wellness, and personal care items'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Sports & Fitness', 'sports-fitness', 'Dumbbell', 'Sports equipment and fitness gear'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Books & Education', 'books-education', 'Book', 'Books, educational materials, and supplies'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Toys & Games', 'toys-games', 'Gamepad2', 'Toys, games, and entertainment'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Automotive', 'automotive', 'Car', 'Car accessories and automotive supplies');

-- Insert Subcategories
INSERT INTO subcategories (category_id, name, slug) VALUES
  -- Electronics & Computers
  ('550e8400-e29b-41d4-a716-446655440001', 'Smartphones & Tablets', 'smartphones-tablets'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Laptops & Computers', 'laptops-computers'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Audio & Headphones', 'audio-headphones'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Cameras & Photography', 'cameras-photography'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Gaming Consoles', 'gaming-consoles'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Accessories', 'electronics-accessories'),
  
  -- Fashion & Beauty
  ('550e8400-e29b-41d4-a716-446655440002', 'Women''s Clothing', 'womens-clothing'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Men''s Clothing', 'mens-clothing'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Shoes & Footwear', 'shoes-footwear'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Bags & Accessories', 'bags-accessories'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Beauty & Cosmetics', 'beauty-cosmetics'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Jewelry & Watches', 'jewelry-watches'),
  
  -- Home & Kitchen
  ('550e8400-e29b-41d4-a716-446655440003', 'Furniture', 'furniture'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Kitchen Appliances', 'kitchen-appliances'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Home Decor', 'home-decor'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Bedding & Bath', 'bedding-bath'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Storage & Organization', 'storage-organization'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Lighting', 'lighting'),
  
  -- Health & Personal Care
  ('550e8400-e29b-41d4-a716-446655440004', 'Vitamins & Supplements', 'vitamins-supplements'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Personal Care', 'personal-care'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Medical Supplies', 'medical-supplies'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Fitness Equipment', 'fitness-equipment'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Baby Care', 'baby-care'),
  
  -- Sports & Fitness
  ('550e8400-e29b-41d4-a716-446655440005', 'Exercise Equipment', 'exercise-equipment'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Sports Gear', 'sports-gear'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Outdoor Activities', 'outdoor-activities'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Athletic Wear', 'athletic-wear'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Team Sports', 'team-sports'),
  
  -- Books & Education
  ('550e8400-e29b-41d4-a716-446655440006', 'Books', 'books'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Educational Materials', 'educational-materials'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Stationery', 'stationery'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Art & Craft Supplies', 'art-craft-supplies'),
  
  -- Toys & Games
  ('550e8400-e29b-41d4-a716-446655440007', 'Action Figures', 'action-figures'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Board Games', 'board-games'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Educational Toys', 'educational-toys'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Outdoor Toys', 'outdoor-toys'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Puzzles', 'puzzles'),
  
  -- Automotive
  ('550e8400-e29b-41d4-a716-446655440008', 'Car Accessories', 'car-accessories'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Car Electronics', 'car-electronics'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Replacement Parts', 'replacement-parts'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Tools & Equipment', 'tools-equipment');