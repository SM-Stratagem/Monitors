import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getBaseUrlFromRequest } from "@/lib/request-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = ((await getBaseUrlFromRequest()) ?? getSiteUrl()).replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/support",
          "/llms.txt",
          "/ai.txt",
          "/sitemap.xml",
          "/opengraph-image",
          "/twitter-image",
          "/icon",
          "/apple-icon",
        ],
        disallow: [
          "/api/ingest",
          "/api/pipeline/",
          "/_next/",
          "/node_modules/",
        ],
        crawlDelay: 2,
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended", "anthropic-ai", "ClaudeBot", "PerplexityBot", "YouBot", "Applebot-Extended"],
        allow: [
          "/",
          "/llms.txt",
          "/ai.txt",
          "/sitemap.xml",
          "/api/dashboard",
          "/api/cases",
          "/api/flights",
          "/api/ship",
          "/api/quarantine",
          "/api/disease-info",
          "/api/reddit",
        ],
        disallow: [
          "/api/ingest",
          "/api/pipeline/",
          "/_next/",
        ],
        crawlDelay: 5,
      },
      {
        userAgent: ["Googlebot", "bingbot", "YandexBot", "DuckDuckBot"],
        allow: [
          "/",
          "/support",
          "/llms.txt",
          "/ai.txt",
          "/sitemap.xml",
        ],
        disallow: [
          "/api/ingest",
          "/api/pipeline/",
          "/_next/",
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
