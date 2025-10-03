/** @type {import('next').NextConfig} */
const runtimeEnvKeys = [
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "DECAP_GITHUB_CLIENT_ID",
  "DECAP_GITHUB_CLIENT_SECRET",
  "DECAP_GITHUB_REPO",
  "DECAP_GITHUB_APP_ID",
  "DECAP_GITHUB_API_ROOT",
  "DECAP_BACKEND_NAME",
  "DECAP_BACKEND_BRANCH",
  "DECAP_OAUTH_BASE_URL",
  "DECAP_OAUTH_ENDPOINT",
  "DECAP_SITE_URL",
  "DECAP_DISPLAY_URL",
  "OAUTH_BASE_URL",
];

const runtimeEnv = runtimeEnvKeys.reduce((acc, key) => {
  acc[key] = process.env[key];
  return acc;
}, {});

const nextConfig = {
  output: "standalone",
  experimental: {
    runtimeEnv,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.ya?ml$/i,
      type: "asset/source",
    });

    return config;
  },
};

module.exports = nextConfig;
