import { NextResponse } from "next/server";
import YAML from "yaml";

import configTemplate from "@/admin/config.yml";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ConfigData = Record<string, unknown>;

type CollectionEntry = Record<string, unknown> & { name?: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseConfig(): ConfigData {
  const parsed = YAML.parse(configTemplate);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid CMS configuration template.");
  }

  return parsed as ConfigData;
}

function ensureBackend(config: ConfigData) {
  const backend = isRecord(config.backend) ? { ...config.backend } : {};

  config.backend = {
    ...backend,
    name: "github",
    repo: "ethanbaileyhomework/website-food-truck",
    branch: "main",
    base_url: "/api/oauth",
    auth_endpoint: "auth",
  };
}

const siteCollection = {
  name: "site",
  label: "Site Settings",
  file: "public/content/site.json",
  fields: [
    { label: "Site Name", name: "siteName", widget: "string" },
    { label: "Tagline", name: "tagline", widget: "string", required: false },
    {
      label: "Primary Color",
      name: "primaryColor",
      widget: "string",
      required: false,
    },
    { label: "Logo", name: "logo", widget: "image", required: false },
  ],
};

function ensureSiteCollection(config: ConfigData) {
  const collections = config.collections;

  if (Array.isArray(collections)) {
    const hasSiteCollection = collections.some((entry) => {
      if (!isRecord(entry)) {
        return false;
      }

      const { name } = entry as CollectionEntry;

      return typeof name === "string" && name === siteCollection.name;
    });

    if (!hasSiteCollection) {
      config.collections = [...collections, siteCollection];
    }
  } else {
    config.collections = [siteCollection];
  }
}

export async function GET() {
  try {
    const config = parseConfig();

    ensureBackend(config);
    ensureSiteCollection(config);

    return NextResponse.json(config, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load CMS configuration", error);
    return NextResponse.json(
      { message: "Unable to load CMS configuration." },
      { status: 500 }
    );
  }
}
