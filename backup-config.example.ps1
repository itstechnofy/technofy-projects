# Backup Configuration File
# اس file کا نام بدل کر backup-config.ps1 کر دیں اور اپنی details fill کریں
# Git میں commit نہ کریں - .gitignore میں شامل کریں

# Supabase Database Configuration
$env:SUPABASE_DB_URL = "db.xxxxx.supabase.co"
$env:SUPABASE_DB_PASSWORD = "your-password-here"

# Backup Settings
$env:BACKUP_DIR = ".\backups"
$env:BACKUP_RETENTION_DAYS = 30  # Purana backups kitne din baad delete honge

# Usage:
# 1. Is file ko copy karke backup-config.ps1 banaen
# 2. Apni details fill karein
# 3. backup-supabase.ps1 script ko update karein taake ye config use kare

