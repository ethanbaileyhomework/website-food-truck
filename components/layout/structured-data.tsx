import type { SiteSettings } from "@/lib/types";

function buildStructuredData(settings: SiteSettings) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName,
    url: 'https://cranbournefoodtruck.com',
    description: settings.siteTagline ?? settings.seo?.defaultDescription,
    logo: settings.logo ? `https://cranbournefoodtruck.com${settings.logo}` : undefined,
    contactPoint: settings.contact?.phone
      ? [{
          '@type': 'ContactPoint',
          telephone: settings.contact.phone,
          contactType: 'customer service',
        }]
      : undefined,
    sameAs: settings.socials
      ? Object.values(settings.socials).filter(Boolean)
      : undefined,
  };

  const event = settings.service?.title
    ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: settings.service.title,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: settings.map?.directionsUrl
          ? {
              '@type': 'Place',
              name: settings.service.location,
              url: settings.map.directionsUrl,
            }
          : undefined,
        startDate: new Date().toISOString(),
        description: settings.service.description,
      }
    : undefined;

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName,
    url: 'https://cranbournefoodtruck.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://cranbournefoodtruck.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return [organization, event, webSite].filter(Boolean);
}

export function StructuredData({ settings }: { settings: SiteSettings }) {
  const jsonLd = buildStructuredData(settings);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
