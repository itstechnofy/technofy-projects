# CLI Commands to Deploy track-visit Edge Function

## ⚠️ Important: Run these in your LOCAL TERMINAL (PowerShell/CMD), NOT in Supabase SQL Editor

---

## Step 1: Install Supabase CLI (if not installed)

```bash
npm install -g supabase
```

---

## Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

---

## Step 3: Link Your Project

```bash
supabase link --project-ref wzagyfqpktbhlqpebufw
```

---

## Step 4: Set Environment Variables (Secrets)

**Get your Service Role Key first:**
- Go to Supabase Dashboard → Settings → API
- Copy the **service_role** key (not the anon key)

Then run these commands (replace with your actual values):

```bash
supabase secrets set SUPABASE_URL=https://wzagyfqpktbhlqpebufw.supabase.co
```

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

```bash
supabase secrets set SECRET_SALT=your-random-salt-here
```

**Example:**
```bash
supabase secrets set SECRET_SALT=my-secret-salt-12345
```

---

## Step 5: Deploy the Function

```bash
supabase functions deploy track-visit
```

---

## Step 6: Verify Deployment

```bash
supabase functions list
```

You should see `track-visit` in the list.

---

## All Commands in One Block (Copy & Paste)

```bash
# Install CLI (if needed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref wzagyfqpktbhlqpebufw

# Set secrets (replace with your actual values)
supabase secrets set SUPABASE_URL=https://wzagyfqpktbhlqpebufw.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
supabase secrets set SECRET_SALT=your-random-salt

# Deploy
supabase functions deploy track-visit

# Verify
supabase functions list
```

---

## Where to Run These Commands

✅ **Run in:** Your local terminal (PowerShell or CMD on Windows)  
❌ **NOT in:** Supabase SQL Editor (that's for SQL only)

---

## Alternative: Use Supabase Website Editor (Easier!)

If you prefer not to use CLI, you can:
1. Go to Edge Functions → "Open Editor"
2. Create new function: `track-visit`
3. Paste the code
4. Deploy
5. Set secrets in Edge Functions → Secrets

This is actually easier than CLI! 😊


