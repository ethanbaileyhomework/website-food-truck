/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack(config) {
    config.module.rules.push({
      test: /\.ya?ml$/i,
      type: "asset/source",
    });

    return config;
  },
};

module.exports = nextConfig;
