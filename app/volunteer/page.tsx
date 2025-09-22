import type { Metadata } from "next";

import { TallyEmbed } from "@/components/volunteer/tally-embed";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { getSiteSettings, getVolunteerContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const volunteer = await getVolunteerContent();
  return {
    title: volunteer.seo?.title ?? "Volunteer",
    description: volunteer.seo?.description,
  };
}

export default async function VolunteerPage() {
  const [settings, volunteer] = await Promise.all([getSiteSettings(), getVolunteerContent()]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold text-charcoal sm:text-5xl">{volunteer.introTitle}</h1>
        <MarkdownRenderer content={volunteer.introBody} />
      </header>
      <TallyEmbed tallyUrl={settings.tallyFormUrl} form={settings.volunteerForm} />
    </div>
  );
}
