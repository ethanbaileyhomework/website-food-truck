import { NextResponse } from "next/server";

import { getGitHubClientId, getOAuthBaseUrl } from "../env";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const base = getOAuthBaseUrl() ?? new URL(req.url).origin;
  const redirectUri = `${base}/api/oauth/callback`;
  const clientId = getGitHubClientId();
  if (!clientId) {
    return new NextResponse("Missing GitHub OAuth client ID", { status: 500 });
  }
  const state = crypto.randomUUID();

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "repo user:email");
  url.searchParams.set("state", state);

  const res = NextResponse.redirect(url.toString());
  // set cookie on the RESPONSE, not via next/headers
  res.cookies.set("decap_oauth_state", state, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600
  });
  return res;
}
