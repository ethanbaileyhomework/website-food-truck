import { NextResponse } from "next/server";

import { createCmsConfig } from "@/admin/config";

const AUTH0_DOMAIN_ENV_KEY = "AUTH0_DOMAIN";
const AUTH0_CLIENT_ID_ENV_KEY = "AUTH0_CLIENT_ID";

export async function GET() {
  const authDomain = process.env[AUTH0_DOMAIN_ENV_KEY];
  const clientId = process.env[AUTH0_CLIENT_ID_ENV_KEY];

  if (!authDomain || !clientId) {
    return NextResponse.json(
      { error: "Missing Auth0 configuration" },
      { status: 500 },
    );
  }

  try {
    const config = createCmsConfig({ authDomain, clientId });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create CMS config" },
      { status: 500 },
    );
  }
}
