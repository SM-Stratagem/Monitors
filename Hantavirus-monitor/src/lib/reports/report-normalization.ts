import type { CredibilityBucket, RawReport, SeverityLevel, SignalReport, SignalStatus, SourceType } from "./types";

const travelKeywords = [
  "cruise", "ship", "vessel", "flight", "airport", "port", "travel", "passenger", "crew", "border", "quarantine", "repatriation", "docked", "route", "airline",
];

export function deriveSeverity(report: RawReport): SeverityLevel {
  const raw = String(report.severity ?? "").toLowerCase();
  if (raw === "critical") return "critical";
  if (raw === "high") return "high";
  if (raw === "moderate" || raw === "medium") return "medium";
  if (raw === "low") return "low";
  const text = `${report.title ?? ""} ${report.summary ?? ""}`.toLowerCase();
  if (/death|fatal|cluster|outbreak/.test(text)) return "critical";
  if (/confirmed|hospitalized|alert/.test(text)) return "high";
  if (/monitor|advisory|investigating/.test(text)) return "medium";
  return "unknown";
}

export function deriveStatus(report: RawReport): SignalStatus {
  const text = `${report.title ?? ""} ${report.summary ?? ""} ${report.aiRiskNote ?? ""}`.toLowerCase();
  if (/deceased|died|fatal/.test(text)) return "deceased";
  if (/recovered/.test(text)) return "recovered";
  if (/asymptomatic/.test(text)) return "asymptomatic";
  if (/symptomatic|fever|hospitalized/.test(text)) return "symptomatic";
  if (/confirmed/.test(text)) return "confirmed";
  if (/monitor|watch|surveillance|investigation/.test(text)) return "monitoring";
  return "unknown";
}

export function deriveCountry(report: RawReport): string {
  if (report.country && report.country.trim()) return report.country.trim();
  if (report.region && report.region.trim()) return report.region.trim() === "Global" ? "Unknown location" : report.region.trim();
  return "Unknown location";
}

export function deriveSourceType(report: RawReport): SourceType {
  const source = `${report.source ?? ""} ${report.url ?? ""}`.toLowerCase();
  if (source.includes("who.int") || source.includes("cdc.gov") || source.includes("ecdc.europa.eu")) return "official";
  if (source.includes("google news") || source.includes("news.google")) return "aggregator";
  if (source.includes("ministry") || source.includes("public health") || source.includes("health authority")) return "local_authority";
  if (source.includes("reuters") || source.includes("bbc") || source.includes("cnn") || source.includes("aljazeera") || source.includes("times")) return "media";
  return "other";
}

export function deriveCredibilityBucket(score: number | null | undefined): CredibilityBucket {
  if (typeof score !== "number" || Number.isNaN(score)) return "unrated";
  if (score >= 90) return "verified";
  if (score >= 70) return "reliable";
  if (score >= 50) return "corroborate";
  return "low";
}

export function deriveSignalTags(report: RawReport): string[] {
  const tags = new Set<string>();
  const text = `${report.title ?? ""} ${report.summary ?? ""}`.toLowerCase();
  if (text.includes("hantavirus")) tags.add("hantavirus");
  if (text.includes("outbreak")) tags.add("outbreak");
  if (text.includes("travel")) tags.add("travel");
  if (text.includes("airline") || text.includes("flight")) tags.add("airline");
  if (report.advisoryType) tags.add(report.advisoryType);
  return Array.from(tags);
}

export function deriveTravelSignals(report: RawReport): boolean {
  const text = `${report.title ?? ""} ${report.summary ?? ""}`.toLowerCase();
  return travelKeywords.some((keyword) => text.includes(keyword));
}

export function deriveGeneration(report: RawReport): number | null {
  const text = `${report.title ?? ""} ${report.summary ?? ""} ${report.aiRiskNote ?? ""}`.toLowerCase();
  const match = text.match(/\b(?:gen(?:eration)?|g)\s*([0-9]+)\b/);
  if (!match) return null;
  const n = Number.parseInt(match[1] ?? "", 10);
  if (!Number.isFinite(n)) return null;
  if (n < 0) return null;
  return n;
}

export function normalizeReport(report: RawReport, index: number): SignalReport {
  const id = report.id != null ? String(report.id) : `HT-${String(index + 1).padStart(4, "0")}`;
  const severity = deriveSeverity(report);
  const status = deriveStatus(report);
  const sourceCredibility = typeof report.sourceCredibility === "number" ? report.sourceCredibility : null;
  return {
    id,
    reportId: report.id ?? undefined,
    title: report.title?.trim() || "Untitled signal",
    source: report.source?.trim() || "Unknown source",
    sourceType: deriveSourceType(report),
    url: report.url?.trim() || null,
    summary: report.summary?.trim() || "No summary provided for this signal.",
    severity,
    status,
    generation: deriveGeneration(report),
    region: report.region?.trim() || "Global",
    country: deriveCountry(report),
    inferredCases: typeof report.inferredCases === "number" ? report.inferredCases : null,
    advisoryType: report.advisoryType?.trim() || "news",
    aiRiskNote: report.aiRiskNote?.trim() || null,
    publishedAt: normalizeDate(report.publishedAt),
    ingestedAt: normalizeDate(report.createdAt),
    sourceCredibility,
    credibilityBucket: deriveCredibilityBucket(sourceCredibility),
    tags: deriveSignalTags(report),
    travelLinked: deriveTravelSignals(report),
  };
}

export function normalizeReports(reports: RawReport[]): SignalReport[] {
  return reports
    .map((report, index) => normalizeReport(report, index))
    .filter((report, index, arr) => arr.findIndex((x) => x.url && x.url === report.url) === index || !report.url)
    .sort((a, b) => (new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()));
}

function normalizeDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
