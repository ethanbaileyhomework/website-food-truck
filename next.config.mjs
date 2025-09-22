import path from "node:path";

const yamlLoaderPath = path.join(
  process.cwd(),
  "lib/loaders/yaml-to-json-loader.cjs"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html",
        permanent: false,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.ya?ml$/i,
      use: [
        {
          loader: yamlLoaderPath,
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
