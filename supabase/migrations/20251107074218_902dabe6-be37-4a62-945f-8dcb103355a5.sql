-- Drop the existing policy
DROP POLICY IF EXISTS "Allow anonymous insert leads" ON public.leads;

-- Create a new policy that properly allows anonymous inserts
CREATE POLICY "Allow public to insert leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);