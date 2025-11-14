# How to Run the Database Migration

## Migration File
**File:** `supabase/migrations/20251113150549_create_lead_notification_trigger.sql`

## Step-by-Step Instructions

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on **"SQL Editor"** in the left sidebar
   - Click **"New query"** button (top right)

3. **Copy the Migration SQL**
   - Open the file: `supabase/migrations/20251113150549_create_lead_notification_trigger.sql`
   - Copy **ALL** the contents (Ctrl+A, then Ctrl+C)

4. **Paste and Run**
   - Paste the SQL into the SQL Editor
   - Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
   - Wait for success message: "Success. No rows returned"

5. **Verify**
   - The migration creates:
     - Function: `get_admin_user_ids()` - Helper function to get admin users
     - Function: `notify_new_lead()` - Trigger function for notifications
     - Trigger: `trigger_notify_new_lead` - Automatically fires when leads are inserted

### Method 2: Supabase CLI (If Installed)

If you have Supabase CLI installed and linked to your project:

```bash
# Apply the migration
supabase db push

# Or apply specific migration
supabase migration up
```

## What This Migration Does

1. **Creates `get_admin_user_ids()` function**
   - Allows the notification service to get all admin user IDs
   - Bypasses RLS restrictions using SECURITY DEFINER

2. **Creates `notify_new_lead()` function**
   - Automatically creates notifications for all admin users
   - Fires whenever a new lead is inserted into the `leads` table

3. **Creates `trigger_notify_new_lead` trigger**
   - Automatically executes when a new lead is created
   - No code changes needed - works automatically!

## Testing

After running the migration:

1. Submit a contact form from your public website
2. Check the admin dashboard - you should see a notification
3. The notification will appear for all admin users automatically

## Troubleshooting

If you get an error:
- Make sure you're connected to the correct Supabase project
- Check that the `user_roles` and `admin_notifications` tables exist
- Verify you have the necessary permissions (should work if you're the project owner)

