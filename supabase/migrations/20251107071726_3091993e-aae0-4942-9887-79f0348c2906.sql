-- Drop the existing policy
DROP POLICY IF EXISTS "Anonymous can insert leads" ON public.leads;

-- Create a new policy that explicitly allows anonymous inserts
CREATE POLICY "Allow anonymous insert leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);