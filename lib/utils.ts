import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatStatNumber(value: number) {
  if (Number.isNaN(value)) return "0";
  if (value >= 1000) {
    return new Intl.NumberFormat("en-AU", { notation: "compact" }).format(value);
  }
  return new Intl.NumberFormat("en-AU").format(value);
}

export function formatFullDate(dateString: string, fallback: string = "") {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }
  return format(parsed, "EEEE d MMMM yyyy");
}

export function ensureHttps(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `https://${url}`;
}
