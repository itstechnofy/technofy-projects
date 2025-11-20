-- Fix RLS policy for leads table to allow anonymous inserts
-- This fixes the "new row violates row-level security policy" error

-- Drop ALL existing INSERT policies on leads table
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

-- Create comprehensive policies that allow EVERYONE to insert leads
-- Using 'public' role ensures it works for all users (anon, authenticated, etc.)
CREATE POLICY "Allow public to insert leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

-- Also explicitly allow anon role (for extra safety and browser compatibility)
CREATE POLICY "Allow anon to insert leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Also explicitly allow authenticated role (in case user is logged in)
CREATE POLICY "Allow authenticated to insert leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Verify the policies were created
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'leads' 
        AND schemaname = 'public'
        AND policyname = 'Allow public to insert leads'
        AND cmd = 'INSERT'
    ) THEN
        RAISE NOTICE '✅ INSERT policies created successfully for leads table';
    ELSE
        RAISE EXCEPTION '❌ Failed to create INSERT policy for leads table';
    END IF;
END $$;

