# Cranbourne Food Truck website

A modern, community-focused website for Cranbourne Food Truck built with Next.js 14, TypeScript, Tailwind CSS and Decap CMS. Content editors can update all key sections through the `/admin` interface, while live service statistics surface directly from a Google Sheet and Looker Studio dashboard.

## Tech stack

- [Next.js 14 (App Router)](https://nextjs.org/) with TypeScript
- Tailwind CSS for styling
- Decap CMS (Git-based with GitHub authentication) for content management
- Cloudflare Pages for hosting and deploy previews
- Google Sheets CSV feed for live service statistics (`/api/stats`)
- Looker Studio embeds for interactive dashboards
- Tally.so volunteer expression of interest form embed

## Local development

```bash
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Useful scripts

- `npm run dev` – start the local development server
- `npm run build` – create a production build
- `npm run start` – serve the production build locally
- `npm run lint` – run Next.js/ESLint checks

## Content editing with Decap CMS

1. Deploy the project to Cloudflare Pages. The CMS is pre-configured for the GitHub backend so editors authenticate with their GitHub accounts.
2. Provision a GitHub OAuth integration (either an OAuth App, GitHub App or the official Decap CMS OAuth provider) and expose it via a Cloudflare Worker or other HTTPS endpoint.
3. In Cloudflare Pages → **Settings → Environment variables**, add the following values for both Production and Preview environments:
   - `DECAP_GITHUB_REPO` – `owner/repo` slug for this site.
   - `DECAP_BACKEND_BRANCH` – optional override if your default branch is not `main`.
   - `DECAP_GITHUB_APP_ID` – client/app ID from your GitHub OAuth integration (optional but recommended when using GitHub Apps).
   - `DECAP_GITHUB_CLIENT_ID` / `DECAP_GITHUB_CLIENT_SECRET` – credentials for the built-in GitHub OAuth flow (alternatively, set `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`).
   - `DECAP_OAUTH_BASE_URL` – origin for your OAuth provider (for example `https://cms-auth.example.com`).
   - `DECAP_OAUTH_ENDPOINT` – endpoint path served by the provider (for example `/api/auth`).
   - `DECAP_SITE_URL` / `DECAP_DISPLAY_URL` – optional values to control site and preview URLs displayed inside the CMS UI.
4. Visit `/admin` on the deployed site to access the CMS once authentication is configured.
5. Collections available:
   - **Site Settings** – global contact details, donation links, map embed, service info, social links and analytics.
   - **Home Page**, **Stats Settings**, **About Page**, **Donate Page**, **Volunteer Page**, **Sponsors Page** – single-file collections for main copy and metadata.
   - **Team**, **Stories**, **Partners** – folder collections for repeatable entries with images and optional ordering.
6. Media uploads are stored in `public/uploads/` and referenced automatically.

The CMS can also run locally with `npx decap-server` and navigating to `http://localhost:3000/admin`.

## Live stats setup

1. Create a Google Sheet with a `services` tab containing the columns:
   - `date` (YYYY-MM-DD)
   - `meals`
   - `guests`
   - `volunteers`
   - `groceries`
   - `notes` (optional)
2. Publish the sheet to the web as CSV (`File → Share → Publish to web → CSV`).
3. Copy the generated CSV URL into **Stats Settings → Google Sheet → CSV URL** in the CMS.
4. Ensure the column names in **Field Mapping** match the sheet headers.
5. Update fallback totals and latest service numbers as a safety net when the sheet is unreachable.

The `/api/stats` route polls this CSV, caches responses for 10 minutes and powers:
- The homepage impact counters
- The stats page KPI bar

## Looker Studio dashboard

1. Publish the Looker Studio report and enable embedding.
2. Paste the embed URL into **Site Settings → Looker Studio → Dashboard URL** (or the Stats Settings equivalent if you prefer page-specific control).

## Google Map embed

1. From Google Maps choose **Share → Embed a map** and copy the iframe URL.
2. Paste into **Site Settings → Map → Google Maps Embed URL**.
3. Optionally provide a separate **Directions URL** for the button beneath the map.

## Donations

- Update bank transfer details inside **Site Settings → Bank Details**.
- Add PayPal and Stripe donate URLs inside **Site Settings → Donate Links** (buttons appear only when a URL is provided).
- The donation acknowledgement note is editable in the same section.

## Volunteer form

- Create a Tally.so form and copy the share URL.
- Paste the link into **Site Settings → Tally Form URL** to display the embedded form on `/volunteer`.
- If you need an alternative submission channel, configure a Cloudflare Worker or third-party form tool and embed it here.

## Sponsors & team content

- Upload partner logos or team headshots through the CMS; responsive placeholders exist until real images are provided.
- Use the optional “Display Order” field to control ordering where relevant.

## Analytics

- Add a Google Analytics 4 Measurement ID under **Site Settings → Analytics** to automatically load GA scripts. Leave blank to disable tracking.

## Deployment on Cloudflare Pages

1. Add the repository to Cloudflare Pages and choose the **Pages** framework preset.
2. Set the build command to `npm run cf:build` so OpenNext adapts the project for Cloudflare Workers.
3. Use `.open-next` as the output directory.
4. Ensure the project uses the provided `wrangler.jsonc` configuration (automatically picked up by OpenNext) and keep the `nodejs_compat` flag enabled.
5. Add the CMS environment variables described above so editors can authenticate.
6. Configure your production domain in Cloudflare Pages once the build succeeds.

## Additional notes

- All imagery and partner logos are placeholders – replace via the CMS or by updating the files in `public/images`.
- Keep the Google Sheet CSV publicly accessible for the stats API to work without authentication.
- Lighthouse targets (Performance/Accessibility/SEO ≥ 90) are achievable with optimized assets and content.
- JSON-LD structured data for Organisation, Event and WebSite is injected automatically from Site Settings.

Happy serving!
