import { NextResponse } from "next/server";
import YAML from "yaml";

import configTemplate from "@/admin/config.yml";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type ConfigData = Record<string, unknown>;

let cachedConfig: ConfigData | null = null;
let cachedError: Error | null = null;

function getConfig(): ConfigData {
  if (!cachedConfig && !cachedError) {
    try {
      const parsed = YAML.parse(configTemplate);

      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid CMS configuration template.");
      }

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
