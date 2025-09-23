import { cache } from "react";

import rawContent from "@/generated/content.json";
import type {
  AboutContent,
  DonateContent,
  HomeContent,
  LegalPageContent,
  Partner,
  SiteSettings,
  SponsorsContent,
  StatsSettings,
  Story,
  TeamMember,
  VolunteerContent,
} from "@/lib/types";

type MarkdownEntry = {
  slug: string;
  data: Record<string, unknown>;
  content: string;
};

type LegalEntries = Record<"privacy" | "terms", MarkdownEntry>;

type GeneratedContent = {
  siteSettings: SiteSettings;
  home: HomeContent;
  statsSettings: StatsSettings;
  about: AboutContent;
  donate: DonateContent;
  volunteer: VolunteerContent;
  sponsors: SponsorsContent;
  legal: LegalEntries;
  team: MarkdownEntry[];
  stories: MarkdownEntry[];
  partners: MarkdownEntry[];
};

const content = rawContent as GeneratedContent;

function parseOrder(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return content.siteSettings;
});

export const getHomeContent = cache(async (): Promise<HomeContent> => {
  return content.home;
});

export const getStatsSettings = cache(async (): Promise<StatsSettings> => {
  return content.statsSettings;
});

export const getAboutContent = cache(async (): Promise<AboutContent> => {
  return content.about;
});

export const getDonateContent = cache(async (): Promise<DonateContent> => {
  return content.donate;
});

export const getVolunteerContent = cache(async (): Promise<VolunteerContent> => {
  return content.volunteer;
});

export const getSponsorsContent = cache(async (): Promise<SponsorsContent> => {
  return content.sponsors;
});

export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  const members = content.team ?? [];

  return members
    .map(({ data, content: body, slug }) => {
      const order = parseOrder(data.order);

      return {
        name: typeof data.name === "string" ? data.name : "Unnamed",
        role: typeof data.role === "string" ? data.role : undefined,
        email: typeof data.email === "string" ? data.email : undefined,
        headshot: typeof data.headshot === "string" ? data.headshot : undefined,
        order: Number.isFinite(order) ? order : undefined,
        body,
        slug,
      } satisfies TeamMember;
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
});

export const getStories = cache(async (): Promise<Story[]> => {
  const stories = content.stories ?? [];

  return stories
    .map(({ data, content: body, slug }) => {
      const date = typeof data.date === "string" ? data.date : "";
      return {
        title: typeof data.title === "string" ? data.title : slug,
        date,
        coverImage: typeof data.coverImage === "string" ? data.coverImage : undefined,
        body,
        slug,
      } satisfies Story;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

export const getPartners = cache(async (): Promise<Partner[]> => {
  const partners = content.partners ?? [];

  return partners
    .map(({ data, content: body, slug }) => {
      const order = parseOrder(data.order);
      const blurb =
        typeof data.blurb === "string" && data.blurb.length > 0 ? data.blurb : body;

      return {
        name: typeof data.name === "string" ? data.name : slug,
        link: typeof data.link === "string" ? data.link : undefined,
        logo: typeof data.logo === "string" ? data.logo : undefined,
        blurb,
        category: typeof data.category === "string" ? data.category : undefined,
        order: Number.isFinite(order) ? order : undefined,
        slug,
      } satisfies Partner;
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
});

export const getLegalPage = cache(async (slug: "privacy" | "terms"): Promise<LegalPageContent> => {
  const entry = content.legal[slug];
  const record = entry?.data ?? {};

  return {
    title: typeof record.title === "string" ? record.title : slug,
    description: typeof record.description === "string" ? record.description : undefined,
    body: entry?.content ?? "",
  } satisfies LegalPageContent;
});
