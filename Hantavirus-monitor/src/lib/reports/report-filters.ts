import { severityRank } from "./report-analytics";
import type { SeverityLevel, SignalReport, SignalStatus, SourceType } from "./types";

export type ReportFilters = {
  search: string;
  statuses: SignalStatus[];
  severities: SeverityLevel[];
  regions: string[];
  sources: SourceType[];
  credibility: string[];
  dateFrom: string;
  dateTo: string;
  generations: number[];
};

export function filterReports(reports: SignalReport[], filters: ReportFilters): SignalReport[] {
  return reports.filter((r) => {
    const hay = `${r.title} ${r.summary} ${r.source} ${r.country} ${r.region}`.toLowerCase();
    if (filters.search && !hay.includes(filters.search.toLowerCase())) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(r.status)) return false;
    if (filters.severities.length > 0 && !filters.severities.includes(r.severity)) return false;
    if (filters.regions.length > 0 && !filters.regions.includes(r.region)) return false;
    if (filters.sources.length > 0 && !filters.sources.includes(r.sourceType)) return false;
    if (filters.credibility.length > 0 && !filters.credibility.includes(r.credibilityBucket)) return false;
    if (filters.dateFrom && r.publishedAt && new Date(r.publishedAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && r.publishedAt && new Date(r.publishedAt) > new Date(filters.dateTo + "T23:59:59.999Z")) return false;
    if (filters.generations.length > 0) {
      const g = typeof r.generation === "number" ? (r.generation >= 3 ? 3 : r.generation) : null;
      if (g == null) return false;
      if (!filters.generations.includes(g)) return false;
    }
    return true;
  });
}

export type SortMode = "newest" | "severity" | "credibility" | "country" | "source";

export function sortReports(reports: SignalReport[], sort: SortMode): SignalReport[] {
  const clone = [...reports];
  if (sort === "newest") return clone.sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
  if (sort === "severity") return clone.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
  if (sort === "credibility") return clone.sort((a, b) => (b.sourceCredibility ?? -1) - (a.sourceCredibility ?? -1));
  if (sort === "country") return clone.sort((a, b) => a.country.localeCompare(b.country));
  return clone.sort((a, b) => a.source.localeCompare(b.source));
}
