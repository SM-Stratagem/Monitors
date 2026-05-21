import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getBaseUrlFromRequest } from "@/lib/request-url";
import { getSeoContext } from "@/lib/seo-context";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = ((await getBaseUrlFromRequest()) ?? getSiteUrl()).replace(/\/+$/, "");
  const seo = await getSeoContext();
  const lastModified = seo.lastSnapshotAt ?? seo.lastIngestAt ?? new Date();

  return [
    // Primary page — highest priority, real-time updates
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "hourly",
      priority: 1.0,
    },

    // Pillar pages — topic authority for SEO ranking
    {
      url: `${siteUrl}/hantavirus-101`,
      lastModified: new Date("2026-05-15T00:00:00Z"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/outbreak-timeline`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/travel-advisory`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/case-reports`,
      lastModified,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date("2026-05-15T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/prevention-guide`,
      lastModified: new Date("2026-05-15T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/health-authority-guidance`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },

    // API endpoints — critical for AI crawlers and data access
    {
      url: `${siteUrl}/api/dashboard`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/api/cases`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/api/flights`,
      lastModified,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/api/ship`,
      lastModified,
      changeFrequency: "hourly",
      priority: 0.75,
    },
    {
      url: `${siteUrl}/api/quarantine`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/api/disease-info`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Feed endpoints
    {
      url: `${siteUrl}/api/feed.json`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.75,
    },

    // LLM guidance files
    {
      url: `${siteUrl}/llms.txt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/ai.txt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // Support page
    {
      url: `${siteUrl}/support`,
      lastModified: new Date("2026-05-01T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
