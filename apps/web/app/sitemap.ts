// app/sitemap.ts
import type { MetadataRoute } from "next";
import { API_BASE_URL } from "@/services/authService";

const baseUrl = "https://iconicrometours.com";

// Rebuild the sitemap at most once an hour so newly published tours appear
// without a full redeploy.
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];
type ChangeFrequency = Entry["changeFrequency"];

const staticPages: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/tour", priority: 0.9, changeFrequency: "daily" },
  { path: "/about-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/blog/first-time-rome", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/rome-travel-tips", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/colosseum-vs-vatican", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/italy-top-sights", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/private-3-hour-tour", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/stpeter-colosseum", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/vatican-sistine", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal-notice", priority: 0.3, changeFrequency: "yearly" },
];

/**
 * Walk the paginated tour API so every live tour detail page is listed.
 * A failure here must not break the build, so it degrades to the static pages.
 */
async function getTourEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  try {
    // Hard page cap so a misbehaving `next` link can't spin forever.
    for (let page = 1; page <= 50; page++) {
      const response = await fetch(`${API_BASE_URL}/tour/plan/?page=${page}`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate },
      });
      if (!response.ok) break;

      const data = await response.json();
      const results = Array.isArray(data?.results) ? data.results : [];

      for (const tour of results) {
        if (tour?.id == null) continue;
        if (tour.is_active === false) continue;

        entries.push({
          url: `${baseUrl}/tour/${tour.id}`,
          lastModified: tour.updated_at ? new Date(tour.updated_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }

      if (!data?.next || results.length === 0) break;
    }
  } catch (error) {
    console.error("sitemap: could not load tours, falling back to static pages", error);
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return [...staticEntries, ...(await getTourEntries())];
}
