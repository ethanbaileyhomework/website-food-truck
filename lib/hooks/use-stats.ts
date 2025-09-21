"use client";

import useSWR from "swr";

import type { StatsApiResponse } from "@/lib/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load stats");
  }
  return (await res.json()) as StatsApiResponse;
};

export function useStats() {
  return useSWR<StatsApiResponse>("/api/stats", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 5 * 60 * 1000,
  });
}
