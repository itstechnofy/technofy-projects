-- Grant admin role to Howexmarketing@gmail.com
-- User ID: 8be9d05d-8ccc-452c-a4a1-95688abb8528

-- First, delete any existing roles for this user (to ensure clean state)
DELETE FROM public.user_roles 
WHERE user_id = '8be9d05d-8ccc-452c-a4a1-95688abb8528';

-- Then insert the admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('8be9d05d-8ccc-452c-a4a1-95688abb8528', 'admin');

-- Verify the admin role was added:
SELECT ur.role, u.email, u.id
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.id = '8be9d05d-8ccc-452c-a4a1-95688abb8528';
