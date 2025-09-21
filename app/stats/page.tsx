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

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold text-charcoal sm:text-5xl">Service stats</h1>
        <p className="mx-auto max-w-2xl text-base text-charcoal/75">
          Live counts of meals, guests and volunteers powered by our Google Sheet. Explore deeper trends via the interactive dashboard below.
        </p>
      </header>
      <KPIBar
        fallbackTotals={stats.fallbackTotals}
        fallbackLatestService={stats.fallbackLatestService}
      />
      <LookerEmbed looker={stats.lookers ?? site.lookers} />
    </div>
  );
}
