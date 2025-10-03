# Load environment variables from .env.local and start the development server

# Check if .env.local exists
if (-Not (Test-Path ".env.local")) {
    Write-Host "ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create a .env.local file with your GitHub OAuth credentials." -ForegroundColor Yellow
    Write-Host "You can copy .env.local.example as a starting point:" -ForegroundColor Yellow
    Write-Host "  cp .env.local.example .env.local" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then edit .env.local and add your GitHub OAuth credentials from:" -ForegroundColor Yellow
    Write-Host "  https://github.com/settings/applications/new" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# Load variables from .env.local
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        # Remove quotes if present
        $value = $value -replace '^["'']|["'']$', ''
        Set-Item -Path "env:$name" -Value $value
        Write-Host "Loaded: $name" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Environment variables loaded. Starting development server..." -ForegroundColor Green
npm run dev

