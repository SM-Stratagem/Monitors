import type { SignalReport } from "./types";

export type TimelineMode = "published" | "ingested";

export function timelineEvents(reports: SignalReport[], mode: TimelineMode) {
  return reports
    .map((report) => ({
      report,
      time: mode === "ingested" ? report.ingestedAt : report.publishedAt,
    }))
    .filter((entry) => Boolean(entry.time))
    .sort((a, b) => new Date(a.time ?? 0).getTime() - new Date(b.time ?? 0).getTime());
}
