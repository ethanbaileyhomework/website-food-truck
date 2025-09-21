# Cranbourne Food Truck website

A modern, community-focused website for Cranbourne Food Truck built with Next.js 14, TypeScript, Tailwind CSS and Decap CMS. Content editors can update all key sections through the `/admin` interface, while live service statistics surface directly from a Google Sheet and Looker Studio dashboard.

## Tech stack

- [Next.js 14 (App Router)](https://nextjs.org/) with TypeScript
- Tailwind CSS for styling
- Decap CMS (Git-based, Netlify Identity ready) for content management
- Netlify for hosting, deploy previews and optional form handling
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

1. Deploy the project to Netlify and enable **Identity** + **Git Gateway** for authentication.
2. Visit `/admin` on the deployed site to access the CMS.
3. Collections available:
   - **Site Settings** – global contact details, donation links, map embed, service info, social links and analytics.
   - **Home Page**, **Stats Settings**, **About Page**, **Donate Page**, **Volunteer Page**, **Sponsors Page** – single-file collections for main copy and metadata.
   - **Team**, **Stories**, **Partners** – folder collections for repeatable entries with images and optional ordering.
4. Media uploads are stored in `public/uploads/` and referenced automatically.

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
- A hidden Netlify form named `volunteer-fallback` is included as a backup if you later enable native Netlify Forms.

## Sponsors & team content

- Upload partner logos or team headshots through the CMS; responsive placeholders exist until real images are provided.
- Use the optional “Display Order” field to control ordering where relevant.

## Analytics

- Add a Google Analytics 4 Measurement ID under **Site Settings → Analytics** to automatically load GA scripts. Leave blank to disable tracking.

## Deployment on Netlify

1. Connect the GitHub repository to Netlify.
2. Set the build command to `npm run build` and publish directory to `.next`.
3. Netlify automatically detects `netlify.toml` and applies the official Next.js plugin.
4. Enable Netlify Identity + Git Gateway for Decap CMS login.
5. Configure the custom domain `cranbournefoodtruck.com` in Netlify’s Domain settings and update DNS with your registrar.

## Additional notes

- All imagery and partner logos are placeholders – replace via the CMS or by updating the files in `public/images`.
- Keep the Google Sheet CSV publicly accessible for the stats API to work without authentication.
- Lighthouse targets (Performance/Accessibility/SEO ≥ 90) are achievable with optimized assets and content.
- JSON-LD structured data for Organisation, Event and WebSite is injected automatically from Site Settings.

Happy serving!
