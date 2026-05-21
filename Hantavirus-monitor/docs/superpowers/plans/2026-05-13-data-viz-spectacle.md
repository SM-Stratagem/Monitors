# Data-Viz Spectacle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Hantavirus Monitor dashboard into a visually stunning data-viz spectacle with animated counters, sparklines, severity charts, map glow effects, card animations, and smooth transitions.

**Architecture:** Pure CSS animations + React hooks for counters. No new npm dependencies. All effects use GPU-composited properties (transform, opacity). Branch: `feat/data-viz-spectacle`.

**Tech Stack:** React 19, CSS animations, SVG sparklines, Leaflet (existing)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/hooks/useCountUp.ts` | Create | Count-up animation hook |
| `src/app/globals.css` | Modify | All new CSS animations, utility classes |
| `src/components/dashboard.tsx` | Modify | Animated counters, tab transitions, loading spinner |
| `src/components/tabs/dashboard-overview.tsx` | Modify | Sparklines, severity bar chart, map glow |
| `src/components/tabs/news-feed.tsx` | Modify | Staggered card animations, card glow |
| `src/components/tabs/case-tracker.tsx` | Modify | Staggered card animations, card glow |
| `src/components/tabs/flight-tracker.tsx` | Modify | Staggered card animations, card glow |
| `src/components/tabs/reddit-feed.tsx` | Modify | Staggered card animations, card glow |

---

## Task 1: Create `useCountUp` Hook

**Files:**
- Create: `src/hooks/useCountUp.ts`

- [ ] **Step 1: Create the hook file**

```typescript
"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }

    let start: number | null = null;
    let raf: number;

    function tick(now: number) {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
```

- [ ] **Step 2: Verify hook compiles**

Run: `npx tsc --noEmit src/hooks/useCountUp.ts 2>&1 | head -5`
Expected: No errors or only unrelated errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCountUp.ts
git commit -m "feat: add useCountUp hook for animated number counters"
```

---

## Task 2: Add CSS Animations to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append animation keyframes and utility classes at the end of globals.css**

Add the following block after the last line of the existing CSS:

```css
/* ===== DATA-VIZ SPECTACLE ANIMATIONS ===== */

/* Count-up glow */
@keyframes countGlow {
  0% { text-shadow: 0 0 0 transparent; }
  40% { text-shadow: 0 0 12px currentColor; }
  100% { text-shadow: 0 0 0 transparent; }
}
.count-animate {
  animation: countGlow 1.2s ease-out;
}

/* Stat chip border flash */
@keyframes chipFlash {
  0% { border-color: var(--border); }
  30% { border-color: rgba(22,242,139,0.6); }
  100% { border-color: var(--border); }
}
.chip-flash {
  animation: chipFlash 0.8s ease-out;
}

/* Sparkline draw */
@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}
.sparkline-path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawLine 1.5s ease-out forwards;
}

/* Severity bar grow */
@keyframes barGrow {
  from { width: 0; }
}
.severity-bar-fill {
  animation: barGrow 0.8s ease-out forwards;
}

/* Map marker pulse */
@keyframes markerPulseSlow {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.15); }
}
.marker-pulse-critical { animation: markerPulseSlow 1.2s ease-in-out infinite; }
.marker-pulse-high { animation: markerPulseSlow 1.8s ease-in-out infinite; }
.marker-pulse-moderate { animation: markerPulseSlow 2.5s ease-in-out infinite; }
.marker-pulse-low { animation: markerPulseSlow 3s ease-in-out infinite; }

/* Radiating ring (sonar ping) */
@keyframes sonarPing {
  0% { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(3); opacity: 0; }
}
.sonar-ring {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #FF1744;
  animation: sonarPing 3s ease-out infinite;
  pointer-events: none;
}

/* Card glow by severity */
.card-glow-critical { box-shadow: 0 0 8px rgba(255,23,68,0.35); border-color: rgba(255,23,68,0.4) !important; }
.card-glow-high { box-shadow: 0 0 8px rgba(255,102,0,0.3); border-color: rgba(255,102,0,0.35) !important; }
.card-glow-moderate { box-shadow: 0 0 8px rgba(255,215,0,0.25); border-color: rgba(255,215,0,0.3) !important; }
.card-glow-low { box-shadow: 0 0 8px rgba(49,215,255,0.2); border-color: rgba(49,215,255,0.25) !important; }
.card-glow-critical:hover { box-shadow: 0 0 14px rgba(255,23,68,0.5); }
.card-glow-high:hover { box-shadow: 0 0 14px rgba(255,102,0,0.45); }
.card-glow-moderate:hover { box-shadow: 0 0 14px rgba(255,215,0,0.4); }
.card-glow-low:hover { box-shadow: 0 0 14px rgba(49,215,255,0.35); }

/* Staggered card entrance */
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.stagger-card {
  opacity: 0;
  animation: slideInUp 0.35s ease-out forwards;
  animation-delay: calc(var(--i, 0) * 50ms);
}

/* Tab crossfade */
@keyframes tabFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.tab-enter {
  animation: tabFadeIn 0.2s ease-out;
}

/* Enhanced loading spinner - radar sweep */
.loading-spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0%, rgba(49,215,255,0.8) 25%, transparent 50%);
  animation: spin 1s linear infinite;
  position: relative;
}
.loading-spinner::after {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: var(--bg-primary);
}

/* Button hover glow */
.btn-hover-glow {
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-hover-glow:hover {
  transform: scale(1.03);
  box-shadow: 0 0 12px rgba(49,215,255,0.25);
}
.btn-hover-glow:active {
  transform: scale(0.97);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .count-animate, .chip-flash, .sparkline-path,
  .severity-bar-fill, .marker-pulse-critical,
  .marker-pulse-high, .marker-pulse-moderate,
  .marker-pulse-low, .sonar-ring, .stagger-card,
  .tab-enter, .loading-spinner {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

- [ ] **Step 2: Verify CSS parses**

Run: `npm run build 2>&1 | tail -5`
Expected: Build completes (may have unrelated warnings)

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add data-viz spectacle CSS animations and utilities"
```

---

## Task 3: Animated Counters in Dashboard Header

**Files:**
- Modify: `src/components/dashboard.tsx:144-149` (stat chips)

- [ ] **Step 1: Import useCountUp hook**

In `src/components/dashboard.tsx`, add the import at line 3:

```typescript
import { useCountUp } from "@/hooks/useCountUp";
```

- [ ] **Step 2: Create a StatChip component with animated counter**

Add this component inside `dashboard.tsx` before the `Dashboard` function:

```typescript
function StatChip({ label, value, className, title }: { label: string; value: number; className: string; title: string }) {
  const animated = useCountUp(value);
  return (
    <div className={`stat-chip ${className} chip-flash`} title={title}>
      <span className="stat-label">{label}</span>
      <span className="stat-value count-animate">{animated}</span>
    </div>
  );
}
```

- [ ] **Step 3: Replace stat chip divs in JSX**

Replace lines 145-149 (the four stat-chip divs) with:

```tsx
<StatChip label="Reports" value={stats.totalTrackedReports || 0} className="stat-chip--confirmed" title="Total monitored reporting items" />
<StatChip label="High/Critical" value={stats.highSeverityLast14Days || 0} className="stat-chip--high" title="Reports tagged high/critical in last 14 days" />
<StatChip label="Flights" value={stats.flightCount || flights.length} className="stat-chip--flights" title="Tracked flight records" />
<StatChip label="Case records" value={stats.caseCount || cases.length} className="stat-chip--cases" title="Case-record entries" />
```

- [ ] **Step 4: Verify it compiles**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -5`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard.tsx
git commit -m "feat: animate stat counters in dashboard header"
```

---

## Task 4: Animated Loading Spinner

**Files:**
- Modify: `src/components/dashboard.tsx:100-107` (loading screen)

- [ ] **Step 1: Replace the loading spinner JSX**

Replace lines 100-107:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard.tsx
git commit -m "feat: enhance loading spinner with radar sweep effect"
```

---

## Task 5: Tab Crossfade Transitions

**Files:**
- Modify: `src/components/dashboard.tsx:194-210` (tab content area)

- [ ] **Step 1: Add tab transition state**

Inside the `Dashboard` component, add state after the existing `useState` calls (around line 33):

```typescript
const [tabKey, setTabKey] = useState(0);
```

- [ ] **Step 2: Update tab setter to increment key**

Replace the `onClick` handler in the tab nav buttons (line 164):

```tsx
onClick={() => { setTab(t.id); setTabKey(k => k + 1); }}
```

Do the same for the mobile nav buttons (line 181):

```tsx
onClick={() => { setTab(t.id); setTabKey(k => k + 1); }}
```

And the mobile "More" button (line 186):

```tsx
onClick={() => {
  const remaining = TABS.slice(5);
  const currentIdx = remaining.findIndex(t => t.id === tab);
  const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % remaining.length : 0;
  setTab(remaining[nextIdx].id);
  setTabKey(k => k + 1);
}}
```

- [ ] **Step 3: Add tab-enter class to tab content wrapper**

Replace line 195:

```tsx
<Suspense fallback={<div className="tab-loading">Loading...</div>}>
```

with:

```tsx
<Suspense fallback={<div className="tab-loading">Loading...</div>}>
  <div key={tabKey} className="tab-enter">
```

And close the div before `</Suspense>` (after line 210):

```tsx
  </div>
</Suspense>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard.tsx
git commit -m "feat: add smooth crossfade transitions between tabs"
```

---

## Task 6: Sparklines in Dashboard Overview Stat Cards

**Files:**
- Modify: `src/components/tabs/dashboard-overview.tsx` (stat cards section)

- [ ] **Step 1: Create a Sparkline SVG component**

Add this inside `dashboard-overview.tsx` before the `DashboardOverview` function:

```typescript
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 80;
  const h = 28;
  const padding = 2;
  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (w - padding * 2);
    const y = h - padding - (v / max) * (h - padding * 2);
    return `${x},${y}`;
  });
  const pathD = `M${points.join(" L")}`;
  const totalLen = data.length * 12;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sparkline-path"
        style={{ strokeDasharray: totalLen, strokeDashoffset: totalLen }}
      />
    </svg>
  );
}
```

- [ ] **Step 2: Derive sparkline data from cases**

Inside `DashboardOverview`, after the `totalQuarantine` calculation (line 351), add:

```typescript
const caseSparkline = (() => {
  if (!Array.isArray(cases) || cases.length === 0) return [];
  const byDate: Record<string, number> = {};
  for (const c of cases) {
    const d = (c.date || c.reportedAt || "").slice(0, 10);
    if (d) byDate[d] = (byDate[d] || 0) + 1;
  }
  const sorted = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b));
  return sorted.slice(-7).map(([, count]) => count);
})();

const reportSparkline = (() => {
  if (!Array.isArray(latest) || latest.length === 0) return [];
  const byDate: Record<string, number> = {};
  for (const item of latest) {
    const d = (item.publishedAt || "").slice(0, 10);
    if (d) byDate[d] = (byDate[d] || 0) + 1;
  }
  const sorted = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b));
  return sorted.slice(-7).map(([, count]) => count);
})();
```

- [ ] **Step 3: Add sparklines to stat cards**

Replace the stat cards section (lines 355-404) with sparklines added to the first two cards:

```tsx
<div className="overview-stats-grid">
  <div className="overview-stat-card stat-critical" title="Unique news reports from 20+ sources">
    <div className="stat-card-icon">🔴</div>
    <div className="stat-card-content">
      <div className="stat-card-value">{stats.totalTrackedReports || 0}</div>
      <div className="stat-card-label">Reports (deduplicated)</div>
      <Sparkline data={reportSparkline} color="#FF1744" />
      <div className="stat-card-source">20+ sources</div>
    </div>
  </div>
  <div className="overview-stat-card stat-high" title="Reports tagged high or critical severity in the last 14 days">
    <div className="stat-card-icon">🟠</div>
    <div className="stat-card-content">
      <div className="stat-card-value">{stats.highSeverityLast14Days || 0}</div>
      <div className="stat-card-label">High/Critical (14d)</div>
      <div className="stat-card-source">AI-classified severity</div>
    </div>
  </div>
  <div className="overview-stat-card stat-info" title="MV Hondius outbreak cases tracked">
    <div className="stat-card-icon">🔬</div>
    <div className="stat-card-content">
      <div className="stat-card-value">{cases?.length || 0}</div>
      <div className="stat-card-label">Cases Tracked</div>
      <Sparkline data={caseSparkline} color="#31d7ff" />
      <div className="stat-card-source">WHO, CDC, RKI</div>
    </div>
  </div>
  <div className="overview-stat-card stat-info" title="Repatriation flights tracked">
    <div className="stat-card-icon">✈️</div>
    <div className="stat-card-content">
      <div className="stat-card-value">{flights?.length || 0}</div>
      <div className="stat-card-label">Flights Tracked</div>
      <div className="stat-card-source">OpenSky Network</div>
    </div>
  </div>
  <div className="overview-stat-card stat-info" title="Countries with active signals">
    <div className="stat-card-icon">🌍</div>
    <div className="stat-card-content">
      <div className="stat-card-value">{Array.isArray(geo) ? geo.length : 0}</div>
      <div className="stat-card-label">Countries Affected</div>
      <div className="stat-card-source">Geo-tagged feeds</div>
    </div>
  </div>
  <div className="overview-stat-card stat-info" title="Passengers in quarantine">
    <div className="stat-card-icon">🏥</div>
    <div className="stat-card-content">
      <div className="stat-card-value">{totalQuarantine || 0}</div>
      <div className="stat-card-label">In Quarantine</div>
      <div className="stat-card-source">Health authorities</div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/tabs/dashboard-overview.tsx
git commit -m "feat: add animated sparklines to dashboard stat cards"
```

---

## Task 7: Severity Bar Chart in Dashboard Overview

**Files:**
- Modify: `src/components/tabs/dashboard-overview.tsx`

- [ ] **Step 1: Derive severity counts and add bar chart**

After the sparkline data derivation (step 2 above), add a severity bar chart component and data:

```typescript
function SeverityBarChart({ counts }: { counts: Record<string, number> }) {
  const max = Math.max(...Object.values(counts), 1);
  const bars = [
    { label: "Critical", value: counts.critical || 0, color: "#FF1744" },
    { label: "High", value: counts.high || 0, color: "#FF6600" },
    { label: "Moderate", value: counts.moderate || 0, color: "#FFD700" },
    { label: "Low", value: counts.low || 0, color: "#31d7ff" },
  ];

  return (
    <div className="overview-panel">
      <h3>📊 Severity Distribution</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {bars.map((b, i) => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "var(--muted)", minWidth: 70 }}>{b.label}</span>
            <div style={{ flex: 1, height: 8, background: "rgba(49,215,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
              <div
                className="severity-bar-fill"
                style={{
                  height: "100%",
                  width: `${(b.value / max) * 100}%`,
                  background: b.color,
                  borderRadius: 4,
                  boxShadow: `0 0 8px ${b.color}44`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            </div>
            <span style={{ fontSize: 12, fontFamily: "IBM Plex Mono, monospace", color: b.color, minWidth: 30, textAlign: "right" }}>{b.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Compute severity counts**

Inside `DashboardOverview`, add:

```typescript
const severityCounts = (() => {
  const counts: Record<string, number> = {};
  if (Array.isArray(latest)) {
    for (const item of latest) {
      const sev = item.severity || "low";
      counts[sev] = (counts[sev] || 0) + 1;
    }
  }
  return counts;
})();
```

- [ ] **Step 3: Add the chart to the overview layout**

After the `overview-stats-grid` div and before the `dashboard-three-col` div, insert:

```tsx
<SeverityBarChart counts={severityCounts} />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/tabs/dashboard-overview.tsx
git commit -m "feat: add animated severity bar chart to dashboard overview"
```

---

## Task 8: Map Glow Effects (Pulsing Markers, Radiating Rings)

**Files:**
- Modify: `src/components/tabs/dashboard-overview.tsx` (marker creation in useEffect)

- [ ] **Step 1: Replace circleMarker creation with pulsing div icons for cases**

In the useEffect that plots cases (around line 177), replace the `circleMarker` creation with a pulsing `divIcon`:

Replace:
```typescript
const circle = L.circleMarker([lat, lng], {
  radius,
  fillColor: color,
  color: "#fff",
  weight: 1.5,
  opacity: 0.9,
  fillOpacity: 0.75,
}).addTo(layer);
```

With:
```typescript
const pulseClass = c.status === "confirmed" ? "marker-pulse-critical"
  : c.status === "symptomatic" ? "marker-pulse-high"
  : c.status === "asymptomatic" ? "marker-pulse-moderate"
  : "marker-pulse-low";

const markerHtml = `
  <div style="position:relative;">
    <div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color}88;border:2px solid rgba(255,255,255,0.8);"
         class="${pulseClass}"></div>
    ${c.severity === "critical" ? '<div class="sonar-ring" style="position:absolute;top:-3px;left:-3px;"></div>' : ""}
  </div>
`;

const icon = L.divIcon({
  html: markerHtml,
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const circle = L.marker([lat, lng], { icon }).addTo(layer);
```

- [ ] **Step 2: Update the mouseover/mouseout handlers**

Replace:
```typescript
circle.on("mouseover", function(this: any) { this.setStyle({ weight: 3, fillOpacity: 0.9 }); });
circle.on("mouseout", function(this: any) { this.setStyle({ weight: 1.5, fillOpacity: 0.75 }); });
```

With:
```typescript
circle.on("mouseover", function(this: any) {
  const el = this.getElement();
  if (el) el.style.transform += " scale(1.3)";
});
circle.on("mouseout", function(this: any) {
  const el = this.getElement();
  if (el) el.style.transform = el.style.transform.replace(" scale(1.3)", "");
});
```

- [ ] **Step 3: Add staggered marker entrance**

In the same useEffect, wrap the marker creation loops with staggered delays. Replace the case plotting loop start:

```typescript
let markerDelay = 0;
if (Array.isArray(cases)) {
  for (const c of cases) {
    // ... existing marker creation code ...
    setTimeout(() => circle.addTo(layer), markerDelay);
    markerDelay += 50;
  }
}
```

Remove the `.addTo(layer)` from the marker creation line (it's now in the setTimeout).

- [ ] **Step 4: Add flight path animation CSS**

In `src/app/globals.css`, add:

```css
/* Flight path traveling dash animation */
@keyframes dashTravel {
  to { stroke-dashoffset: 0; }
}
.leaflet-interactive {
  animation: dashTravel 3s linear infinite;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/tabs/dashboard-overview.tsx src/app/globals.css
git commit -m "feat: add pulsing markers, sonar rings, staggered entrance, and flight path animation"
```

---

## Task 9: Staggered Card Animations in News Feed

**Files:**
- Modify: `src/components/tabs/news-feed.tsx:87-114` (card rendering)

- [ ] **Step 1: Add stagger animation to news cards**

Replace the card mapping (lines 87-114):

```tsx
filtered.map((item, idx) => (
  <a
    key={item.id}
    href={item.url}
    target="_blank"
    rel="noopener noreferrer"
    className={`news-card stagger-card card-glow-${item.severity}`}
    style={{ "--i": idx } as React.CSSProperties}
  >
    <div className="news-card-top">
      <span className="news-severity" style={{ background: SEV_COLORS[item.severity] || "#666" }}>
        {item.severity}
      </span>
      <span className="news-source">{item.source}</span>
      <span className="news-date">
        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""}
      </span>
    </div>
    <h4 className="news-title">{item.title}</h4>
    <p className="news-summary">{item.summary}</p>
    <div className="news-card-bottom">
      <span className="news-country">{item.country || "Unknown"}</span>
      <span className="news-type">{item.advisoryType}</span>
      {item.aiRiskNote && (
        <span className="news-ai-badge" title={item.aiRiskNote}>AI</span>
      )}
    </div>
  </a>
))
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tabs/news-feed.tsx
git commit -m "feat: add staggered animations and card glow to news feed"
```

---

## Task 10: Staggered Card Animations in Case Tracker

**Files:**
- Modify: `src/components/tabs/case-tracker.tsx`

- [ ] **Step 1: Find the case card rendering and add stagger classes**

In `case-tracker.tsx`, find the `.case-card` elements and add:

```tsx
className={`case-card stagger-card card-glow-${c.status} ${selected?.caseId === c.caseId ? "selected" : ""}`}
style={{ "--i": idx } as React.CSSProperties}
```

where `idx` is the `.map()` index.

- [ ] **Step 2: Commit**

```bash
git add src/components/tabs/case-tracker.tsx
git commit -m "feat: add staggered animations and card glow to case tracker"
```

---

## Task 11: Staggered Card Animations in Flight Tracker

**Files:**
- Modify: `src/components/tabs/flight-tracker.tsx`

- [ ] **Step 1: Find the flight card rendering and add stagger classes**

In `flight-tracker.tsx`, find the `.flight-card` elements and add:

```tsx
className={`flight-card stagger-card ${selected?.flightNumber === f.flightNumber ? "selected" : ""}`}
style={{ "--i": idx } as React.CSSProperties}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tabs/flight-tracker.tsx
git commit -m "feat: add staggered animations to flight tracker cards"
```

---

## Task 12: Staggered Card Animations in Reddit Feed

**Files:**
- Modify: `src/components/tabs/reddit-feed.tsx`

- [ ] **Step 1: Find the reddit card rendering and add stagger classes**

In `reddit-feed.tsx`, find the `.reddit-card` elements and add:

```tsx
className={`reddit-card stagger-card`}
style={{ "--i": idx } as React.CSSProperties}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tabs/reddit-feed.tsx
git commit -m "feat: add staggered animations to reddit feed cards"
```

---

## Task 13: Button Micro-Interactions

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add btn-hover-glow to existing button classes**

Append to globals.css:

```css
.tab-btn, .map-btn, .news-filter-btn, .case-filter-btn, .tl-btn, .reddit-filter-btn {
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s, background 0.2s;
}
.tab-btn:hover, .map-btn:hover, .news-filter-btn:hover, .case-filter-btn:hover, .tl-btn:hover, .reddit-filter-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 0 10px rgba(49,215,255,0.15);
}
.tab-btn:active, .map-btn:active, .news-filter-btn:active, .case-filter-btn:active, .tl-btn:active, .reddit-filter-btn:active {
  transform: scale(0.97);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add button hover micro-interactions"
```

---

## Task 14: Final Verification

- [ ] **Step 1: Run full build**

Run: `npm run build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 2: Run lint**

Run: `npm run lint 2>&1 | tail -10`
Expected: No errors (warnings OK)

- [ ] **Step 3: Manual smoke test**

Run: `npm run dev`
Open http://localhost:3000 and verify:
- Stat counters animate from 0 on load
- Sparklines draw on stat cards
- Severity bar chart animates in
- Map markers pulse with colored glow
- Critical markers have sonar ring effect
- Tab transitions are smooth crossfades
- News cards stagger in on mount
- Card borders glow based on severity
- Loading spinner shows radar sweep
- Buttons scale on hover

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: polish data-viz spectacle effects based on smoke test"
```
