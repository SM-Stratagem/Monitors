import type { CredibilityBucket, DashboardPayload, SeverityLevel, SignalReport } from "./types";

export function getLatestSync(payload: DashboardPayload, reports: SignalReport[]): string | null {
  return payload.stats.lastSyncAt || reports[0]?.publishedAt || null;
}

export function groupReportsByCountry(reports: SignalReport[]): Record<string, SignalReport[]> {
  return reports.reduce<Record<string, SignalReport[]>>((acc, report) => {
    const key = report.country || "Unknown location";
    acc[key] = acc[key] ?? [];
    acc[key].push(report);
    return acc;
  }, {});
}

export function computeKpis(reports: SignalReport[], payload: DashboardPayload) {
  const now = Date.now();
  const new24h = reports.filter((r) => r.publishedAt && now - new Date(r.publishedAt).getTime() <= 86400000).length;
  const travelRelated = reports.filter((r) => r.travelLinked).length;
  const byCountry = groupReportsByCountry(reports);
  const countries = Object.keys(byCountry).length;
  const credibility: Record<CredibilityBucket, number> = { verified: 0, reliable: 0, corroborate: 0, low: 0, unrated: 0 };
  const severity: Record<SeverityLevel, number> = { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 };
  const confirmed = reports.filter((r) => r.status === "confirmed").length;
  const monitoring = reports.filter((r) => r.status === "monitoring").length;
  for (const report of reports) {
    credibility[report.credibilityBucket] += 1;
    severity[report.severity] += 1;
  }
  return {
    total: payload.stats.totalTrackedReports,
    high14d: payload.stats.highSeverityLast14Days,
    sources: payload.stats.activeSources,
    countries,
    latestSync: getLatestSync(payload, reports),
    credibility,
    new24h,
    travelRelated,
    confirmed,
    monitoring,
    severity,
  };
}

export function severityRank(level: SeverityLevel): number {
  if (level === "critical") return 4;
  if (level === "high") return 3;
  if (level === "medium") return 2;
  if (level === "low") return 1;
  return 0;
}
