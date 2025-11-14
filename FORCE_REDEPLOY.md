# Force Clean Redeploy in Vercel

The deployment is still using cached environment variables. Follow these steps:

## Step 1: Verify Environment Variable Value

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Click on `VITE_SUPABASE_URL` to edit it
3. **Verify the value is exactly**: `https://wzagyfqpktbhlqpebufw.supabase.co`
4. Make sure there are NO extra spaces before or after
5. Click Save

## Step 2: Delete and Re-add (Force Refresh)

Sometimes Vercel caches the old value. Try this:

1. **Delete** the `VITE_SUPABASE_URL` variable (click minus icon)
2. Click **Save**
3. **Add it back** with the exact value: `https://wzagyfqpktbhlqpebufw.supabase.co`
4. Make sure "Production, Preview, and Development" are all checked
5. Click **Save**

## Step 3: Clear Build Cache and Redeploy

1. Go to **Deployments** tab
2. Click on your latest deployment
3. Click **three dots (⋯)** → **Redeploy**
4. **IMPORTANT**: Check the box that says "Use existing Build Cache" and **UNCHECK it**
5. Click **Redeploy**

## Step 4: Wait and Verify

1. Wait 2-3 minutes for deployment to complete
2. Check the build logs to ensure it's using the new environment variables
3. Visit your site and check browser console (F12)
4. You should see: "✅ Supabase environment variables loaded successfully"
5. The console should show the correct URL starting with `https://wzagyfqpktbhlqpebufw...`

## Alternative: Push a New Commit

If redeploy doesn't work, push a new commit to force a fresh build:

```bash
# Make a small change
echo "// Force redeploy" >> src/App.tsx
git add .
git commit -m "Force redeploy with updated env vars"
git push
```

This will trigger a completely fresh build with the updated environment variables.

