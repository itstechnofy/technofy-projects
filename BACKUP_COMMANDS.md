# Backup Commands - Copy Paste Karo Aur Run Karo
# بالکل وہی commands جو آپکو چاہیے

## ⚡ Method 1: PowerShell Script (Sab Se Aasaan)

### Step 1: PowerShell Kholo
Windows key + R → `powershell` → Enter

### Step 2: Project Folder Mein Jao
```powershell
cd "C:\Users\Hi\Documents\glow-replicate-wonder"
```

### Step 3: Script Run Karo
```powershell
.\backup-supabase.ps1
```

Script aap se URL aur password puchhegi - enter karo!

---

## 🔧 Method 2: Direct Command (Agar Script Kaam Na Kare)

### Pehle Ye 3 Cheezein Chahiye:
1. **Database URL:** Supabase Dashboard → Settings → Database → Connection string se
2. **Password:** Apna database password
3. **Port:** Usually `5432`

### Backup Folder Banao (Pehli Baar):
```powershell
mkdir backups
```

### Backup Command (Apni Details Se Replace Karo):

**Yeh command copy karo aur apni details fill karo:**

```powershell
pg_dump "postgresql://postgres:APNA_PASSWORD@APNA_DATABASE_URL:5432/postgres" > backups\backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

**Example (Yeh format dekho):**
```powershell
pg_dump "postgresql://postgres:mypassword123@aws-0-us-east-1.abcdefgh.supabase.co:5432/postgres" > backups\backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

---

## 📝 Step-by-Step: Exact Kya Karna Hai

### Step 1: Supabase Se Connection String Lo
1. Browser mein `https://supabase.com` kholo
2. Login karo
3. Apna project select karo
4. **Settings** (⚙️) → **Database**
5. **Connection string** section mein **URI** select karo
6. Connection string copy karo

**Connection string aisa hoga:**
```
postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-xx-xx-x.xxxxx.supabase.co:5432/postgres
```

### Step 2: Connection String Se 2 Cheezein Nikalo

**Example connection string:**
```
postgresql://postgres.abc123:MyPass123@aws-0-us-east-1.wzagyfqpktbhlqpebufw.supabase.co:5432/postgres
```

**Is se yeh 2 cheezein nikalo:**
- **Database URL:** `aws-0-us-east-1.wzagyfqpktbhlqpebufw.supabase.co`
- **Password:** `MyPass123`

### Step 3: PowerShell Mein Command Run Karo

**Pehle folder mein jao:**
```powershell
cd "C:\Users\Hi\Documents\glow-replicate-wonder"
```

**Backup folder banao (agar nahi hai):**
```powershell
if (-not (Test-Path backups)) { mkdir backups }
```

**Ab backup command run karo (apni details se replace karo):**
```powershell
pg_dump "postgresql://postgres:APNA_PASSWORD@APNA_DATABASE_URL:5432/postgres" > backups\backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

**Real Example:**
```powershell
pg_dump "postgresql://postgres:MyPass123@aws-0-us-east-1.wzagyfqpktbhlqpebufw.supabase.co:5432/postgres" > backups\backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

### Step 4: Wait Karo
Command run hone ke baad thoda wait karo. Backup file `backups` folder mein save ho jayegi.

### Step 5: Verify Karo
```powershell
dir backups
```

Aapko backup file dikhai degi jaisa:
```
supabase_backup_20250115_143022.sql
```

---

## 🎯 One-Liner Command (Sab Kuch Ek Sath)

**Yeh complete command copy karo aur apni details fill karo:**

```powershell
cd "C:\Users\Hi\Documents\glow-replicate-wonder"; if (-not (Test-Path backups)) { mkdir backups }; pg_dump "postgresql://postgres:APNA_PASSWORD@APNA_DATABASE_URL:5432/postgres" > backups\backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql; Write-Host "Backup complete! Check backups folder." -ForegroundColor Green
```

**Real Example:**
```powershell
cd "C:\Users\Hi\Documents\glow-replicate-wonder"; if (-not (Test-Path backups)) { mkdir backups }; pg_dump "postgresql://postgres:MyPass123@aws-0-us-east-1.wzagyfqpktbhlqpebufw.supabase.co:5432/postgres" > backups\backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql; Write-Host "Backup complete! Check backups folder." -ForegroundColor Green
```

---

## ⚠️ Important Notes

1. **Password Special Characters:** Agar password mein special characters hain (jaise `@`, `#`, `$`) to unhein URL-encode karna padega:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `&` → `%26`
   - Space → `%20`

2. **Connection String Format:**
   ```
   postgresql://postgres:PASSWORD@HOST:PORT/database
   ```

3. **Backup File Location:**
   ```
   C:\Users\Hi\Documents\glow-replicate-wonder\backups\
   ```

---

## 🔍 Backup File Check Kaise Karein

### File Size Check:
```powershell
Get-Item backups\*.sql | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
```

### File Open Karo:
```powershell
notepad backups\supabase_backup_*.sql
```

Ya File Explorer mein:
```
C:\Users\Hi\Documents\glow-replicate-wonder\backups
```

---

## 🆘 Agar Error Aaye

### Error: "pg_dump command not found"
**Solution:**
1. PostgreSQL install karo: https://www.postgresql.org/download/windows/
2. Installation ke dauran **Command Line Tools** select karo
3. PowerShell restart karo

### Error: "Connection refused"
**Solution:**
- Internet connection check karo
- Database URL sahi hai ya nahi verify karo
- Supabase dashboard mein database active hai ya nahi check karo

### Error: "Authentication failed"
**Solution:**
- Password sahi type kiya hai ya nahi check karo
- Password mein special characters hain to URL-encode karo
- Supabase dashboard mein password reset karo agar zarurat ho

---

## ✅ Quick Checklist

- [ ] PostgreSQL install hai
- [ ] Supabase connection string mil gaya
- [ ] Database URL note kar liya
- [ ] Password note kar liya
- [ ] PowerShell open hai
- [ ] Project folder mein hain
- [ ] Command run kar di
- [ ] Backup file create ho gayi
- [ ] File size check kar li

---

**Yaad Rakho:**
- Backup file `backups` folder mein save hogi
- File ka naam timestamp ke saath hoga
- Backup complete hone mein thoda time lag sakta hai (database size ke hisab se)

**Good Luck! 🚀**

