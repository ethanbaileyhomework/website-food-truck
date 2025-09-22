import Link from "next/link";

import type { ServiceDetails, SiteSettings } from "@/lib/types";

export function ServiceInfo({ service, map }: { service?: ServiceDetails; map?: SiteSettings["map"] }) {
  if (!service) return null;

  const labels = service.labels ?? {};

  return (
    <section id="service-details" className="mx-auto mt-16 max-w-6xl rounded-3xl bg-white p-8 shadow-soft sm:p-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary/75">
              {labels.sectionEyebrow ?? "Service details"}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-charcoal">{service.title ?? "Weekly service"}</h2>
            {service.description && <p className="mt-3 text-base text-charcoal/80">{service.description}</p>}
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {service.days && (
              <div>
                <dt className="text-sm font-semibold text-charcoal/90">Days</dt>
                <dd className="text-base text-charcoal/80">{service.days}</dd>
              </div>
            )}
            {service.time && (
              <div>
                <dt className="text-sm font-semibold text-charcoal/90">Time</dt>
                <dd className="text-base text-charcoal/80">{service.time}</dd>
              </div>
            )}
            {service.location && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-semibold text-charcoal/90">Location</dt>
                <dd className="text-base text-charcoal/80">{service.location}</dd>
              </div>
            )}
          </dl>
          {service.notes && service.notes.length > 0 && (
            <div className="rounded-2xl bg-sand/70 p-4 text-sm text-charcoal/80">
              <p className="font-semibold text-charcoal">{labels.notesTitle ?? "What to expect"}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {service.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {service.phone && (
              <Link
                href={`tel:${service.phone}`}
                className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                {labels.callCta ?? "Call us"}
              </Link>
            )}
            {service.email && (
              <Link
                href={`mailto:${service.email}`}
                className="inline-flex items-center justify-center rounded-full border border-brand-primary/40 px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:border-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                {labels.emailCta ?? "Email the team"}
              </Link>
            )}
            {map?.directionsUrl && (
              <Link
                href={map.directionsUrl}
                className="inline-flex items-center justify-center rounded-full border border-brand-primary/40 px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:border-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                {service.ctaLabel ?? "Get directions"}
              </Link>
            )}
          </div>
        </div>
        {map?.embedUrl && (
          <div className="overflow-hidden rounded-2xl shadow-soft">
            <iframe
              title={labels.mapTitle ?? "Service location map"}
              src={map.embedUrl}
              className="h-[320px] w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </section>
  );
}
