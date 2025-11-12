# 🚀 Complete Vercel Deployment Guide

Your Supabase credentials are configured! Follow these steps to deploy your admin panel to Vercel.

## ✅ Step 1: Environment File Created

Your `.env.local` file has been created with your Supabase credentials. This file is for local development only.

## 📋 Step 2: Set Up Database in Supabase

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/wzagyfqpktbhlqpebufw

2. **Open SQL Editor** (left sidebar → SQL Editor)

3. **Copy and paste the entire contents of `SETUP_DATABASE.sql`** into the SQL Editor

4. **Click "Run"** to execute all the database setup

5. **Wait for success message** - This creates all necessary tables, policies, and indexes

## 👤 Step 3: Create Admin User

1. **Go to Authentication** → **Users** (in Supabase Dashboard)

2. **Click "Add User"** → **"Create new user"**

3. **Fill in:**
   - **Email**: Your admin email (e.g., `admin@yourdomain.com`)
   - **Password**: Choose a strong password (remember this!)
   - ✅ **Check "Auto Confirm User"**

4. **Click "Create User"**

5. **Copy the User ID** (you'll see it in the user list)

6. **Go to SQL Editor** and run:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('PASTE_YOUR_USER_ID_HERE', 'admin')
   ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
   ```
   Replace `PASTE_YOUR_USER_ID_HERE` with the actual User ID you copied.

## 🧪 Step 4: Test Locally First

Before deploying to Vercel, test everything locally:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open browser**: http://localhost:8080/admin

3. **Login** with your admin email and password

4. **Verify you can:**
   - ✅ See the admin dashboard
   - ✅ View leads (if any)
   - ✅ Access analytics tab
   - ✅ Navigate to settings

## 🌐 Step 5: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Setup admin panel for Vercel deployment"
   git push
   ```

2. **Go to Vercel Dashboard**: https://vercel.com/dashboard

3. **Click "Add New Project"**

4. **Import your GitHub repository**

5. **Configure project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Add Environment Variables:**
   - Click **"Environment Variables"**
   - Add these two:
     ```
     VITE_SUPABASE_URL = https://wzagyfqpktbhlqpebufw.supabase.co
     VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YWd5ZnFwa3RiaGxxcGVidWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTIwMzgsImV4cCI6MjA3ODA2ODAzOH0.C_9k7GTm7jafQRRTLQjlmh1AEN-lYKxnx9ryDEbPuEk
     ```

7. **Click "Deploy"**

8. **Wait for deployment to complete** (usually 1-2 minutes)

9. **Visit your live site**: `https://your-project.vercel.app/admin`

### Option B: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Set environment variables:**
   ```bash
   vercel env add VITE_SUPABASE_URL
   # Paste: https://wzagyfqpktbhlqpebufw.supabase.co
   
   vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
   # Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YWd5ZnFwa3RiaGxxcGVidWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTIwMzgsImV4cCI6MjA3ODA2ODAzOH0.C_9k7GTm7jafQRRTLQjlmh1AEN-lYKxnx9ryDEbPuEk
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

## ✅ Step 6: Verify Deployment

1. **Visit your Vercel URL**: `https://your-project.vercel.app`

2. **Go to admin panel**: `https://your-project.vercel.app/admin`

3. **Login** with your admin credentials

4. **Test all features:**
   - ✅ View leads
   - ✅ View analytics
   - ✅ Update lead status
   - ✅ Export data
   - ✅ Access settings

## 🔧 Optional: Deploy Edge Function for Analytics

If you want visit tracking to work:

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref wzagyfqpktbhlqpebufw
   ```

4. **Deploy the function:**
   ```bash
   supabase functions deploy track-visit
   ```

## 🆘 Troubleshooting

### Admin login not working on Vercel
- ✅ Verify environment variables are set correctly in Vercel
- ✅ Check that admin user exists in Supabase
- ✅ Verify `user_roles` table has the admin entry
- ✅ Check browser console for errors

### Database connection errors
- ✅ Verify Supabase project is active
- ✅ Check environment variables match your Supabase credentials
- ✅ Ensure database migrations have been run

### Build errors on Vercel
- ✅ Check build logs in Vercel dashboard
- ✅ Verify all dependencies are in `package.json`
- ✅ Ensure environment variables are set before build

## 🎉 Success!

Your admin panel is now live on Vercel! 

**Your Supabase Project**: https://wzagyfqpktbhlqpebufw.supabase.co  
**Your Vercel Site**: https://your-project.vercel.app

---

**Need help?** Check the browser console (F12) and Vercel deployment logs for any errors.

