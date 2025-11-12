-- ============================================
-- CREATE ADMIN USER
-- Run this AFTER creating the user in Supabase Dashboard
-- ============================================

-- Step 1: First, create the user in Supabase Dashboard:
-- Go to: Authentication > Users > Add User > Create new user
-- Email: Howexmarketing@gmail.com
-- Password: Technofy2025@!
-- ✅ Check "Auto Confirm User"
-- Click "Create User"
-- Copy the User ID

-- Step 2: Replace 'YOUR_USER_ID_HERE' below with the actual User ID from Step 1
-- Then run this SQL:

INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- ============================================
-- ALTERNATIVE: If you want to find the user ID by email, use this:
-- ============================================

-- First, find the user ID:
-- SELECT id, email FROM auth.users WHERE email = 'Howexmarketing@gmail.com';

-- Then use that ID in the INSERT statement above

