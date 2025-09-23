import type { Metadata } from "next";

import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { getLegalPage } from "@/lib/content";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("terms");
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function TermsPage() {
  const page = await getLegalPage("terms");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-4xl font-semibold text-charcoal">{page.title}</h1>
      <MarkdownRenderer content={page.body} />
    </div>
  );
}
