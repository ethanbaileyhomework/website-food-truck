import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

import { getStatsSettings } from "@/lib/content";
import type { StatsApiResponse, StatsSettings } from "@/lib/types";

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

type CacheEntry = {
  timestamp: number;
  data: StatsApiResponse;
};

const globalForStats = globalThis as typeof globalThis & {
  __statsCache?: CacheEntry;
};

function parseNumber(value: unknown) {
  const num = typeof value === "number" ? value : Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(num) ? num : Number.NaN;
}

function buildFallback(stats: StatsSettings): StatsApiResponse {
  return {
    totals: stats.fallbackTotals,
    latestService: stats.fallbackLatestService,
  };
}

export async function GET() {
  const stats = await getStatsSettings();
  const cached = globalForStats.__statsCache;
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data, {
      headers: {
        "cache-control": "public, max-age=60",
      },
    });
  }

  if (!stats.sheet.csvUrl) {
    const fallback = buildFallback(stats);
    globalForStats.__statsCache = { timestamp: now, data: fallback };
    return NextResponse.json(fallback);
  }

  try {
    const response = await fetch(stats.sheet.csvUrl, {
      next: { revalidate: CACHE_DURATION / 1000 },
    });

    if (!response.ok) {
      throw new Error(`Failed to load stats CSV: ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    if (!rows || rows.length === 0) {
      throw new Error("No rows found in CSV");
    }

    const mapping = stats.sheet.fieldMapping;

    const sorted = [...rows].sort((a, b) => {
      const dateA = new Date(a[mapping.date] ?? "").getTime();
      const dateB = new Date(b[mapping.date] ?? "").getTime();
      return dateB - dateA;
    });

    const totals = sorted.reduce(
      (acc, row) => {
        const meals = parseNumber(row[mapping.meals]);
        const guests = parseNumber(row[mapping.guests]);
        const volunteers = parseNumber(row[mapping.volunteers]);
        const groceries = parseNumber(row[mapping.groceries]);

        acc.meals += Number.isFinite(meals) ? meals : 0;
        acc.guests += Number.isFinite(guests) ? guests : 0;
        acc.volunteers += Number.isFinite(volunteers) ? volunteers : 0;
        acc.groceries += Number.isFinite(groceries) ? groceries : 0;
        return acc;
      },
      { meals: 0, guests: 0, volunteers: 0, groceries: 0 }
    );

    const latestRow = sorted[0];
    const latestMeals = parseNumber(latestRow?.[mapping.meals]);
    const latestGuests = parseNumber(latestRow?.[mapping.guests]);
    const latestVolunteers = parseNumber(latestRow?.[mapping.volunteers]);
    const latestGroceries = parseNumber(latestRow?.[mapping.groceries]);

    const latest = {
      date: latestRow?.[mapping.date] ?? stats.fallbackLatestService.date,
      meals: Number.isFinite(latestMeals) ? latestMeals : stats.fallbackLatestService.meals,
      guests: Number.isFinite(latestGuests) ? latestGuests : stats.fallbackLatestService.guests,
      volunteers: Number.isFinite(latestVolunteers) ? latestVolunteers : stats.fallbackLatestService.volunteers,
      groceries: Number.isFinite(latestGroceries) ? latestGroceries : stats.fallbackLatestService.groceries,
      notes: mapping.notes ? latestRow?.[mapping.notes] : undefined,
    };

    const safeTotals = {
      meals: Number.isFinite(totals.meals) ? totals.meals : stats.fallbackTotals.meals,
      guests: Number.isFinite(totals.guests) ? totals.guests : stats.fallbackTotals.guests,
      volunteers: Number.isFinite(totals.volunteers) ? totals.volunteers : stats.fallbackTotals.volunteers,
      groceries: Number.isFinite(totals.groceries) ? totals.groceries : stats.fallbackTotals.groceries,
      services: sorted.length > 0 ? sorted.length : stats.fallbackTotals.services,
    };

    const payload: StatsApiResponse = {
      totals: safeTotals,
      latestService: latest,
    };

    globalForStats.__statsCache = {
      timestamp: now,
      data: payload,
    };

    return NextResponse.json(payload, {
      headers: {
        "cache-control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error("Stats API error", error);
    const fallback = buildFallback(stats);
    globalForStats.__statsCache = { timestamp: now, data: fallback };
    return NextResponse.json(fallback, {
      headers: {
        "cache-control": "public, max-age=120",
      },
    });
  }
}
