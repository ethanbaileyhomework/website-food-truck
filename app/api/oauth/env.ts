const pickEnv = (...keys: (keyof NodeJS.ProcessEnv)[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  return undefined;
};

export const getGitHubClientId = () =>
  pickEnv("GITHUB_CLIENT_ID", "DECAP_GITHUB_CLIENT_ID");

export const getGitHubClientSecret = () =>
  pickEnv("GITHUB_CLIENT_SECRET", "DECAP_GITHUB_CLIENT_SECRET");

export const getOAuthCallbackUrl = () =>
  pickEnv(
    "DECAP_OAUTH_CALLBACK_URL",
    "DECAP_OAUTH_REDIRECT_URL",
    "DECAP_OAUTH_REDIRECT_URI"
  );

export const getOAuthCallbackPath = () =>
  pickEnv("DECAP_OAUTH_CALLBACK_PATH", "DECAP_OAUTH_REDIRECT_PATH");

export const getSiteUrl = () =>
  pickEnv("DECAP_SITE_URL", "SITE_URL", "NEXT_PUBLIC_SITE_URL");
