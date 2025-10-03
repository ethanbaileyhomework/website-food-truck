import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getGitHubClientId, getGitHubClientSecret } from "../env";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = cookies().get("decap_oauth_state")?.value;

  if (!code || !state || state !== cookieState) {
    console.error("Invalid OAuth state. Code:", !!code, "State match:", state === cookieState);
    return new NextResponse(
      "Invalid OAuth state. Please try logging in again. If this persists, clear your browser cookies and try again.", 
      { status: 400 }
    );
  }

  const clientId = getGitHubClientId();
  const clientSecret = getGitHubClientSecret();
  if (!clientId || !clientSecret) {
    console.error("Missing GitHub OAuth credentials. ClientID:", !!clientId, "ClientSecret:", !!clientSecret);
    return new NextResponse(
      "Missing GitHub OAuth credentials. Please configure your .env.local file with GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET. See ADMIN_SETUP.md for instructions.", 
      { status: 500 }
    );
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code
  });

  const r = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json" },
    body
  });
  const data = (await r.json()) as { access_token?: string; error?: string; error_description?: string };

  if (!data.access_token) {
    console.error("GitHub OAuth failed:", data.error, data.error_description);
    return new NextResponse(
      `GitHub OAuth authentication failed: ${data.error || 'Unknown error'}. ${data.error_description || 'Please check your OAuth credentials.'}`, 
      { status: 400 }
    );
  }

  const isSecure = url.protocol === "https:";

  // Send token back to Decap and close popup
  const html = `<!doctype html><meta charset="utf-8">
<script>
  (function(){
    var payload = JSON.stringify({ token: ${JSON.stringify(data.access_token)} });
    // Decap listens for this exact message format
    window.opener && window.opener.postMessage('authorization:github:success:' + payload, '*');
    window.close();
  })();
</script>OK`;

  const res = new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  res.cookies.set("decap_token", data.access_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });
  res.cookies.delete({ name: "decap_oauth_state", path: "/", secure: isSecure });
  return res;
}
