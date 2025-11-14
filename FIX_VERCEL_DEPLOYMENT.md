# Fix "Invalid Credentials" on Vercel

The issue is that **Vercel needs your Supabase environment variables** to connect to your database.

## ✅ Quick Fix Steps:

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Find your project (or create a new one if you haven't deployed yet)

### Step 2: Add Environment Variables
1. Click on your project
2. Go to **Settings** → **Environment Variables**
3. Add these TWO variables:

**Variable 1:**
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://wzagyfqpktbhlqpebufw.supabase.co`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YWd5ZnFwa3RiaGxxcGVidWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTIwMzgsImV4cCI6MjA3ODA2ODAzOH0.C_9k7GTm7jafQRRTLQjlmh1AEN-lYKxnx9ryDEbPuEk`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### Step 3: Redeploy
1. After adding environment variables, go to **Deployments** tab
2. Click the **three dots (⋯)** on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic redeploy

### Step 4: Verify
1. Wait for deployment to complete (1-2 minutes)
2. Visit your Vercel URL: `https://your-project.vercel.app/admin`
3. Try logging in with:
   - Email: `Howexmarketing@gmail.com`
   - Password: `Technofy2025@!`

## 🔍 If Still Not Working:

### Check Browser Console
1. Open your live site
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for any red error messages
5. Common errors:
   - `Missing Supabase environment variables` → Env vars not set
   - `Invalid API key` → Wrong key in Vercel
   - `Network error` → Supabase URL incorrect

### Verify Environment Variables in Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Make sure both variables are there
3. Make sure they're enabled for **Production**
4. Check for typos (no extra spaces)

### Test Supabase Connection
Run this in Supabase SQL Editor to verify your user exists:
```sql
SELECT u.email, u.id, ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'Howexmarketing@gmail.com';
```

You should see:
- Email: `howexmarketing@gmail.com`
- Role: `admin`

## 📝 Common Issues:

1. **Environment variables not set** → Most common issue!
2. **Variables set but not redeployed** → Need to redeploy after adding env vars
3. **Wrong Supabase URL/key** → Double-check the values
4. **User not confirmed in Supabase** → Check Authentication → Users → User should be "Confirmed"

## ✅ After Fixing:

Once environment variables are set and you redeploy, the login should work!

