"use client";

import { useStats } from "@/lib/hooks/use-stats";
import type { StatsSettings } from "@/lib/types";

import { KPICounter } from "@/components/shared/kpi-counter";

export function ImpactHighlights({ title, description, fallback }: { title: string; description?: string; fallback: StatsSettings["fallbackTotals"] }) {
  const { data, error } = useStats();
  const totals = data?.totals ?? fallback;

  return (
    <section className="mx-auto mt-20 max-w-6xl rounded-3xl bg-gradient-to-br from-brand-primary/10 via-white to-sand/80 px-4 py-16 shadow-soft sm:px-6 lg:px-12">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-charcoal sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-base text-charcoal/75">{description}</p>}
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-brand-primary/80">
          {error ? "Showing latest published totals" : "Updated automatically from our live service sheet"}
        </p>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        <KPICounter label="Total meals" value={totals.meals} />
        <KPICounter label="Guests welcomed" value={totals.guests} />
        <KPICounter label="Services run" value={totals.services} />
      </div>
    </section>
  );
}
