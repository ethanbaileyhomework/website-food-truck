import { NextResponse } from "next/server";

import {
  getGitHubClientId,
  getOAuthBaseUrl,
  getOAuthEndpoint,
} from "../env";

export const dynamic = "force-dynamic";

const DEFAULT_ENDPOINT_PATH = "/api/oauth";
const DEFAULT_CALLBACK_PATH = `${DEFAULT_ENDPOINT_PATH}/callback`;

function buildCallbackPath(endpoint: string | undefined | null) {
  if (!endpoint) {
    return DEFAULT_CALLBACK_PATH;
  }

  const trimmed = endpoint.trim();

  if (!trimmed) {
    return DEFAULT_CALLBACK_PATH;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutTrailingSlash = normalized.replace(/\/+$/, "");

  if (!withoutTrailingSlash) {
    return DEFAULT_CALLBACK_PATH;
  }

  return `${withoutTrailingSlash}/callback`;
}

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const base = getOAuthBaseUrl();
  const endpoint = getOAuthEndpoint();
  const callbackPath = buildCallbackPath(endpoint);
  const redirectUri = (() => {
    if (!base) {
      return new URL(callbackPath, requestUrl.origin).toString();
    }

    try {
      return new URL(callbackPath, base).toString();
    } catch (error) {
      console.warn(
        "Invalid OAUTH_BASE_URL provided, falling back to request origin",
        error
      );
      return new URL(callbackPath, requestUrl.origin).toString();
    }
  })();
  const clientId = getGitHubClientId();

  if (!clientId) {
    console.error("Missing GitHub OAuth client ID. Please set GITHUB_CLIENT_ID in your environment variables.");
    return new NextResponse(
      "Missing GitHub OAuth client ID. Please configure your .env.local file with GITHUB_CLIENT_ID. See ADMIN_SETUP.md for instructions.", 
      { status: 500 }
    );
  }
  const state = crypto.randomUUID();

  const isSecure = requestUrl.protocol === "https:";

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "repo user:email");
  url.searchParams.set("state", state);

  const res = NextResponse.redirect(url.toString());
  // set cookie on the RESPONSE, not via next/headers
  res.cookies.set("decap_oauth_state", state, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
