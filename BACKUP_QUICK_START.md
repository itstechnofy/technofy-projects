# Supabase Backup - Quick Start Guide
# فوری شروع کرنے کا طریقہ

## ⚡ سب سے تیز طریقہ (5 منٹ)

### Step 1: PostgreSQL Install کریں
1. https://www.postgresql.org/download/windows/ پر جائیں
2. PostgreSQL download اور install کریں
3. Installation کے دوران **Command Line Tools** option select کریں

### Step 2: Supabase Connection String حاصل کریں
1. Supabase Dashboard کھولیں
2. Settings > Database
3. Connection string copy کریں (URI format)

### Step 3: Backup Script Run کریں
PowerShell میں:
```powershell
.\backup-supabase.ps1
```

Script آپ سے URL اور password پوچھے گی، enter کریں!

---

## 🔧 Manual Backup (Command Line)

```powershell
pg_dump "postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres" > backup.sql
```

---

## 📋 Connection String Format

```
postgresql://postgres:PASSWORD@HOST:5432/postgres
```

**مثال:**
```
postgresql://postgres:mypassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## ✅ Backup Verify کرنا

Backup file کھول کر check کریں:
- File size 0 نہیں ہونی چاہیے
- File میں SQL commands نظر آنی چاہیئیں
- `CREATE TABLE` statements موجود ہونے چاہیئیں

---

## 🔄 Restore کرنا

```powershell
psql "postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres" < backup.sql
```

---

## ⚠️ Important Notes

1. **Password Security:** Backup files میں passwords شامل ہوتے ہیں
2. **Storage:** Backups کو safe place میں store کریں
3. **Regular Backups:** ہفتے میں کم از کم ایک بار backup لیں
4. **Test Restore:** کبھی کبھار restore test کریں

---

## 🆘 Problem Solving

### pg_dump not found
**Solution:** PostgreSQL install کریں اور PATH میں add کریں

### Connection refused
**Solution:** 
- Internet connection check کریں
- Supabase URL verify کریں
- Firewall settings check کریں

### Authentication failed
**Solution:**
- Password verify کریں
- Supabase dashboard میں password reset کریں

---

## 📞 Help

Detailed guide کے لیے `SUPABASE_BACKUP_GUIDE.md` دیکھیں

