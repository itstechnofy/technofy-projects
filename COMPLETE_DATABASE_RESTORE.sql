-- ============================================
-- COMPLETE DATABASE RESTORE
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Remove phone from contact_method constraint (RESTORE)
ALTER TABLE public.leads 
DROP CONSTRAINT IF EXISTS leads_contact_method_check;

ALTER TABLE public.leads 
ADD CONSTRAINT leads_contact_method_check 
CHECK (contact_method IN ('whatsapp', 'viber', 'messenger', 'email'));

-- Step 2: Verify constraint is correct
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.leads'::regclass
AND conname = 'leads_contact_method_check';

-- Step 3: Keep realtime enabled (this is fine, no need to remove)
-- Realtime for leads table is already enabled and working fine

