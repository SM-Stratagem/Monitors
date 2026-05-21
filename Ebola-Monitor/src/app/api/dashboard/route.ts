import { NextResponse } from "next/server";
import { fetchDashboardData, fetchLiveFeedSnapshot, ingestFeeds } from "@/lib/ingest";
import { normalizeReports } from "@/lib/reports/report-normalization";

export const runtime = "nodejs";

let cachedResponse: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let lastIngestTime: number = 0;
let ingestInFlight: Promise<unknown> | null = null;

function envBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (!raw) return fallback;
  if (/^(1|true|yes|y)$/i.test(raw)) return true;
  if (/^(0|false|no|n)$/i.test(raw)) return false;
  return fallback;
}

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const refresh = url.searchParams.get("refresh") === "true";

    if (!refresh && cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cachedResponse.data);
    }

    const autoIngestEnabled = envBool("DASHBOARD_AUTO_INGEST_ENABLED", true);
    if (autoIngestEnabled && !ingestInFlight) {
      const staleMs = envInt("DASHBOARD_AUTO_INGEST_STALE_HOURS", 12) * 60 * 60 * 1000;
      const now = Date.now();
      if (now - lastIngestTime > staleMs) {
        lastIngestTime = now;
        ingestInFlight = ingestFeeds().catch(() => {}).finally(() => { ingestInFlight = null; });
      }
    }

    const data = await fetchDashboardData();
    const normalized = normalizeReports(data.latest);

    const responseData = {
      ...data,
      latest: normalized,
    };

    cachedResponse = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    const snapshot = await fetchLiveFeedSnapshot(50);
    const normalized = normalizeReports(snapshot.latest);

    return NextResponse.json(
      {
        degraded: true,
        warning: "Database is unreachable. Showing live feed snapshot without historical persistence.",
        detail: message,
        ...snapshot,
        latest: normalized,
      },
      { status: 200 },
    );
  }
}
