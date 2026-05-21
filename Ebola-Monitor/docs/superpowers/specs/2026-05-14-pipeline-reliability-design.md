# Pipeline Reliability Overhaul

**Date:** 2026-05-14
**Status:** Approved
**Goal:** Make the data ingestion pipeline resilient, observable, and cost-effective. Fix critical bugs, add retry/circuit-breaker logic, improve data quality, and reduce Gemini costs.

---

## 1. Reliability Layer

### 1a. Retry with exponential backoff

Add `fetchWithRetry(url, opts, maxRetries=3)` wrapper around existing `fetchWithTimeout`.

- Retries on network errors and 5xx responses only
- Backoff: 1s, 2s, 4s (doubles each retry)
- 4xx responses are NOT retried (client errors are permanent)
- Each retry logs the attempt number and delay

### 1b. Circuit breaker per source

Track consecutive failures per source key (e.g., "RSS:Google News", "Scrape:WHO").

- After 3 consecutive failures, mark source as "open" for 30 minutes
- During open window, skip the source entirely (no HTTP call)
- Log when circuit opens: `[Ingest:CB] Circuit OPEN for RSS:Google News (3 failures)`
- Log when circuit closes: `[Ingest:CB] Circuit CLOSED for RSS:Google News`
- Reset failure count on successful fetch

### 1c. Structured logging

Replace bare `console.log` with contextual logging:

- Per-source: `[Ingest:RSS] Fetched 12 signals from Google News`
- Per-phase: `[Ingest:Phase] Starting RSS fetch...`
- Errors: `[Ingest:Error] RSS:Google News failed: timeout (attempt 2/3)`
- Summary: `[Ingest:Done] 47 inserted, 3 errors, 2 sources circuit-broken, took 23s`

### 1d. Job timeout

Wrap `ingestFeeds()` in a top-level timeout (default 5 minutes, configurable via `INGEST_JOB_TIMEOUT_MS`).

- If exceeded, log partial results and return what we have
- Prevents hung ingestion from blocking Railway cron

---

## 2. Data Quality Fixes

### 2a. Better title deduplication

Replace 80-char prefix approach with:

1. Lowercase
2. Strip all non-alphanumeric characters
3. Collapse whitespace
4. Remove stop words: "the", "a", "an", "in", "on", "at", "of", "for", "to", "and", "or"
5. Use first 120 chars after normalization as dedup key
6. Use a Map for O(1) lookup

### 2b. Safer case inference

Fix `inferCases()` false positives:

- Only match numbers 1-9999 (hantavirus outbreaks don't exceed 10k)
- Require "hantavirus" or "andes virus" in the same sentence
- Skip matches that look like phone numbers (10+ digits, no space separators)

### 2c. Safer country inference

Fix `inferCountry()` false positives:

- Move "usa" and "united states" regex checks BEFORE substring matching
- Add word-boundary check for short names ("us", "uk") using `/\bus\b/` not just `includes("us")`
- Test against: "focused", "based", "used", "results"

### 2d. Improved junk filter

Expand `JUNK_PATTERNS` to catch:

- Auto-generated pages: "page not found", "404", "redirect", "access denied"
- Social media fragments: "upvote", "downvote", "comment", "share", "like"
- Navigation elements: "menu", "sidebar", "footer", "skip to content"
- Generic health pages: "health topics", "sign up", "newsletter"

---

## 3. Performance Fixes

### 3a. Batch DB inserts

Replace individual `db.insert(monitorItems).values(...)` in a loop with single batch:

```typescript
await db.insert(monitorItems).values(
  signals.map(s => ({
    title: s.title.slice(0, 300),
    source: s.source,
    url: s.url,
    // ... all fields
  }))
);
```

Configurable batch size via `INGEST_BATCH_SIZE` (default 50).

### 3b. Parallel AI enrichment

Process up to 3 Gemini calls concurrently (configurable via `INGEST_AI_CONCURRENCY`):

```typescript
const batches = chunk(signalsToEnrich, 3);
for (const batch of batches) {
  await Promise.all(batch.map(s => enrichWithGemini(s.title, s.summary)));
}
```

### 3c. Parallel source fetching

In `ingestFeeds()`, fetch all sources in parallel (currently sequential):

```typescript
const [rssSignals, newsApiSignals, serpApiSignals, redditSignals, scrapedSignals] =
  await Promise.all([
    fetchFromRssFeeds(),
    fetchFromNewsApi(),
    fetchFromSerpApi(),
    fetchFromReddit(),
    scrapeOfficialPages(),
  ]);
```

This is already done in `fetchLiveFeedSnapshot()` but not in the main ingestion path.

---

## 4. Bug Fixes

### 4a. Dead code path (lines 1040-1041)

The `return` at line 1038 makes lines 1040-1041 unreachable.

**Fix:** Remove the dead code. Keep the return that includes error count:

```typescript
console.log(`[Ingest] Done: ${inserted} inserted, ${errors} errors from ${uniqueSignals.length} signals`);
return { inserted, total: uniqueSignals.length, errors };
```

### 4b. Recursive ingestion loop

`fetchDashboardData()` at line 1088 calls `ingestFeeds()` if DB is empty, then recursively calls itself. If ingestion fails, this loops forever.

**Fix:** Add a module-level flag `ingestionTriggered` to prevent recursive calls:

```typescript
let ingestionTriggered = false;

// In fetchDashboardData():
if ((totalItems[0]?.value ?? 0) === 0 && !ingestionTriggered) {
  ingestionTriggered = true;
  console.log("[Dashboard] DB empty, triggering ingestion...");
  await ingestFeeds();
  return fetchDashboardData();
}
```

### 4c. Unprotected core queries

The core queries (totalItems, highSeverityCount, lastRunItems) are not wrapped in try/catch. If `monitorItems` table doesn't exist, the function crashes.

**Fix:** Wrap all DB queries in try/catch with appropriate fallbacks:

```typescript
let totalItems = [{ value: 0 }];
let highSeverityCount = [{ value: 0 }];
let lastRunItems = [];
try {
  [totalItems, highSeverityCount, lastRunItems] = await Promise.all([...]);
} catch (e) {
  console.error("[Dashboard] Core queries failed:", e);
  // Return degraded response
}
```

---

## 5. Testing Strategy

### 5a. Unit tests for inference functions

File: `src/lib/__tests__/infer.test.ts`

Test `detectSeverity`, `inferCases`, `inferCountry`, `inferRegion`, `isHantavirusRelated`, `scoreSourceCredibility` with:
- Known inputs/outputs from real data
- Edge cases (empty strings, very long text)
- False positive cases (phone numbers, "us" in words)

### 5b. Unit tests for dedup logic

File: `src/lib/__tests__/dedup.test.ts`

Test URL dedup and title dedup with:
- Identical URLs
- Same article from different sources
- Similar titles with different wording
- Titles that differ only in punctuation
- Stop word removal

### 5c. Integration test for ingestion flow

File: `src/lib/__tests__/ingest.test.ts`

Mock external HTTP calls and verify:
- All sources are called
- Dedup removes duplicates
- AI enrichment runs on new signals only
- Circuit breaker opens after failures
- Batch inserts happen correctly
- Job timeout works

---

## 6. Config & Model Switch

### 6a. New environment variables

```env
# Pipeline reliability
INGEST_MAX_RETRIES=3
INGEST_CIRCUIT_BREAKER_THRESHOLD=3
INGEST_CIRCUIT_BREAKER_COOLDOWN_MS=1800000
INGEST_JOB_TIMEOUT_MS=300000
INGEST_BATCH_SIZE=50
INGEST_AI_CONCURRENCY=3
```

### 6b. Gemini model switch

- Default model: `gemini-3.1-flash-lite` (was `gemini-2.5-flash`)
- Update in `.env.example` and fallback in `enrichWithGemini()`
- Faster response, lower cost, sufficient for 1-2 sentence risk notes

### 6c. No schema changes

Database schema stays exactly as-is. No migrations needed.

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/ingest.ts` | Modify | Reliability layer, bug fixes, performance, data quality |
| `src/lib/__tests__/infer.test.ts` | Create | Unit tests for inference functions |
| `src/lib/__tests__/dedup.test.ts` | Create | Unit tests for dedup logic |
| `src/lib/__tests__/ingest.test.ts` | Create | Integration tests |
| `.env.example` | Modify | Add new env vars, update Gemini model |

---

## Success Criteria

1. **Zero silent failures** — every error is logged with context
2. **Dead sources don't waste time** — circuit breaker opens after 3 failures
3. **Ingestion completes in <3 minutes** — parallel fetching + batching
4. **No false positive dedup** — improved normalization catches similar titles
5. **No recursive loops** — DB-empty trigger fires once max
6. **Gemini costs reduced** — flash-lite model + concurrency
7. **Tests pass** — all inference, dedup, and integration tests green
