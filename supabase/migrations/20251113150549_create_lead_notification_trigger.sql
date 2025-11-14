-- Create security definer function to get all admin user IDs
-- This allows the notification service to query admin users without RLS restrictions
CREATE OR REPLACE FUNCTION get_admin_user_ids()
RETURNS TABLE(user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT ur.user_id
  FROM user_roles ur
  WHERE ur.role = 'admin';
END;
$$;

-- Create function to notify admins when a new lead is created
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user RECORD;
BEGIN
  -- Loop through all admin users and create notifications
  FOR admin_user IN
    SELECT user_id
    FROM user_roles
    WHERE role = 'admin'
  LOOP
    INSERT INTO admin_notifications (
      type,
      title,
      message,
      meta,
      user_id,
      read
    ) VALUES (
      'lead',
      'New Lead Received',
      NEW.name || ' submitted a contact form',
      jsonb_build_object('lead_id', NEW.id),
      admin_user.user_id,
      false
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger that fires after a lead is inserted
DROP TRIGGER IF EXISTS trigger_notify_new_lead ON leads;
CREATE TRIGGER trigger_notify_new_lead
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();

