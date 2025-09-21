import type { LookerSettings } from "@/lib/types";

export function LookerEmbed({ looker }: { looker?: LookerSettings }) {
  if (!looker?.statsUrl) return null;

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-charcoal">Interactive dashboard</h2>
          {looker.embedTitle && <p className="text-sm text-charcoal/70">{looker.embedTitle}</p>}
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <iframe
            title={looker.embedTitle ?? "Looker Studio dashboard"}
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
