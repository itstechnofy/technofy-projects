# URGENT: Clear Build Cache - Old URL Still Being Used

The deployment is using a **cached build** with the old environment variable. Even though you set it correctly in Vercel, the build cache has the old value baked in.

## 🔴 CRITICAL FIX - Do This Now:

### Option 1: Delete and Re-add Environment Variable (Recommended)

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Delete `VITE_SUPABASE_URL`:**
   - Click the **minus icon (-)** next to `VITE_SUPABASE_URL`
   - Click **Save**

3. **Add it back:**
   - Click **"Add Another"**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://wzagyfqpktbhlqpebufw.supabase.co` (copy-paste exactly)
   - **Environments**: Check ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

4. **Go to Deployments tab**

5. **Redeploy WITHOUT cache:**
   - Click **three dots (⋯)** on latest deployment
   - Click **"Redeploy"**
   - **IMPORTANT**: If you see "Use existing Build Cache" checkbox, **UNCHECK IT**
   - Click **"Redeploy"**

6. **Wait 2-3 minutes** for deployment

### Option 2: Use Vercel CLI to Force Clean Build

If you have Vercel CLI installed:

```bash
vercel --prod --force
```

This forces a completely fresh build without any cache.

## ✅ After Redeploy:

1. Visit your site
2. Open browser console (F12)
3. You should see:
   - `Full Supabase URL: https://wzagyfqpktbhlqpebufw.supabase.co`
   - `URL contains wzagyfqpktbhlqpebufw: ✅ YES`
   - `URL contains krjjvzxezjuiuulimlfh: ✅ NO`

## 🚨 Why This Happens:

Vite builds environment variables **at build time** into the JavaScript bundle. Even if you update the environment variable in Vercel, if the build cache is used, it will still have the old value.

**Solution**: Delete and re-add the variable, then redeploy WITHOUT cache.

