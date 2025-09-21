"use client";

import { useStats } from "@/lib/hooks/use-stats";
import type { StatsSettings } from "@/lib/types";
import { formatFullDate } from "@/lib/utils";

import { KPICounter } from "@/components/shared/kpi-counter";

export function KPIBar({ fallbackTotals, fallbackLatestService }: { fallbackTotals: StatsSettings["fallbackTotals"]; fallbackLatestService: StatsSettings["fallbackLatestService"]; }) {
  const { data, error } = useStats();

  const totals = data?.totals ?? fallbackTotals;
  const latest = data?.latestService ?? fallbackLatestService;

  return (
    <section className="mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-primary/70">Latest service</p>
            <h2 className="mt-2 text-2xl font-semibold text-charcoal">
              {formatFullDate(latest.date, "Most recent service")}
            </h2>
            <p className="text-sm text-charcoal/70">
              {error ? "Showing fallback numbers from CMS" : "Streaming directly from our Google Sheet"}
            </p>
          </div>
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-sand/70 p-4 text-sm">
              <p className="font-semibold text-charcoal/90">Meals served</p>
              <p className="mt-1 text-2xl font-semibold text-brand-primary">{latest.meals}</p>
            </div>
            <div className="rounded-2xl bg-sand/70 p-4 text-sm">
              <p className="font-semibold text-charcoal/90">Guests welcomed</p>
              <p className="mt-1 text-2xl font-semibold text-brand-primary">{latest.guests}</p>
            </div>
            <div className="rounded-2xl bg-sand/70 p-4 text-sm">
              <p className="font-semibold text-charcoal/90">Volunteers rostered</p>
              <p className="mt-1 text-2xl font-semibold text-brand-primary">{latest.volunteers}</p>
            </div>
            <div className="rounded-2xl bg-sand/70 p-4 text-sm">
              <p className="font-semibold text-charcoal/90">Grocery packs</p>
              <p className="mt-1 text-2xl font-semibold text-brand-primary">{latest.groceries}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <KPICounter label="Total meals" value={totals.meals} />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <KPICounter label="Guests welcomed" value={totals.guests} />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <KPICounter label="Volunteers" value={totals.volunteers} />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <KPICounter label="Services" value={totals.services} />
        </div>
      </div>
    </section>
  );
}
