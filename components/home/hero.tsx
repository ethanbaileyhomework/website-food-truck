import Image from "next/image";
import Link from "next/link";

import type { HomeHero, ServiceDetails } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Hero({ hero, service }: { hero: HomeHero; service?: ServiceDetails }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sand to-brand-primary/10 shadow-soft">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_top,_rgba(195,66,63,0.12),_transparent_60%)]" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr,0.85fr] lg:px-12 lg:py-20">
        <div className="space-y-6">
          {hero.eyebrow && <span className="inline-flex rounded-full bg-brand-primary/15 px-4 py-1 text-sm font-semibold text-brand-primary">{hero.eyebrow}</span>}
          <h1 className="text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl lg:text-6xl">{hero.headline}</h1>
          {hero.subheadline && <p className="max-w-xl text-lg text-charcoal/80">{hero.subheadline}</p>}
          <div className="flex flex-wrap gap-4">
            <Link
              href={hero.ctas.primary.href}
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {hero.ctas.primary.label}
            </Link>
            {hero.ctas.secondary && (
              <Link
                href={hero.ctas.secondary.href}
                className="inline-flex items-center justify-center rounded-full border border-brand-primary/40 bg-white px-6 py-3 text-base font-semibold text-brand-primary transition hover:border-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                {hero.ctas.secondary.label}
              </Link>
            )}
          </div>
          {service && (
            <div className="grid gap-3 rounded-2xl bg-white/80 p-5 shadow-soft backdrop-blur">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary/80">
                  {service.labels?.heroEyebrow ?? "This week’s service"}
                </p>
                <p className="text-lg font-semibold text-charcoal">{service.title}</p>
              </div>
              <dl className="grid gap-2 text-sm text-charcoal/85 sm:grid-cols-2">
                {service.days && (
                  <div>
                    <dt className="font-semibold text-charcoal">Days</dt>
                    <dd>{service.days}</dd>
                  </div>
                )}
                {service.time && (
                  <div>
                    <dt className="font-semibold text-charcoal">Time</dt>
                    <dd>{service.time}</dd>
                  </div>
                )}
                {service.location && (
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-charcoal">Location</dt>
                    <dd>{service.location}</dd>
                  </div>
                )}
                {service.description && (
                  <div className="sm:col-span-2 text-sm text-charcoal/70">{service.description}</div>
                )}
              </dl>
            </div>
          )}
        </div>
        {hero.image && (
          <div className={cn("relative flex items-center justify-center")}
          >
            <div className="relative aspect-[4/3] w-full max-w-xl">
              <Image
                src={hero.image}
                alt={hero.imageAlt ?? hero.headline}
                fill
                className="rounded-3xl object-cover shadow-soft"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
