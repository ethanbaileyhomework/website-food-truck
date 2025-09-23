import type { Metadata } from "next";

import { DonateBox } from "@/components/donate/donate-box";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { getDonateContent, getSiteSettings } from "@/lib/content";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const donate = await getDonateContent();
  return {
    title: donate.seo?.title ?? "Donate",
    description: donate.seo?.description,
  };
}

export default async function DonatePage() {
  const [settings, donate] = await Promise.all([getSiteSettings(), getDonateContent()]);

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold text-charcoal sm:text-5xl">{donate.introTitle}</h1>
        <MarkdownRenderer content={donate.introBody} />
      </header>
      <DonateBox bank={settings.bank} donate={settings.donate} copy={settings.donationCopy} />
    </div>
  );
}
