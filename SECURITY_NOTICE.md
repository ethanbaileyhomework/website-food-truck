# SECURITY NOTICE

## ⚠️ CRITICAL: OAuth Credentials Exposed

**Previous versions of this repository contained hardcoded GitHub OAuth credentials in `start-dev.ps1`.**

### If you have used this repository before this fix:

1. **The exposed credentials MUST be revoked immediately:**
   - Go to https://github.com/settings/developers
   - Find the OAuth App with Client ID: `Ov23lifXUhUiG4vCZHqd`
   - Delete or regenerate the credentials

2. **Create new OAuth credentials:**
   - Follow the instructions in `ADMIN_SETUP.md`
   - Create a new GitHub OAuth App
   - Store credentials in `.env.local` (which is gitignored)

### Security Best Practices

✅ **DO:**
- Store credentials in `.env.local` (never committed to git)
- Use environment variables for all sensitive configuration
- Rotate credentials regularly
- Use different OAuth apps for development and production

❌ **DON'T:**
- Commit `.env.local` to git
- Hardcode credentials in source files
- Share OAuth credentials in documentation or comments
- Use the same credentials across multiple environments

### What Changed

- ✅ Removed hardcoded credentials from `start-dev.ps1`
- ✅ Created `.env.local.example` template
- ✅ Updated scripts to load from `.env.local`
- ✅ Added comprehensive setup documentation
- ✅ Improved error messages for missing credentials

For setup instructions, see `ADMIN_SETUP.md`.
