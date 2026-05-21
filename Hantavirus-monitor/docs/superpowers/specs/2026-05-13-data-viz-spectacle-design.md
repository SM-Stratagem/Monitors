# Data-Viz Spectacle: Full Spectrum Visual Upgrade

**Date:** 2026-05-13
**Status:** Draft
**Goal:** Transform the Hantavirus Monitor dashboard into a visually stunning data-viz spectacle — animated counters, self-drawing charts, glowing map markers, severity-reactive UI, and smooth transitions.

---

## 1. Animated Stat Counters

**What:** Every numeric stat chip in the header animates from 0 to its value on mount.

**Where:** `src/components/dashboard.tsx` — stat chips (Reports, High/Critical, Flights, Case records)

**Behavior:**
- Numbers count up over ~1.2s with ease-out curve
- Subtle glow effect (text-shadow) that peaks at ~40% through the animation then fades
- Stat chip border flashes briefly on mount (opacity pulse)
- Numbers that are 0 stay at 0, no animation

**Implementation:**
- Custom `useCountUp(targetValue, duration)` hook
- Uses `requestAnimationFrame` for smooth counting
- CSS `text-shadow` transition for glow

---

## 2. Sparklines in Overview Stat Cards

**What:** Dashboard overview stat cards get mini line charts (sparklines) showing trend data.

**Where:** `src/components/tabs/dashboard-overview.tsx` — stat cards section

**Behavior:**
- Each stat card shows a small (80x30px) SVG sparkline
- Sparkline draws itself on mount (stroke-dashoffset animation)
- Uses the existing neon color palette for the line color
- 7 data points derived from the `cases` array: group cases by date, count per day, take last 7 days
- If fewer than 7 days of data, remaining points are 0

**Implementation:**
- Inline SVG with `path` element
- CSS `stroke-dasharray` + `stroke-dashoffset` animation
- Data: `cases.reduce((acc, c) => { const d = c.date || c.reportedAt; acc[d] = (acc[d]||0)+1; return acc; }, {})` then slice last 7 entries

---

## 3. Self-Drawing Severity Bar Chart

**What:** A new animated bar chart in the dashboard overview showing severity distribution.

**Where:** `src/components/tabs/dashboard-overview.tsx` — new panel below stats grid

**Behavior:**
- Horizontal bars for each severity level (critical, high, moderate, low)
- Bars animate from width 0 to their target width, staggered by 100ms each
- Bar fill has a subtle glow (box-shadow)
- Labels and counts fade in after bars complete

**Implementation:**
- Pure CSS/SVG bar chart (no D3 dependency needed for this)
- CSS `width` transition with `animation-delay` for stagger
- Bar colors match existing severity palette

---

## 4. Map Glow System

**What:** Enhanced visual effects on the Leaflet map markers and paths.

**Where:** `src/components/tabs/dashboard-overview.tsx` (hero map) and `src/components/tabs/world-map.tsx`

### 4a. Pulsing Markers
- Each marker pulses with its severity color
- CSS `@keyframes` animation on the marker div
- Pulse rate: critical = 1.2s, high = 1.8s, moderate = 2.5s, low = 3s

### 4b. Radiating Rings (Critical Only)
- Critical markers emit expanding transparent rings (sonar ping effect)
- Rings expand from marker center, fade out over 3s
- Max 2 visible rings at a time
- Implemented via duplicate div icons with CSS animation

### 4c. Flight Path Animation
- Flight paths use animated `stroke-dashoffset` on Leaflet's SVG `<path>` elements
- Leaflet renders polylines as SVG paths — we target them via `.leaflet-interactive` class
- Dashes appear to travel along the route direction by animating `stroke-dashoffset` from full length to 0
- CSS: `@keyframes dashTravel { to { stroke-dashoffset: 0; } }`
- Path color matches flight status (cyan for active, amber for departed, green for arrived)

### 4d. Staggered Marker Entrance
- Markers fade in with a 50ms delay between each
- Creates a cascade effect when map loads
- Implemented via `setTimeout` in marker creation loop

---

## 5. Severity-Reactive Card Borders

**What:** Cards across all tabs glow based on their highest-severity content.

**Where:** All tab components (case cards, news cards, flight cards, etc.)

**Behavior:**
- Card `border-color` and `box-shadow` are set dynamically based on max severity
- Critical → red glow (`rgba(255,23,68,0.4)`)
- High → amber glow (`rgba(255,102,0,0.3)`)
- Moderate → yellow glow (`rgba(255,215,0,0.25)`)
- Low → cyan glow (`rgba(49,215,255,0.2)`)
- On hover, glow intensifies by 20% opacity
- New data triggers a brief pulse animation on the border

**Implementation:**
- CSS custom property `--card-glow` set per card
- `.card-glow-critical`, `.card-glow-high`, etc. utility classes
- CSS `transition` on `box-shadow` and `border-color`

---

## 6. Smooth Tab Transitions

**What:** Tab content fades and slides when switching between tabs.

**Where:** `src/components/dashboard.tsx` — tab content wrapper

**Behavior:**
- Outgoing tab content fades out (opacity 1→0, 100ms)
- Incoming tab content fades in + slides up slightly (opacity 0→1, translateY 8px→0, 200ms)
- Total transition time: ~200ms, no jank

**Implementation:**
- CSS class `.tab-enter` with animation
- React state manages transition phase
- `onAnimationEnd` cleans up

---

## 7. Staggered Card List Animations

**What:** Cards in list views (news, cases, flights, reddit) animate in with staggered delays.

**Where:** All tab components with card lists

**Behavior:**
- Each card slides up + fades in
- Stagger: 50ms between cards, max 10 cards animated
- Creates a cascade/waterfall effect

**Implementation:**
- CSS animation `slideInUp` with `animation-delay: calc(var(--i) * 50ms)`
- Set `--i` index via inline style

---

## 8. Enhanced Loading Spinner

**What:** Replace plain spinner with a glowing radar sweep.

**Where:** `src/app/globals.css` — `.loading-spinner`

**Behavior:**
- Circular radar sweep (conic-gradient rotating)
- Glowing cyan trail
- More dramatic than plain border spinner

**Implementation:**
- CSS `conic-gradient` + `@keyframes rotate`
- `filter: drop-shadow` for glow

---

## 9. Button Micro-Interactions

**What:** Buttons get scale + glow effects on hover.

**Where:** All buttons across the app

**Behavior:**
- Scale 1.0 → 1.03 on hover (200ms)
- Subtle glow appears behind button on hover
- Active state: scale 0.97

**Implementation:**
- CSS `transition: transform 0.2s, box-shadow 0.2s`
- `.btn-hover-glow` utility class

---

## 10. Git Safety

**Revert strategy:**
- All changes isolated in a single feature branch: `feat/data-viz-spectacle`
- If anything breaks, `git checkout main` restores the working state
- Each major section (counters, charts, map glow, etc.) can be reverted independently via individual commits

---

## Technical Notes

- **No new npm dependencies** — all effects use CSS animations, SVG, and React state
- **Performance:** All animations use `transform` and `opacity` (GPU-composited properties)
- **Accessibility:** `prefers-reduced-motion` media query disables animations for users who request it
- **Mobile:** Animations are lighter on mobile (fewer particles, simpler effects)

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/dashboard.tsx` | Animated counters, tab transitions, enhanced loading |
| `src/components/tabs/dashboard-overview.tsx` | Sparklines, severity bar chart, map glow system |
| `src/components/tabs/world-map.tsx` | Map glow system (markers, rings, flight paths) |
| `src/components/tabs/case-tracker.tsx` | Card glow, staggered animations |
| `src/components/tabs/news-feed.tsx` | Card glow, staggered animations |
| `src/components/tabs/flight-tracker.tsx` | Card glow, staggered animations |
| `src/components/tabs/reddit-feed.tsx` | Card glow, staggered animations |
| `src/components/tabs/ship-deck.tsx` | Card glow |
| `src/components/tabs/quarantine-countdown.tsx` | Card glow |
| `src/components/tabs/timeline.tsx` | Card glow |
| `src/components/tabs/disease-info.tsx` | Card glow |
| `src/app/globals.css` | All new CSS animations, utility classes, sparkline styles |
| `src/hooks/useCountUp.ts` | New — count-up animation hook |
