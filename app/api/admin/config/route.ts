import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

export const dynamic = "force-dynamic";

const CONFIG_TEMPLATE_PATH = path.join(process.cwd(), "admin", "config.yml");

type PlainObject = Record<string, unknown>;

function resolveAuth0Setting(name: string) {
  return (
    process.env[name] ??
    process.env[`NEXT_PUBLIC_${name}`] ??
    ""
  );
}

function getAuth0Settings() {
  const domain = resolveAuth0Setting("AUTH0_DOMAIN");
  const clientId = resolveAuth0Setting("AUTH0_CLIENT_ID");
  return { domain, clientId };
}

export async function GET() {
  try {
    const { domain, clientId } = getAuth0Settings();

    if (!domain || !clientId) {
      console.error(
        "CMS configuration requires AUTH0_DOMAIN and AUTH0_CLIENT_ID environment variables."
      );
      return NextResponse.json(
        {
          message:
            "Content manager configuration error. Missing Auth0 credentials.",
        },
        { status: 500 }
      );
    }

    const raw = await readFile(CONFIG_TEMPLATE_PATH, "utf8");
    const parsed = YAML.parse(raw) as PlainObject | null;

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid CMS configuration template.");
    }

    const backend = (parsed.backend as PlainObject | undefined) ?? {};
    const auth0 = (backend.auth0 as PlainObject | undefined) ?? {};

    auth0.client_id = clientId;
    auth0.auth_domain = domain;
    auth0.domain = domain;

    backend.auth0 = auth0;
    parsed.backend = backend;

    return NextResponse.json(parsed, {
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
