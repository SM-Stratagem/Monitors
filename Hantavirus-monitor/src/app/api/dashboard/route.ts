import { NextResponse } from "next/server";
import { fetchDashboardData, fetchLiveFeedSnapshot, ingestFeeds } from "@/lib/ingest";
import { normalizeReports } from "@/lib/reports/report-normalization";

export const runtime = "nodejs";

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

export async function GET() {
  try {
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

    return NextResponse.json({
      ...data,
      latest: normalized,
    });
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
