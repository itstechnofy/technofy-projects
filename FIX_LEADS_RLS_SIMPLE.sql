-- ============================================
-- SIMPLE FIX - Handles existing policies properly
-- ============================================

-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Allow public to insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anon to insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated to insert leads" ON public.leads;

-- Create policy that explicitly allows anon role
CREATE POLICY "Allow anon to insert leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Also allow authenticated users
CREATE POLICY "Allow authenticated to insert leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also create public policy (most permissive - allows everyone)
CREATE POLICY "Allow public to insert leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

-- Verify all INSERT policies
SELECT 
    '✅ Current INSERT policies:' as status,
    policyname,
    cmd,
    roles::text as allowed_roles
FROM pg_policies 
WHERE tablename = 'leads' 
AND schemaname = 'public'
AND cmd = 'INSERT'
ORDER BY policyname;

