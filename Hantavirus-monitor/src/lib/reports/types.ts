export type RawReport = {
  id?: number | string | null;
  title?: string | null;
  source?: string | null;
  url?: string | null;
  summary?: string | null;
  severity?: string | null;
  region?: string | null;
  country?: string | null;
  inferredCases?: number | null;
  advisoryType?: string | null;
  aiRiskNote?: string | null;
  publishedAt?: string | Date | null;
  createdAt?: string | Date | null;
  sourceCredibility?: number | null;
};

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "unknown";

export type SignalStatus = "confirmed" | "monitoring" | "symptomatic" | "asymptomatic" | "recovered" | "deceased" | "unknown";

export type CredibilityBucket = "verified" | "reliable" | "corroborate" | "low" | "unrated";

export type SourceType = "official" | "aggregator" | "media" | "local_authority" | "other";

export type SignalReport = {
  id: string;
  reportId?: number | string;
  title: string;
  source: string;
  sourceType: SourceType;
  url: string | null;
  summary: string;
  severity: SeverityLevel;
  status: SignalStatus;
  /**
   * Optional outbreak generation when the source text includes it (e.g. "Gen 0", "Generation 1", "G2").
   * Values >=3 are bucketed as 3 ("G3+").
   */
  generation?: number | null;
  region: string;
  country: string;
  inferredCases: number | null;
  advisoryType: string;
  aiRiskNote: string | null;
  publishedAt: string | null;
  ingestedAt: string | null;
  sourceCredibility: number | null;
  credibilityBucket: CredibilityBucket;
  tags: string[];
  travelLinked: boolean;
};

export type DashboardPayload = {
  degraded?: boolean;
  warning?: string;
  stats: {
    totalTrackedReports: number;
    highSeverityLast14Days: number;
    activeSources: number;
    lastSyncAt: string | null;
  };
  trend: { day: string; cases: number }[];
  latest: RawReport[];
  geo: { country: string; reports: number }[];
};
