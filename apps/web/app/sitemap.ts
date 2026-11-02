// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://iconicrometours.com";

  const staticPages = [
    "",
    "/tour",
    "/about-us",
    "/contact",
    "/blog",
    "/blog/first-time-rome",
    "/blog/rome-travel-tips",
    "/blog/colosseum-vs-vatican",
    "/blog/italy-top-sights",
    "/blog/private-3-hour-tour",
    "/blog/stpeter-colosseum",
    "/blog/vatican-sistine",
    "/privacy-policy",
    "/terms-and-conditions",
    "/legal-notice",
  ];

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}