"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

import type { CarouselItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TestimonialCarousel({ title, items }: { title?: string; items: CarouselItem[] }) {
  const [index, setIndex] = useState(0);
  const safeItems = useMemo(() => (items.length > 0 ? items : []), [items]);

  useEffect(() => {
    if (safeItems.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [safeItems.length]);

  if (safeItems.length === 0) return null;

  const current = safeItems[index];

  return (
    <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-10 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            {title && <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary/70">{title}</p>}
            <h2 className="mt-2 text-3xl font-semibold text-charcoal">{current.name}</h2>
            {current.role && <p className="text-sm text-charcoal/70">{current.role}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full border border-brand-primary/30 p-2 text-brand-primary transition hover:bg-brand-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              onClick={() => setIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length)}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              className="rounded-full border border-brand-primary/30 p-2 text-brand-primary transition hover:bg-brand-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              onClick={() => setIndex((prev) => (prev + 1) % safeItems.length)}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          {current.image && (
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-sand">
              <Image src={current.image} alt={`Portrait of ${current.name}`} fill className="object-cover" />
            </div>
          )}
          <blockquote className="relative flex-1 text-lg text-charcoal/85">
            <Quote className="absolute -left-1 -top-4 h-8 w-8 text-brand-primary/20" aria-hidden />
            <p className="pl-8">{current.quote}</p>
          </blockquote>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {safeItems.map((_, itemIndex) => (
            <span
              key={itemIndex}
              aria-hidden
              className={cn("h-2.5 w-2.5 rounded-full transition", index === itemIndex ? "bg-brand-primary" : "bg-brand-primary/30")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
