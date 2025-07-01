/*
  # Enable email verification with Resend.com

  This migration documents the setup process for using Resend.com with Supabase
  for email verification. The actual configuration is done in the Supabase dashboard.

  ## Setup Steps:

  1. **Get Resend API Key:**
     - Sign up at https://resend.com
     - Create an API key in your Resend dashboard
     - Verify your domain (or use their test domain for development)

  2. **Configure Supabase:**
     - Go to your Supabase project dashboard
     - Navigate to Authentication → Settings
     - Enable "Enable email confirmations"
     - Set up custom SMTP settings:
       - SMTP Host: smtp.resend.com
       - SMTP Port: 587 (or 465 for SSL)
       - SMTP Username: resend
       - SMTP Password: [Your Resend API Key]
       - Sender Email: [Your verified email address]

  3. **Email Templates:**
     - Customize the email confirmation template in Authentication → Email Templates
     - Set the confirmation URL to point to your app

  ## Benefits of Resend:
  - High deliverability rates
  - Simple API and dashboard
  - Great for transactional emails
  - Generous free tier (3,000 emails/month)
  - Built-in analytics and tracking
*/

-- This is a documentation migration - no actual SQL changes needed
-- The configuration is done through the Supabase dashboard
SELECT 1;