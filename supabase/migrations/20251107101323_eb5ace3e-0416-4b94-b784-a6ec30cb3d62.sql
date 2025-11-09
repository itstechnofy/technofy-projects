-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('lead', 'analytics', 'account', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT false,
  meta JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  desktop_push BOOLEAN NOT NULL DEFAULT false,
  dnd_enabled BOOLEAN NOT NULL DEFAULT false,
  dnd_start TEXT DEFAULT '22:00',
  dnd_end TEXT DEFAULT '07:00',
  timezone TEXT NOT NULL DEFAULT 'Asia/Manila',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_notifications
CREATE POLICY "Admins can view their notifications"
ON public.admin_notifications
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update their notifications"
ON public.admin_notifications
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can insert notifications"
ON public.admin_notifications
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for admin_settings
CREATE POLICY "Admins can view their settings"
ON public.admin_settings
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update their settings"
ON public.admin_settings
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can insert their settings"
ON public.admin_settings
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND has_role(auth.uid(), 'admin'::app_role)
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON public.admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON public.admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_user_id ON public.admin_notifications(user_id);

-- Trigger for updated_at on admin_settings
CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION update_admin_settings_updated_at();