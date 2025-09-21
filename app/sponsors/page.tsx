import type { Metadata } from "next";

import { LogoGrid } from "@/components/shared/logo-grid";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { getPartners, getSponsorsContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const sponsors = await getSponsorsContent();
  return {
    title: sponsors.seo?.title ?? "Sponsors & Partners",
    description: sponsors.seo?.description,
  };
}

export default async function SponsorsPage() {
  const [sponsors, partners] = await Promise.all([getSponsorsContent(), getPartners()]);

  return (
    <div className="space-y-10">
      <header className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-4xl font-semibold text-charcoal sm:text-5xl">{sponsors.introTitle}</h1>
        <MarkdownRenderer content={sponsors.introBody} />
      </header>
      <LogoGrid partners={partners} />
    </div>
  );
}
