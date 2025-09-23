import { NextResponse } from "next/server";

type AccessTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const { cookies } = await import("next/headers");
  const cookieState = cookies().get("decap_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return new NextResponse("Invalid OAuth state", { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse("GitHub OAuth credentials are not configured.", {
      status: 500,
    });
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
  });

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });

  if (!tokenResponse.ok) {
    return new NextResponse("Auth failed", { status: 400 });
  }

  const json = (await tokenResponse.json()) as AccessTokenResponse;

  if (!json.access_token) {
    return new NextResponse("Auth failed", { status: 400 });
  }

  const response = new NextResponse(
    "<html><body><script>window.close()</script>OK</body></html>",
    { headers: { "Content-Type": "text/html" } }
  );

  response.cookies.set("decap_token", json.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 3600,
    path: "/",
  });

  response.cookies.set("decap_oauth_state", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
