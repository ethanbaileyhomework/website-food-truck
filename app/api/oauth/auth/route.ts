import { NextResponse } from "next/server";

import { getOAuthCookieDomain, resolveCallbackUrl } from "../config";
import { getGitHubClientId } from "../env";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const callbackUrl = resolveCallbackUrl(url);
  const redirectUri = callbackUrl.toString();
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
  const cookieDomain = getOAuthCookieDomain(url, callbackUrl);
  const stateCookieOptions: {
    httpOnly: true;
    secure: true;
    sameSite: "lax";
    maxAge: number;
    path: string;
    domain?: string;
  } = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  };

  if (cookieDomain) {
    stateCookieOptions.domain = cookieDomain;
  }

  response.cookies.set("decap_oauth_state", state, stateCookieOptions);

  return response;
}
