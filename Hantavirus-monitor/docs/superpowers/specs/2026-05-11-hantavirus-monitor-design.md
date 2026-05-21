# HantaTrack Design Spec

## Overview

High-tech dark themed hantavirus monitoring dashboard with real-time data ingestion, AI-powered analysis, and monetization. Combines general hantavirus monitoring with ability to deep-dive into specific outbreaks.

## Visual Direction

**Theme: High-Tech Dark**

- Background: Dark slate gradients (`#0f172a` → `#1e293b`)
- Accents: Cyan (`#0ea5e9`) to Purple (`#8b5cf6`) gradients
- Typography: Inter for body, JetBrains Mono for data/numbers
- Glass morphism: Semi-transparent panels with subtle borders
- Glowing effects: Box shadows on markers, status indicators
- Status colors: Red (critical), Amber (high), Cyan (moderate), Green (low/recovered)

## Layout Structure

### Header
- Left: Logo + brand name "HANTATRACK" with gradient text
- Center: Stats chips (cases, deaths, countries, sources)
- Right: Live indicator, Buy Me Coffee button

### Sidebar (Left)
- Filter pills: Severity levels, advisory types, sources
- Recent reports list with severity badges
- Source credibility indicators

### Main Content (Tabs)
1. **World Map** - Leaflet.js interactive map with case markers
2. **Transmission Chains** - Cytoscape.js network visualization
3. **Travel Exposure** - Flight tracking, shore stops, repatriation
4. **Timeline** - Gantt-style timeline of events
5. **Info** - About, sources, health guidance

### Footer
- Google AdSense banner
- Disclaimer
- Links

## Data Architecture

### Database Schema (Drizzle ORM + PostgreSQL)

```sql
monitor_items
  - id (serial, PK)
  - title (text)
  - source (text)
  - url (text, unique)
  - published_at (timestamptz)
  - summary (text)
  - severity (text): low | moderate | high | critical
  - region (text)
  - country (text, nullable)
  - inferred_cases (int, nullable)
  - advisory_type (text): news | travel | airline
  - ai_risk_note (text, nullable)
  - ai_confidence (numeric, nullable)
  - created_at (timestamptz)
```

### Ingestion Pipeline (every 5 minutes)

**RSS Feeds:**
- Google News (hantavirus search)
- WHO RSS
- Reuters Health
- IATA

**Web Scraping (Cheerio):**
- WHO Disease Outbreak News
- CDC Hantavirus pages
- ECDC news

**AI Enrichment (Google Gemini):**
- Risk assessment per item
- Confidence scoring
- Enabled only when `GEMINI_API_KEY` is set

## Monetization

### Google AdSense
- Banner ad in header area (responsive auto)
- Config via `NEXT_PUBLIC_ADSENSE_CLIENT` and `NEXT_PUBLIC_ADSENSE_SLOT_TOP`

### Buy Me Coffee
- Button in header, links to creator's page
- Config via `NEXT_PUBLIC_BUYMECOFFEE_URL`

## Railway Deployment

- Next.js 16 on Node
- PostgreSQL (Railway managed)
- Cron job: `POST /api/ingest` every 5 minutes with `x-cron-key` header
- Environment variables for DB, secrets, API keys

## File Structure

```
src/
  app/
    layout.tsx          # Root layout with fonts, metadata
    page.tsx            # Dashboard entry
    globals.css         # Tailwind + custom theme CSS
    api/
      dashboard/route.ts   # GET - dashboard data
      health/route.ts      # GET - health check
      ingest/route.ts      # POST - trigger ingestion
  components/
    dashboard.tsx       # Main dashboard shell
    intel/
      parts.tsx         # Shared UI components
      badges.tsx        # Status badges
      tabs/             # Tab components
  lib/
    db.ts               # Drizzle DB client
    ingest.ts           # RSS + scrape + AI pipeline
    reports/            # Report processing utilities
db/
  schema.ts             # Drizzle schema
  migrate.ts            # Migration runner
```

## Key Dependencies

- next, react, react-dom - Framework
- drizzle-orm, pg - Database
- rss-parser - RSS feed parsing
- cheerio - Web scraping
- @google/genai - AI enrichment
- leaflet, d3-geo, topojson-client - Map visualization
- zod - Validation
- clsx - Class utilities
- dayjs - Date handling

## Component Approach

- Client components for interactive tabs (`"use client"`)
- Server-side data fetching in API routes
- Memoized computations for filtered/sorted reports
- Responsive grid layouts
- CSS custom properties for theme colors

## Security

- `CRON_SECRET` for ingestion endpoint auth
- No secrets in client-side code
- URL deduplication via unique index
- Rate limiting via Railway platform

## Success Criteria

1. Dashboard loads within 2 seconds
2. Ingestion runs every 5 minutes successfully
3. AI enrichment gracefully degrades when no API key
4. Mobile responsive layout
5. All filter/sort interactions work smoothly
6. Deployed and accessible on Railway
