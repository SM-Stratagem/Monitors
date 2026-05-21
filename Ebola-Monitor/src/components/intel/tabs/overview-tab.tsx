import { groupForMap, COUNTRY_COORDS, severityColor } from "@/lib/reports/report-map-utils";
import type { SignalReport } from "@/lib/reports/types";
import { EmptyState, Panel, SignalCard } from "../parts";

export function OverviewTab({ reports, onOpen }: { reports: SignalReport[]; onOpen: (report: SignalReport) => void }) {
  const grouped = groupForMap(reports);
  const latest = reports.slice(0, 8);
  const highestRegion = topBy(reports.map((r) => r.region));
  const sourceType = topBy(reports.map((r) => r.sourceType));
  const high = reports.find((r) => r.severity === "critical" || r.severity === "high");
  return (
    <div className="overview-grid">
      <Panel title="Global Signal Map" subtitle="Map preview of active signal locations">
        <svg viewBox="0 0 900 350" className="map-svg" role="img" aria-label="Signal map preview">
          <rect x="0" y="0" width="900" height="350" rx="14" fill="#051521" />
          <path d="M51 132l37-16 29 9 44-8 46 11 21 24 39 11 18 30-8 26-41 8-24-5-26 14-44-3-36-24-27-26-18-40z" fill="#0f2b3f" />
          <path d="M344 98l35-15 56 7 47-9 53 13 51 25 60-5 46 21 41 4 16 19-15 18-45 14-42-8-44 12-53 24-61-14-42-11-35-28-32-22z" fill="#0f2b3f" />
          {grouped.map((entry) => {
            const coord = COUNTRY_COORDS[entry.country];
            if (!coord) return null;
            const radius = 5 + Math.min(entry.reports * 2, 16);
            return <g key={entry.country}><circle cx={coord.x} cy={coord.y} r={radius + 5} fill={`${severityColor(entry.highest)}20`} /><circle cx={coord.x} cy={coord.y} r={radius} fill={severityColor(entry.highest)} /><text x={coord.x + radius + 5} y={coord.y + 4} fontSize="11" fill="#b9d8ea">{entry.country} ({entry.reports})</text></g>;
          })}
        </svg>
      </Panel>
      <Panel title="Latest High-Priority Signals" subtitle="Most recent public-source intelligence">
        {latest.length === 0 ? <EmptyState title="No signals yet" description="No reports have been ingested yet." /> : <div className="feed-list">{latest.map((r) => <SignalCard key={r.id} report={r} onOpen={onOpen} />)}</div>}
      </Panel>
      <Panel title="Intelligence Summary" subtitle="Deterministic summaries from current dataset">
        <ul className="summary-list">
          <li><span>Highest activity region</span><strong>{highestRegion || "Unknown"}</strong></li>
          <li><span>Most common source type</span><strong>{sourceType || "Unknown"}</strong></li>
          <li><span>Most recent high severity report</span><strong>{high ? high.title : "None"}</strong></li>
          <li><span>Signals requiring verification</span><strong>{reports.filter((r) => r.credibilityBucket === "low" || r.credibilityBucket === "corroborate").length}</strong></li>
          <li><span>Countries represented</span><strong>{new Set(reports.map((r) => r.country)).size}</strong></li>
        </ul>
      </Panel>
    </div>
  );
}

function topBy(values: string[]): string | null {
  const counts = values.reduce<Record<string, number>>((acc, value) => ({ ...acc, [value]: (acc[value] ?? 0) + 1 }), {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}
