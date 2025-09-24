import { NextResponse } from "next/server";

import { getGitHubClientId } from "../env";

function toTrimmedOrUndefined(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function ensureTrailingSlash(url: URL) {
  if (!url.pathname.endsWith("/")) {
    url.pathname = `${url.pathname}/`;
  }
}

function resolveRedirectUri(requestUrl: URL) {
  const fallback = new URL("/api/oauth/callback", requestUrl.origin);

  const callbackUrlOverride = toTrimmedOrUndefined(
    process.env.DECAP_OAUTH_CALLBACK_URL
  );

  if (callbackUrlOverride) {
    try {
      return new URL(callbackUrlOverride, requestUrl.origin).toString();
    } catch (error) {
      console.warn(
        "Invalid DECAP_OAUTH_CALLBACK_URL provided, falling back to default callback URI.",
        error
      );
    }
  }

  const baseUrlOverride = toTrimmedOrUndefined(
    process.env.DECAP_OAUTH_BASE_URL
  );
  const callbackPathOverride = toTrimmedOrUndefined(
    process.env.DECAP_OAUTH_CALLBACK_PATH
  );

  if (baseUrlOverride || callbackPathOverride) {
    try {
      const baseUrl = new URL(
        baseUrlOverride ?? "/api/oauth",
        requestUrl.origin
      );
      ensureTrailingSlash(baseUrl);

      if (callbackPathOverride) {
        return new URL(callbackPathOverride, baseUrl).toString();
      }

      return new URL("callback", baseUrl).toString();
    } catch (error) {
      console.warn(
        "Unable to resolve OAuth callback URL from overrides, falling back to default callback URI.",
        error
      );
    }
  }

  return fallback.toString();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const redirectUri = resolveRedirectUri(url);
  const clientId = getGitHubClientId();

  if (!clientId) {
    return new NextResponse(
      "GitHub OAuth client ID is not configured. Set GITHUB_CLIENT_ID or DECAP_GITHUB_CLIENT_ID.",
      {
        status: 500,
      }
    );
  }

  const state = crypto.randomUUID();
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo user:email");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl.toString());
  response.cookies.set("decap_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
