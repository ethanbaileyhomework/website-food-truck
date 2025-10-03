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
  pickEnv(
    "GITHUB_CLIENT_ID",
    "DECAP_GITHUB_CLIENT_ID",
    "NEXT_PUBLIC_GITHUB_CLIENT_ID",
    "NEXT_PUBLIC_DECAP_GITHUB_CLIENT_ID"
  );

export const getGitHubClientSecret = () =>
  pickEnv("GITHUB_CLIENT_SECRET", "DECAP_GITHUB_CLIENT_SECRET");

export const getOAuthBaseUrl = () =>
  pickEnv("OAUTH_BASE_URL", "DECAP_OAUTH_BASE_URL");
