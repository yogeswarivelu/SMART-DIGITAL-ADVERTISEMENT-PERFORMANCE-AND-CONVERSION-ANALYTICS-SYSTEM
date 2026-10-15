# Windows PowerShell script to start CloudShield AI Backend
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Starting CloudShield AI FastAPI Backend API  " -ForegroundColor Cyan
Write-Host "  Mode: Synthetic Demo Data (SQLite)           " -ForegroundColor DarkCyan
Write-Host "===============================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path "$ScriptDir\backend"

if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "[*] Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "[*] Installing backend dependencies..." -ForegroundColor Yellow
    .\venv\Scripts\python.exe -m pip install -r requirements.txt
}

Write-Host "[+] Running backend server at http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "[+] Interactive Swagger Docs at http://127.0.0.1:8000/docs" -ForegroundColor Green
.\venv\Scripts\python.exe run.py
