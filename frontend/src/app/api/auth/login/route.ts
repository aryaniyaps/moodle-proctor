import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authCookieOptions, MOODLE_TOKEN_COOKIE } from "@/lib/auth";
import { fetchMoodleSiteInfo, fetchMoodleToken } from "@/lib/moodle";

export async function POST(req: Request) {
  try {
    const { username, password } = (await req.json().catch(() => ({}))) as Partial<{
      username: string;
      password: string;
    }>;

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    const token = await fetchMoodleToken({ username, password });
    cookies().set(MOODLE_TOKEN_COOKIE, token, authCookieOptions);

    let siteInfo: unknown = null;
    try {
      siteInfo = await fetchMoodleSiteInfo(token);
    } catch {
      // If the service doesn't allow core_webservice_get_site_info, login can still succeed.
    }

    return NextResponse.json({ ok: true, siteInfo });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

