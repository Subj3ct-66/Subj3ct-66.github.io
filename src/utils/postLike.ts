import { SITE_URL } from "./config";

export function normalizeLikeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    let path = parsed.pathname + parsed.search + parsed.hash;
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    if (path === "/") path = "";
    return parsed.hostname.replace(/^www\./, "") + path;
  } catch {
    return url;
  }
}

function toAbsoluteUrl(pathOrAbsolute: string): string {
  if (/^https?:\/\//i.test(pathOrAbsolute)) {
    return pathOrAbsolute;
  }

  const path = pathOrAbsolute.startsWith("/")
    ? pathOrAbsolute
    : `/${pathOrAbsolute}`;

  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }

  return `${SITE_URL}${path}`;
}

export function resolveLikeTargetUrl(pathOrAbsolute: string): string {
  return normalizeLikeUrl(toAbsoluteUrl(pathOrAbsolute));
}

export function likeStorageKey(url: string): string {
  return `blog-like-${url}`;
}

export async function fetchLikeCount(
  apiURL: string,
  targetUrl: string
): Promise<number> {
  const response = await fetch(
    `${apiURL}?url=${encodeURIComponent(targetUrl)}`
  );
  if (!response.ok) {
    throw new Error("Failed to load likes");
  }
  const data = await response.json();
  return data.count ?? 0;
}
