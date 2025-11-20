-- ============================================
-- IMMEDIATE FIX FOR LEADS RLS POLICY
-- Run this in Supabase SQL Editor RIGHT NOW to fix the issue
-- This will allow form submissions from all browsers including Opera
-- ============================================

-- Step 1: Drop ALL existing INSERT policies on leads table
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'leads' 
        AND schemaname = 'public'
        AND cmd = 'INSERT'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.leads';
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Step 2: Create a comprehensive policy that allows EVERYONE to insert
-- Using 'public' role ensures it works for anon, authenticated, and any other role
CREATE POLICY "Allow public to insert leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

-- Step 3: Also explicitly allow anon role (for extra safety)
CREATE POLICY "Allow anon to insert leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Step 4: Also explicitly allow authenticated role (in case user is logged in)
CREATE POLICY "Allow authenticated to insert leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 5: Verify RLS is enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'leads'
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS enabled on leads table';
    ELSE
        RAISE NOTICE 'RLS already enabled on leads table';
    END IF;
END $$;

-- Step 6: Verify policies were created correctly
SELECT 
    '✅ INSERT policies after fix:' as status,
    policyname,
    cmd,
    roles::text as allowed_roles,
    with_check
FROM pg_policies 
WHERE tablename = 'leads' 
AND schemaname = 'public'
AND cmd = 'INSERT'
ORDER BY policyname;

-- ============================================
-- EXPECTED RESULT:
-- You should see 3 policies:
-- 1. "Allow anon to insert leads" - roles: {anon}
-- 2. "Allow authenticated to insert leads" - roles: {authenticated}
-- 3. "Allow public to insert leads" - roles: {public}
-- ============================================



