import { NextResponse } from "next/server";

export async function GET() {
  const { cookies } = await import("next/headers");
  const token = cookies().get("decap_token")?.value ?? null;

  if (!token) {
    return NextResponse.json(
      { token: null },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { token },
    { headers: { "Cache-Control": "no-store" } }
  );
}
