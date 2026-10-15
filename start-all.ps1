# Windows PowerShell script to launch both Backend and Frontend concurrently
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "    Launching CloudShield AI Full-Stack Platform          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$WorkspaceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend in a separate PowerShell process
Write-Host "[+] Launching FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy Bypass", "-File `"$WorkspaceRoot\run-backend.ps1`""

# Wait briefly for backend to bind port
Start-Sleep -Seconds 3

# Start Frontend in a separate PowerShell process
Write-Host "[+] Launching Vite React Dashboard on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy Bypass", "-File `"$WorkspaceRoot\run-frontend.ps1`""

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [✓] Backend API:       http://127.0.0.1:8000" -ForegroundColor Green
Write-Host " [✓] Swagger API Docs:  http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host " [✓] React Dashboard:   http://localhost:5173" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
