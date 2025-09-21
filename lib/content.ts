import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import YAML from "yaml";
import { cache } from "react";

import type {
  AboutContent,
  DonateContent,
  HomeContent,
  Partner,
  SiteSettings,
  SponsorsContent,
  StatsSettings,
  Story,
  TeamMember,
  VolunteerContent,
} from "@/lib/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

async function readFileSafe(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    console.error(`Failed to read content file: ${filePath}`, error);
    throw error;
  }
}

const readYamlFile = cache(async <T>(fileName: string): Promise<T> => {
  const filePath = path.join(CONTENT_DIR, fileName);
  const file = await readFileSafe(filePath);
  return YAML.parse(file) as T;
});

async function readMarkdownCollection<T extends { slug: string }>(
  folder: string,
  mapItem: (data: Record<string, unknown>, body: string, slug: string) => T
) {
  const dirPath = path.join(CONTENT_DIR, folder);
  const files = await fs.readdir(dirPath);

  const entries = await Promise.all(
    files
      .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.(md|mdx)$/i, "");
        const filePath = path.join(dirPath, fileName);
        const file = await readFileSafe(filePath);
        const { data, content } = matter(file);
        return mapItem(data, content.trim(), slug);
      })
  );

  return entries;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return readYamlFile<SiteSettings>("site-settings.yaml");
});

export const getHomeContent = cache(async (): Promise<HomeContent> => {
  return readYamlFile<HomeContent>("home.yaml");
});

export const getStatsSettings = cache(async (): Promise<StatsSettings> => {
  return readYamlFile<StatsSettings>("stats-settings.yaml");
});

export const getAboutContent = cache(async (): Promise<AboutContent> => {
  return readYamlFile<AboutContent>("about.yaml");
});

export const getDonateContent = cache(async (): Promise<DonateContent> => {
  return readYamlFile<DonateContent>("donate.yaml");
});

export const getVolunteerContent = cache(async (): Promise<VolunteerContent> => {
  return readYamlFile<VolunteerContent>("volunteer.yaml");
});

export const getSponsorsContent = cache(async (): Promise<SponsorsContent> => {
  return readYamlFile<SponsorsContent>("sponsors.yaml");
});

export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  const team = await readMarkdownCollection("team", (data, body, slug) => {
    const record = data as Record<string, unknown>;
    const orderRaw = record.order;
    const orderValue =
      typeof orderRaw === "number"
        ? orderRaw
        : typeof orderRaw === "string"
          ? Number.parseInt(orderRaw, 10)
          : undefined;

    return {
      name: typeof record.name === "string" ? record.name : "Unnamed",
      role: typeof record.role === "string" ? record.role : undefined,
      email: typeof record.email === "string" ? record.email : undefined,
      headshot: typeof record.headshot === "string" ? record.headshot : undefined,
      order: Number.isFinite(orderValue) ? orderValue : undefined,
      body,
      slug,
    } satisfies TeamMember;
  });

  return team.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
});

export const getStories = cache(async (): Promise<Story[]> => {
  const stories = await readMarkdownCollection("stories", (data, body, slug) => {
    const record = data as Record<string, unknown>;
    return {
      title: typeof record.title === "string" ? record.title : slug,
      date: typeof record.date === "string" ? record.date : "",
      coverImage: typeof record.coverImage === "string" ? record.coverImage : undefined,
      body,
      slug,
    } satisfies Story;
  });

  return stories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

export const getPartners = cache(async (): Promise<Partner[]> => {
  const partners = await readMarkdownCollection("partners", (data, body, slug) => {
    const record = data as Record<string, unknown>;
    const orderRaw = record.order;
    const orderValue =
      typeof orderRaw === "number"
        ? orderRaw
        : typeof orderRaw === "string"
          ? Number.parseInt(orderRaw, 10)
          : undefined;

    return {
      name: typeof record.name === "string" ? record.name : slug,
      link: typeof record.link === "string" ? record.link : undefined,
      logo: typeof record.logo === "string" ? record.logo : undefined,
      blurb: typeof record.blurb === "string" && record.blurb.length > 0 ? record.blurb : body,
      category: typeof record.category === "string" ? record.category : undefined,
      order: Number.isFinite(orderValue) ? orderValue : undefined,
      slug,
    } satisfies Partner;
  });

  return partners.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
});
