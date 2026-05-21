# EpiTrace: Outbreak Intelligence Dashboard - Setup Guide

## Overview

EpiTrace is a real-time outbreak monitoring dashboard that aggregates public-source disease signals from RSS feeds, news APIs, and official health authority websites. It provides situational awareness for outbreak tracking with AI-assisted analysis.

⚠️ **Important**: This is an **unofficial** tracker, not affiliated with WHO, CDC, or any public health authority.

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Leaflet.js
- **Backend**: Node.js runtime with Next.js API routes
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Google Gemini for signal analysis
- **Deployment**: Railway.app (with scheduled jobs)

## Prerequisites

- Node.js 20.9+ (Next.js requirement)
- PostgreSQL 12+
- Google Gemini API key (free tier available)
- NewsAPI key (optional, for additional sources)

## Installation & Setup

### 1. Clone and Install

```bash
git clone <repo>
cd hantavirus-monitor
npm install
```

### 2. Database Setup

#### Local PostgreSQL

```bash
# Create database
createdb hantavirus_monitor

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/hantavirus_monitor

# Run migrations
npm run db:migrate
```

#### Railway.app Deployment

1. Create a PostgreSQL plugin in Railway
2. Copy the generated DATABASE_URL to your environment variables
3. Deploy (migrations run automatically on service boot)

### 3. Environment Configuration

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - [Get from Google AI Studio](https://aistudio.google.com)
- `CRON_SECRET` - Random secret for scheduled ingestion jobs

**Optional Variables:**
- `NEWS_API_KEY` - [Get from newsapi.org](https://newsapi.org) (adds news sources)
- `SERP_API_KEY` - [Get from serpapi.com](https://serpapi.com) (adds Google News signals)
- `OPENSKY_API_KEY` - OpenSky Network API key (improves flight position accuracy)
- `PGSSLMODE` - Set to `require` if your hosted Postgres requires SSL
- `NEXT_PUBLIC_BUYMECOFFEE_URL` - Your Buy Me Coffee link
- `NEXT_PUBLIC_ADSENSE_CLIENT` / `NEXT_PUBLIC_ADSENSE_SLOT_TOP` - Google AdSense IDs
- `NEXT_PUBLIC_SITE_URL` - Your deployment URL
- `INGEST_AI_ENABLED` / `INGEST_AI_MAX` - Control Gemini enrichment (cost control)
- `INGEST_HTTP_TIMEOUT_MS` - Per-request timeout for external sources
- `DASHBOARD_AUTO_INGEST_ENABLED` - If `true`, dashboard traffic can trigger background ingestion (not recommended with Railway cron)

### 4. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

The dashboard will display "Loading outbreak data..." while fetching data from sources.

### 5. Test Data Ingestion

Trigger a manual data ingestion to populate the database:

```bash
npm run ingest:once
```

This will:
1. Fetch from RSS feeds (WHO, CDC, ECDC, ProMED, etc.)
2. Query NewsAPI for hantavirus-related articles
3. Scrape official outbreak pages
4. Insert curated case data

## Data Pipeline

### Sources

The app ingests from multiple sources with credibility scoring:

| Source | Credibility | Type |
|--------|-------------|------|
| WHO | 98 | Official |
| CDC | 96 | Official |
| ECDC | 94 | Official |
| ProMED | 92 | Professional |
| Reuters | 92 | Media |
| BBC | 88 | Media |
| Google News | 80 | Aggregator |
| NewsAPI | 75 | Aggregator |

### Report Normalization

Raw database records are normalized to `SignalReport` type with:
- **Severity detection** - Critical/High/Medium/Low based on content analysis
- **Status classification** - Confirmed/Monitoring/Symptomatic/Asymptomatic/Recovered/Deceased
- **Travel linking** - Keyword-based detection of travel-related signals
- **Credibility bucketing** - Verified/Reliable/Corroborate/Low/Unrated
- **Tag extraction** - Outbreak/Travel/Airline/Advisory type tags

## Features

### Dashboards & Views

1. **Overview** - Global signal map with latest high-priority reports
2. **World Map** - Geographic heat map of signal distribution
3. **Signal Feed** - Chronological stream with sorting options
4. **Transmission Chains** - Signal relationship network visualization
5. **Timeline** - Date-based signal timeline
6. **Travel Exposure** - Travel-linked signal monitoring
7. **Sources** - Source credibility and activity dashboard
8. **Info** - Documentation and data source references

### Filtering & Search

- **Search** - Full-text search across title, summary, source, country
- **Severity** - Critical/High/Medium/Low filter
- **Status** - Confirmed/Monitoring/Symptomatic/Asymptomatic/Recovered/Deceased
- **Region** - Geographic region filtering
- **Source Type** - Official/Aggregator/Media/Local Authority
- **Credibility** - Verified/Reliable/Corroborate/Low/Unrated
- **Date Range** - Published date filtering

### Signal Details

Click any signal card to open the detail panel with:
- Full metadata display
- Source credibility score
- Raw signal JSON
- Direct links to source articles
- Navigation between related signals

## API Endpoints

### GET /api/dashboard

Returns normalized dashboard data:

```json
{
  "stats": {
    "totalTrackedReports": 127,
    "highSeverityLast14Days": 8,
    "activeSources": 9,
    "lastSyncAt": "2026-05-11T15:30:00Z"
  },
  "latest": [
    {
      "id": "HT-0001",
      "title": "MV Hondius Hantavirus Outbreak...",
      "source": "WHO Disease Outbreak News",
      "severity": "critical",
      "status": "confirmed",
      "country": "Global",
      "publishedAt": "2026-05-07T00:00:00Z",
      ...
    }
  ],
  "trend": [
    { "day": "2026-05-05", "cases": 5 },
    { "day": "2026-05-06", "cases": 8 }
  ],
  "geo": [
    { "country": "United States", "reports": 12 },
    { "country": "Spain", "reports": 8 }
  ]
}
```

### Scheduled Ingestion (Railway)

Recommended: use a dedicated Railway cron service that runs ingestion on a schedule (Option A).

```
Schedule: every 12 hours (Railway cron)
Command: npm run ingest:once
```

Notes:
- `/api/ingest` still exists (secured by `CRON_SECRET`) if you prefer HTTP-triggered ingestion.
- `/api/dashboard` request-triggered ingestion is disabled by default to avoid unnecessary API usage; enable with `DASHBOARD_AUTO_INGEST_ENABLED=true` only if you do not have cron configured.

The job will automatically:
- Fetch from all configured sources
- Deduplicate by URL
- Normalize and score signals
- Insert into database
- Clean up old data (>30 days)

## Deployment

### Railway.app

1. Connect GitHub repository
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy
5. Configure scheduled job for periodic ingestion

### Docker

```bash
docker build -t epitrace .
docker run -p 3000:3000 \
  -e DATABASE_URL=... \
  -e GEMINI_API_KEY=... \
  epitrace
```

### Vercel

```bash
vercel env add DATABASE_URL
vercel env add GEMINI_API_KEY
vercel deploy
```

Note: Scheduled ingestion jobs require a separate cron service (Use Railway for both hosting + cron).

## Development

### File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── dashboard/        # Main dashboard API
│   │   ├── health/           # Health check
│   │   └── ingest/           # Manual ingestion
│   ├── globals.css           # Global styling
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── dashboard.tsx         # Main dashboard orchestrator
│   └── intel/
│       ├── parts.tsx         # Reusable components
│       ├── badges.tsx        # Status/severity badges
│       ├── theme.css         # Component styling
│       └── tabs/
│           ├── overview-tab.tsx
│           ├── world-map-tab.tsx
│           ├── signal-feed-tab.tsx
│           ├── transmission-chains-tab.tsx
│           ├── timeline-tab.tsx
│           ├── travel-exposure-tab.tsx
│           ├── sources-tab.tsx
│           └── info-tab.tsx
└── lib/
    ├── db.ts                 # Database connection
    ├── ingest.ts             # Data ingestion pipeline
    ├── reports/
    │   ├── types.ts          # Type definitions
    │   ├── report-normalization.ts
    │   ├── report-filters.ts
    │   ├── report-analytics.ts
    │   ├── report-timeline-utils.ts
    │   └── report-map-utils.ts
    └── run-ingest.ts         # Ingestion CLI

db/
├── schema.ts                 # Drizzle ORM schema
├── migrate.ts                # Migration runner
```

### Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
npm run ingest:once  # One-time data ingestion
npm run lint         # Run ESLint
```

## Troubleshooting

### "Loading outbreak data..." persists

1. Check browser console for errors
2. Verify `/api/dashboard` returns data: `curl http://localhost:3000/api/dashboard`
3. Check DATABASE_URL is correct and database is running
4. Run migrations: `npm run db:migrate`
5. Trigger ingestion: `npm run ingest:once`

### Database connection errors

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check migrations
npm run db:migrate
```

### No data after ingestion

1. Verify `GEMINI_API_KEY` is set correctly
2. Check `NEWS_API_KEY` is optional (app works without it)
3. Review console logs during ingestion
4. Verify database table exists: `SELECT * FROM monitor_items LIMIT 1`

## Performance & Limits

- **Max reports per dashboard load**: 50 (configurable)
- **Data retention**: 30 days auto-cleanup
- **Ingestion frequency**: Recommended every 6 hours
- **API response time**: <500ms typical

## Monitoring

Check the `/api/health` endpoint for status:

```bash
curl http://localhost:3000/api/health
```

Last sync time displayed in the dashboard indicates when ingestion last ran.

## Legal & Attribution

- **Unofficial**: Not affiliated with WHO, CDC, or ECDC
- **Data Sources**: Public RSS feeds and official websites
- **AI Analysis**: Google Gemini for signal classification
- **Database**: PostgreSQL with Drizzle ORM
- **License**: ISC

## Support

For issues or questions:
1. Check the Info tab in the dashboard
2. Review official sources: WHO, CDC, ECDC
3. Submit issues to the repository

---

**Happy tracking! 📡**
