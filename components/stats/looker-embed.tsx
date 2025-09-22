import type { LookerSettings, StatsSettings } from "@/lib/types";

export function LookerEmbed({
  looker,
  dashboard,
}: {
  looker?: LookerSettings;
  dashboard?: StatsSettings["dashboardSection"];
}) {
  if (!looker?.statsUrl) return null;

  const heading = dashboard?.title ?? "Interactive dashboard";
  const description = dashboard?.description ?? looker.embedTitle;
  const iframeTitle = looker.embedTitle ?? heading;

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-charcoal">{heading}</h2>
          {description && <p className="text-sm text-charcoal/70">{description}</p>}
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <iframe
            title={iframeTitle}
            src={looker.statsUrl}
            className="h-full w-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
