// app/robots.ts
import type { MetadataRoute } from "next";

const baseUrl = "https://iconicrometours.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        // Private or per-user pages: nothing here is useful in search results,
        // and crawling them just burns crawl budget on the tour pages.
        "/cart",
        "/checkout",
        "/login",
        "/register",
        "/settings",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
