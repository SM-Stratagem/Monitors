import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { getBaseUrlFromRequest } from "@/lib/request-url";

const SITE_NAME = "Ebola Outbreak Tracker";
const SITE_DESCRIPTION = "Live Ebola virus disease (EVD) outbreak tracker monitoring outbreaks across affected regions.";

export async function GET() {
  const siteUrl = ((await getBaseUrlFromRequest()) ?? getSiteUrl()).replace(/\/+$/, "");

  // Note: In production, fetch actual news items from database
  // For now, returning schema structure for feed discovery
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    language: "en",
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/api/feed.json`,
    icon: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,

    authors: [
      {
        name: "SM Stratagem",
        url: siteUrl,
      },
    ],

    items: [
      // Example structure - replace with database query in production
      {
        id: "news-001",
        url: `${siteUrl}/`,
        title: "Ebola Outbreak: Latest Updates and Global Response",
        summary: "Real-time tracking and latest developments on Ebola virus disease (EVD) outbreaks worldwide.",
        content_html: "Real-time tracking dashboard with live case counts and flight routes.",
        date_published: new Date().toISOString(),
        date_modified: new Date().toISOString(),
        authors: [
          {
            name: "Ebola Outbreak Tracker",
            url: siteUrl,
          },
        ],
        tags: ["ebola", "EVD", "outbreak", "2026", "hemorrhagic fever"],
      },
    ],

    _comment:
      "This is a JSON Feed providing standardized access to Ebola Outbreak Tracker content. Learn more at https://jsonfeed.org",
  };

  return NextResponse.json(feed, {
    headers: {
      "Content-Type": "application/feed+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
