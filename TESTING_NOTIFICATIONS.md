# Testing Notification System - Step by Step

## ✅ Migration Complete!
The database trigger is now active. Here's how to test everything:

---
 
## Step 1: Test Notification Sounds

1. **Login to Admin Dashboard**
   - Go to your admin login page
   - Login with your admin credentials

2. **Go to Notification Settings**
   - Click the **Settings** icon (gear) in the top right
   - Or navigate to `/admin/settings`

3. **Test Sound**
   - Make sure "Enable notification sound" is **ON** (toggle should be purple/active)
   - Click **"Play test sound"** button
   - You should hear a beep sound
   - If you don't hear it, make sure your browser/device volume is up

4. **Enable Desktop Notifications** (Optional)
   - Toggle "Enable desktop notifications" to **ON**
   - Browser will ask for permission - click **"Allow"**
   - This enables desktop notifications even when tab is not active

5. **Save Settings**
   - Click **"Save settings"** button at the bottom

---

## Step 2: Test Notification System

1. **Send Test Notification**
   - Still in Settings page
   - Click **"Send test notification"** button
   - You should see:
     - ✅ A toast notification appear
     - ✅ Hear a sound (if enabled)
     - ✅ See desktop notification (if enabled)
     - ✅ See notification in the bell icon (top right)

2. **Check Notification Bell**
   - Click the **bell icon** (🔔) in the top right of admin dashboard
   - You should see your test notification listed
   - Click on it to mark as read

---

## Step 3: Test Lead Notifications (The Main Feature!)

### Option A: Test from Public Site (Recommended)

1. **Open Your Public Website**
   - Open your site in a new tab/window (or use incognito)
   - Navigate to the contact form section

2. **Submit a Test Inquiry**
   - Fill out the contact form:
     - Name: "Test User"
     - Phone: Any number
     - Message: "This is a test inquiry"
     - Select a channel (WhatsApp, Email, etc.)
   - Click submit

3. **Check Admin Dashboard**
   - Go back to your admin dashboard
   - You should **automatically** see:
     - ✅ New notification in the bell icon
     - ✅ Toast notification appear
     - ✅ Sound play (if enabled)
     - ✅ Desktop notification (if enabled)
   - The notification should say: **"New Lead Received"** with message **"Test User submitted a contact form"**

### Option B: Test from Supabase Dashboard (Quick Check)

1. **Go to Supabase Dashboard**
   - Navigate to **Table Editor**
   - Select **`leads`** table

2. **Insert Test Lead**
   - Click **"Insert row"**
   - Fill in:
     - `name`: "Test Lead"
     - `message`: "Test message"
     - `contact_method`: "email"
   - Click **"Save"**

3. **Check Notifications**
   - Go to **`admin_notifications`** table
   - You should see a new notification created automatically
   - Check admin dashboard - notification should appear

---

## Step 4: Verify Everything Works

### ✅ Checklist:

- [ ] Test sound plays when clicking "Play test sound"
- [ ] Test notification appears when clicking "Send test notification"
- [ ] Notification appears in bell icon
- [ ] Sound plays when notification arrives (if enabled)
- [ ] Desktop notification shows (if enabled and permission granted)
- [ ] Lead notification appears automatically when form is submitted
- [ ] Notification shows correct lead name and message

---

## Troubleshooting

### Sound Not Working?
- Make sure sound is enabled in settings
- Check browser/device volume
- Try clicking anywhere on the page first (user interaction required)
- Check browser console for errors (F12)

### Desktop Notifications Not Working?
- Make sure you clicked "Allow" when browser asked for permission
- Check browser settings - some browsers block notifications
- Try toggling the setting off and on again

### Lead Notifications Not Appearing?
- Check Supabase dashboard → `admin_notifications` table - is notification created?
- Check browser console for errors (F12)
- Verify you're logged in as admin
- Check that the trigger exists: Supabase → Database → Functions → `notify_new_lead`
- Check that trigger is active: Supabase → Database → Triggers → `trigger_notify_new_lead`

### Still Having Issues?
1. Check browser console (F12) for errors
2. Check Supabase logs for database errors
3. Verify RLS policies allow admin users to view notifications
4. Make sure you have admin role assigned in `user_roles` table

---

## Success Indicators

✅ **Everything is working if:**
- You hear sounds when notifications arrive
- Desktop notifications pop up (if enabled)
- Lead notifications appear automatically when someone submits the contact form
- All notifications show in the bell icon dropdown

🎉 **You're all set!** The notification system is now fully functional.

