-- Create visits table for anonymous tracking
CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  device TEXT,
  browser TEXT,
  ip_hash TEXT,
  session_id TEXT,
  geo_source TEXT DEFAULT 'ip'
);

-- Add index for common queries
CREATE INDEX idx_visits_occurred_at ON public.visits(occurred_at);
CREATE INDEX idx_visits_ip_hash ON public.visits(ip_hash);
CREATE INDEX idx_visits_session_id ON public.visits(session_id);

-- Enable RLS (public read for admins only)
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Only admins can view visits
CREATE POLICY "Admins can view all visits"
ON public.visits
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Add optional geo fields to leads table for better tracking
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS geo_source TEXT DEFAULT 'ip';