# Supabase Database Backup Script
# استعمال: PowerShell میں run کریں: .\backup-supabase.ps1

param(
    [string]$SupabaseUrl = "",
    [string]$SupabasePassword = "",
    [string]$BackupDir = ".\backups"
)

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "=========================================="
Write-ColorOutput Green "  Supabase Database Backup Tool"
Write-ColorOutput Green "=========================================="
Write-Output ""

# Check if pg_dump is available
$pgDumpPath = Get-Command pg_dump -ErrorAction SilentlyContinue
if (-not $pgDumpPath) {
    Write-ColorOutput Red "ERROR: pg_dump command not found!"
    Write-Output ""
    Write-Output "Please install PostgreSQL from:"
    Write-Output "https://www.postgresql.org/download/windows/"
    Write-Output ""
    Write-Output "Or add PostgreSQL bin directory to your PATH"
    exit 1
}

# Get connection details if not provided
if ([string]::IsNullOrEmpty($SupabaseUrl)) {
    Write-Output "Supabase Database URL required"
    Write-Output "Example: db.xxxxx.supabase.co"
    $SupabaseUrl = Read-Host "Enter your Supabase database URL"
}

if ([string]::IsNullOrEmpty($SupabasePassword)) {
    Write-Output ""
    Write-Output "Database password required"
    $securePassword = Read-Host "Enter your database password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $SupabasePassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

# Create backup directory if not exists
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
    Write-ColorOutput Cyan "Created backup directory: $BackupDir"
}

# Generate backup filename with timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = Join-Path $BackupDir "supabase_backup_$timestamp.sql"

# Connection string
$connectionString = "postgresql://postgres:$SupabasePassword@$SupabaseUrl:5432/postgres"

Write-Output ""
Write-ColorOutput Yellow "Creating backup..."
Write-Output "Source: $SupabaseUrl"
Write-Output "Destination: $backupFile"
Write-Output ""

# Run pg_dump
try {
    & pg_dump $connectionString > $backupFile 2>&1
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path $backupFile)) {
        $fileSize = (Get-Item $backupFile).Length / 1MB
        Write-Output ""
        Write-ColorOutput Green "✓ Backup created successfully!"
        Write-ColorOutput Cyan "  File: $backupFile"
        Write-ColorOutput Cyan "  Size: $([math]::Round($fileSize, 2)) MB"
        Write-Output ""
        
        # Show backup file location
        $fullPath = (Resolve-Path $backupFile).Path
        Write-ColorOutput Green "Full path: $fullPath"
        Write-Output ""
        
        # Ask if user wants to open the folder
        $openFolder = Read-Host "Open backup folder? (y/n)"
        if ($openFolder -eq "y" -or $openFolder -eq "Y") {
            Start-Process explorer.exe -ArgumentList $BackupDir
        }
    } else {
        Write-ColorOutput Red "✗ Backup failed!"
        Write-Output ""
        Write-Output "Please check:"
        Write-Output "1. Database URL is correct"
        Write-Output "2. Password is correct"
        Write-Output "3. Internet connection is working"
        Write-Output "4. Supabase database is accessible"
        exit 1
    }
} catch {
    Write-ColorOutput Red "✗ Error occurred: $_"
    exit 1
}

Write-Output ""
Write-ColorOutput Green "Backup completed successfully!"
Write-Output ""

