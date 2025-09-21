import type { MetadataRoute } from "next";

const BASE_URL = "https://cranbournefoodtruck.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/stats",
    "/donate",
    "/volunteer",
    "/about",
    "/sponsors",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
