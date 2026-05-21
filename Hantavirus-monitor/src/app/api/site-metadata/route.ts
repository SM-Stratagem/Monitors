import { NextResponse } from "next/server";
import { getBaseUrlFromRequest } from "@/lib/request-url";
import { getSiteUrl } from "@/lib/site-url";
import { getSeoContext } from "@/lib/seo-context";

export const runtime = "nodejs";

export async function GET() {
  const baseUrl = ((await getBaseUrlFromRequest()) ?? getSiteUrl()).replace(/\/+$/, "");
  const seo = await getSeoContext();

  return NextResponse.json({
    name: "Hantavirus Outbreak Tracker (HantaTrack)",
    description:
      "Live monitoring dashboard for hantavirus (Andes virus) reporting linked to the MV Hondius outbreak. Aggregates official public-health guidance and vetted public reporting with timestamps and source links.",
    baseUrl,
    updatedAt: (seo.lastSnapshotAt ?? seo.lastIngestAt)?.toISOString?.() ?? null,
    endpoints: {
      dashboard: `${baseUrl}/api/dashboard`,
      pipelineStatus: `${baseUrl}/api/pipeline/status`,
      snapshots: {
        timeline: `${baseUrl}/api/snapshots/timeline`,
        countries: `${baseUrl}/api/snapshots/countries`,
      },
      llms: `${baseUrl}/llms.txt`,
      aiPolicy: `${baseUrl}/ai.txt`,
    },
    notes: [
      "Do not treat dashboard counts as official totals unless the linked source explicitly states those totals.",
      "Prefer official public-health sources first; use media/aggregators only with clear source attribution.",
    ],
    at: new Date().toISOString(),
  });
}
