 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/app/about/page.tsx
index 0000000000000000000000000000000000000000..60f3ed2579722ad81578ebd31cc6be5296e44b7f 100644
--- a//dev/null
+++ b/app/about/page.tsx
@@ -0,0 +1,105 @@
+import type { Metadata } from "next";
+
+import { TeamGrid } from "@/components/about/team-grid";
+import { LogoGrid } from "@/components/shared/logo-grid";
+import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
+import {
+  getAboutContent,
+  getPartners,
+  getSiteSettings,
+  getStories,
+  getTeamMembers,
+} from "@/lib/content";
+import { formatFullDate } from "@/lib/utils";
+
+export async function generateMetadata(): Promise<Metadata> {
+  const about = await getAboutContent();
+  return {
+    title: about.seo?.title ?? "About us",
+    description: about.seo?.description,
+  };
+}
+
+export default async function AboutPage() {
+  const [about, team, stories, partners, settings] = await Promise.all([
+    getAboutContent(),
+    getTeamMembers(),
+    getStories(),
+    getPartners(),
+    getSiteSettings(),
+  ]);
+
+  return (
+    <div className="space-y-16">
+      <section className="mx-auto max-w-3xl space-y-6 text-center">
+        <h1 className="text-4xl font-semibold text-charcoal sm:text-5xl">{about.story.title}</h1>
+        <MarkdownRenderer content={about.story.body} />
+      </section>
+
+      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-soft sm:p-12">
+        <h2 className="text-3xl font-semibold text-charcoal sm:text-4xl">{about.missionVision.title}</h2>
+        <div className="mt-6 grid gap-6 sm:grid-cols-2">
+          <div className="rounded-2xl bg-sand/70 p-6 text-left">
+            <h3 className="text-lg font-semibold text-charcoal">Mission</h3>
+            <p className="mt-3 text-sm text-charcoal/75">{about.missionVision.mission}</p>
+          </div>
+          <div className="rounded-2xl bg-sand/70 p-6 text-left">
+            <h3 className="text-lg font-semibold text-charcoal">Vision</h3>
+            <p className="mt-3 text-sm text-charcoal/75">{about.missionVision.vision}</p>
+          </div>
+        </div>
+      </section>
+
+      <section className="mx-auto max-w-5xl">
+        <h2 className="text-3xl font-semibold text-charcoal">{about.impact.title}</h2>
+        <div className="mt-6 grid gap-6 md:grid-cols-3">
+          {about.impact.points.map((point) => (
+            <div key={point.title} className="rounded-3xl bg-white p-6 shadow-soft">
+              <h3 className="text-xl font-semibold text-charcoal">{point.title}</h3>
+              <p className="mt-2 text-sm text-charcoal/75">{point.description}</p>
+            </div>
+          ))}
+        </div>
+      </section>
+
+      <section className="mx-auto max-w-5xl space-y-6">
+        <h2 className="text-3xl font-semibold text-charcoal">Milestones</h2>
+        <div className="grid gap-6 md:grid-cols-2">
+          {stories.map((story) => (
+            <article key={story.slug} className="rounded-3xl bg-white p-6 shadow-soft">
+              <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary/70">
+                {formatFullDate(story.date, story.date)}
+              </p>
+              <h3 className="mt-2 text-xl font-semibold text-charcoal">{story.title}</h3>
+              <div className="mt-3 text-sm text-charcoal/75">
+                <MarkdownRenderer content={story.body} />
+              </div>
+            </article>
+          ))}
+        </div>
+      </section>
+
+      <TeamGrid team={team} />
+
+      <section className="mx-auto max-w-4xl space-y-4 text-center">
+        <h2 className="text-3xl font-semibold text-charcoal">{about.partnerships.title}</h2>
+        <p className="text-base text-charcoal/75">{about.partnerships.description}</p>
+      </section>
+
+      <LogoGrid partners={partners.slice(0, 6)} />
+
+      <section className="mx-auto max-w-3xl space-y-4 text-center">
+        <h2 className="text-3xl font-semibold text-charcoal">{about.futurePlans.title}</h2>
+        <MarkdownRenderer content={about.futurePlans.body} />
+        {settings.donate?.paypal && (
+          <a
+            href={settings.donate.paypal}
+            className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
+          >
+            Support the vision
+          </a>
+        )}
+      </section>
+    </div>
+  );
+}
 
EOF
)
