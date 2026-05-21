import type { SignalReport } from "@/lib/reports/types";
import { EmptyState, Panel } from "../parts";

export function SourcesTab({ reports }: { reports: SignalReport[] }) {
  if (!reports.length) return <EmptyState title="No sources" description="Source intelligence will populate after ingestion." />;
  const grouped = reports.reduce<Record<string, SignalReport[]>>((acc, report) => {
    acc[report.source] = acc[report.source] ?? [];
    acc[report.source].push(report);
    return acc;
  }, {});
  const rows = Object.entries(grouped).map(([source, items]) => {
    const latest = items.sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())[0];
    const avgCred = Math.round(items.reduce((sum, i) => sum + (i.sourceCredibility ?? 0), 0) / Math.max(items.filter((i) => typeof i.sourceCredibility === "number").length, 1));
    return { source, type: latest.sourceType, reports: items.length, latest, avgCred };
  });
  const officialReferences = [
    {
      name: "WHO Disease Outbreak News - DON599",
      note: "Official WHO situation report on the Ebola virus disease outbreak",
      url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599",
      domain: "who.int",
    },
    {
      name: "WHO Response Statement - May 7, 2026",
      note: "WHO statement on response actions including onboard expert deployment and diagnostic kits",
      url: "https://www.who.int/news/item/07-05-2026-who-response-statement",
      domain: "who.int",
    },
    {
      name: "CDC - Ebola",
      note: "US Centers for Disease Control Ebola information",
      url: "https://www.cdc.gov/ebola/",
      domain: "cdc.gov",
    },
    {
      name: "ECDC - European Centre for Disease Prevention and Control",
      note: "European infectious disease surveillance authority",
      url: "https://www.ecdc.europa.eu/",
      domain: "ecdc.europa.eu",
    },
  ];

  return (
    <Panel title="Source Intelligence" subtitle="Official/public health sources are separated from media and aggregators.">
      <div className="source-grid">
        {officialReferences.map((ref) => {
          const matched = reports.some((r) => (r.url || "").includes(ref.domain) || r.source.toLowerCase().includes(ref.domain));
          return (
            <article key={ref.name}>
              <h4>{ref.name}</h4>
              <p>{ref.note}</p>
              <p className="mono">Status: {matched ? "Referenced in ingested signals" : "Official reference only (not directly ingested feed)"}</p>
              <a href={ref.url} target="_blank" rel="noreferrer">Open source</a>
            </article>
          );
        })}
      </div>
      <div className="source-grid">{rows.map((row) => <article key={row.source}><h4>{row.source}</h4><p className="mono">{row.type}</p><p>Reports: {row.reports}</p><p>Avg credibility: {Number.isFinite(row.avgCred) ? row.avgCred : "-"}</p><p className="mono">Last seen: {row.latest?.publishedAt ? new Date(row.latest.publishedAt).toLocaleString() : "Unknown"}</p></article>)}</div>
      <p className="mono">Credibility legend: 90-100 official/high confidence · 70-89 reliable media/verified · 50-69 needs corroboration · under 50 low confidence.</p>
    </Panel>
  );
}
