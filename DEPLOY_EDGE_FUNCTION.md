# Deploy track-visit Edge Function

## Option 1: Deploy via Supabase Dashboard (Easiest) ⭐

### Step 1: Open the Editor
1. In your Supabase Dashboard, go to **Edge Functions** (you're already there!)
2. Click **"<> Via Editor"** → **"Open Editor"** button

### Step 2: Create New Function
1. Click **"Create a new function"** or **"New Function"**
2. Name it: **`track-visit`** (exactly this name, lowercase with hyphen)
3. Click **"Create function"**

### Step 3: Copy the Code
1. Open the file: `supabase/functions/track-visit/index.ts` in your project
2. Copy **ALL** the code from that file
3. Paste it into the Supabase Editor (replace any default code)

### Step 4: Deploy
1. Click **"Deploy"** button (usually top right)
2. Wait for deployment to complete
3. You should see "Deployed successfully" message

### Step 5: Set Environment Variables (Important!)
1. Go to **Edge Functions** → **Secrets** (in left sidebar)
2. Add these secrets:
   - **`SUPABASE_URL`** = `https://wzagyfqpktbhlqpebufw.supabase.co`
   - **`SUPABASE_SERVICE_ROLE_KEY`** = (Get this from Settings → API → service_role key)
   - **`SECRET_SALT`** = (Optional - any random string for IP hashing)

**To get Service Role Key:**
- Go to **Settings** → **API** (in Supabase Dashboard)
- Scroll down to **"service_role"** key
- Copy it (keep it secret!)

### Step 6: Verify
1. Go back to **Edge Functions** → **Functions**
2. You should now see **`track-visit`** in the list
3. Status should be **"Active"**

---

## Option 2: Deploy via CLI (For Developers)

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login
```bash
supabase login
```
This will open your browser to authenticate.

### Step 3: Link Your Project
```bash
supabase link --project-ref wzagyfqpktbhlqpebufw
```

### Step 4: Set Secrets
```bash
supabase secrets set SUPABASE_URL=https://wzagyfqpktbhlqpebufw.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
supabase secrets set SECRET_SALT=your-random-salt-here
```

**To get Service Role Key:**
- Go to Supabase Dashboard → Settings → API
- Copy the **service_role** key

### Step 5: Deploy
```bash
supabase functions deploy track-visit
```

### Step 6: Verify
```bash
supabase functions list
```
You should see `track-visit` in the list.

---

## Quick Test After Deployment

1. **Visit your website** (public site, not admin)
2. **Open browser console** (F12)
3. **Check for errors** - should see no analytics errors
4. **Go to Admin Dashboard** → **Analytics tab**
5. **Wait a few seconds** - you should see your visit appear!

---

## Troubleshooting

### Function Not Appearing?
- Make sure you deployed it (not just saved)
- Check the function name is exactly `track-visit`
- Refresh the Edge Functions page

### Getting Errors?
- **Check Secrets**: Make sure all environment variables are set
- **Check Logs**: Go to Edge Functions → track-visit → Logs
- **Check Service Role Key**: Must be the service_role key, not anon key

### Still Not Working?
1. Check Edge Function logs in Supabase Dashboard
2. Check browser console (F12) for errors
3. Verify the function URL is accessible
4. Make sure RLS policies allow inserts (you already ran the migration)

---

## What This Function Does

The `track-visit` function:
- ✅ Tracks page visits automatically
- ✅ Gets visitor location (country, region, city)
- ✅ Detects device and browser
- ✅ Hashes IP addresses for privacy
- ✅ Stores data in `visits` table
- ✅ Works with analytics dashboard

Once deployed, analytics will start working automatically! 🎉

