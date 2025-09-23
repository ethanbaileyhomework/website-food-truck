import { NextResponse } from "next/server";

import { getGitHubClientId, getOAuthBaseUrl } from "../env";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const baseOverride = getOAuthBaseUrl();
  const redirectUri = (() => {
    try {
      const base = baseOverride ?? url.origin;
      return new URL("/api/oauth/callback", base).toString().replace(/\/$/, "");
    } catch {
      return `${url.origin}/api/oauth/callback`;
    }
  })();
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
