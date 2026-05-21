# EVDTrack (Next.js + Railway)

Production-grade Ebola virus disease (EVD) monitor with:
- real feed ingestion (RSS/news sources),
- PostgreSQL persistence,
- optional AI risk note enrichment,
- source credibility scoring per publisher,
- country map visualization of report concentration,
- dashboard API + polished UI,
- scheduled ingest via Railway cron service (recommended).

## Why migrate from `monitor.html`

Your current `monitor.html` is a static mock. It has no:
- persistent DB,
- scheduled ingestion,
- authenticated backend,
- real source collection pipeline.

This repo now has all of those in Next.js.

## Local setup

1. Install deps:
```bash
npm install
```

2. Add env:
```bash
cp .env.example .env
```

3. Generate + run DB migration:
```bash
npm run db:generate
npm run db:migrate
```

4. Start app:
```bash
npm run dev
```

5. Seed first ingest:
```bash
npm run ingest:once
```

## Railway deployment

1. Create Railway project from this repo (GitHub-connected deploys).
2. Add PostgreSQL service.
3. Set environment variables listed below.
4. Deploy. On boot, the service will wait for DB, run migrations, then start.
5. Create a dedicated Railway cron service (Option A): schedule every 12 hours, start command `npm run ingest:once`.

## Required `.env` variables

- `DATABASE_URL`: Railway Postgres URL
- `CRON_SECRET`: shared secret for `/api/ingest` (only needed if you use HTTP-triggered ingestion)

## Optional `.env` variables

- `GEMINI_API_KEY`: enables AI risk note enrichment
- `GEMINI_MODEL`: defaults to `gemini-2.5-flash`
- `SERP_API_KEY`: enables SerpAPI Google News ingestion
- `NEWS_API_KEY`: enables NewsAPI ingestion
- `OPENSKY_API_KEY`: improves flight position accuracy
- `INGEST_AI_ENABLED` / `INGEST_AI_MAX`: cost control for AI enrichment
- `DASHBOARD_AUTO_INGEST_ENABLED`: if true, dashboard traffic can trigger background ingestion (default false)
- `NEXT_PUBLIC_ADSENSE_CLIENT`: Google AdSense publisher ID
- `NEXT_PUBLIC_ADSENSE_SLOT_TOP`: top banner ad slot ID
- `NEXT_PUBLIC_SITE_URL`: canonical app URL

## APIs

- `GET /api/health` health check
- `GET /api/dashboard` UI data payload
- `POST /api/ingest` ingestion trigger (requires `x-cron-key`)
- `GET /api/pipeline/status` last job + snapshot status
- `GET /api/snapshots/countries` latest materialized country stats
- `GET /api/snapshots/timeline` latest materialized timeline

## Ingestion pipeline (v2)

The scheduled job (`npm run ingest:once`) now:
- pulls high-reliability sources (WHO DON API, CDC pages, CDC NNDSS weekly, ECDC CDTR RSS, ProMED RSS),
- persists every pull to `raw_documents` (ETag/If-Modified-Since supported),
- deduplicates into `documents` and extracts basic `events`,
- rebuilds snapshot tables (`snapshot_stats`, `snapshot_country_stats`, `snapshot_timeline`) for fast reads.
