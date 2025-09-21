"use client";

import { useEffect, useMemo, useState } from "react";

import { formatStatNumber } from "@/lib/utils";

export function KPICounter({ label, value }: { label: string; value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  const duration = 1200;

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  const formatted = useMemo(() => formatStatNumber(displayValue), [displayValue]);

  return (
    <div className="space-y-2 text-center">
      <p className="text-4xl font-semibold text-brand-primary sm:text-5xl">{formatted}</p>
      <p className="text-sm uppercase tracking-[0.2em] text-charcoal/60">{label}</p>
    </div>
  );
}
