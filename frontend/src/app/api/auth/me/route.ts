import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { MOODLE_TOKEN_COOKIE } from "@/lib/auth";
import { fetchMoodleSiteInfo } from "@/lib/moodle";

export async function GET() {
  const token = cookies().get(MOODLE_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const siteInfo = await fetchMoodleSiteInfo(token);
    return NextResponse.json({ authenticated: true, siteInfo });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid session";
    return NextResponse.json({ authenticated: false, error: message }, { status: 401 });
  }
}

