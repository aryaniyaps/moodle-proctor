import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authCookieOptions, MOODLE_TOKEN_COOKIE } from "@/lib/auth";

export async function POST() {
  cookies().set(MOODLE_TOKEN_COOKIE, "", { ...authCookieOptions, maxAge: 0 });
  return NextResponse.json({ ok: true });
}

