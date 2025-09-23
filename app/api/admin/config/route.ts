import { NextResponse } from "next/server";
import YAML from "yaml";

import configTemplate from "@/admin/config.yml";

export const dynamic = "force-dynamic";

type ConfigData = Record<string, unknown>;

let cachedConfig: ConfigData | null = null;
let cachedError: Error | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function applyRuntimeOverrides(config: ConfigData) {
  const backend = isRecord(config.backend) ? { ...config.backend } : {};

  const backendName =
    process.env.DECAP_BACKEND_NAME ??
    (typeof backend.name === "string" ? backend.name : "github");
  backend.name = backendName;

  const branch =
    process.env.DECAP_BACKEND_BRANCH ??
    (typeof backend.branch === "string" ? backend.branch : "main");
  backend.branch = branch;

  if (backendName === "github") {
    const repo =
      process.env.DECAP_GITHUB_REPO ??
      (typeof backend.repo === "string" ? backend.repo : undefined) ??
      "ethanbaileyhomework/website-food-truck";

    if (!repo) {
      console.warn(
        "Decap CMS GitHub backend is missing a repository. Set the DECAP_GITHUB_REPO environment variable or update admin/config.yml."
      );
    } else {
      backend.repo = repo;
    }

    const baseUrl = process.env.DECAP_OAUTH_BASE_URL ?? "/api/oauth";
    backend.base_url = baseUrl;

    const authEndpoint = process.env.DECAP_OAUTH_ENDPOINT ?? "auth";
    backend.auth_endpoint = authEndpoint;

    const appId = process.env.DECAP_GITHUB_APP_ID;
    if (appId) {
      backend.app_id = appId;
    }

    const apiRoot = process.env.DECAP_GITHUB_API_ROOT;
    if (apiRoot) {
      backend.api_root = apiRoot;
    }
  }

  config.backend = backend;

  const siteUrl = process.env.DECAP_SITE_URL;
  if (siteUrl) {
    config.site_url = siteUrl;
  }

  const displayUrl = process.env.DECAP_DISPLAY_URL ?? siteUrl;
  if (displayUrl) {
    config.display_url = displayUrl;
  }
}

function getConfig(): ConfigData {
  if (!cachedConfig && !cachedError) {
    try {
      const parsed = YAML.parse(configTemplate);

      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid CMS configuration template.");
      }

      applyRuntimeOverrides(parsed as ConfigData);

      cachedConfig = parsed as ConfigData;
    } catch (error) {
      cachedError =
        error instanceof Error
          ? error
          : new Error("Unknown error parsing CMS configuration.");
    }
  }

  if (cachedError) {
    throw cachedError;
  }

  if (!cachedConfig) {
    throw new Error("CMS configuration not available.");
  }

  return cachedConfig;
}

export async function GET() {
  try {
    const config = getConfig();

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
