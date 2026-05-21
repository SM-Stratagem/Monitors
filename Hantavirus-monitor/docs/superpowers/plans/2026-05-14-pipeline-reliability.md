# Pipeline Reliability Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the data ingestion pipeline resilient, observable, and cost-effective by adding retry/circuit-breaker logic, improving data quality, fixing critical bugs, and reducing Gemini costs.

**Architecture:** Surgical fixes to `src/lib/ingest.ts` — add reliability primitives (retry, circuit breaker, logging, timeout), fix inference functions, improve dedup, batch DB operations, and parallelize source fetching. Add Vitest for unit and integration tests.

**Tech Stack:** TypeScript, Vitest (test framework), PostgreSQL (existing), Gemini API (existing)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `vitest.config.ts` | Create | Vitest configuration |
| `package.json` | Modify | Add vitest devDependency and test script |
| `src/lib/__tests__/infer.test.ts` | Create | Unit tests for inference functions |
| `src/lib/__tests__/dedup.test.ts` | Create | Unit tests for dedup logic |
| `src/lib/__tests__/reliability.test.ts` | Create | Unit tests for retry, circuit breaker, logging |
| `src/lib/__tests__/ingest.test.ts` | Create | Integration tests for full ingestion flow |
| `src/lib/ingest.ts` | Modify | All reliability, quality, performance, and bug fixes |
| `.env.example` | Modify | Add new env vars, update Gemini model |

---

## Task 1: Set Up Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Create Vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/lib/__tests__/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Add test script to package.json**

Add to `scripts` in `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify Vitest runs**

```bash
npx vitest run --reporter=verbose 2>&1 | head -10
```

Expected: Vitest starts, finds 0 tests, exits cleanly

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "chore: add vitest for unit and integration testing"
```

---

## Task 2: Write Inference Function Tests

**Files:**
- Create: `src/lib/__tests__/infer.test.ts`

- [ ] **Step 1: Write failing tests for `detectSeverity`**

Create `src/lib/__tests__/infer.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

// We'll import from ingest.ts after we export these functions
// For now, test the logic directly

describe("detectSeverity", () => {
  // We'll implement detectSeverity as an exported function in Task 4
  // For now, this test documents expected behavior

  it("marks death reports as critical", () => {
    // Will pass once we export detectSeverity
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

```bash
npx vitest run src/lib/__tests__/infer.test.ts
```

Expected: PASS (placeholder test)

- [ ] **Step 3: Commit**

```bash
git add src/lib/__tests__/infer.test.ts
git commit -m "test: add inference test skeleton"
```

---

## Task 3: Export Inference Functions from ingest.ts

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Add export keywords to inference functions**

In `src/lib/ingest.ts`, change these function declarations from `function` to `export function`:

- Line 207: `function detectSeverity(` → `export function detectSeverity(`
- Line 231: `function inferCases(` → `export function inferCases(`
- Line 245: `function inferCountry(` → `export function inferCountry(`
- Line 305: `function inferRegion(` → `export function inferRegion(`
- Line 327: `function isHantavirusRelated(` → `export function isHantavirusRelated(`
- Line 315: `function scoreSourceCredibility(` → `export function scoreSourceCredibility(`

Also export the `fetchWithTimeout` function:

- Line 28: `async function fetchWithTimeout(` → `export async function fetchWithTimeout(`

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors (existing errors are ok)

- [ ] **Step 3: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "refactor: export inference functions for testing"
```

---

## Task 4: Write Comprehensive Inference Tests

**Files:**
- Modify: `src/lib/__tests__/infer.test.ts`

- [ ] **Step 1: Write complete inference tests**

Replace `src/lib/__tests__/infer.test.ts` with:

```typescript
import { describe, it, expect } from "vitest";
import {
  detectSeverity,
  inferCases,
  inferCountry,
  inferRegion,
  isHantavirusRelated,
  scoreSourceCredibility,
} from "@/lib/ingest";

describe("detectSeverity", () => {
  it("returns critical for death reports with hantavirus", () => {
    expect(detectSeverity("3 deaths from hantavirus outbreak")).toBe("critical");
  });

  it("returns critical for fatality reports", () => {
    expect(detectSeverity("Hantavirus fatality confirmed in Chile")).toBe("critical");
  });

  it("returns critical for outbreak declared", () => {
    expect(detectSeverity("WHO declares hantavirus outbreak")).toBe("critical");
  });

  it("returns critical for biocontainment mentions", () => {
    expect(detectSeverity("Patient moved to biocontainment unit")).toBe("critical");
  });

  it("returns high for confirmed cases", () => {
    expect(detectSeverity("5 confirmed hantavirus cases reported")).toBe("high");
  });

  it("returns high for hospitalization", () => {
    expect(detectSeverity("Patient hospitalized with hantavirus infection")).toBe("high");
  });

  it("returns high for evacuation", () => {
    expect(detectSeverity("Evacuation of hantavirus patients underway")).toBe("high");
  });

  it("returns high for travel advisory", () => {
    expect(detectSeverity("Travel advisory issued for hantavirus")).toBe("high");
  });

  it("returns moderate for monitoring", () => {
    expect(detectSeverity("Authorities monitoring hantavirus situation")).toBe("moderate");
  });

  it("returns moderate for investigation", () => {
    expect(detectSeverity("Investigating possible hantavirus case")).toBe("moderate");
  });

  it("returns moderate for generic hantavirus mention", () => {
    expect(detectSeverity("New research on hantavirus transmission")).toBe("moderate");
  });

  it("returns low for non-hantavirus content", () => {
    expect(detectSeverity("Weather update for South America")).toBe("low");
  });

  it("does not mark non-fatal numbers as critical", () => {
    expect(detectSeverity("Hantavirus vaccine shows promise in 50 patients")).not.toBe("critical");
  });
});

describe("inferCases", () => {
  it("extracts case count from standard phrasing", () => {
    expect(inferCases("12 confirmed cases of hantavirus")).toBe(12);
  });

  it("extracts case count with patients keyword", () => {
    expect(inferCases("5 patients infected with hantavirus")).toBe(5);
  });

  it("extracts case count with confirmed prefix", () => {
    expect(inferCases("confirmed: 8 cases")).toBe(8);
  });

  it("returns null for no match", () => {
    expect(inferCases("No hantavirus cases reported")).toBeNull();
  });

  it("ignores numbers over 9999 (noise)", () => {
    expect(inferCases("12345 cases reported worldwide")).toBeNull();
  });

  it("ignores phone-number-like patterns", () => {
    expect(inferCases("Call 5551234567 for information")).toBeNull();
  });
});

describe("inferCountry", () => {
  it("detects Argentina", () => {
    expect(inferCountry("Hantavirus outbreak in Argentina")).toBe("Argentina");
  });

  it("detects Chile", () => {
    expect(inferCountry("Cases reported in Chile")).toBe("Chile");
  });

  it("detects United States from 'usa'", () => {
    expect(inferCountry("CDC issues guidance for USA travelers")).toBe("United States");
  });

  it("detects United States from 'united states'", () => {
    expect(inferCountry("Cases in the United States")).toBe("United States");
  });

  it("does not match 'us' inside words", () => {
    expect(inferCountry("Research focused on hantavirus")).toBeNull();
  });

  it("detects cities", () => {
    expect(inferCountry("Outbreak reported in Buenos Aires")).toBe("Argentina");
  });

  it("returns null for short text", () => {
    expect(inferCountry("Short")).toBeNull();
  });
});

describe("inferRegion", () => {
  it("returns North America for US", () => {
    expect(inferRegion("United States")).toBe("North America");
  });

  it("returns South America for Argentina", () => {
    expect(inferRegion("Argentina")).toBe("South America");
  });

  it("returns Europe for UK", () => {
    expect(inferRegion("United Kingdom")).toBe("Europe");
  });

  it("returns Global for null", () => {
    expect(inferRegion(null)).toBe("Global");
  });
});

describe("isHantavirusRelated", () => {
  it("returns true for hantavirus", () => {
    expect(isHantavirusRelated("New hantavirus cases")).toBe(true);
  });

  it("returns true for andes virus", () => {
    expect(isHantavirusRelated("Andes virus outbreak")).toBe(true);
  });

  it("returns true for hemorrhagic fever", () => {
    expect(isHantavirusRelated("Hemorrhagic fever cases rise")).toBe(true);
  });

  it("returns true for rodent-borne", () => {
    expect(isHantavirusRelated("Rodent-borne illness spreads")).toBe(true);
  });

  it("returns false for unrelated content", () => {
    expect(isHantavirusRelated("Weather update for Europe")).toBe(false);
  });
});

describe("scoreSourceCredibility", () => {
  it("returns 98 for WHO", () => {
    expect(scoreSourceCredibility("WHO Disease Outbreak News")).toBe(98);
  });

  it("returns 96 for CDC", () => {
    expect(scoreSourceCredibility("CDC Health Alert")).toBe(96);
  });

  it("returns 92 for Reuters", () => {
    expect(scoreSourceCredibility("Reuters Health")).toBe(92);
  });

  it("returns 70 for unknown sources", () => {
    expect(scoreSourceCredibility("Unknown Blog")).toBe(70);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail (functions not yet properly exported/working)**

```bash
npx vitest run src/lib/__tests__/infer.test.ts
```

Expected: Some tests may fail if functions aren't properly exported

- [ ] **Step 3: Fix any import issues and re-run**

```bash
npx vitest run src/lib/__tests__/infer.test.ts
```

Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/__tests__/infer.test.ts src/lib/ingest.ts
git commit -m "test: add comprehensive inference function tests"
```

---

## Task 5: Write Dedup Tests

**Files:**
- Create: `src/lib/__tests__/dedup.test.ts`

- [ ] **Step 1: Write dedup test skeleton**

Create `src/lib/__tests__/dedup.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

// We'll test the dedup logic after implementing it in Task 8

describe("title normalization", () => {
  it("lowercases and strips punctuation", () => {
    // Will test normalizeTitle() once implemented
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/__tests__/dedup.test.ts
git commit -m "test: add dedup test skeleton"
```

---

## Task 6: Add Retry with Backoff

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Add fetchWithRetry function**

In `src/lib/ingest.ts`, add after the `fetchWithTimeout` function (around line 36):

```typescript
export async function fetchWithRetry(
  input: string,
  init: RequestInit = {},
  maxRetries = envInt("INGEST_MAX_RETRIES", 3),
  timeoutMs = 12_000,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetchWithTimeout(input, init, timeoutMs);

      // Don't retry client errors (4xx)
      if (res.status >= 400 && res.status < 500) {
        return res;
      }

      // Don't retry successful responses
      if (res.ok) {
        return res;
      }

      // Retry on 5xx
      lastError = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));

      // Don't retry on abort (timeout) for first attempt
      if (attempt === 0 && lastError.name === "AbortError") {
        throw lastError;
      }
    }

    // If we have more retries, wait with exponential backoff
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      console.log(`[Ingest:Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "feat: add fetchWithRetry with exponential backoff"
```

---

## Task 7: Add Circuit Breaker

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Add CircuitBreaker class**

In `src/lib/ingest.ts`, add after the `fetchWithRetry` function:

```typescript
class CircuitBreaker {
  private failures = new Map<string, number>();
  private openUntil = new Map<string, number>();

  constructor(
    private threshold = envInt("INGEST_CIRCUIT_BREAKER_THRESHOLD", 3),
    private cooldownMs = envInt("INGEST_CIRCUIT_BREAKER_COOLDOWN_MS", 30 * 60 * 1000),
  ) {}

  isOpen(key: string): boolean {
    const until = this.openUntil.get(key);
    if (until && Date.now() < until) {
      return true;
    }
    if (until && Date.now() >= until) {
      // Cooldown expired, close the circuit
      this.openUntil.delete(key);
      this.failures.delete(key);
      console.log(`[Ingest:CB] Circuit CLOSED for ${key}`);
      return false;
    }
    return false;
  }

  recordSuccess(key: string): void {
    this.failures.delete(key);
    this.openUntil.delete(key);
  }

  recordFailure(key: string): void {
    const count = (this.failures.get(key) || 0) + 1;
    this.failures.set(key, count);

    if (count >= this.threshold) {
      this.openUntil.set(key, Date.now() + this.cooldownMs);
      console.log(`[Ingest:CB] Circuit OPEN for ${key} (${count} failures)`);
    }
  }

  getStatus(): { open: string[]; closed: string[] } {
    const open: string[] = [];
    const closed: string[] = [];
    const now = Date.now();

    for (const [key, until] of this.openUntil) {
      if (now < until) {
        open.push(key);
      } else {
        closed.push(key);
      }
    }

    return { open, closed };
  }
}

const circuitBreaker = new CircuitBreaker();
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "feat: add CircuitBreaker class for source failure tracking"
```

---

## Task 8: Add Structured Logging

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Add logger utility**

In `src/lib/ingest.ts`, add after the CircuitBreaker class:

```typescript
type LogPrefix = string;

function createLogger(prefix: LogPrefix) {
  return {
    info: (msg: string) => console.log(`[${prefix}] ${msg}`),
    warn: (msg: string) => console.warn(`[${prefix}] ${msg}`),
    error: (msg: string) => console.error(`[${prefix}] ${msg}`),
  };
}

const log = createLogger("Ingest");
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "feat: add structured logging utility"
```

---

## Task 9: Add Job Timeout

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Add withTimeout utility**

In `src/lib/ingest.ts`, add after the logger:

```typescript
async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Timeout: ${label} exceeded ${ms}ms`)), ms);
  });

  try {
    const result = await Promise.race([promise, timeout]);
    clearTimeout(timeoutId!);
    return result;
  } catch (e) {
    clearTimeout(timeoutId!);
    throw e;
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "feat: add withTimeout utility for job-level timeouts"
```

---

## Task 10: Fix Bug — Dead Code Path

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Remove dead code at lines 1040-1041**

In `src/lib/ingest.ts`, find the `ingestFeeds` function's return statement. It currently looks like:

```typescript
  console.log(`[Ingest] Inserted ${inserted} new items from ${uniqueSignals.length} unique signals`);
  return { inserted, total: uniqueSignals.length };

  console.log(`[Ingest] Inserted ${inserted} new items (errors=${errors})`);
  return { inserted, total: uniqueSignals.length, errors };
```

Replace with:

```typescript
  log.info(`Done: ${inserted} inserted, ${errors} errors from ${uniqueSignals.length} signals`);
  return { inserted, total: uniqueSignals.length, errors };
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "fix: remove dead code path in ingestFeeds return"
```

---

## Task 11: Fix Bug — Recursive Ingestion Loop

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Add ingestionTriggered flag**

In `src/lib/ingest.ts`, add near the top of the file (after imports):

```typescript
let ingestionTriggered = false;
```

- [ ] **Step 2: Update fetchDashboardData to use the flag**

In `src/lib/ingest.ts`, find the section in `fetchDashboardData` that checks if DB is empty (around line 1086):

```typescript
    // If DB is empty, trigger ingestion
    if ((totalItems[0]?.value ?? 0) === 0) {
      console.log("[Dashboard] DB empty, triggering ingestion...");
      await ingestFeeds();
      return fetchDashboardData();
    }
```

Replace with:

```typescript
    // If DB is empty, trigger ingestion (once only)
    if ((totalItems[0]?.value ?? 0) === 0 && !ingestionTriggered) {
      ingestionTriggered = true;
      log.info("DB empty, triggering initial ingestion...");
      try {
        await ingestFeeds();
        return fetchDashboardData();
      } catch (e) {
        log.error(`Initial ingestion failed: ${e instanceof Error ? e.message : e}`);
        return {
          stats: { totalTrackedReports: 0, highSeverityLast14Days: 0, activeSources: 0, lastSyncAt: null, flightCount: 0, caseCount: 0 },
          trend: [],
          latest: [],
          geo: [],
          ship: null,
          quarantine: [],
        };
      }
    }
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "fix: prevent recursive ingestion loop when DB is empty"
```

---

## Task 12: Fix Bug — Unprotected Core Queries

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Wrap core queries in try/catch**

In `src/lib/ingest.ts`, find the core queries in `fetchDashboardData` (around line 1053):

```typescript
    // Core query — always works if monitor_items exists
    const [totalItems, highSeverityCount, lastRunItems] = await Promise.all([
      db.select({ value: count() }).from(monitorItems),
      db.select({ value: count() }).from(monitorItems).where(
        and(gte(monitorItems.publishedAt, last14), sql`${monitorItems.severity} in ('high', 'critical')`)
      ),
      db.select().from(monitorItems).orderBy(desc(monitorItems.publishedAt)).limit(50),
    ]);
```

Replace with:

```typescript
    // Core query — wrapped in try/catch for resilience
    let totalItems = [{ value: 0 }];
    let highSeverityCount = [{ value: 0 }];
    let lastRunItems: any[] = [];
    try {
      [totalItems, highSeverityCount, lastRunItems] = await Promise.all([
        db.select({ value: count() }).from(monitorItems),
        db.select({ value: count() }).from(monitorItems).where(
          and(gte(monitorItems.publishedAt, last14), sql`${monitorItems.severity} in ('high', 'critical')`)
        ),
        db.select().from(monitorItems).orderBy(desc(monitorItems.publishedAt)).limit(50),
      ]);
    } catch (e) {
      log.error(`Core queries failed: ${e instanceof Error ? e.message : e}`);
    }
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "fix: wrap core dashboard queries in try/catch"
```

---

## Task 13: Improve Data Quality — Better Dedup

**Files:**
- Modify: `src/lib/ingest.ts`
- Modify: `src/lib/__tests__/dedup.test.ts`

- [ ] **Step 1: Add normalizeTitle function**

In `src/lib/ingest.ts`, add after the logger:

```typescript
const STOP_WORDS = new Set(["the", "a", "an", "in", "on", "at", "of", "for", "to", "and", "or"]);

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => !STOP_WORDS.has(w))
    .join(" ")
    .slice(0, 120);
}
```

- [ ] **Step 2: Write comprehensive dedup tests**

Replace `src/lib/__tests__/dedup.test.ts` with:

```typescript
import { describe, it, expect } from "vitest";
import { normalizeTitle } from "@/lib/ingest";

describe("normalizeTitle", () => {
  it("lowercases the title", () => {
    expect(normalizeTitle("HANTAVIRUS Outbreak")).toBe("hantavirus outbreak");
  });

  it("strips punctuation", () => {
    expect(normalizeTitle("Hantavirus: outbreak confirmed!")).toBe("hantavirus outbreak confirmed");
  });

  it("collapses whitespace", () => {
    expect(normalizeTitle("Hantavirus   outbreak   confirmed")).toBe("hantavirus outbreak confirmed");
  });

  it("removes stop words", () => {
    expect(normalizeTitle("The hantavirus in the Americas")).toBe("hantavirus americas");
  });

  it("truncates to 120 chars", () => {
    const long = "A".repeat(200);
    expect(normalizeTitle(long).length).toBe(120);
  });

  it("handles empty string", () => {
    expect(normalizeTitle("")).toBe("");
  });

  it("normalizes similar titles to same key", () => {
    const t1 = normalizeTitle("WHO Reports 5 Hantavirus Cases in Chile");
    const t2 = normalizeTitle("WHO: 5 Hantavirus Cases Reported in Chile");
    expect(t1).toBe(t2);
  });

  it("differentiates truly different titles", () => {
    const t1 = normalizeTitle("Hantavirus Cases Rise in Argentina");
    const t2 = normalizeTitle("Hantavirus Deaths Reported in Chile");
    expect(t1).not.toBe(t2);
  });
});
```

- [ ] **Step 3: Run dedup tests**

```bash
npx vitest run src/lib/__tests__/dedup.test.ts
```

Expected: All tests PASS

- [ ] **Step 4: Update dedup logic in ingestFeeds**

In `src/lib/ingest.ts`, find the title dedup section in `ingestFeeds` (around line 971):

```typescript
  // De-duplicate by similar titles (keep the one with highest credibility)
  const titleSeen = new Map<string, number>();
  const uniqueSignals = urlDeduped.filter((s) => {
    const normalized = s.title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
    const key = normalized.slice(0, 80); // first 80 chars as dedup key
    const existingScore = titleSeen.get(key) ?? 0;
    const thisScore = s.credibility ?? 70;
    if (existingScore >= thisScore) return false;
    titleSeen.set(key, thisScore);
    return true;
  });
```

Replace with:

```typescript
  // De-duplicate by similar titles (keep the one with highest credibility)
  const titleSeen = new Map<string, number>();
  const uniqueSignals = urlDeduped.filter((s) => {
    const key = normalizeTitle(s.title);
    if (!key) return true;
    const existingScore = titleSeen.get(key) ?? 0;
    const thisScore = s.credibility ?? 70;
    if (existingScore >= thisScore) return false;
    titleSeen.set(key, thisScore);
    return true;
  });
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/ingest.ts src/lib/__tests__/dedup.test.ts
git commit -m "feat: improve title dedup with normalization and stop word removal"
```

---

## Task 14: Improve Data Quality — Safer Inference

**Files:**
- Modify: `src/lib/ingest.ts`
- Modify: `src/lib/__tests__/infer.test.ts`

- [ ] **Step 1: Update inferCases to reject large numbers**

In `src/lib/ingest.ts`, update the `inferCases` function to add a sanity check after the pattern matching:

```typescript
function inferCases(text: string): number | null {
  const patterns = [
    /\b(\d{1,4})\s+(?:confirmed\s+)?(?:cases|case|patients|infections|infected)\b/i,
    /\b(\d{1,4})\s+(?:people|persons?)\s+(?:infected|affected|sick)\b/i,
    /confirmed[:\s]+(\d+)/i,
    /total[:\s]+(\d+)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const num = Number(match[1]);
      // Sanity check: hantavirus outbreaks don't exceed 10k cases
      if (num > 0 && num <= 9999) return num;
    }
  }
  return null;
}
```

- [ ] **Step 2: Update inferCountry to fix false positives**

In `src/lib/ingest.ts`, update the `inferCountry` function to move regex checks before substring matching:

```typescript
function inferCountry(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.length < 30) return null;

  // Check regex patterns first (before substring matching)
  if (/\busa\b/.test(lower)) return "United States";
  if (/\bunited states\b/.test(lower)) return "United States";

  const COUNTRY_MAP: Record<string, string> = {
    "argentina": "Argentina", "chile": "Chile", "brazil": "Brazil",
    "united kingdom": "United Kingdom", "britain": "United Kingdom", "british": "United Kingdom",
    "spain": "Spain", "french": "France", "france": "France",
    "germany": "Germany", "dutch": "Netherlands", "netherlands": "Netherlands",
    "canada": "Canada", "australia": "Australia", "norway": "Norway",
    "ireland": "Ireland", "turkey": "Turkey", "italy": "Italy",
    "new zealand": "New Zealand", "japan": "Japan", "south korea": "South Korea",
    "china": "China", "mongolia": "Mongolia", "russia": "Russia",
    "finland": "Finland", "sweden": "Sweden", "denmark": "Denmark",
    "colombia": "Colombia", "peru": "Peru", "bolivia": "Bolivia",
    "mexico": "Mexico", "philippines": "Philippines", "malaysia": "Malaysia",
    "indonesia": "Indonesia", "thailand": "Thailand",
    "south africa": "South Africa", "israel": "Israel", "lebanon": "Lebanon",
    "tristan da cunha": "United Kingdom", "saint helena": "United Kingdom",
    "tenerife": "Spain", "granadilla": "Spain",
    "johannesburg": "South Africa", "cape town": "South Africa",
    "omaha": "United States", "nebraska": "United States",
    "paris": "France", "london": "United Kingdom", "madrid": "Spain",
    "amsterdam": "Netherlands", "berlin": "Germany", "rome": "Italy",
    "tokyo": "Japan", "beijing": "China", "seoul": "South Korea",
    "moscow": "Russia", "ankara": "Turkey",
    "vienna": "Austria", "warsaw": "Poland", "prague": "Czech Republic",
    "lisbon": "Portugal", "budapest": "Hungary", "zagreb": "Croatia",
    "helsinki": "Finland", "stockholm": "Sweden", "oslo": "Norway",
    "copenhagen": "Denmark", "bratislava": "Slovakia",
    "bucharest": "Romania", "sofia": "Bulgaria",
    "hondius": "International Waters", "mv hondius": "International Waters",
    "south atlantic": "International Waters", "cruise ship": "International Waters",
    "manila": "Philippines", "jakarta": "Indonesia", "bangkok": "Thailand",
    "kuala lumpur": "Malaysia", "hanoi": "Vietnam",
    "lagos": "Nigeria", "nairobi": "Kenya", "cairo": "Egypt",
    "bogota": "Colombia", "lima": "Peru", "santiago": "Chile",
    "buenos aires": "Argentina", "mendoza": "Argentina",
    "mexico city": "Mexico", "guatemala": "Guatemala", "panama": "Panama",
    "sydney": "Australia", "melbourne": "Australia", "wellington": "New Zealand",
    "edinburgh": "United Kingdom", "manchester": "United Kingdom",
    "bagotville": "Canada", "saguenay": "Canada", "quebec": "Canada",
    "eindhoven": "Netherlands",
    "torrejón": "Spain", "le bourget": "France",
    "nebraska biocontainment": "United States",
  };

  // Check longest matches first
  for (const [key, value] of Object.entries(COUNTRY_MAP).sort((a, b) => b[0].length - a[0].length)) {
    if (lower.includes(key)) return value;
  }

  return null;
}
```

- [ ] **Step 3: Update junk filter**

In `src/lib/ingest.ts`, find the `JUNK_PATTERNS` constant (around line 958) and expand it:

```typescript
  const JUNK_PATTERNS = /skip to main|read more|click here|privacy policy|terms of|cookie|Eastern Mediterranean|Mental disorders|Welcome to the|Health topics|Sign up|Subscribe|Log in|Newsletter|Advertise|page not found|404|redirect|access denied|upvote|downvote|share this|like this|menu|sidebar|footer|skip to content|navigation/i;
```

- [ ] **Step 4: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/ingest.ts src/lib/__tests__/infer.test.ts
git commit -m "feat: improve inference safety and junk filter"
```

---

## Task 15: Performance — Parallel Source Fetching

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Parallelize source fetching in ingestFeeds**

In `src/lib/ingest.ts`, find the sequential source fetching in `ingestFeeds` (around line 890):

```typescript
  // 1. Fetch from RSS feeds
  console.log("[Ingest] Fetching RSS feeds...");
  const rssSignals = await fetchFromRssFeeds();
  console.log(`[Ingest] Got ${rssSignals.length} signals from RSS`);

  // 2. Fetch from NewsAPI
  console.log("[Ingest] Fetching NewsAPI...");
  const newsApiSignals = await fetchFromNewsApi();
  console.log(`[Ingest] Got ${newsApiSignals.length} signals from NewsAPI`);

  // 2b. Fetch from SerpAPI Google News
  console.log("[Ingest] Fetching SerpAPI Google News...");
  const serpApiSignals = await fetchFromSerpApi();
  console.log(`[Ingest] Got ${serpApiSignals.length} signals from SerpAPI`);

  // 2c. Fetch from Reddit
  console.log("[Ingest] Fetching Reddit...");
  const redditSignals = await fetchFromReddit();
  console.log(`[Ingest] Got ${redditSignals.length} signals from Reddit`);

  // 3. Scrape official pages
  console.log("[Ingest] Scraping official pages...");
  const scrapedSignals = await scrapeOfficialPages();
  console.log(`[Ingest] Got ${scrapedSignals.length} signals from scraping`);
```

Replace with:

```typescript
  // Fetch all sources in parallel
  log.info("Fetching all sources in parallel...");
  const [rssSignals, newsApiSignals, serpApiSignals, redditSignals, scrapedSignals] =
    await Promise.all([
      fetchFromRssFeeds().catch((e) => { log.error(`RSS failed: ${e.message}`); return []; }),
      fetchFromNewsApi().catch((e) => { log.error(`NewsAPI failed: ${e.message}`); return []; }),
      fetchFromSerpApi().catch((e) => { log.error(`SerpAPI failed: ${e.message}`); return []; }),
      fetchFromReddit().catch((e) => { log.error(`Reddit failed: ${e.message}`); return []; }),
      scrapeOfficialPages().catch((e) => { log.error(`Scraping failed: ${e.message}`); return []; }),
    ]);

  log.info(`RSS: ${rssSignals.length}, NewsAPI: ${newsApiSignals.length}, SerpAPI: ${serpApiSignals.length}, Reddit: ${redditSignals.length}, Scraped: ${scrapedSignals.length}`);
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "perf: parallelize source fetching in ingestFeeds"
```

---

## Task 16: Performance — Batch DB Inserts

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Add chunk utility**

In `src/lib/ingest.ts`, add after the `withTimeout` function:

```typescript
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
```

- [ ] **Step 2: Replace individual inserts with batch inserts**

In `src/lib/ingest.ts`, find the individual insert loop in `ingestFeeds` (around line 1011):

```typescript
  // Insert NEW rows
  for (const signal of newSignals) {
    try {
      await db.insert(monitorItems).values({
        title: signal.title.slice(0, 300),
        source: signal.source,
        url: signal.url,
        publishedAt: signal.publishedAt,
        summary: signal.summary.slice(0, 600),
        severity: signal.severity || detectSeverity(signal.title + " " + signal.summary),
        region: signal.region || inferRegion(signal.country || null),
        country: signal.country || null,
        inferredCases: signal.inferredCases || null,
        advisoryType: signal.advisoryType,
        aiRiskNote: (signal as any).aiRiskNote || null,
        aiConfidence: (signal as any).aiConfidence || null,
      });
      inserted += 1;
    } catch {
      errors += 1;
      continue;
    }
  }
```

Replace with:

```typescript
  // Insert NEW rows in batches
  const batchSize = envInt("INGEST_BATCH_SIZE", 50);
  const batches = chunk(newSignals, batchSize);

  for (const batch of batches) {
    try {
      await db.insert(monitorItems).values(
        batch.map((signal) => ({
          title: signal.title.slice(0, 300),
          source: signal.source,
          url: signal.url,
          publishedAt: signal.publishedAt,
          summary: signal.summary.slice(0, 600),
          severity: signal.severity || detectSeverity(signal.title + " " + signal.summary),
          region: signal.region || inferRegion(signal.country || null),
          country: signal.country || null,
          inferredCases: signal.inferredCases || null,
          advisoryType: signal.advisoryType,
          aiRiskNote: (signal as any).aiRiskNote || null,
          aiConfidence: (signal as any).aiConfidence || null,
        }))
      );
      inserted += batch.length;
    } catch (e) {
      log.error(`Batch insert failed: ${e instanceof Error ? e.message : e}`);
      errors += batch.length;
    }
  }
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "perf: batch DB inserts for faster ingestion"
```

---

## Task 17: Performance — Parallel AI Enrichment

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Update AI enrichment to use concurrency**

In `src/lib/ingest.ts`, find the AI enrichment section (around line 1001):

```typescript
    for (const signal of signalsToEnrich) {
      const enriched = await enrichWithGemini(signal.title, signal.summary);
      if (enriched) {
        (signal as any).aiRiskNote = enriched.riskNote;
        (signal as any).aiConfidence = enriched.confidence;
      }
    }
```

Replace with:

```typescript
    const aiConcurrency = envInt("INGEST_AI_CONCURRENCY", 3);
    const aiBatches = chunk(signalsToEnrich, aiConcurrency);

    for (const batch of aiBatches) {
      const results = await Promise.all(
        batch.map(async (signal) => {
          const enriched = await enrichWithGemini(signal.title, signal.summary);
          return { signal, enriched };
        })
      );

      for (const { signal, enriched } of results) {
        if (enriched) {
          (signal as any).aiRiskNote = enriched.riskNote;
          (signal as any).aiConfidence = enriched.confidence;
        }
      }
    }
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "perf: parallelize AI enrichment with configurable concurrency"
```

---

## Task 18: Add Reliability to Source Fetchers

**Files:**
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Update fetchFromRssFeeds to use circuit breaker and retry**

In `src/lib/ingest.ts`, update `fetchFromRssFeeds` to use the circuit breaker:

```typescript
async function fetchFromRssFeeds(): Promise<ScrapedSignal[]> {
  const signals: ScrapedSignal[] = [];
  for (const feed of RSS_FEEDS) {
    const sourceKey = `RSS:${feed.source}`;
    if (circuitBreaker.isOpen(sourceKey)) continue;

    try {
      const data = await parser.parseURL(feed.url);
      circuitBreaker.recordSuccess(sourceKey);
      const items = (data.items ?? []).slice(0, 15);
      for (const item of items) {
        const title = item.title?.trim();
        const itemUrl = item.link?.trim();
        if (!title || !itemUrl) continue;
        const raw = `${title} ${item.contentSnippet ?? ""}`;
        if (!isHantavirusRelated(raw)) continue;
        const country = inferCountry(raw);
        signals.push({
          source: item.creator?.trim() || feed.source,
          title,
          url: itemUrl,
          summary: (item.contentSnippet || item.content || title).replace(/\s+/g, " ").trim().slice(0, 600),
          advisoryType: feed.advisoryType,
          publishedAt: dayjs(item.isoDate ?? item.pubDate ?? new Date()).toDate(),
          country,
          region: inferRegion(country),
          severity: detectSeverity(raw),
          inferredCases: inferCases(raw),
          credibility: feed.credibility,
        });
      }
    } catch {
      circuitBreaker.recordFailure(sourceKey);
    }
  }
  return signals;
}
```

- [ ] **Step 2: Update other fetchers similarly**

Apply the same pattern to `fetchFromNewsApi`, `fetchFromSerpApi`, `fetchFromReddit`, and `scrapeOfficialPages` — add circuit breaker checks at the start and record successes/failures.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/ingest.ts
git commit -m "feat: add circuit breaker to all source fetchers"
```

---

## Task 19: Update Config

**Files:**
- Modify: `.env.example`
- Modify: `src/lib/ingest.ts`

- [ ] **Step 1: Update .env.example**

Add to `.env.example`:

```env
# Pipeline reliability
INGEST_MAX_RETRIES=3
INGEST_CIRCUIT_BREAKER_THRESHOLD=3
INGEST_CIRCUIT_BREAKER_COOLDOWN_MS=1800000
INGEST_JOB_TIMEOUT_MS=300000
INGEST_BATCH_SIZE=50
INGEST_AI_CONCURRENCY=3
```

- [ ] **Step 2: Update Gemini model default**

In `src/lib/ingest.ts`, find the `enrichWithGemini` function and update the model fallback:

```typescript
const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
```

- [ ] **Step 3: Add job timeout wrapper to ingestFeeds**

In `src/lib/ingest.ts`, wrap the main body of `ingestFeeds` with the timeout:

At the start of `ingestFeeds`:

```typescript
export async function ingestFeeds() {
  const jobTimeoutMs = envInt("INGEST_JOB_TIMEOUT_MS", 300_000);

  return withTimeout(ingestFeedsInner(), jobTimeoutMs, "ingestFeeds");
}

async function ingestFeedsInner() {
  const db = getDb();
  let inserted = 0;
  let errors = 0;
  const keepDays = envInt("INGEST_KEEP_DAYS", 30);
  const startTime = Date.now();

  log.info("Starting unified data ingestion...");
  // ... rest of the function
```

At the end of `ingestFeedsInner`, before the final return:

```typescript
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  log.info(`Done: ${inserted} inserted, ${errors} errors from ${uniqueSignals.length} signals (took ${duration}s)`);
  return { inserted, total: uniqueSignals.length, errors };
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors

- [ ] **Step 5: Commit**

```bash
git add .env.example src/lib/ingest.ts
git commit -m "feat: add config vars, switch to gemini-3.1-flash-lite, add job timeout"
```

---

## Task 20: Run All Tests and Verify

**Files:**
- None (verification only)

- [ ] **Step 1: Run all tests**

```bash
npx vitest run --reporter=verbose
```

Expected: All tests PASS

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: No new errors (existing errors are ok)

- [ ] **Step 3: Run lint**

```bash
npm run lint 2>&1 | head -30
```

Expected: No new errors

- [ ] **Step 4: Verify the build works**

```bash
npm run build 2>&1 | tail -20
```

Expected: Build succeeds

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: verify all tests pass and build succeeds"
```

---

## Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Set up Vitest | `vitest.config.ts`, `package.json` |
| 2-3 | Export inference functions | `src/lib/ingest.ts` |
| 4 | Write inference tests | `src/lib/__tests__/infer.test.ts` |
| 5 | Write dedup test skeleton | `src/lib/__tests__/dedup.test.ts` |
| 6 | Add retry with backoff | `src/lib/ingest.ts` |
| 7 | Add circuit breaker | `src/lib/ingest.ts` |
| 8 | Add structured logging | `src/lib/ingest.ts` |
| 9 | Add job timeout | `src/lib/ingest.ts` |
| 10 | Fix dead code path | `src/lib/ingest.ts` |
| 11 | Fix recursive ingestion | `src/lib/ingest.ts` |
| 12 | Fix unprotected queries | `src/lib/ingest.ts` |
| 13 | Better dedup | `src/lib/ingest.ts`, `src/lib/__tests__/dedup.test.ts` |
| 14 | Safer inference | `src/lib/ingest.ts`, `src/lib/__tests__/infer.test.ts` |
| 15 | Parallel source fetching | `src/lib/ingest.ts` |
| 16 | Batch DB inserts | `src/lib/ingest.ts` |
| 17 | Parallel AI enrichment | `src/lib/ingest.ts` |
| 18 | Circuit breaker in fetchers | `src/lib/ingest.ts` |
| 19 | Config & model switch | `.env.example`, `src/lib/ingest.ts` |
| 20 | Verify everything works | None |
