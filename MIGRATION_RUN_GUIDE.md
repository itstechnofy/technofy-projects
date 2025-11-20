# Migration Kaise Run Karein (How to Run Migration)

## Method 1: Supabase Dashboard (Sabse Aasan - Recommended) ✅

Yeh sabse simple tareeqa hai. Direct Supabase Dashboard se SQL run karein:

### Steps:

1. **Supabase Dashboard kholo**
   - Browser mein [supabase.com](https://supabase.com) pe jao
   - Apna project select karo

2. **SQL Editor mein jao**
   - Left sidebar mein **"SQL Editor"** click karo
   - Ya direct URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql`

3. **SQL File kholo**
   - `FIX_LEADS_RLS_IMMEDIATE.sql` file kholo
   - Saara content copy karo (Ctrl+A, Ctrl+C)

4. **SQL Editor mein paste karo**
   - SQL Editor mein paste karo (Ctrl+V)
   - Ya file ka content manually type karo

5. **Run karo**
   - Bottom right mein **"Run"** button click karo
   - Ya **Ctrl+Enter** press karo

6. **Result check karo**
   - Aapko 3 policies dikhni chahiye:
     - `Allow anon to insert leads`
     - `Allow authenticated to insert leads`
     - `Allow public to insert leads`

7. **Test karo**
   - Opera browser mein form submit karo
   - Ab error nahi aana chahiye! ✅

---

## Method 2: Supabase CLI (Advanced)

Agar aap Supabase CLI use kar rahe hain:

### Prerequisites:
```bash
# Supabase CLI install karo (agar nahi hai)
npm install -g supabase
```

### Steps:

1. **Supabase project link karo**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

2. **Migration run karo**
   ```bash
   supabase db push
   ```
   
   Ya specific migration run karo:
   ```bash
   supabase migration up
   ```

3. **Verify karo**
   ```bash
   supabase db diff
   ```

---

## Method 3: Migration File Direct Copy-Paste

Agar aap migration file ka content direct run karna chahte hain:

1. `supabase/migrations/20250116000000_fix_leads_rls_comprehensive.sql` file kholo
2. Saara content copy karo
3. Supabase SQL Editor mein paste karo
4. Run button click karo

---

## Troubleshooting

### Agar error aaye:

**Error: "policy already exists"**
- Matlab policy pehle se hai
- Koi baat nahi, script automatically drop karke nayi banayegi

**Error: "permission denied"**
- Check karo ki aap project owner/admin ho
- Ya proper permissions ho

**Error: "table does not exist"**
- Pehle `leads` table create karo
- Ya `SETUP_DATABASE.sql` run karo

---

## Quick Check (Verification)

Migration run karne ke baad, yeh query run karo verify karne ke liye:

```sql
SELECT 
    policyname,
    cmd,
    roles::text as allowed_roles
FROM pg_policies 
WHERE tablename = 'leads' 
AND schemaname = 'public'
AND cmd = 'INSERT'
ORDER BY policyname;
```

**Expected Result:**
- 3 policies dikhni chahiye
- Har policy mein `WITH CHECK (true)` hona chahiye

---

## Important Notes

⚠️ **Migration run karne se pehle:**
- Backup le lo (agar important data hai)
- Production mein directly run karne se pehle test karo

✅ **Migration run karne ke baad:**
- Browser cache clear karo
- Form test karo different browsers mein
- Console mein errors check karo

---

## Still Having Issues?

Agar phir bhi problem ho:
1. Browser console check karo (F12)
2. Network tab mein request check karo
3. Supabase logs check karo
4. SQL Editor mein verification query run karo



