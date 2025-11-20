-- Optimize notification trigger for fastest possible delivery
-- This migration updates the trigger to use a single INSERT instead of a loop

-- Create optimized function to notify admins when a new lead is created
-- OPTIMIZED: Single INSERT instead of loop for maximum speed
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Single INSERT for all admin users - MUCH FASTER than loop
  -- This executes in a single database operation instead of multiple
  INSERT INTO admin_notifications (
    type,
    title,
    message,
    meta,
    user_id,
    read
  )
  SELECT 
    'lead',
    'New Lead Received',
    NEW.name || ' submitted a contact form',
    jsonb_build_object('lead_id', NEW.id),
    ur.user_id,
    false
  FROM user_roles ur
  WHERE ur.role = 'admin';
  
  RETURN NEW;
END;
$$;

-- Ensure trigger is active and optimized
DROP TRIGGER IF EXISTS trigger_notify_new_lead ON leads;
CREATE TRIGGER trigger_notify_new_lead
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();

-- Add index on admin_notifications for faster realtime delivery
CREATE INDEX IF NOT EXISTS idx_admin_notifications_user_id_created_at 
ON admin_notifications(user_id, created_at DESC);

-- Ensure realtime is enabled for instant delivery
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS admin_notifications;

