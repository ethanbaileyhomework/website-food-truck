# Admin Page Setup Instructions

## Prerequisites

Before you can use the admin page, you need to set up GitHub OAuth credentials.

## Setup Steps

### 1. Create a GitHub OAuth App
1. Go to https://github.com/settings/applications/new
2. Fill in the application details:
   - **Application name**: Cranbourne Food Truck CMS (or any name you prefer)
   - **Homepage URL**: http://localhost:3000 (for local development)
   - **Authorization callback URL**: http://localhost:3000/api/oauth/callback
3. Click "Register application"
4. Copy the **Client ID** and **Client Secret** (you'll need these in the next step)

**IMPORTANT**: Make sure the Authorization callback URL is exactly: `http://localhost:3000/api/oauth/callback`

### 2. Configure Environment Variables

Create a `.env.local` file in the root of the project:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then edit `.env.local` and replace the placeholder values with your actual GitHub OAuth credentials:

```bash
GITHUB_CLIENT_ID=your_actual_client_id_here
GITHUB_CLIENT_SECRET=your_actual_client_secret_here
DECAP_GITHUB_REPO=ethanbaileyhomework/website-food-truck
DECAP_BACKEND_BRANCH=main
DECAP_OAUTH_BASE_URL=http://localhost:3000
DECAP_OAUTH_ENDPOINT=auth
DECAP_SITE_URL=http://localhost:3000
DECAP_DISPLAY_URL=http://localhost:3000
```

**⚠️ SECURITY WARNING**: Never commit your `.env.local` file to git! It's already in `.gitignore`.

### 3. Start the Development Server

**Option A: Use the startup script (Recommended)**

For Windows (PowerShell):
```powershell
.\start-dev.ps1
```

For Linux/Mac:
```bash
./start-dev.sh
```

**Option B: Manual startup**
```bash
npm run dev
```
(Note: Make sure your `.env.local` file is properly configured)

### 4. Access the Admin Page
1. Navigate to http://localhost:3000/admin
2. You should see the admin guide at the top
3. Below that, the Decap CMS interface should load
4. Click "Login with GitHub" to authenticate
5. Once authenticated, you can edit all content through the CMS interface

## Troubleshooting

### "Missing GitHub OAuth client ID" Error
- Make sure you've created the `.env.local` file
- Verify that `GITHUB_CLIENT_ID` is set in `.env.local`
- Restart the dev server after creating/modifying `.env.local`

### "Missing GitHub OAuth credentials" Error
- Make sure both `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set in `.env.local`
- Verify there are no extra spaces or quotes in your `.env.local` file

### "Invalid OAuth state" Error
- Clear your browser cookies for localhost:3000
- Try the authentication flow again

### Admin Page Doesn't Load
- Check the browser console for errors (F12 → Console tab)
- Make sure the dev server is running without errors
- Verify that all dependencies are installed (`npm install`)

## What You Can Edit
Once authenticated, you can edit:
- **Site Settings** - Global site configuration, contact info, social links
- **Home Page** - Hero section, what we do, impact highlights, testimonials
- **About Page** - Story, mission & vision, impact, partnerships
- **Donate Page** - Donation information and copy
- **Volunteer Page** - Volunteer information and form
- **Sponsors Page** - Sponsor information
- **Stats Settings** - Google Sheets integration and statistics
- **Team** - Team member profiles
- **Stories** - News and updates
- **Partners** - Partner organizations
- **Legal Pages** - Privacy policy and terms of use

## 🎯 Pull Request Automation
**Yes, Decap CMS automatically creates pull requests!** When you edit content and click "Publish":
- ✅ **Automatically creates a PR** on GitHub
- ✅ **Commits your changes** to a new branch
- ✅ **Opens the PR** for review
- ✅ **You merge it** to make changes live

## Deployment to Production

For production deployment (e.g., Cloudflare Pages):

1. In your hosting platform's environment variables, add:
   - `GITHUB_CLIENT_ID` - Your production GitHub OAuth App Client ID
   - `GITHUB_CLIENT_SECRET` - Your production GitHub OAuth App Client Secret
   - `DECAP_GITHUB_REPO` - `ethanbaileyhomework/website-food-truck`
   - `DECAP_BACKEND_BRANCH` - `main`

2. Update your GitHub OAuth App settings:
   - **Homepage URL**: `https://your-production-domain.com`
   - **Authorization callback URL**: `https://your-production-domain.com/api/oauth/callback`

3. The admin page will be available at `https://your-production-domain.com/admin`
