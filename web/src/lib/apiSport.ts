export type ApiSportImageSet = {
  thumbnailProxied?: string;
  thumbnail?: string;
};

export type ApiSportSubNewsItem = {
  title: string;
  snippet?: string;
  newsUrl: string;
  timestamp?: string;
  images?: ApiSportImageSet;
  publisher?: string;
};

export type ApiSportItem = {
  title: string;
  snippet?: string;
  newsUrl: string;
  timestamp?: string;
  images?: ApiSportImageSet;
  hasSubnews?: boolean;
  publisher?: string;
  subnews?: ApiSportSubNewsItem[];
};

export type ApiSportResponse = {
  status: string;
  items: ApiSportItem[];
};

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined;
}

function withRequiredQueryParams(url: string): string {
  const u = new URL(url);

  // Some RapidAPI endpoints (e.g. google-news13) require `lr` (language region).
  // Allow overriding via env; default to Bulgarian.
  if (!u.searchParams.get("lr")) {
    u.searchParams.set("lr", getEnv("RAPIDAPI_LR") ?? "bg-BG");
  }

  return u.toString();
}

export function formatTimestampMs(ts?: string): string | null {
  if (!ts) return null;
  const n = Number(ts);
  if (!Number.isFinite(n)) return null;
  const d = new Date(n);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("bg-BG");
}

export async function fetchApiSportFixtures(): Promise<ApiSportResponse> {
  const key = getEnv("RAPIDAPI_KEY");
  if (!key) {
    throw new Error("Missing RAPIDAPI_KEY environment variable.");
  }

  const url = getEnv("RAPIDAPI_FIXTURES_URL");
  if (!url) {
    throw new Error("Missing RAPIDAPI_FIXTURES_URL environment variable.");
  }
  const finalUrl = withRequiredQueryParams(url);

  const host = getEnv("RAPIDAPI_HOST");
  const headers: Record<string, string> = {
    "X-RapidAPI-Key": key,
  };
  if (host) headers["X-RapidAPI-Host"] = host;

  const res = await fetch(finalUrl, {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `API request failed (${res.status} ${res.statusText})${body ? `: ${body}` : ""}`,
    );
  }

  return (await res.json()) as ApiSportResponse;
}

