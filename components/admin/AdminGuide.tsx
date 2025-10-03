import Link from "next/link";

const sections = [
  {
    title: "Open the editor",
    steps: [
      "Go to /admin on the live site. Sign in with your GitHub account when prompted.",
      "After signing in the editor will load. The instructions below stay on this page in case you need a refresher.",
    ],
  },
  {
    title: "Choose what you want to update",
    steps: [
      "The left-hand sidebar lists every collection of content: Site Settings, Home Page, Team, Stories and so on.",
      "Single entries such as the Home Page open directly; repeatable items like Team or Stories show an “Add new” button for creating additional cards.",
    ],
  },
  {
    title: "Edit text and links",
    steps: [
      "Click into any field and type the copy you want. Changes are saved as drafts until you publish.",
      "Use the formatting toolbar on markdown fields (e.g. story body) for headings, bold, lists and links without needing to know Markdown syntax.",
    ],
  },
  {
    title: "Upload photos and logos",
    steps: [
      "Click the **Upload** button that appears next to any Image field.",
      "Pick a file from your computer – PNG, JPG or SVG all work. The file is stored automatically in the site’s uploads folder and the preview updates instantly.",
      "You can reuse an existing image by switching to the **Media Library** tab and selecting it.",
    ],
  },
  {
    title: "Preview and publish",
    steps: [
      "Hit **Save** to keep a draft or **Publish** to push the change live. Publishing creates a pull request on GitHub automatically.",
      "Cloudflare Pages builds a preview of each change. Use the link shown after publishing to review before approving the pull request in GitHub.",
    ],
  },
  {
    title: "Need to make bulk updates?",
    steps: [
      "Repeatable content such as Team members and Partners lets you drag items to reorder them after saving.",
      "If you want to copy an existing item, open it and use the **Duplicate** button in the top-right menu.",
    ],
  },
];

export function AdminGuide() {
  return (
    <section className="border-b border-white/10 bg-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-10 text-slate-100">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
          Need a refresher?
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Edit the site without touching code
        </h1>
        <p className="mt-3 max-w-3xl text-base text-slate-200 sm:text-lg">
          Everything on the public website comes from editable fields in the Decap CMS
          (the panel that appears below). Follow the steps on this page whenever you
          need to swap copy, add stories, or upload new logos and photos.
        </p>
        <p className="mt-4 text-sm text-slate-300">
          Looking for a printable walkthrough? Download the {" "}
          <Link
            href="/editor-guide"
            className="font-semibold text-rose-300 underline-offset-4 hover:underline"
          >
            content editor guide
          </Link>
          .
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur"
            >
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <ol className="mt-3 space-y-2 text-sm text-slate-100">
                {section.steps.map((step) => (
                  <li key={step} className="flex gap-2">
                    <span className="font-semibold text-rose-200">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
