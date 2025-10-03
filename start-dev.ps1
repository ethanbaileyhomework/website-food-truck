# Set environment variables and start the development server
$env:GITHUB_CLIENT_ID="Ov23lifXUhUiG4vCZHqd"
$env:DECAP_GITHUB_CLIENT_ID=$env:GITHUB_CLIENT_ID
$env:GITHUB_CLIENT_SECRET="5cb77d19ba008d68828300ed145ca9410ab0512a"
$env:DECAP_GITHUB_CLIENT_SECRET=$env:GITHUB_CLIENT_SECRET
$env:DECAP_GITHUB_REPO="ethanbaileyhomework/website-food-truck"
$env:DECAP_BACKEND_BRANCH="main"
$env:DECAP_OAUTH_BASE_URL="http://localhost:3000"
$env:DECAP_OAUTH_ENDPOINT="auth"
$env:DECAP_SITE_URL="http://localhost:3000"
$env:DECAP_DISPLAY_URL="http://localhost:3000"

Write-Host "Environment variables set. Starting development server..."
npm run dev

