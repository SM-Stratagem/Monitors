"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { ReportFilters, SortMode } from "@/lib/reports/report-filters";
import type { SignalReport } from "@/lib/reports/types";
import { CredibilityBadge, SeverityBadge, SourceBadge, StatusBadge } from "./badges";

export function Panel({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="intel-panel">
      <header className="intel-panel-head">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}

export function AlertBar({
  onDisclaimer,
  defaultOpen = true,
}: {
  onDisclaimer: () => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (!open) return null;
  return (
    <div className="top-alert" role="status">
      <span>
        <strong>ALERT:</strong> UNOFFICIAL TRACKER - NOT AN OFFICIAL PUBLIC HEALTH RESOURCE. Data is manually compiled from public sources and may be incomplete or inaccurate.
      </span>
      <span className="top-alert-spacer" />
      <button onClick={onDisclaimer}>Full Disclaimer</button>
      <button className="top-alert-close" aria-label="Dismiss alert" onClick={() => setOpen(false)}>
        ×
      </button>
    </div>
  );
}

export type HeaderStats = {
  confirmed: number;
  symptomatic: number;
  asymptomatic: number;
  recovered: number;
  deaths: number;
  tracked: number;
  gen0: number;
  gen1: number;
};

export function CommandHeader({
  lastSyncAt,
  stats,
  onMobileView,
}: {
  lastSyncAt: string | null;
  stats: HeaderStats;
  onMobileView?: () => void;
}) {
  const updatedLabel = useMemo(() => {
    if (!lastSyncAt) return "Updated unknown";
    const dt = new Date(lastSyncAt);
    const time = dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    const offsetMin = -dt.getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const abs = Math.abs(offsetMin);
    const hh = String(Math.floor(abs / 60)).padStart(1, "0");
    const mm = String(abs % 60).padStart(2, "0");
    const gmt = mm === "00" ? `GMT${sign}${hh}` : `GMT${sign}${hh}:${mm}`;
    return `Updated ${time} ${gmt}`;
  }, [lastSyncAt]);

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon" aria-hidden="true">🛰</div>
        <div>
          <div className="brand-title">Outbreak Tracker</div>
          <div className="brand-subtitle">West Africa · Ebola Outbreak Tracker</div>
        </div>
      </div>

      <div className="header-stats" aria-label="Outbreak totals">
        <div className="stat-chip stat-chip--confirmed">
          <div className="stat-label">Confirmed</div>
          <div className="stat-value">{stats.confirmed}</div>
        </div>
        <div className="stat-chip stat-chip--symptomatic">
          <div className="stat-label">Symptomatic</div>
          <div className="stat-value">{stats.symptomatic}</div>
        </div>
        <div className="stat-chip stat-chip--asymptomatic">
          <div className="stat-label">Asymptomatic</div>
          <div className="stat-value">{stats.asymptomatic}</div>
        </div>
        <div className="stat-chip stat-chip--recovered">
          <div className="stat-label">Recovered</div>
          <div className="stat-value">{stats.recovered}</div>
        </div>
        <div className="stat-chip stat-chip--deceased">
          <div className="stat-label">Deaths</div>
          <div className="stat-value">{stats.deaths}</div>
        </div>
        <div className="stat-chip stat-chip--total">
          <div className="stat-label">Tracked</div>
          <div className="stat-value">{stats.tracked}</div>
        </div>
        <div className="stat-chip stat-chip--gen0">
          <div className="stat-label">Gen 0</div>
          <div className="stat-value">{stats.gen0}</div>
        </div>
        <div className="stat-chip stat-chip--gen1">
          <div className="stat-label">Gen 1</div>
          <div className="stat-value">{stats.gen1}</div>
        </div>
      </div>

      <div className="header-actions">
        <div className="last-updated">
          <span className="live-dot" aria-hidden="true" />
          <span className="mono">{updatedLabel}</span>
        </div>
        <button className="header-btn" onClick={onMobileView}>
          <span aria-hidden="true">📖</span>
          <span>Mobile View</span>
        </button>
      </div>
    </header>
  );
}

export type DashboardTabOption = { id: string; label: string };

export function DashboardTabs({
  value,
  onChange,
  tabs = [
    { id: "overview", label: "Overview" },
    { id: "world-map", label: "World Map" },
    { id: "signal-feed", label: "Signal Feed" },
    { id: "transmission", label: "Transmission Chains" },
    { id: "timeline", label: "Timeline" },
    { id: "travel-exposure", label: "Travel Exposure" },
    { id: "sources", label: "Sources" },
    { id: "info", label: "Info" },
  ],
}: {
  value: string;
  onChange: (value: string) => void;
  tabs?: DashboardTabOption[];
}) {
  return (
    <nav className="tab-nav" aria-label="Dashboard tabs" style={{
      display: "flex",
      gap: "8px",
      padding: "8px",
      background: "rgba(30, 41, 59, 0.6)",
      border: "1px solid rgba(148, 163, 184, 0.15)",
      borderRadius: "14px",
      marginBottom: "16px",
      overflowX: "auto"
    }}>
      {tabs.map((tab) => (
        <button 
          key={tab.id} 
          className={value === tab.id ? "active" : ""} 
          onClick={() => onChange(tab.id)}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "500",
            color: value === tab.id ? "#38bdf8" : "#94a3b8",
            background: value === tab.id ? "rgba(14, 165, 233, 0.15)" : "transparent",
            border: value === tab.id ? "1px solid rgba(14, 165, 233, 0.4)" : "1px solid transparent",
            transition: "all 0.2s",
            whiteSpace: "nowrap"
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export function FilterSidebar({ filters, setFilters, reports, onPick }: { filters: ReportFilters; setFilters: (next: ReportFilters) => void; reports: SignalReport[]; onPick: (report: SignalReport) => void }) {
  const statusOptions: { label: string; value: SignalReport["status"]; cls: string }[] = [
    { label: "Confirmed", value: "confirmed", cls: "filter-pill--confirmed" },
    { label: "Monitoring - Symptomatic", value: "symptomatic", cls: "filter-pill--symptomatic" },
    { label: "Monitoring - Asymptomatic", value: "asymptomatic", cls: "filter-pill--asymptomatic" },
    { label: "Recovered", value: "recovered", cls: "filter-pill--recovered" },
    { label: "Deceased", value: "deceased", cls: "filter-pill--deceased" },
  ];

  const genCounts = useMemo(() => {
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<number, number>;
    for (const r of reports) {
      const g = typeof (r as any).generation === "number" ? (r as any).generation : null;
      if (g == null) continue;
      const bucket = g >= 3 ? 3 : g;
      counts[bucket] = (counts[bucket] ?? 0) + 1;
    }
    return counts;
  }, [reports]);

  const toggleStatus = (value: SignalReport["status"]) => {
    const next = filters.statuses.includes(value) ? filters.statuses.filter((s) => s !== value) : [...filters.statuses, value];
    setFilters({ ...filters, statuses: next });
  };

  const toggleGeneration = (gen: number) => {
    const next = filters.generations.includes(gen) ? filters.generations.filter((g) => g !== gen) : [...filters.generations, gen];
    setFilters({ ...filters, generations: next });
  };

  const reset = () =>
    setFilters({
      search: "",
      statuses: [],
      severities: [],
      regions: [],
      sources: [],
      credibility: [],
      dateFrom: "",
      dateTo: "",
      generations: [],
    });

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Status</div>
        <div className="filter-pills">
          {statusOptions.map((opt) => (
            <label key={opt.value} className={`filter-pill ${opt.cls}`}>
              <input type="checkbox" checked={filters.statuses.includes(opt.value)} onChange={() => toggleStatus(opt.value)} />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Generation</div>
        <div className="filter-pills">
          <label className="filter-pill filter-pill--gen0">
            <input type="checkbox" checked={filters.generations.includes(0)} onChange={() => toggleGeneration(0)} />
            <span>G0 ({genCounts[0] ?? 0})</span>
          </label>
          <label className="filter-pill filter-pill--gen1">
            <input type="checkbox" checked={filters.generations.includes(1)} onChange={() => toggleGeneration(1)} />
            <span>G1 ({genCounts[1] ?? 0})</span>
          </label>
          <label className="filter-pill filter-pill--gen2">
            <input type="checkbox" checked={filters.generations.includes(2)} onChange={() => toggleGeneration(2)} />
            <span>G2 ({genCounts[2] ?? 0})</span>
          </label>
          <label className="filter-pill filter-pill--gen3">
            <input type="checkbox" checked={filters.generations.includes(3)} onChange={() => toggleGeneration(3)} />
            <span>G3+ ({genCounts[3] ?? 0})</span>
          </label>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Cases ({Math.min(80, reports.length)} of {reports.length})</div>
        <div className="sidebar-cases">
          <div className="case-list">
            {reports.slice(0, 80).map((report) => (
              <button key={report.id} className="case-item" onClick={() => onPick(report)}>
                <div className="case-id">{report.id}</div>
                <div className="case-title">{report.title}</div>
                <div className="case-meta mono">
                  {report.status.toUpperCase()} · {report.country}
                </div>
              </button>
            ))}
          </div>
        </div>
        <button className="header-btn" onClick={reset}>
          Reset
        </button>
      </div>
    </aside>
  );
}

export function KpiStrip({ cards }: { cards: { label: string; value: string; note: string; tone?: string }[] }) {
  return (
    <div className="kpi-strip" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "12px",
      marginBottom: "16px"
    }}>
      {cards.map((card) => (
        <article 
          key={card.label} 
          className={`kpi ${card.tone ?? ""}`}
          style={{
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            borderRadius: "10px",
            padding: "14px",
            transition: "all 0.2s"
          }}
        >
          <p style={{ margin: "0 0 4px", color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</p>
          <h2 style={{ 
            margin: 0, 
            fontSize: "24px",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: "700",
            background: card.tone === "warn" ? "linear-gradient(135deg, #f97316, #ef4444)" : "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>{card.value}</h2>
          <small style={{ color: "#64748b", fontSize: "10px" }}>{card.note}</small>
        </article>
      ))}
    </div>
  );
}

export function SignalCard({ report, onOpen }: { report: SignalReport; onOpen: (report: SignalReport) => void }) {
  return <button className="feed-card" onClick={() => onOpen(report)}><div className="feed-top"><SeverityBadge severity={report.severity} /><StatusBadge status={report.status} /><SourceBadge sourceType={report.sourceType} /></div><h4>{report.title}</h4><p>{report.summary}</p><div className="feed-meta mono"><span>{report.country}</span><span>{report.publishedAt ? new Date(report.publishedAt).toLocaleString() : "No date"}</span><CredibilityBadge bucket={report.credibilityBucket} score={report.sourceCredibility} /></div></button>;
}

export function FeedToolbar({ sort, setSort }: { sort: SortMode; setSort: (sort: SortMode) => void }) {
  return <div className="feed-toolbar"><label className="mono">Sort</label><select value={sort} onChange={(e) => setSort(e.target.value as SortMode)}><option value="newest">Newest</option><option value="severity">Highest severity</option><option value="credibility">Highest credibility</option><option value="country">Country</option><option value="source">Source</option></select></div>;
}

export function SignalDetailPanel({ report, onClose, onPrev, onNext }: { report: SignalReport | null; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  if (!report) return <aside className="detail-panel"><p className="muted">Select a signal to open its intelligence dossier.</p></aside>;
  return (
    <aside className="detail-panel">
      <div className="detail-actions"><button onClick={onPrev}>Previous</button><button onClick={onNext}>Next</button><button onClick={onClose}>Close</button></div>
      <h3>{report.title}</h3>
      <div className="detail-tags"><SeverityBadge severity={report.severity} /><StatusBadge status={report.status} /><SourceBadge sourceType={report.sourceType} /><CredibilityBadge bucket={report.credibilityBucket} score={report.sourceCredibility} /></div>
      <p>{report.summary}</p>
      <dl className="detail-grid mono"><dt>ID</dt><dd>{report.id}</dd><dt>Country</dt><dd>{report.country}</dd><dt>Source</dt><dd>{report.source}</dd><dt>Published</dt><dd>{report.publishedAt ? new Date(report.publishedAt).toLocaleString() : "Unknown"}</dd><dt>Ingested</dt><dd>{report.ingestedAt ? new Date(report.ingestedAt).toLocaleString() : "Unknown"}</dd></dl>
      <div className="detail-actions">
        <button onClick={() => navigator.clipboard.writeText(report.url || report.title)}>Copy report link</button>
        {report.url ? <a href={report.url} target="_blank" rel="noreferrer">Open source</a> : <button disabled>Open source</button>}
      </div>
      <details><summary>Raw metadata</summary><pre>{JSON.stringify(report, null, 2)}</pre></details>
    </aside>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty"><h4>{title}</h4><p>{description}</p></div>;
}
