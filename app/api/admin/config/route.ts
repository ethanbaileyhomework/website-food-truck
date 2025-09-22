import { NextResponse } from "next/server";

import cmsConfig from "@/admin/config.yml";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type ConfigData = Record<string, unknown>;

const { configData, configError } = (() => {
  try {
    if (!cmsConfig || typeof cmsConfig !== "object" || Array.isArray(cmsConfig)) {
      throw new Error("Invalid CMS configuration template.");
    }

    return { configData: cmsConfig as ConfigData, configError: null };
  } catch (error) {
    return {
      configData: null,
      configError:
        error instanceof Error
          ? error
          : new Error("Unknown error loading CMS configuration."),
    };
  }
})();

export async function GET() {
  if (configError) {
    console.error("Failed to load CMS configuration", configError);
    return NextResponse.json(
      { message: "Unable to load CMS configuration." },
      { status: 500 }
    );
  }

  if (!configData) {
    console.error("CMS configuration not available.");
    return NextResponse.json(
      { message: "Unable to load CMS configuration." },
      { status: 500 }
    );
  }

  return NextResponse.json(configData, {
    headers: { "cache-control": "no-store" },
  });
}
