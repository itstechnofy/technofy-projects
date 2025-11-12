# Welcome to your Lovable project

## Project info

<!-- Updated: Admin panel configured for Vercel deployment -->

**URL**: https://lovable.dev/projects/dfef5e28-562d-4ad1-b6f6-7b7b7983b5a4

## 🚀 Quick Start - Run Locally

### Prerequisites
- Node.js (v18+) - [Download](https://nodejs.org/)
- Supabase account - [Sign up](https://supabase.com)

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` file** in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
   ```
   Get these values from: Supabase Dashboard → Settings → API

3. **Set up database:**
   - Go to Supabase Dashboard → SQL Editor
   - Run migration files from `supabase/migrations/` folder

4. **Create admin user:**
   - Supabase Dashboard → Authentication → Users → Add User
   - Then in SQL Editor, run:
     ```sql
     INSERT INTO user_roles (user_id, role)
     VALUES ('YOUR_USER_ID', 'admin');
     ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   - Main site: http://localhost:8080
   - Admin panel: http://localhost:8080/admin

📖 **For detailed local setup instructions, see [LOCAL_SETUP.md](./LOCAL_SETUP.md)**

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/dfef5e28-562d-4ad1-b6f6-7b7b7983b5a4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/dfef5e28-562d-4ad1-b6f6-7b7b7983b5a4) and click on Share -> Publish.

## Deploying to Vercel

### Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. A Vercel account (sign up at [vercel.com](https://vercel.com))

### Step 1: Set up Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy your **Project URL** and **anon/public key**

### Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New Project**
4. Import your GitHub repository
5. Configure environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key
6. Click **Deploy**

### Step 3: Set up Admin User

1. Go to your Supabase dashboard > **Authentication** > **Users**
2. Create a new user or use an existing one
3. Go to **SQL Editor** and run:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('your-user-id-here', 'admin')
   ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
   ```
   Replace `'your-user-id-here'` with the actual user ID from the Authentication table.

### Step 4: Deploy Supabase Edge Function (Optional)

If you want visit tracking to work:

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`
4. Deploy the function: `supabase functions deploy track-visit`

### Environment Variables Required

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
