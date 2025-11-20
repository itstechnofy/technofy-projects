# Supabase Database Backup - Step by Step Guide
# Supabase Database Backup - مکمل گائیڈ

## Method 1: Supabase Dashboard Se Backup (سب سے آسان طریقہ)

### Step 1: Supabase Dashboard کھولیں
1. Browser میں [supabase.com](https://supabase.com) پر جائیں
2. اپنے account سے login کریں
3. اپنا project select کریں

### Step 2: Database Settings میں جائیں
1. Left sidebar میں **Settings** (⚙️) icon پر click کریں
2. **Database** section میں جائیں
3. Scroll down کریں **Connection string** section تک

### Step 3: Connection String Copy کریں
1. **Connection string** section میں **URI** یا **Connection pooling** option select کریں
2. Connection string copy کریں (یہ کچھ ایسا لگے گا: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)

### Step 4: pg_dump Command Run کریں
Terminal/PowerShell میں یہ command run کریں:

```bash
pg_dump "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Important Notes:**
- `[YOUR-PASSWORD]` کی جگہ اپنا actual password لکھیں
- `db.xxxxx.supabase.co` کی جگہ اپنا actual database URL لکھیں
- Backup file automatically current directory میں save ہو جائے گی

---

## Method 2: Supabase CLI استعمال کر کے (Recommended)

### Step 1: Supabase CLI Install کریں
PowerShell میں:

```powershell
# npm se install
npm install -g supabase

# یا scoop se install (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Step 2: Supabase Login کریں
```bash
supabase login
```
Browser میں login کریں

### Step 3: Project Link کریں
```bash
supabase link --project-ref your-project-ref
```
Project ref آپکو Supabase dashboard میں project settings میں ملے گا

### Step 4: Database Dump کریں
```bash
supabase db dump -f backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

---

## Method 3: SQL Editor سے Manual Backup

### Step 1: SQL Editor کھولیں
1. Supabase Dashboard میں
2. Left sidebar میں **SQL Editor** پر click کریں

### Step 2: Schema Export کریں
یہ query run کریں schema export کے لیے:

```sql
-- All tables ka schema
SELECT 
    'CREATE TABLE ' || schemaname || '.' || tablename || ' (' || 
    string_agg(column_name || ' ' || data_type, ', ') || 
    ');' as create_statement
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY schemaname, tablename;
```

### Step 3: Data Export کریں
ہر table کے لیے:

```sql
-- Example: leads table ka data
COPY (SELECT * FROM public.leads) TO STDOUT WITH CSV HEADER;
```

**Note:** یہ method بہت وقت لگاتا ہے، Method 1 یا 2 استعمال کریں

---

## Method 4: pgAdmin یا DBeaver استعمال کر کے

### Step 1: Database Tool Install کریں
- **pgAdmin** (https://www.pgadmin.org/download/) یا
- **DBeaver** (https://dbeaver.io/download/) install کریں

### Step 2: Connection Setup کریں
1. New connection create کریں
2. Connection details:
   - **Host:** `db.xxxxx.supabase.co`
   - **Port:** `5432`
   - **Database:** `postgres`
   - **Username:** `postgres`
   - **Password:** اپنا database password

### Step 3: Backup Export کریں
**pgAdmin میں:**
1. Database پر right-click کریں
2. **Backup...** select کریں
3. File path specify کریں
4. **Backup** button click کریں

**DBeaver میں:**
1. Database پر right-click کریں
2. **Tools** > **Backup Database** select کریں
3. Settings configure کریں
4. **Start** click کریں

---

## Complete Backup Script (Windows PowerShell)

یہ script آپکے لیے automatic backup create کرے گی:

```powershell
# backup-supabase.ps1

# Configuration
$SUPABASE_URL = "db.xxxxx.supabase.co"
$SUPABASE_PASSWORD = "your-password-here"
$BACKUP_DIR = ".\backups"

# Create backup directory if not exists
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR
}

# Generate backup filename with timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "$BACKUP_DIR\supabase_backup_$timestamp.sql"

# Connection string
$connectionString = "postgresql://postgres:$SUPABASE_PASSWORD@$SUPABASE_URL:5432/postgres"

# Run pg_dump
Write-Host "Creating backup..." -ForegroundColor Green
pg_dump $connectionString > $backupFile

if ($LASTEXITCODE -eq 0) {
    $fileSize = (Get-Item $backupFile).Length / 1MB
    Write-Host "Backup created successfully!" -ForegroundColor Green
    Write-Host "File: $backupFile" -ForegroundColor Cyan
    Write-Host "Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
} else {
    Write-Host "Backup failed!" -ForegroundColor Red
}
```

**استعمال:**
1. Script میں اپنا password اور URL update کریں
2. PowerShell میں run کریں: `.\backup-supabase.ps1`

---

## Backup Restore کرنا

### Restore Command:
```bash
psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres" < backup_file.sql
```

### Supabase CLI se:
```bash
supabase db reset
# پھر
psql -f backup_file.sql
```

---

## Important Tips

1. **Regular Backups:** ہفتے میں کم از کم ایک بار backup ضرور لیں
2. **Password Security:** Backup files میں passwords شامل ہوتے ہیں، انہیں secure رکھیں
3. **Storage:** Backups کو cloud storage (Google Drive, Dropbox) میں بھی save کریں
4. **Test Restore:** کبھی کبھار restore test کریں کہ backup صحیح ہے
5. **Automation:** Windows Task Scheduler استعمال کر کے automatic backups setup کریں

---

## Quick Checklist

- [ ] Supabase connection string مل گیا
- [ ] pg_dump install ہے (PostgreSQL tools کے ساتھ آتا ہے)
- [ ] Backup file create ہو گئی
- [ ] Backup file کی size check کی
- [ ] Backup file secure location میں save کی
- [ ] Restore test کیا (optional لیکن recommended)

---

## Troubleshooting

### Error: pg_dump command not found
**Solution:** PostgreSQL install کریں: https://www.postgresql.org/download/windows/

### Error: Connection refused
**Solution:** 
- Connection string check کریں
- Supabase dashboard میں database connection settings verify کریں
- Firewall settings check کریں

### Error: Authentication failed
**Solution:**
- Password verify کریں
- Supabase dashboard میں database password reset کریں اگر ضرورت ہو

---

## Contact & Support

اگر کوئی problem آئے تو:
1. Supabase Documentation: https://supabase.com/docs
2. Supabase Discord Community
3. Stack Overflow پر question post کریں

---

**Last Updated:** January 2025

