/*
  # Disable email verification

  This migration disables email verification in Supabase Auth settings.
  Users will be able to register and login immediately without email confirmation.

  1. Changes
    - Disable email confirmation requirement
    - Allow users to sign in immediately after registration
*/

-- Update auth configuration to disable email confirmation
-- Note: This is typically done through the Supabase dashboard, but we can also
-- handle it programmatically by ensuring our app doesn't require email confirmation

-- For now, we'll update our application logic to handle unconfirmed emails
-- The actual Supabase auth settings need to be changed in the dashboard:
-- 1. Go to Authentication > Settings
-- 2. Turn off "Enable email confirmations"

-- This migration serves as documentation of the change needed
SELECT 1; -- Placeholder query since we can't directly modify auth settings via SQL