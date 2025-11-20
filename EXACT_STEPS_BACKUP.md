# Supabase Database Backup - Exact Steps (Roman Urdu)
# بالکل وہی steps جو آپکو follow کرنے ہیں

## 🎯 Method 1: PowerShell Script Se (Sab Se Aasaan)

### Step 1: PostgreSQL Install Karein
1. Browser kholen aur yeh link open karein: `https://www.postgresql.org/download/windows/`
2. **Download the installer** button par click karein
3. Downloaded file run karein (example: `postgresql-16-x64.exe`)
4. Installation ke dauran:
   - **Next** click karte rahein
   - **Command Line Tools** option ko **check** karein (yeh zaroori hai!)
   - Password set karein (yeh local PostgreSQL ka hai, Supabase ka nahi)
   - **Finish** tak installation complete karein

### Step 2: Supabase Connection Details Lein
1. Browser mein `https://supabase.com` open karein
2. Apne account se **login** karein
3. Apna **project** select karein
4. Left side mein **Settings** (⚙️ icon) par click karein
5. **Database** section mein jayein
6. Neeche scroll karein aur **Connection string** section dhoondhein
7. **URI** option select karein
8. Connection string copy karein - yeh kuch aisa hoga:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xx-x.xxxxx.supabase.co:5432/postgres
   ```
9. Is connection string se **3 cheezein note** karein:
   - **Database URL:** `aws-0-xx-xx-x.xxxxx.supabase.co` (yeh middle part hai)
   - **Password:** `[YOUR-PASSWORD]` wala part (bina brackets ke)
   - **Port:** `5432` (usually yahi hota hai)

### Step 3: PowerShell Kholen
1. Windows key + R press karein
2. `powershell` type karein
3. Enter press karein
4. Ya **Start Menu** se **Windows PowerShell** search karein aur open karein

### Step 4: Project Folder Mein Jayein
PowerShell mein yeh command type karein:
```powershell
cd "C:\Users\Hi\Documents\glow-replicate-wonder"
```
Enter press karein

### Step 5: Backup Script Run Karein
PowerShell mein yeh command type karein:
```powershell
.\backup-supabase.ps1
```
Enter press karein

### Step 6: Details Enter Karein
Script aap se 2 cheezein puchhegi:

**Pehli prompt:**
```
Enter your Supabase database URL
```
Yahan **database URL** enter karein (Step 2 se jo URL mila tha, sirf hostname part):
```
aws-0-xx-xx-x.xxxxx.supabase.co
```
Enter press karein

**Dusri prompt:**
```
Enter your database password
```
Yahan **password** type karein (password screen par dikhai nahi degi, normal hai)
Enter press karein

### Step 7: Backup Complete!
Script backup banane lag jayegi. Jab complete ho jaye to:
- ✅ Success message aayega
- 📁 Backup file ka location dikhai dega
- 💾 File size dikhai degi

Backup file `backups` folder mein save hogi, naam kuch aisa hoga:
```
supabase_backup_20250115_143022.sql
```

---

## 🎯 Method 2: Manual Command Se (Agar Script Kaam Na Kare)

### Step 1: PostgreSQL Install Karein
(Pehle method ki tarah - Step 1 dekhein)

### Step 2: Connection String Lein
(Pehle method ki tarah - Step 2 dekhein)

### Step 3: PowerShell Kholen
(Pehle method ki tarah - Step 3 dekhein)

### Step 4: Project Folder Mein Jayein
```powershell
cd "C:\Users\Hi\Documents\glow-replicate-wonder"
```

### Step 5: Backup Folder Banayein
```powershell
mkdir backups
```

### Step 6: Backup Command Run Karein
Yeh command type karein (apni details ke saath):
```powershell
pg_dump "postgresql://postgres:APNA_PASSWORD@APNA_DATABASE_URL:5432/postgres" > backups\backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

**Example (apni details se replace karein):**
```powershell
pg_dump "postgresql://postgres:mypassword123@aws-0-us-east-1.abcdefgh.supabase.co:5432/postgres" > backups\backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

Enter press karein aur wait karein.

### Step 7: Verify Karein
Backup complete hone ke baad check karein:
```powershell
dir backups
```
Aapko backup file dikhai degi.

---

## 🔍 Backup File Check Kaise Karein

### Step 1: File Location
Backup file `backups` folder mein hogi:
```
C:\Users\Hi\Documents\glow-replicate-wonder\backups\
```

### Step 2: File Open Karein
1. File Explorer mein `backups` folder kholen
2. `.sql` file par **right-click** karein
3. **Open with** > **Notepad** ya koi text editor select karein

### Step 3: Verify Karein
File mein yeh cheezein honi chahiyein:
- ✅ `CREATE TABLE` statements
- ✅ `INSERT INTO` statements
- ✅ SQL commands
- ❌ File empty nahi honi chahiye

---

## ⚠️ Agar Problem Aaye To

### Problem 1: "pg_dump command not found"
**Solution:**
1. PostgreSQL properly install hua hai ya nahi check karein
2. PowerShell ko **restart** karein
3. Ya PostgreSQL ko **reinstall** karein aur **Command Line Tools** zaroor select karein

### Problem 2: "Connection refused" ya "Could not connect"
**Solution:**
1. Internet connection check karein
2. Database URL sahi hai ya nahi verify karein
3. Password sahi hai ya nahi check karein
4. Supabase dashboard mein database **active** hai ya nahi dekh lein

### Problem 3: "Authentication failed"
**Solution:**
1. Password sahi type kiya hai ya nahi check karein
2. Supabase dashboard mein jayein
3. Settings > Database > **Reset database password** karein
4. Naya password use karein

### Problem 4: Script run nahi hota
**Solution:**
1. PowerShell mein execution policy check karein:
   ```powershell
   Get-ExecutionPolicy
   ```
2. Agar "Restricted" aaye to yeh command run karein:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Phir script dobara run karein

---

## 📋 Quick Checklist

Backup lene se pehle:
- [ ] PostgreSQL install hai
- [ ] Supabase connection string mil gaya
- [ ] Database URL note kar liya
- [ ] Password note kar liya
- [ ] PowerShell open hai
- [ ] Project folder mein hain

Backup ke baad:
- [ ] Backup file create ho gayi
- [ ] File size 0 nahi hai
- [ ] File mein SQL code hai
- [ ] Backup file safe jagah save kar di

---

## 🎯 Sab Se Aasaan Tarika (TL;DR)

1. PostgreSQL install karo (Command Line Tools ke saath)
2. Supabase dashboard se connection string lo
3. PowerShell kholo
4. Project folder mein jao: `cd "C:\Users\Hi\Documents\glow-replicate-wonder"`
5. Script run karo: `.\backup-supabase.ps1`
6. URL aur password enter karo
7. Done! ✅

---

## 📞 Agar Koi Problem Ho

1. Pehle **EXACT_STEPS_BACKUP.md** file dobara padhein
2. **SUPABASE_BACKUP_GUIDE.md** mein detailed solutions dekhein
3. Supabase documentation check karein
4. Error message ko Google par search karein

---

**Yaad Rakhne Wali Baatein:**
- ✅ Backup regular lena zaroori hai (haftay mein kam se kam ek baar)
- ✅ Backup files ko safe jagah store karein
- ✅ Password ko secure rakhein
- ✅ Backup file ko test restore karein (kabhi kabhi)

**Good Luck! 🚀**

