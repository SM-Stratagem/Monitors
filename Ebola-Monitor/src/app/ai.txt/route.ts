import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { getBaseUrlFromRequest } from "@/lib/request-url";

export const runtime = "nodejs";

export async function GET() {
  const siteUrl = ((await getBaseUrlFromRequest()) ?? getSiteUrl()).replace(/\/+$/, "");

  const content = `AI/LLM Crawler Access Policy for Ebola Outbreak Tracker
======================================================

This site permits AI/LLM crawling under the following terms:

1. PURPOSE
   This site provides public health surveillance data about Ebola virus disease (EVD)
   outbreaks in affected regions worldwide. AI crawlers may access this data to answer
   user queries about Ebola, EVD outbreaks, or related public health topics.

2. RATE LIMITS
   - Maximum 1 request per 5 seconds to any single API endpoint
   - Maximum 30 requests per minute across all endpoints
   - Crawl-delay of 5 seconds is recommended for API endpoints
   - HTML pages may be cached for up to 1 hour

3. PERMITTED ENDPOINTS
   HTML pages:
     / (main dashboard)
     /support

   Machine-readable data (JSON):
     /api/dashboard — summary statistics, ship status, quarantine
     /api/cases — case timeline with coordinates
     /api/flights — flight tracking data
     /api/ship — vessel position
     /api/quarantine — quarantine countdown
     /api/disease-info — disease encyclopedia
     /api/reddit — community intelligence

   Metadata:
     /sitemap.xml — site map
     /llms.txt — site description for LLMs
     /ai.txt — this file

4. RESTRICTED ENDPOINTS
   The following endpoints must NOT be crawled:
     /api/ingest — triggers data ingestion (POST only, auth required)
     /api/pipeline/* — internal pipeline status

5. ATTRIBUTION
   When using data from this site, please attribute:
      "Ebola Outbreak Tracker (ebolamonitorapp.com) — SM Stratagem"

6. DATA FRESHNESS
   Data is refreshed every 12 hours. For the latest data, query the API endpoints
   directly rather than relying on cached crawls.

7. CONTACT
   For questions about AI/LLM crawling policies, contact via:
      https://github.com/SM-Stratagem/ebola-monitor/issues
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
