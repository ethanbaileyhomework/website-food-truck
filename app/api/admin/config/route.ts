import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

export const dynamic = "force-dynamic";

const CONFIG_TEMPLATE_PATH = path.join(
  process.cwd(),
  "public",
  "admin",
  "config.yml"
);

export async function GET() {
  try {
    const raw = await readFile(CONFIG_TEMPLATE_PATH, "utf8");
    const parsed = YAML.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid CMS configuration template.");
    }

    return NextResponse.json(parsed as Record<string, unknown>, {
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
