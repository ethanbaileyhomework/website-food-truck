import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { ImpactHighlights } from "@/components/home/impact-highlights";
import { ServiceInfo } from "@/components/home/service-info";
import { InfoCards } from "@/components/shared/info-cards";
import { TestimonialCarousel } from "@/components/shared/testimonial-carousel";
import { getHomeContent, getSiteSettings, getStatsSettings } from "@/lib/content";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomeContent();
  return {
    title: home.seo?.title ?? "Home",
    description: home.seo?.description,
  };
}

export default async function HomePage() {
  const [settings, home, statsSettings] = await Promise.all([
    getSiteSettings(),
    getHomeContent(),
    getStatsSettings(),
  ]);

  return (
    <div className="space-y-16">
      <Hero hero={home.hero} service={settings.service} />
      <ServiceInfo service={settings.service} map={settings.map} />
      <InfoCards
        title={home.whatWeDo.title}
        description={home.whatWeDo.description}
        cards={home.whatWeDo.cards}
      />
      <ImpactHighlights
        title={home.impact.title}
        description={home.impact.description}
        fallback={statsSettings.fallbackTotals}
      />
      <TestimonialCarousel title={home.carousel.title} items={home.carousel.items} />
    </div>
  );
}
