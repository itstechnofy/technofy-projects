-- ============================================
-- QUICK FIX - Run this if above doesn't work
-- ============================================

-- Drop ALL policies first
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'leads' 
        AND schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.leads';
    END LOOP;
END $$;

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create single most permissive INSERT policy
CREATE POLICY "leads_insert_all"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

-- Verify
SELECT policyname, cmd, roles::text 
FROM pg_policies 
WHERE tablename = 'leads' 
AND cmd = 'INSERT';



