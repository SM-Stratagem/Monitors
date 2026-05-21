import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { getBaseUrlFromRequest } from "@/lib/request-url";

const SITE_NAME = "Hantavirus Outbreak Tracker";
const SITE_DESCRIPTION = "Live hantavirus outbreak tracker monitoring the 2026 MV Hondius cruise ship incident.";

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
        title: "MV Hondius: Latest Updates on Hantavirus Outbreak",
        summary: "Real-time tracking and latest developments on the 2026 MV Hondius cruise ship hantavirus outbreak.",
        content_html: "Real-time tracking dashboard with live case counts and flight routes.",
        date_published: new Date().toISOString(),
        date_modified: new Date().toISOString(),
        authors: [
          {
            name: "Hantavirus Outbreak Tracker",
            url: siteUrl,
          },
        ],
        tags: ["hantavirus", "outbreak", "2026", "MV Hondius", "Andes virus"],
      },
    ],

    _comment:
      "This is a JSON Feed providing standardized access to Hantavirus Outbreak Tracker content. Learn more at https://jsonfeed.org",
  };

  return NextResponse.json(feed, {
    headers: {
      "Content-Type": "application/feed+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
