-- ============================================
-- COMPREHENSIVE DIAGNOSTIC AND FIX FOR RLS
-- Pehle diagnose karein, phir fix karein
-- ============================================

-- STEP 1: Check current policies (Diagnostic)
SELECT 
    '🔍 CURRENT POLICIES:' as info,
    policyname,
    cmd,
    roles::text as allowed_roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'leads' 
AND schemaname = 'public'
ORDER BY cmd, policyname;

-- STEP 2: Check RLS status
SELECT 
    '🔍 RLS STATUS:' as info,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'leads';

-- STEP 3: Drop ALL existing policies (Complete cleanup)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop ALL policies (INSERT, SELECT, UPDATE, DELETE)
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'leads' 
        AND schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.leads';
        RAISE NOTICE '✅ Dropped policy: %', r.policyname;
    END LOOP;
    
    RAISE NOTICE '✅ All existing policies dropped';
END $$;

-- STEP 4: Ensure RLS is enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create INSERT policy for PUBLIC (most permissive - works for everyone)
CREATE POLICY "leads_insert_public"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

-- STEP 6: Create INSERT policy for ANON (explicit for anonymous users)
CREATE POLICY "leads_insert_anon"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- STEP 7: Create INSERT policy for AUTHENTICATED (for logged-in users)
CREATE POLICY "leads_insert_authenticated"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- STEP 8: Recreate SELECT policy for admins (if needed)
CREATE POLICY "leads_select_admin"
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

-- STEP 9: Recreate UPDATE policy for admins (if needed)
CREATE POLICY "leads_update_admin"
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

-- STEP 10: Recreate DELETE policy for admins (if needed)
CREATE POLICY "leads_delete_admin"
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

-- STEP 11: Verify all policies were created
SELECT 
    '✅ FINAL POLICIES AFTER FIX:' as info,
    policyname,
    cmd,
    roles::text as allowed_roles,
    CASE 
        WHEN with_check = 'true' THEN '✅'
        ELSE '❌'
    END as with_check_status
FROM pg_policies 
WHERE tablename = 'leads' 
AND schemaname = 'public'
ORDER BY cmd, policyname;

-- STEP 12: Final verification - Check INSERT policies specifically
SELECT 
    '✅ INSERT POLICIES VERIFICATION:' as info,
    COUNT(*) as total_insert_policies,
    STRING_AGG(policyname, ', ') as policy_names
FROM pg_policies 
WHERE tablename = 'leads' 
AND schemaname = 'public'
AND cmd = 'INSERT';

-- ============================================
-- EXPECTED RESULTS:
-- 
-- After running this, you should see:
-- 1. At least 3 INSERT policies (public, anon, authenticated)
-- 2. RLS enabled = true
-- 3. All policies with WITH CHECK (true) for INSERT
-- ============================================



