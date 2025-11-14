-- Add INSERT policy for visits table
-- This allows the edge function to insert visits (though service role key should bypass RLS)
-- This is a safety measure in case RLS is enforced

-- Drop existing INSERT policy if any
DROP POLICY IF EXISTS "Allow service role to insert visits" ON public.visits;

-- Create policy that allows service role (edge function) to insert visits
-- Service role key bypasses RLS, but this ensures compatibility
CREATE POLICY "Allow service role to insert visits"
ON public.visits
FOR INSERT
TO service_role
WITH CHECK (true);

-- Also allow anonymous inserts as fallback (if not using service role)
CREATE POLICY "Allow anonymous to insert visits"
ON public.visits
FOR INSERT
TO anon
WITH CHECK (true);

