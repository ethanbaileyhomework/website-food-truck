import type { Metadata } from "next";

import { KPIBar } from "@/components/stats/kpi-bar";
import { LookerEmbed } from "@/components/stats/looker-embed";
import { getSiteSettings, getStatsSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getStatsSettings();
  return {
    title: stats.seo?.title ?? "Stats",
    description: stats.seo?.description,
  };
}

export default async function StatsPage() {
  const [stats, site] = await Promise.all([getStatsSettings(), getSiteSettings()]);

  const heading = stats.page?.heading ?? "Service stats";
  const intro = stats.page?.intro ??
    "Live counts of meals, guests and volunteers powered by our Google Sheet. Explore deeper trends via the interactive dashboard below.";

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold text-charcoal sm:text-5xl">{heading}</h1>
        {intro && <p className="mx-auto max-w-2xl text-base text-charcoal/75">{intro}</p>}
      </header>
      <KPIBar stats={stats} />
      <LookerEmbed looker={stats.lookers ?? site.lookers} dashboard={stats.dashboardSection} />
    </div>
  );
}
