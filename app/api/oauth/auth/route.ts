import { NextResponse } from "next/server";

import {
  getGitHubClientId,
  getOAuthBaseUrl,
  getOAuthEndpoint,
} from "../env";

export const dynamic = "force-dynamic";

const DEFAULT_ENDPOINT_PATH = "/api/oauth";
const DEFAULT_CALLBACK_PATH = `${DEFAULT_ENDPOINT_PATH}/callback`;

function normalizePath(value: string | undefined | null) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  let path: string;

  try {
    path = new URL(trimmed).pathname;
  } catch {
    path = trimmed;
  }

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  const withoutTrailingSlash = path.replace(/\/+$/, "");

  if (!withoutTrailingSlash) {
    return "/";
  }

  return withoutTrailingSlash;
}

function getEndpointBasePath(endpoint: string | undefined | null) {
  const normalized = normalizePath(endpoint);

  if (!normalized || normalized === "/") {
    return undefined;
  }

  const segments = normalized.split("/").filter(Boolean);

  if (segments.length <= 1) {
    return undefined;
  }

  segments.pop();

  if (segments.length === 0) {
    return undefined;
  }

  return `/${segments.join("/")}`;
}

function getBaseUrlPath(base: string | undefined | null) {
  const normalized = normalizePath(base);

  if (!normalized || normalized === "/") {
    return undefined;
  }

  return normalized;
}

function buildCallbackPath({
  base,
  endpoint,
}: {
  base: string | undefined | null;
  endpoint: string | undefined | null;
}) {
  const endpointBasePath = getEndpointBasePath(endpoint);

  if (endpointBasePath) {
    return `${endpointBasePath}/callback`;
  }

  const baseUrlPath = getBaseUrlPath(base);

  if (baseUrlPath) {
    return `${baseUrlPath}/callback`;
  }

  return DEFAULT_CALLBACK_PATH;
}

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const base = getOAuthBaseUrl();
  const endpoint = getOAuthEndpoint();
  const callbackPath = buildCallbackPath({ base, endpoint });
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
    return new NextResponse("Missing GitHub OAuth client ID", { status: 500 });
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
