import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { getBaseUrlFromRequest } from "@/lib/request-url";

export const runtime = "nodejs";

export async function GET() {
  const siteUrl = ((await getBaseUrlFromRequest()) ?? getSiteUrl()).replace(/\/+$/, "");

  const content = `# Hantavirus Outbreak Tracker

> Live monitoring dashboard for the 2026 MV Hondius hantavirus (Andes virus) outbreak. Aggregates official public-health guidance and verified public reporting from WHO, CDC, ECDC, RKI, and 20+ curated sources.

## About

This is an unofficial hantavirus outbreak tracker monitoring the MV Hondius cruise ship incident. It tracks cases, repatriation flights, quarantine status, and global hantavirus activity across 19+ countries.

## Data Sources

- World Health Organization (WHO) Disease Outbreak News
- US Centers for Disease Control (CDC)
- European Centre for Disease Prevention and Control (ECDC)
- Robert Koch Institute (RKI), Germany
- Pan American Health Organization (PAHO)
- ProMED Disease Surveillance
- NewsAPI, SerpAPI Google News
- Reddit (r/hantavirus, r/worldnews)
- OpenSky Network (flight tracking)
- BBC, Reuters, CNN, Al Jazeera, New York Times

## Key Data Points

- Total reports tracked: 400+
- Cases tracked: 38 across 19 countries
- Repatriation flights: 9 tracked from Tenerife
- Quarantine status: 9 countries with countdown timers
- Disease information: Hantavirus strains, transmission, symptoms

## API Endpoints

- ${siteUrl}/api/dashboard — Dashboard summary (reports, stats, ship, quarantine)
- ${siteUrl}/api/cases — Case timeline with coordinates and clinical notes
- ${siteUrl}/api/flights — Repatriation flight tracking data
- ${siteUrl}/api/ship — MV Hondius live position
- ${siteUrl}/api/quarantine — Quarantine countdown per country
- ${siteUrl}/api/disease-info — Disease encyclopedia + live WHO/CDC feed
- ${siteUrl}/api/reddit — Community intelligence from r/hantavirus

## Contact

Built by SM Stratagem
https://www.hantavirusmonitorapp.com/
https://hanatavirusmonitor.sm-stratagem.com/

## Update Frequency

Data is refreshed every 12 hours via automated ingestion pipeline.
Dashboard auto-triggers ingestion when data is stale (>6 hours old).
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
