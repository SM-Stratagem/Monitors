"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { useCountUp } from "@/hooks/useCountUp";

const DashboardOverview = lazy(() => import("./tabs/dashboard-overview").then(m => ({ default: m.DashboardOverview })));
const CaseTracker = lazy(() => import("./tabs/case-tracker").then(m => ({ default: m.CaseTracker })));
const WorldMap = lazy(() => import("./tabs/world-map").then(m => ({ default: m.WorldMap })));
const FlightTracker = lazy(() => import("./tabs/flight-tracker").then(m => ({ default: m.FlightTracker })));
const ShipDeck = lazy(() => import("./tabs/ship-deck").then(m => ({ default: m.ShipDeck })));
const QuarantineCountdown = lazy(() => import("./tabs/quarantine-countdown").then(m => ({ default: m.QuarantineCountdown })));
const Timeline = lazy(() => import("./tabs/timeline").then(m => ({ default: m.Timeline })));
const NewsFeed = lazy(() => import("./tabs/news-feed").then(m => ({ default: m.NewsFeed })));
const RedditFeed = lazy(() => import("./tabs/reddit-feed").then(m => ({ default: m.RedditFeed })));
const DiseaseInfo = lazy(() => import("./tabs/disease-info").then(m => ({ default: m.DiseaseInfo })));

type TabId = "overview" | "cases" | "world-map" | "flights" | "ship" | "quarantine" | "timeline" | "news" | "reddit" | "disease-info";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Dashboard" },
  { id: "cases", label: "Case Tracker" },
  { id: "world-map", label: "World Map" },
  { id: "flights", label: "Flight Tracker" },
  { id: "ship", label: "Ship Deck" },
  { id: "quarantine", label: "Quarantine" },
  { id: "timeline", label: "Timeline" },
  { id: "news", label: "News Feed" },
  { id: "reddit", label: "Reddit" },
  { id: "disease-info", label: "Disease Info" },
];

function StatChip({ label, value, className, title }: { label: string; value: number; className: string; title: string }) {
  const animated = useCountUp(value);
  return (
    <div className={`stat-chip ${className} chip-flash`} title={title}>
      <span className="stat-label">{label}</span>
      <span className="stat-value count-animate">{animated}</span>
    </div>
  );
}

export function Dashboard() {
  const [tab, setTab] = useState<TabId>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dashboard, setDashboard] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [ship, setShip] = useState<any>(null);
  const [quarantine, setQuarantine] = useState<any[]>([]);
  const [diseaseInfo, setDiseaseInfo] = useState<any>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [tabKey, setTabKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      try {
        const [dashRes, casesRes, flightsRes, shipRes, quarantineRes, diseaseRes] = await Promise.allSettled([
          fetch("/api/dashboard"),
          fetch("/api/cases"),
          fetch("/api/flights"),
          fetch("/api/ship"),
          fetch("/api/quarantine"),
          fetch("/api/disease-info"),
        ]);

        if (!mounted) return;

        if (dashRes.status === "fulfilled" && dashRes.value.ok) {
          setDashboard(await dashRes.value.json());
        }
        if (casesRes.status === "fulfilled" && casesRes.value.ok) {
          const d = await casesRes.value.json();
          setCases(d.cases || []);
        }
        if (flightsRes.status === "fulfilled" && flightsRes.value.ok) {
          const d = await flightsRes.value.json();
          setFlights(d.flights || []);
        }
        if (shipRes.status === "fulfilled" && shipRes.value.ok) {
          const d = await shipRes.value.json();
          setShip(d.ship);
        }
        if (quarantineRes.status === "fulfilled" && quarantineRes.value.ok) {
          const d = await quarantineRes.value.json();
          setQuarantine(d.quarantine || []);
        }
        if (diseaseRes.status === "fulfilled" && diseaseRes.value.ok) {
          setDiseaseInfo(await diseaseRes.value.json());
        }

        setLoading(false);
      } catch (e) {
        if (mounted) {
          setError("Failed to load dashboard data");
          setLoading(false);
        }
      }
    }

    fetchAll();

    // Poll for updates every 10 minutes
    const interval = setInterval(fetchAll, 10 * 60 * 1000);

    return () => { mounted = false; clearInterval(interval); };
  }, []);

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-spinner" />
        <p style={{ color: "var(--cyan)", fontFamily: "IBM Plex Mono, monospace", fontSize: 13, letterSpacing: 1 }}>
          INITIALIZING OUTBREAK MONITOR...
        </p>
      </main>
    );
  }

  if (error && !dashboard) {
    return (
      <main className="error-screen">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </main>
    );
  }

  const stats = dashboard?.stats || {};
  const latest = dashboard?.latest || [];
  const geo = dashboard?.geo || [];
  const quarantineData = quarantine.length > 0 ? quarantine : dashboard?.quarantine || [];
  const lastSyncLabel = stats.lastSyncAt ? new Date(stats.lastSyncAt).toLocaleString() : "Unknown";

  return (
    <main className="app-shell">
      {showDisclaimer && (
        <div className="disclaimer-banner">
          <span className="disclaimer-icon">⚠️</span>
          <div className="disclaimer-text">
            <strong>ALERT:</strong> UNOFFICIAL TRACKER — NOT AN OFFICIAL PUBLIC HEALTH RESOURCE. Data compiled from public sources.
          </div>
          <button className="disclaimer-btn" onClick={() => setShowDisclaimer(false)}>Dismiss</button>
        </div>
      )}

      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">📡</div>
          <div>
            <div className="brand-title">OUTBREAK TRACKER</div>
            <div className="brand-subtitle">MV Hondius · Hantavirus · Live Monitoring</div>
          </div>
        </div>
        <div className="header-stats">
          <StatChip label="Reports" value={stats.totalTrackedReports || 0} className="stat-chip--confirmed" title="Total monitored reporting items" />
          <StatChip label="High/Critical" value={stats.highSeverityLast14Days || 0} className="stat-chip--high" title="Reports tagged high/critical in last 14 days" />
          <StatChip label="Flights" value={stats.flightCount || flights.length} className="stat-chip--flights" title="Tracked flight records" />
          <StatChip label="Case records" value={stats.caseCount || cases.length} className="stat-chip--cases" title="Case-record entries" />
        </div>
        <div className="header-actions">
          <a href="https://www.buymeacoffee.com/SMStratagem" target="_blank" rel="noopener noreferrer" className="bmc-link-sm">
            ☕ Buy me a Spanish Latte
          </a>
        </div>
      </header>

      <nav className="tab-nav" role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? "active" : ""}`}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => { setTab(t.id); setTabKey(k => k + 1); }}
          >
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="mobile-bottom-nav" role="tablist" aria-label="Mobile navigation">
        {TABS.slice(0, 5).map(t => (
          <button
            key={t.id}
            className={`mobile-nav-btn ${tab === t.id ? "active" : ""}`}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => { setTab(t.id); setTabKey(k => k + 1); }}
          >
            <span className="mobile-nav-label">{t.label.split(" ")[0]}</span>
          </button>
        ))}
        <div className="mobile-nav-more" onClick={() => {
          const remaining = TABS.slice(5);
          const currentIdx = remaining.findIndex(t => t.id === tab);
          const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % remaining.length : 0;
          setTab(remaining[nextIdx].id);
          setTabKey(k => k + 1);
        }}>
          <span className="mobile-nav-label">More</span>
        </div>
      </nav>

      <div className="tab-content">
        <Suspense fallback={<div className="tab-loading">Loading...</div>}>
          <div key={tabKey} className="tab-enter">
            {tab === "overview" && (
              <DashboardOverview stats={stats} latest={latest} geo={geo} ship={ship} quarantine={quarantineData} cases={cases} flights={flights} />
            )}
            {tab === "cases" && <CaseTracker cases={cases} />}
            {tab === "world-map" && <WorldMap cases={cases} geo={geo} flights={flights} ship={ship} latest={latest} />}
            {tab === "flights" && <FlightTracker flights={flights} />}
            {tab === "ship" && <ShipDeck ship={ship} />}
            {tab === "quarantine" && <QuarantineCountdown quarantine={quarantineData} />}
            {tab === "timeline" && <Timeline entries={cases} />}
            {tab === "news" && <NewsFeed items={latest} />}
            {tab === "reddit" && <RedditFeed />}
            {tab === "disease-info" && diseaseInfo && (
              <DiseaseInfo disease={diseaseInfo.disease} feedItems={diseaseInfo.feedItems || []} />
            )}
          </div>
        </Suspense>
      </div>

      <footer className="app-footer">
        <div className="footer-sync">
          <span className="live-dot" />
          <span className="mono">Last sync: {lastSyncLabel} · Auto-refreshes every 10 min</span>
        </div>
        <span>Unofficial tracker · Not affiliated with WHO, CDC, or ECDC</span>
        <span>Data sources: RSS, NewsAPI, SerpAPI, Reddit, OpenSky Network, WHO, CDC, ECDC, RKI</span>
      </footer>
    </main>
  );
}
