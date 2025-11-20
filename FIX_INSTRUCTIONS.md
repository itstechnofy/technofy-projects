# Fix for RLS Policy Error in Opera Browser

## Problem
The form submission is failing in Opera browser (and potentially other browsers) with the error:
```
new row violates row-level security policy for table "leads"
```

## Root Cause
The Row-Level Security (RLS) policy on the `leads` table only allows the `anon` role to insert, but the Supabase client may not always be recognized as `anon` in certain browsers or scenarios.

## Solution

### Option 1: Immediate Fix (Recommended)
Run the SQL script `FIX_LEADS_RLS_IMMEDIATE.sql` in your Supabase SQL Editor:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire contents of `FIX_LEADS_RLS_IMMEDIATE.sql`
4. Click "Run" or press Ctrl+Enter
5. Verify you see 3 policies created in the results

### Option 2: Apply Migration
If you're using Supabase migrations, the new migration file `20250116000000_fix_leads_rls_comprehensive.sql` will automatically apply the fix when you run migrations.

## What the Fix Does

1. **Drops all existing INSERT policies** - Removes any conflicting or incomplete policies
2. **Creates 3 comprehensive policies**:
   - `Allow public to insert leads` - Allows everyone (most permissive)
   - `Allow anon to insert leads` - Explicitly allows anonymous users
   - `Allow authenticated to insert leads` - Allows logged-in users
3. **Ensures RLS is enabled** - Verifies Row-Level Security is active
4. **Verifies the fix** - Shows all created policies in the results

## Verification

After running the fix, you should see 3 INSERT policies in the results:
- `Allow anon to insert leads` with roles: `{anon}`
- `Allow authenticated to insert leads` with roles: `{authenticated}`
- `Allow public to insert leads` with roles: `{public}`

## Testing

After applying the fix:
1. Clear your browser cache
2. Try submitting the form in Opera browser
3. Check the browser console - you should see "✅ Lead saved successfully!" instead of the RLS error

## Notes

- This fix is safe and doesn't affect security for SELECT, UPDATE, or DELETE operations
- Only INSERT operations are made more permissive
- Admin-only policies for viewing/editing leads remain unchanged



