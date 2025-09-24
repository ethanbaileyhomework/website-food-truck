import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import YAML from "yaml";

import { loadStaticFile } from "@/lib/server/static-file";
import type { StatsApiResponse, StatsSettings } from "@/lib/types";

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const CSV_REQUEST_TIMEOUT = 8 * 1000; // 8 seconds
const LIVE_RESPONSE_MAX_AGE_SECONDS = 60; // 1 minute
const FALLBACK_RESPONSE_MAX_AGE_SECONDS = 120; // 2 minutes

type StatsSource = "live" | "fallback";

type CacheEntry = {
  timestamp: number;
  data: StatsApiResponse;
  source: StatsSource;
};

type SkipReason = "disabled" | "invalid-url" | "missing-csv-url" | "placeholder-url";

type SkipDecision =
  | { shouldSkip: true; reason: SkipReason; url?: string }
  | { shouldSkip: false; url: string; from: "config" | "env" };

type UnknownRecord = Record<string, unknown>;

const globalForStats = globalThis as typeof globalThis & {
  __statsCache?: CacheEntry;
  __statsLoggedReasons?: Partial<Record<SkipReason, true>>;
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

const statsSettingsSource = loadStaticFile("content/stats-settings.yaml");
const statsSettings: StatsSettings = YAML.parse(statsSettingsSource);
const disableRemoteFetch = parseBoolean(process.env.STATS_DISABLE_FETCH);

function parseBoolean(value: string | undefined) {
  return typeof value === "string" && /^(1|true|yes|on)$/i.test(value.trim());
}

function resolveCsvUrl(stats: StatsSettings): SkipDecision {
  if (disableRemoteFetch) {
    return { shouldSkip: true, reason: "disabled" };
  }

  const envUrl = process.env.STATS_CSV_URL?.trim();
  if (envUrl) {
    return validateCsvUrl(envUrl, "env");
  }

  const configUrl = stats.sheet.csvUrl?.trim();
  if (!configUrl) {
    return { shouldSkip: true, reason: "missing-csv-url" };
  }

  if (configUrl.includes("placeholder")) {
    return { shouldSkip: true, reason: "placeholder-url" };
  }

  return validateCsvUrl(configUrl, "config");
}

function validateCsvUrl(url: string, from: "config" | "env"): SkipDecision {
  try {
    const parsed = new URL(url);

    if (!(["http:", "https:"].includes(parsed.protocol))) {
      return { shouldSkip: true, reason: "invalid-url", url };
    }

    return { shouldSkip: false, url: parsed.toString(), from };
  } catch {
    return { shouldSkip: true, reason: "invalid-url", url };
  }
}

function rememberSkip(reason: SkipReason, details?: { url?: string }) {
  if (!globalForStats.__statsLoggedReasons) {
    globalForStats.__statsLoggedReasons = {};
  }

  if (globalForStats.__statsLoggedReasons[reason]) {
    return;
  }

  globalForStats.__statsLoggedReasons[reason] = true;

  switch (reason) {
    case "disabled":
      console.info("Stats CSV fetching disabled via STATS_DISABLE_FETCH. Serving fallback data.");
      break;
    case "missing-csv-url":
      console.warn("Stats CSV URL is not configured. Serving fallback data.");
      break;
    case "placeholder-url":
      console.info(
        "Stats CSV URL is set to the placeholder value. Serving fallback data until a real sheet URL is configured."
      );
      break;
    case "invalid-url":
      if (details?.url) {
        console.warn(
          `Stats CSV URL "${details.url}" is invalid or unsupported. Serving fallback data.`
        );
      } else {
        console.warn("Stats CSV URL is invalid. Serving fallback data.");
      }
      break;
  }
}

function respondWith(data: StatsApiResponse, source: StatsSource) {
  const maxAge =
    source === "live" ? LIVE_RESPONSE_MAX_AGE_SECONDS : FALLBACK_RESPONSE_MAX_AGE_SECONDS;

  return NextResponse.json(data, {
    headers: {
      "cache-control": `public, max-age=${maxAge}`,
      "x-stats-source": source,
    },
  });
}

function isTimeoutError(error: unknown): error is Error {
  return error instanceof Error && error.name === "TimeoutError";
}

function isAbortError(error: unknown): error is Error {
  return error instanceof Error && (error.name === "AbortError" || /aborted/i.test(error.message));
}

function getErrorCode(value: unknown): string | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const record = value as UnknownRecord;

  const directCode = record.code;
  if (typeof directCode === "string" && directCode) {
    return directCode;
  }

  if (record.cause) {
    const causeCode = getErrorCode(record.cause);
    if (causeCode) {
      return causeCode;
    }
  }

  const aggregateErrors = record.errors;
  if (Array.isArray(aggregateErrors)) {
    for (const nested of aggregateErrors) {
      const nestedCode = getErrorCode(nested);
      if (nestedCode) {
        return nestedCode;
      }
    }
  }

  return undefined;
}

function isNetworkError(error: unknown): error is Error {
  if (!(error instanceof Error)) {
    return false;
  }

  if (error.name === "TypeError" && /fetch failed/i.test(error.message)) {
    return true;
  }

  const code = getErrorCode(error);
  if (!code) {
    return false;
  }

  return /^E[A-Z0-9_]+/.test(code) || code.startsWith("ERR_") || code.startsWith("UND_ERR");
}

function logStatsFetchError(error: unknown) {
  if (isTimeoutError(error)) {
    console.warn(
      `Stats API request timed out after ${CSV_REQUEST_TIMEOUT}ms. Serving fallback data.`
    );
    return;
  }

  if (isAbortError(error)) {
    console.warn("Stats API request was aborted. Serving fallback data.");
    return;
  }

  if (isNetworkError(error)) {
    const code = getErrorCode(error);
    const detail = code ? `${code}: ${error.message}` : error.message;
    console.warn(`Stats API network error (${detail}). Serving fallback data.`);
    return;
  }

  if (error instanceof Error) {
    console.error("Stats API error", error);
  } else {
    console.error("Stats API unknown error", error);
  }
}

export async function GET() {
  const stats = statsSettings;
  const cached = globalForStats.__statsCache;
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return respondWith(cached.data, cached.source);
  }

  const decision = resolveCsvUrl(stats);

  if (decision.shouldSkip) {
    const fallback = buildFallback(stats);
    globalForStats.__statsCache = { timestamp: now, data: fallback, source: "fallback" };
    rememberSkip(decision.reason, { url: decision.url });
    return respondWith(fallback, "fallback");
  }

  try {
    const response = await fetchWithTimeout(decision.url, {
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
      source: "live",
    };

    return respondWith(payload, "live");
  } catch (error) {
    logStatsFetchError(error);
    const fallback = buildFallback(stats);
    globalForStats.__statsCache = { timestamp: now, data: fallback, source: "fallback" };
    return respondWith(fallback, "fallback");
  }
}

async function fetchWithTimeout(
  url: string,
  init?: RequestInit & { next?: { revalidate?: number } },
  timeoutMs = CSV_REQUEST_TIMEOUT
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      const timeoutError = new Error(`Request for ${url} timed out after ${timeoutMs}ms`, {
        cause: error instanceof Error ? error : undefined,
      });
      timeoutError.name = "TimeoutError";
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
