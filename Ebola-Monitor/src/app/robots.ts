import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getBaseUrlFromRequest } from "@/lib/request-url";

// Major search engines — honor robots directives, ignore Crawl-delay.
// We omit crawlDelay here so Google/Bing crawl at full speed.
const SEARCH_BOTS = [
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-News",
  "Bingbot",
  "Slurp",
  "DuckDuckBot",
  "YandexBot",
  "Baiduspider",
  "Applebot",
];

// AI / LLM crawlers — allowed, but rate-limited via crawlDelay to protect the origin.
// Most of these DO honor Crawl-delay (unlike Googlebot).
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "YouBot",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "cohere-ai",
  "Bytespider",
  "Amazonbot",
  "Diffbot",
  "Timpibot",
  "Omgilibot",
  "CCBot",
  "DuckAssistBot",
  "MistralAI-User",
];

const COMMON_DISALLOW = [
  "/api/ingest",
  "/api/pipeline/",
  "/_next/",
  "/node_modules/",
  "/*?utm_*",
  "/*?ref=*",
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = ((await getBaseUrlFromRequest()) ?? getSiteUrl()).replace(/\/+$/, "");

  return {
    rules: [
      // Default — every other bot. Modest crawl-delay to prevent runaway scrapers.
      {
        userAgent: "*",
        allow: "/",
        disallow: COMMON_DISALLOW,
        crawlDelay: 2,
      },
      // Search engines — full speed.
      {
        userAgent: SEARCH_BOTS,
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      // AI / LLM crawlers — explicitly allowed, rate-limited.
      {
        userAgent: AI_BOTS,
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
          "/api/feed.json",
        ],
        disallow: COMMON_DISALLOW,
        crawlDelay: 5,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
