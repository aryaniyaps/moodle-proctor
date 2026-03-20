type MoodleTokenSuccess = {
  token: string;
};

type MoodleTokenError = {
  error: string;
  errorcode?: string;
  stacktrace?: string;
  debuginfo?: string;
};

function moodleBaseUrl(): string {
  const base = process.env.MOODLE_BASE_URL?.trim();
  if (!base) {
    throw new Error("Missing MOODLE_BASE_URL");
  }
  return base.replace(/\/+$/, "");
}

function moodleServiceShortname(): string {
  const service = process.env.MOODLE_SERVICE?.trim();
  if (!service) {
    throw new Error("Missing MOODLE_SERVICE (external service shortname)");
  }
  return service;
}

export async function fetchMoodleToken(params: {
  username: string;
  password: string;
}): Promise<string> {
  const body = new URLSearchParams({
    username: params.username,
    password: params.password,
    service: moodleServiceShortname(),
  });

  const res = await fetch(`${moodleBaseUrl()}/login/token.php`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    },
    body,
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as Partial<MoodleTokenSuccess & MoodleTokenError>;

  if (!res.ok) {
    throw new Error(`Moodle token endpoint failed (${res.status})`);
  }

  if (typeof data.token === "string" && data.token.length > 0) {
    return data.token;
  }

  if (typeof data.error === "string") {
    const code = data.errorcode ? ` (${data.errorcode})` : "";
    throw new Error(`${data.error}${code}`);
  }

  throw new Error("Unexpected Moodle response from token endpoint");
}

export async function fetchMoodleSiteInfo(token: string): Promise<unknown> {
  const url = new URL(`${moodleBaseUrl()}/webservice/rest/server.php`);
  url.searchParams.set("wstoken", token);
  url.searchParams.set("wsfunction", "core_webservice_get_site_info");
  url.searchParams.set("moodlewsrestformat", "json");

  const res = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as any;

  if (!res.ok) {
    throw new Error(`Moodle REST server failed (${res.status})`);
  }

  if (data?.exception) {
    const msg = typeof data?.message === "string" ? data.message : "Moodle exception";
    const code = typeof data?.errorcode === "string" ? ` (${data.errorcode})` : "";
    throw new Error(`${msg}${code}`);
  }

  return data;
}

