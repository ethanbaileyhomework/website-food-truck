# Cranbourne Food Truck – Content editor guide

This walkthrough is written for volunteers who want to refresh real copy, photos and logos on the website without touching any code. Everything happens inside the Decap CMS editor that lives at `/admin`.

## 1. Sign in

1. Visit `https://<your-domain>/admin`.
2. Click **Log in with GitHub** and authorise access. (Ask the site administrator to invite you if you do not yet have access.)
3. The CMS loads inside the browser – no extra software is required.

## 2. Pick something to edit

- The left sidebar lists every editable section. Single pages such as **Home Page** or **Donate Page** open straight away.
- Collections such as **Team**, **Stories** or **Partners** show existing entries. Use the **New** button to add another card.
- Global details like logos, navigation, contact information and donation links live in **Site Settings**.

## 3. Update copy

- Click any field to start editing. Changes are saved as drafts until you press **Publish**.
- Rich text areas offer buttons for headings, bold text, bullet lists, links and quotes.
- You can undo with <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Z</kbd> just like a regular document editor.

## 4. Add photos or logos

1. Locate an **Image** field and choose **Upload**.
2. Select a JPG, PNG or SVG from your computer. The CMS stores it inside `public/uploads/` for you.
3. If the image is already in the library, switch to the **Media Library** tab and pick it instead of uploading a duplicate.
4. Fill in the optional alt text field wherever it appears so the site stays accessible.

## 5. Reorder items

- Collections such as Team members allow drag-and-drop ordering. Grab the handle to the left of an entry inside the list view.
- Use the **Duplicate** option (three dot menu in the top-right) to clone a similar entry and tweak the details.

## 6. Save, preview and publish

1. Choose **Save** if you want to leave a draft for someone else to review later.
2. Choose **Publish** when you are ready. This creates a pull request on GitHub with your changes.
3. Cloudflare Pages generates a deploy preview for each pull request. The link appears on the confirmation screen – open it to check everything looks correct before approving the PR in GitHub.

## 7. Need help?

- Use the **Back to site** link in the top left of the CMS to return to the live site at any time.
- Ask the developer team if you need new collections or fields added; they can update `admin/config.yml` to expose them in the editor.
- If the CMS fails to load, ensure you are logged into GitHub and reload the page. Persistent errors may mean the GitHub token has expired – re-authorise when prompted.

Happy editing!
