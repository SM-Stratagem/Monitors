# HantaTrack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing hantavirus monitor into a high-tech dark themed dashboard with enhanced UI, Buy Me Coffee integration, improved data visualization, and polished aesthetics.

**Architecture:** Enhance existing Next.js app with modern CSS theming, improved components, and better visual hierarchy while maintaining all existing functionality.

**Tech Stack:** Next.js 16, React 19, Drizzle ORM, PostgreSQL, Tailwind-like custom CSS, Leaflet.js, Cytoscape.js, Google Gemini AI

---

## File Structure

**Existing files to modify:**
- `src/app/globals.css` - Complete theme overhaul to high-tech dark
- `src/app/layout.tsx` - Add fonts, meta tags, Buy Me Coffee link
- `src/components/dashboard.tsx` - Add Buy Me Coffee button, enhance layout
- `src/components/intel/parts.tsx` - Modernize shared components
- `.env.example` - Add new env vars

**New files to create:**
- `src/components/intel/theme.css` - CSS custom properties for high-tech dark theme
- `src/app/api/buycoffee/route.ts` - Optional: Buy Me Coffee widget endpoint

---

### Task 1: Update Environment Variables

**Files:**
- Modify: `.env.example`
- Modify: `.env` (add new vars)

- [ ] **Step 1: Update .env.example with new variables**

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hantavirus_monitor
CRON_SECRET=replace-with-long-random-secret
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_TOP=0000000000
NEXT_PUBLIC_SITE_URL=https://your-railway-domain.up.railway.app
NEXT_PUBLIC_BUYMECOFFEE_URL=https://buymeacoffee.com/suhayl
```

- [ ] **Step 2: Read current .env to check existing values**

```bash
cat /Users/suhayl/Downloads/Hantavirus-monitor/.env
```

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "feat: add Buy Me Coffee env var"
```

---

### Task 2: Create High-Tech Dark Theme CSS

**Files:**
- Create: `src/components/intel/theme.css`

- [ ] **Step 1: Write the complete theme CSS file**

```css
/* High-Tech Dark Theme - HantaTrack */
/* Gradients, glass morphism, neon accents */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

:root {
  /* Background layers */
  --bg-deep: #0a0f1a;
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-elevated: #1e293b;
  --bg-panel: rgba(30, 41, 59, 0.6);
  --bg-panel-hover: rgba(30, 41, 59, 0.8);
  --bg-card: rgba(15, 23, 42, 0.5);
  
  /* Glass morphism */
  --glass-bg: rgba(30, 41, 59, 0.6);
  --glass-border: rgba(148, 163, 184, 0.15);
  --glass-blur: 12px;
  
  /* Accent colors - Cyan to Purple gradient */
  --accent-cyan: #0ea5e9;
  --accent-cyan-soft: #38bdf8;
  --accent-cyan-muted: rgba(14, 165, 233, 0.2);
  --accent-purple: #8b5cf6;
  --accent-purple-soft: #a78bfa;
  --accent-purple-muted: rgba(139, 92, 246, 0.2);
  --accent-gradient: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  
  /* Status colors */
  --color-critical: #ef4444;
  --color-critical-bg: rgba(239, 68, 68, 0.15);
  --color-high: #f97316;
  --color-high-bg: rgba(249, 115, 22, 0.15);
  --color-moderate: #eab308;
  --color-moderate-bg: rgba(234, 179, 8, 0.15);
  --color-low: #10b981;
  --color-low-bg: rgba(16, 185, 129, 0.15);
  --color-info: #0ea5e9;
  --color-info-bg: rgba(14, 165, 233, 0.15);
  
  /* Text */
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --text-faint: #64748b;
  
  /* Borders */
  --border-subtle: rgba(148, 163, 184, 0.1);
  --border-default: rgba(148, 163, 184, 0.2);
  --border-accent: rgba(14, 165, 233, 0.4);
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  
  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-full: 9999px;
  
  /* Fonts */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
  
  /* Shadows */
  --shadow-glow-cyan: 0 0 20px rgba(14, 165, 233, 0.3);
  --shadow-glow-purple: 0 0 20px rgba(139, 92, 246, 0.3);
  --shadow-glow-red: 0 0 20px rgba(239, 68, 68, 0.3);
  --shadow-glow-green: 0 0 20px rgba(16, 185, 129, 0.3);
  --shadow-panel: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
}

/* Reset and base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  background: linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-primary) 30%, var(--bg-deep) 100%);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
}

/* Background grid overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: 
    linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
}

/* Links */
a {
  color: var(--accent-cyan-soft);
  text-decoration: none;
  transition: color 0.2s;
}
a:hover {
  color: var(--accent-cyan);
  text-decoration: underline;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
}

.mono {
  font-family: var(--font-mono);
}

/* Buttons */
button {
  font-family: var(--font-sans);
  cursor: pointer;
  border: none;
  background: none;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--accent-gradient);
  color: white;
  border: none;
}
.btn-primary:hover {
  box-shadow: var(--shadow-glow-cyan);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
}
.btn-ghost:hover {
  background: var(--bg-panel-hover);
  border-color: var(--border-accent);
}

/* Buy Me Coffee Button */
.btn-coffee {
  background: linear-gradient(135deg, #ffdd00 0%, #f9a825 100%);
  color: #1a1a1a;
  font-weight: 600;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  border: none;
  transition: all 0.2s;
}
.btn-coffee:hover {
  box-shadow: 0 0 20px rgba(255, 221, 0, 0.4);
  transform: translateY(-1px);
}

/* Panels and Cards */
.panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(var(--glass-blur));
  box-shadow: var(--shadow-panel);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border-subtle);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-md);
}

.kpi-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  transition: all 0.2s;
}
.kpi-card:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-glow-cyan);
}

.kpi-card .label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.kpi-card .value {
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 700;
  color: var(--accent-cyan-soft);
}

.kpi-card .note {
  font-size: 11px;
  color: var(--text-faint);
  margin-top: var(--space-xs);
}

.kpi-card.critical .value { color: var(--color-critical); }
.kpi-card.high .value { color: var(--color-high); }
.kpi-card.success .value { color: var(--color-low); }

/* Status Pills */
.pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 500;
  border: 1px solid;
}

.pill-critical {
  background: var(--color-critical-bg);
  border-color: var(--color-critical);
  color: var(--color-critical);
}

.pill-high {
  background: var(--color-high-bg);
  border-color: var(--color-high);
  color: var(--color-high);
}

.pill-moderate {
  background: var(--color-moderate-bg);
  border-color: var(--color-moderate);
  color: var(--color-moderate);
}

.pill-low {
  background: var(--color-low-bg);
  border-color: var(--color-low);
  color: var(--color-low);
}

/* Live indicator */
.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-md);
  background: var(--color-low-bg);
  border: 1px solid var(--color-low);
  border-radius: var(--radius-full);
  color: var(--color-low);
  font-size: 12px;
  font-weight: 500;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: var(--color-low);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--color-low);
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.9); }
}

/* Header styles */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) var(--space-xl);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(var(--glass-blur));
  margin-bottom: var(--space-lg);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.brand-icon {
  width: 44px;
  height: 44px;
  background: var(--accent-gradient);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: var(--shadow-glow-cyan);
}

.brand-title {
  font-size: 20px;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  font-size: 12px;
  color: var(--text-muted);
}

/* Sidebar styles */
.sidebar-section {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border-subtle);
}

.sidebar-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

/* Filter pills */
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-pill:hover {
  border-color: var(--border-accent);
}

.filter-pill input[type="checkbox"] {
  width: 12px;
  height: 12px;
  accent-color: var(--accent-cyan);
}

/* Tabs */
.tab-nav {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  overflow-x: auto;
}

.tab-btn {
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--text-secondary);
  background: var(--bg-panel-hover);
}

.tab-btn.active {
  color: var(--accent-cyan-soft);
  background: var(--accent-cyan-muted);
  box-shadow: 0 0 14px rgba(14, 165, 233, 0.2) inset;
}

/* Signal cards */
.signal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  cursor: pointer;
  transition: all 0.2s;
}

.signal-card:hover {
  border-color: var(--border-accent);
  background: var(--bg-panel-hover);
}

.signal-card h4 {
  font-size: 14px;
  margin-bottom: var(--space-sm);
}

.signal-card p {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}

.signal-card .meta {
  display: flex;
  gap: var(--space-md);
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

/* Map styles */
.map-container {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-accent);
  overflow: hidden;
  box-shadow: var(--shadow-glow-cyan);
}

/* Footer */
.footer {
  margin-top: var(--space-xl);
  padding: var(--space-lg);
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  border-top: 1px solid var(--border-subtle);
}

/* Disclaimer banner */
.disclaimer-banner {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-high-bg);
  border: 1px solid var(--color-high);
  border-radius: var(--radius-md);
  font-size: 12px;
  color: var(--color-high);
  margin-bottom: var(--space-lg);
}

/* Responsive */
@media (max-width: 1024px) {
  .app-header {
    flex-direction: column;
    gap: var(--space-md);
    text-align: center;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .tab-nav {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
```

- [ ] **Step 2: Import theme in layout.tsx (will modify in Task 3)**

- [ ] **Step 3: Commit**

```bash
git add src/components/intel/theme.css
git commit -m "feat: add high-tech dark theme CSS"
```

---

### Task 3: Update Layout with Fonts and Meta

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read current layout**

```bash
cat /Users/suhayl/Downloads/Hantavirus-monitor/src/app/layout.tsx
```

- [ ] **Step 2: Update layout.tsx**

```tsx
import type { Metadata } from "next";
import "./globals.css";
import "@/components/intel/theme.css";

export const metadata: Metadata = {
  title: "HantaTrack | Real-Time Hantavirus Intelligence",
  description: "Live hantavirus monitoring dashboard with real-source ingestion, AI analysis, and travel risk updates. Tracking outbreaks globally.",
  keywords: "hantavirus, outbreak tracker, health monitoring, WHO, CDC, travel advisory",
  openGraph: {
    title: "HantaTrack | Real-Time Hantavirus Intelligence",
    description: "Live hantavirus monitoring dashboard with real-source ingestion, AI analysis, and travel risk updates.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HantaTrack | Real-Time Hantavirus Intelligence",
    description: "Live hantavirus monitoring dashboard with real-source ingestion, AI analysis, and travel risk updates.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: update layout with fonts, meta tags, theme import"
```

---

### Task 4: Update Dashboard Component with Buy Me Coffee

**Files:**
- Modify: `src/components/dashboard.tsx`

- [ ] **Step 1: Read current dashboard**

Read full file content at `/Users/suhayl/Downloads/Hantavirus-monitor/src/components/dashboard.tsx`

- [ ] **Step 2: Update dashboard.tsx with new styling classes and Buy Me Coffee**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { computeKpis } from "@/lib/reports/report-analytics";
import { filterReports, sortReports, type ReportFilters, type SortMode } from "@/lib/reports/report-filters";
import { normalizeReports } from "@/lib/reports/report-normalization";
import type { DashboardPayload, SignalReport } from "@/lib/reports/types";
import { AlertBar, CommandHeader, DashboardTabs, EmptyState, FilterSidebar, KpiStrip, SignalDetailPanel } from "./intel/parts";
import { InfoTab } from "./intel/tabs/info-tab";
import { OverviewTab } from "./intel/tabs/overview-tab";
import { SignalFeedTab } from "./intel/tabs/signal-feed-tab";
import { SourcesTab } from "./intel/tabs/sources-tab";
import { TimelineTab } from "./intel/tabs/timeline-tab";
import { TransmissionChainsTab } from "./intel/tabs/transmission-chains-tab";
import { TravelExposureTab } from "./intel/tabs/travel-exposure-tab";
import { WorldMapTab } from "./intel/tabs/world-map-tab";
import type { TimelineMode } from "@/lib/reports/report-timeline-utils";

const baseFilters: ReportFilters = { search: "", statuses: [], severities: [], regions: [], sources: [], credibility: [], dateFrom: "", dateTo: "" };

export function Dashboard() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("World Map");
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("hantatrack_disclaimer_hidden") !== "true";
  });
  const [filters, setFilters] = useState<ReportFilters>(baseFilters);
  const [sort, setSort] = useState<SortMode>("newest");
  const [timelineMode, setTimelineMode] = useState<TimelineMode>("published");
  const [selected, setSelected] = useState<SignalReport | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        if (!response.ok) throw new Error("dashboard fetch failed");
        const payload: DashboardPayload = await response.json();
        if (mounted) setData(payload);
      } catch {
        if (mounted) setError("Unable to load outbreak intelligence data.");
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const reports = useMemo(() => normalizeReports(data?.latest ?? []), [data]);
  const filteredSorted = useMemo(() => sortReports(filterReports(reports, filters), sort), [reports, filters, sort]);
  const kpis = useMemo(() => (data ? computeKpis(reports, data) : null), [reports, data]);

  const selectedIndex = selected ? filteredSorted.findIndex((x) => x.id === selected.id) : -1;
  const onPrev = () => selectedIndex > 0 && setSelected(filteredSorted[selectedIndex - 1]);
  const onNext = () => selectedIndex >= 0 && selectedIndex < filteredSorted.length - 1 && setSelected(filteredSorted[selectedIndex + 1]);

  if (error) return <main className="intel-shell"><p>{error}</p></main>;
  if (!data || !kpis) return <main className="intel-shell"><p>Loading monitor data...</p></main>;

  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP;
  const buyMeCoffeeUrl = process.env.NEXT_PUBLIC_BUYMECOFFEE_URL || "https://buymeacoffee.com/suhayl";

  const cards = [
    { label: "Total tracked reports", value: String(kpis.total), note: "historical ingestion" },
    { label: "High/Critical in 14d", value: String(kpis.high14d), note: "monitoring pressure", tone: "warn" },
    { label: "Active source feeds", value: String(kpis.sources), note: "configured ingest feeds" },
    { label: "Countries represented", value: String(kpis.countries), note: "current report coverage" },
    { label: "New reports in 24h", value: String(kpis.new24h), note: "recent activity window" },
    { label: "Travel-linked signals", value: String(kpis.travelRelated), note: "possible exposure context", tone: "warn" },
    { label: "Confirmed vs Monitoring", value: `${kpis.confirmed}/${kpis.monitoring}`, note: "status heuristic" },
    { label: "Latest sync", value: kpis.latestSync ? new Date(kpis.latestSync).toLocaleTimeString() : "-", note: "periodic refresh" },
  ];

  return (
    <main className="intel-shell">
      <AlertBar lastSyncAt={kpis.latestSync} sourceCount={kpis.sources} onDisclaimer={() => setShowDisclaimer(true)} />
      
      {/* Header with Buy Me Coffee */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">📡</div>
          <div>
            <div className="brand-title">HANTATRACK</div>
            <div className="brand-subtitle">Real-Time Hantavirus Intelligence</div>
          </div>
        </div>
        
        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className={`live-pill ${kpis.latestSync ? "" : "is-stale"}`}>
            <i />
            {kpis.latestSync ? "LIVE" : "STALE"}
          </span>
          <a href={buyMeCoffeeUrl} target="_blank" rel="noopener noreferrer" className="btn-coffee">
            ☕ Buy Me Coffee
          </a>
        </div>
      </header>

      <KpiStrip cards={cards} />
      <DashboardTabs value={tab} onChange={setTab} />

      <section className="workspace">
        <FilterSidebar filters={filters} setFilters={setFilters} reports={filteredSorted} onPick={setSelected} />
        <div className="content">
          {data.degraded && data.warning ? <EmptyState title="Degraded mode" description={data.warning} /> : null}
          {adsenseClient && adsenseSlot ? (
            <section className="intel-panel">
              <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} crossOrigin="anonymous" />
              <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={adsenseClient} data-ad-slot={adsenseSlot} data-ad-format="auto" data-full-width-responsive="true" />
            </section>
          ) : null}
          {tab === "Overview" ? <OverviewTab reports={filteredSorted} onOpen={setSelected} /> : null}
          {tab === "World Map" ? <WorldMapTab reports={filteredSorted} onSelectCountry={(country) => setFilters({ ...filters, search: country })} /> : null}
          {tab === "Signal Feed" ? <SignalFeedTab reports={filteredSorted} sort={sort} setSort={setSort} onOpen={setSelected} /> : null}
          {tab === "Transmission Chains" ? <TransmissionChainsTab reports={filteredSorted} onOpen={setSelected} /> : null}
          {tab === "Timeline" ? <TimelineTab reports={filteredSorted} mode={timelineMode} setMode={setTimelineMode} onOpen={setSelected} /> : null}
          {tab === "Travel Exposure" ? <TravelExposureTab reports={filteredSorted} onOpen={setSelected} /> : null}
          {tab === "Sources" ? <SourcesTab reports={filteredSorted} /> : null}
          {tab === "Info" ? <InfoTab lastSyncAt={kpis.latestSync} /> : null}
        </div>
        <SignalDetailPanel report={selected} onClose={() => setSelected(null)} onPrev={onPrev} onNext={onNext} />
      </section>

      {showDisclaimer ? (
        <div className="disclaimer-overlay">
          <div className="disclaimer-modal">
            <h2>Disclaimer</h2>
            <p>This dashboard aggregates public signals and reports. It may be incomplete, inaccurate, delayed, or duplicated.</p>
            <p>Users should verify critical information with official public health authorities. This is not medical advice.</p>
            <ul>
              <li>WHO: who.int</li>
              <li>CDC: cdc.gov</li>
              <li>ECDC: ecdc.europa.eu</li>
            </ul>
            <button onClick={() => { window.localStorage.setItem("hantatrack_disclaimer_hidden", "true"); setShowDisclaimer(false); }}>Acknowledge</button>
          </div>
        </div>
      ) : null}

      <footer className="footer mono">
        HantaTrack | Public-source intelligence | Refreshed periodically | Build {new Date().toISOString().slice(0, 10)}
      </footer>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard.tsx
git commit -m "feat: add Buy Me Coffee button and header to dashboard"
```

---

### Task 5: Update Parts.tsx with Modern Styling

**Files:**
- Modify: `src/components/intel/parts.tsx`

- [ ] **Step 1: Update CommandHeader with gradient brand**

```tsx
export function CommandHeader({ lastSyncAt, sourceCount }: { lastSyncAt: string | null; sourceCount: number }) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  const ageMin = lastSyncAt ? Math.floor((nowMs - new Date(lastSyncAt).getTime()) / 60000) : null;
  const status = ageMin == null ? "STALE" : ageMin <= 15 ? "LIVE INGESTION" : ageMin <= 60 ? "SYNCED" : "STALE";
  return (
    <div className="cmd-header" style={{
      background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7))",
      border: "1px solid rgba(148, 163, 184, 0.15)",
      borderRadius: "14px",
      padding: "20px",
      marginBottom: "16px"
    }}>
      <div>
        <p className="eyebrow" style={{ color: "#38bdf8" }}>HantaTrack</p>
        <h1 style={{ 
          fontSize: "24px", 
          fontWeight: "700",
          background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>Global Hantavirus Signal Intelligence</h1>
      </div>
      <div className="cmd-meta" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <span className={`live-pill ${status === "STALE" ? "is-stale" : ""}`}>
          <i />
          {status}
        </span>
        <span className="mono" style={{ fontSize: "11px", color: "#94a3b8" }}>Railway cron ingestion</span>
        <span className="mono" style={{ fontSize: "11px", color: "#94a3b8" }}>Active feeds: {sourceCount}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update KpiStrip with modern card styling**

```tsx
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
            background: "rgba(30, 41, 59, 0.6)",
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
            color: card.tone === "warn" ? "#f97316" : "#38bdf8"
          }}>{card.value}</h2>
          <small style={{ color: "#64748b", fontSize: "10px" }}>{card.note}</small>
        </article>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Update DashboardTabs with modern styling**

```tsx
export function DashboardTabs({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const tabs = ["Overview", "World Map", "Signal Feed", "Transmission Chains", "Timeline", "Travel Exposure", "Sources", "Info"];
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
          key={tab} 
          className={value === tab ? "active" : ""} 
          onClick={() => onChange(tab)}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "500",
            color: value === tab ? "#38bdf8" : "#94a3b8",
            background: value === tab ? "rgba(14, 165, 233, 0.15)" : "transparent",
            border: value === tab ? "1px solid rgba(14, 165, 233, 0.4)" : "1px solid transparent",
            transition: "all 0.2s",
            whiteSpace: "nowrap"
          }}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/intel/parts.tsx
git commit -m "feat: modernize header, KPIs, and tabs with high-tech styling"
```

---

### Task 6: Update globals.css with Enhanced Theme Variables

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add new color variables to existing CSS**

Add at the top of the file (after existing :root block):

```css
/* Additional theme variables for high-tech dark */
:root {
  --bg-deep: #0a0f1a;
  --glass-bg: rgba(30, 41, 59, 0.6);
  --glass-border: rgba(148, 163, 184, 0.15);
  --accent-cyan-soft: #38bdf8;
  --accent-purple: #8b5cf6;
  --text-primary: #f1f5f9;
  --text-faint: #64748b;
  --shadow-glow-cyan: 0 0 20px rgba(14, 165, 233, 0.3);
}
```

- [ ] **Step 2: Update panel styles for glass morphism**

Modify `.intel-panel` class:

```css
.intel-panel {
  padding: 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 14px;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: enhance CSS variables and panel styling"
```

---

### Task 7: Verify Build and Run

**Files:**
- No file changes

- [ ] **Step 1: Run type check**

```bash
npm run build 2>&1 | head -50
```

Expected: Build succeeds or shows specific errors to fix.

- [ ] **Step 2: Start dev server and verify**

```bash
npm run dev &
sleep 5
curl -s http://localhost:3000 | head -100
```

- [ ] **Step 3: Fix any build errors**

If build fails, read the error output and fix issues in the affected files.

- [ ] **Step 4: Commit final fixes**

```bash
git add -A
git commit -m "fix: resolve build issues"
```

---

## Self-Review

### Spec Coverage
- ✅ High-tech dark theme - Tasks 2, 6
- ✅ Buy Me Coffee integration - Tasks 1, 4
- ✅ Updated fonts (Inter, JetBrains Mono) - Task 3
- ✅ Glass morphism panels - Tasks 2, 5, 6
- ✅ Gradient branding - Tasks 4, 5
- ✅ Google AdSense - Already exists in code
- ✅ Real data ingestion - Already exists in code
- ✅ Railway deployment - Already configured

### Placeholder Scan
- ✅ No TBDs or TODOs
- ✅ All code blocks are complete
- ✅ All commands are exact

### Type Consistency
- ✅ CSS variable names consistent across files
- ✅ Component props unchanged (backward compatible)
- ✅ Env var naming consistent with existing pattern
