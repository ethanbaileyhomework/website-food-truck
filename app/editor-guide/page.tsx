import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Content editor guide",
  description:
    "Step-by-step instructions for updating copy, photos and logos in the Cranbourne Food Truck website CMS.",
};

const sections = [
  {
    title: "1. Sign in",
    body: [
      "Visit https://<your-domain>/admin.",
      "Click **Log in with GitHub** and authorise access. Ask the administrator to invite you if you cannot sign in yet.",
      "The editor runs entirely in your browser – no extra software is required.",
    ],
  },
  {
    title: "2. Pick something to edit",
    body: [
      "Use the left-hand sidebar to select a collection. Single pages such as **Home Page** or **Donate Page** open directly.",
      "Collections like **Team**, **Stories** or **Partners** show a list of existing entries with a **New** button for adding more.",
      "Global items (logos, navigation, donation links, contact details) live in **Site Settings**.",
    ],
  },
  {
    title: "3. Update copy",
    body: [
      "Click into any field and type your changes. Nothing goes live until you publish.",
      "Rich text areas include buttons for headings, bold, lists, links and quotes – no Markdown knowledge needed.",
      "Undo works with Ctrl/Cmd + Z just like a word processor.",
    ],
  },
  {
    title: "4. Add photos or logos",
    body: [
      "Find an **Image** field and press **Upload**.",
      "Choose a JPG, PNG or SVG from your computer. The CMS stores it in the site uploads folder automatically.",
      "Switch to the **Media Library** tab to reuse an existing image instead of uploading a duplicate.",
      "Fill in any alt text field to keep the site accessible.",
    ],
  },
  {
    title: "5. Reorder items",
    body: [
      "In repeatable collections you can drag entries by the handle to the left of each card.",
      "Use the **Duplicate** option (three-dot menu in the top-right) to copy similar content and tweak it.",
    ],
  },
  {
    title: "6. Save, preview and publish",
    body: [
      "Hit **Save** to keep a draft for later.",
      "Choose **Publish** once you are ready. This raises a pull request on GitHub with your update.",
      "Cloudflare Pages builds a preview link automatically. Open it to double-check everything before approving the pull request.",
    ],
  },
  {
    title: "7. Need help?",
    body: [
      "Use the **Back to site** link in the CMS header to return to the public site.",
      "Ask the development team if you need new fields added. They can update admin/config.yml to expose more content.",
      "If the editor fails to load, sign out and back into GitHub, then refresh the page to re-authorise.",
    ],
  },
];

export default function EditorGuidePage() {
  return (
    <main className="bg-slate-950 py-16 text-slate-100">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
          Content support
        </p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
          How to update the website without touching code
        </h1>
        <p className="mt-4 text-lg text-slate-200">
          The Cranbourne Food Truck site is fully editable through the Decap CMS interface at {" "}
          <Link href="/admin" className="font-semibold text-rose-300 underline-offset-4 hover:underline">
            /admin
          </Link>
          . Follow this checklist whenever you need to replace placeholder copy, upload new photos or refresh contact details.
        </p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
              <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
              <ul className="mt-4 space-y-2 text-base text-slate-100">
                {section.body.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-rose-300" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-slate-300">
          Tip: bookmark this page or download the PDF version so future volunteers can self-serve updates without waiting on a developer.
        </p>
      </div>
    </main>
  );
}
