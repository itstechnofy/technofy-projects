-- ============================================
-- SAFE FIX - No DROP commands, just creates new policies
-- This won't show destructive operation warning
-- ============================================

-- Create policy for anonymous users (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'leads' 
        AND schemaname = 'public'
        AND policyname = 'Allow anon to insert leads'
        AND cmd = 'INSERT'
    ) THEN
        CREATE POLICY "Allow anon to insert leads"
        ON public.leads
        FOR INSERT
        TO anon
        WITH CHECK (true);
        RAISE NOTICE '✅ Created policy: Allow anon to insert leads';
    ELSE
        RAISE NOTICE 'ℹ️ Policy already exists: Allow anon to insert leads';
    END IF;
END $$;

-- Create policy for authenticated users (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'leads' 
        AND schemaname = 'public'
        AND policyname = 'Allow authenticated to insert leads'
        AND cmd = 'INSERT'
    ) THEN
        CREATE POLICY "Allow authenticated to insert leads"
        ON public.leads
        FOR INSERT
        TO authenticated
        WITH CHECK (true);
        RAISE NOTICE '✅ Created policy: Allow authenticated to insert leads';
    ELSE
        RAISE NOTICE 'ℹ️ Policy already exists: Allow authenticated to insert leads';
    END IF;
END $$;

-- Also create policy for public role (most permissive)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'leads' 
        AND schemaname = 'public'
        AND policyname = 'Allow public to insert leads'
        AND cmd = 'INSERT'
    ) THEN
        CREATE POLICY "Allow public to insert leads"
        ON public.leads
        FOR INSERT
        TO public
        WITH CHECK (true);
        RAISE NOTICE '✅ Created policy: Allow public to insert leads';
    ELSE
        RAISE NOTICE 'ℹ️ Policy already exists: Allow public to insert leads';
    END IF;
END $$;

-- Verify all INSERT policies
SELECT 
    'Current INSERT policies:' as status,
    policyname,
    cmd,
    roles::text as allowed_roles
FROM pg_policies 
WHERE tablename = 'leads' 
AND schemaname = 'public'
AND cmd = 'INSERT'
ORDER BY policyname;



