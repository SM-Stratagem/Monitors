import type { CredibilityBucket, SeverityLevel, SignalStatus, SourceType } from "@/lib/reports/types";

export function StatusBadge({ status }: { status: SignalStatus }) {
  return <span className={`pill status-${status}`}>{status.replace("_", " ")}</span>;
}

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  return <span className={`pill sev-${severity}`}>{severity}</span>;
}

export function SourceBadge({ sourceType }: { sourceType: SourceType }) {
  return <span className={`pill source-${sourceType}`}>{sourceType.replace("_", " ")}</span>;
}

export function CredibilityBadge({ bucket, score }: { bucket: CredibilityBucket; score: number | null }) {
  const label = bucket === "verified" ? "Verified/high confidence" : bucket === "reliable" ? "Reliable" : bucket === "corroborate" ? "Needs corroboration" : bucket === "low" ? "Low confidence" : "Unrated";
  return <span className={`pill cred-${bucket}`}>{label}{typeof score === "number" ? ` ${score}` : ""}</span>;
}
