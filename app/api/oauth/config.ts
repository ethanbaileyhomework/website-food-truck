import {
  getOAuthCallbackPath,
  getOAuthCallbackUrl,
  getSiteUrl,
} from "./env";

const DEFAULT_CALLBACK_PATH = "/api/oauth/callback";

function normalisePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function parseUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value);
  } catch (error) {
    console.warn(
      "Invalid URL provided for OAuth configuration, ignoring value:",
      value,
      error instanceof Error ? error.message : error
    );
    return undefined;
  }
}

function getSharedDomain(hosts: (string | undefined)[]) {
  const partsList = hosts
    .filter((host): host is string => Boolean(host && host.trim().length > 0))
    .map((host) => host.toLowerCase().split(".").filter(Boolean));

  if (partsList.length === 0) {
    return undefined;
  }

  let candidate = partsList[0];

  for (const parts of partsList.slice(1)) {
    const shared: string[] = [];
    const maxLength = Math.min(candidate.length, parts.length);

    for (let i = 1; i <= maxLength; i += 1) {
      const candidatePart = candidate[candidate.length - i];
      const part = parts[parts.length - i];

      if (!candidatePart || candidatePart !== part) {
        break;
      }

      shared.unshift(candidatePart);
    }

    candidate = shared;

    if (candidate.length === 0) {
      break;
    }
  }

  if (candidate.length < 2) {
    return undefined;
  }

  return candidate.join(".");
}

export function resolveCallbackUrl(requestUrl: URL) {
  const explicitCallback = parseUrl(getOAuthCallbackUrl());

  if (explicitCallback) {
    return explicitCallback;
  }

  const siteUrl = parseUrl(getSiteUrl());
  const baseOrigin = siteUrl?.origin ?? requestUrl.origin;

  const callbackPath = getOAuthCallbackPath();

  if (callbackPath) {
    try {
      return new URL(normalisePath(callbackPath), baseOrigin);
    } catch (error) {
      console.warn(
        "Failed to resolve OAuth callback path, falling back to default path:",
        callbackPath,
        error instanceof Error ? error.message : error
      );
    }
  }

  return new URL(DEFAULT_CALLBACK_PATH, baseOrigin);
}

export function getOAuthCookieDomain(requestUrl: URL, callbackUrl: URL) {
  const siteUrl = parseUrl(getSiteUrl());

  return getSharedDomain([
    requestUrl.hostname,
    callbackUrl.hostname,
    siteUrl?.hostname,
  ]);
}
