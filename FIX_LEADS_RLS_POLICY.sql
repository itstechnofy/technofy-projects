-- ============================================
-- COMPLETE FIX FOR RLS POLICY ON LEADS TABLE
-- Run this ENTIRE script in Supabase SQL Editor
-- This fixes the "new row violates row-level security policy" error
-- ============================================

-- Step 1: Check current policies (for debugging)
SELECT 
    'Current INSERT policies:' as info,
    policyname,
    cmd,
    roles::text,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'leads' 
AND schemaname = 'public'
AND cmd = 'INSERT';

-- Step 2: Drop ALL existing policies on leads table (INSERT, SELECT, UPDATE, DELETE)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop all policies, not just INSERT
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'leads' 
        AND schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.leads';
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Step 3: Create INSERT policy that allows EVERYONE (including anonymous users)
-- This is the most permissive policy - allows all users to insert
CREATE POLICY "Allow public to insert leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

-- Step 4: Recreate SELECT policy for admins only
CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Step 5: Recreate UPDATE policy for admins only
CREATE POLICY "Admins can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Step 6: Recreate DELETE policy for admins only
CREATE POLICY "Admins can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Step 7: Verify the INSERT policy was created correctly
SELECT 
    '✅ Verification - INSERT policies after fix:' as info,
    policyname,
    cmd,
    roles::text as allowed_roles,
    with_check
FROM pg_policies 
WHERE tablename = 'leads' 
AND schemaname = 'public'
AND cmd = 'INSERT';

-- Step 8: Test if RLS is enabled (should be true)
SELECT 
    'RLS Status:' as info,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'leads';

-- ============================================
-- IMPORTANT: After running this script:
-- 1. Check the "Verification" query results above
-- 2. You should see "Allow public to insert leads" with roles = "{public}"
-- 3. RLS should be enabled (true)
-- 4. Test the form again - it should work now!
-- ============================================

