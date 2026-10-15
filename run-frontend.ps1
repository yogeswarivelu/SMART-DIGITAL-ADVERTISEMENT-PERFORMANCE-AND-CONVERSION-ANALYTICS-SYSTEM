# Windows PowerShell script to start CloudShield AI React Dashboard
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " Starting CloudShield AI Frontend Console     " -ForegroundColor Cyan
Write-Host " Vite + React + TypeScript Dashboard           " -ForegroundColor DarkCyan
Write-Host "===============================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path "$ScriptDir\frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "[*] Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "[+] Running Vite dev server at http://localhost:5173" -ForegroundColor Green
npm run dev
