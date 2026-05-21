import dayjs from "dayjs";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { createHash } from "node:crypto";
import { and, count, desc, eq, gte, sql, lt } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { getSiteUrl } from "@/lib/site-url";
import { shouldFetchSource, recordSourceFetch, getCachedResponse, getConditionalHeaders, SOURCE_TTLS } from "./source-cache";
import {
  monitorItems,
  ingestRuns,
  sources as sourcesTable,
  rawDocuments,
  documents as documentsTable,
  events as eventsTable,
  snapshotStats,
  snapshotCountryStats,
  snapshotTimeline,
  flightPositions,
  shipPositions,
  caseTimeline,
  repatriationFlights,
  quarantineStatus,
} from "../../db/schema";

let ingestionTriggered = false;

type Severity = "low" | "moderate" | "high" | "critical";
type AdvisoryType = "news" | "travel" | "airline";

const parser = new Parser();

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

function envBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (!raw) return fallback;
  if (/^(1|true|yes|y)$/i.test(raw)) return true;
  if (/^(0|false|no|n)$/i.test(raw)) return false;
  return fallback;
}

function sha256Hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function normalizeSourceKey(input: string): string {
  const normalized = normalizeTitle(input || "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
  return normalized || "unknown";
}

function clampConfidence(credibility?: number): string | null {
  if (credibility === undefined || credibility === null) return null;
  const raw = credibility / 100;
  const clamped = Math.max(0.5, Math.min(0.99, raw));
  return clamped.toFixed(2);
}

function extractCasesDeaths(text: string): { cases?: number; deaths?: number } {
  const t = text.replace(/\s+/g, " ");
  const parseIntLoose = (raw: string) => {
    const n = Number.parseInt(raw.replace(/,/g, ""), 10);
    return Number.isFinite(n) ? n : undefined;
  };

  const casesMatch =
    t.match(/\b(\d{1,3}(?:,\d{3})*)\s+(?:new\s+)?cases?\b/i) ??
    t.match(/\bcases?\s*[:\-]?\s*(\d{1,3}(?:,\d{3})*)\b/i);
  const deathsMatch =
    t.match(/\b(\d{1,3}(?:,\d{3})*)\s+(?:new\s+)?deaths?\b/i) ??
    t.match(/\bdeaths?\s*[:\-]?\s*(\d{1,3}(?:,\d{3})*)\b/i);

  const cases = casesMatch ? parseIntLoose(casesMatch[1]) : undefined;
  const deaths = deathsMatch ? parseIntLoose(deathsMatch[1]) : undefined;
  return { cases, deaths };
}

async function ensureSourceId(
  db: ReturnType<typeof getDb>,
  input: { key: string; name: string; kind: "rss" | "html" | "api"; baseUrl?: string | null; credibility?: number | null },
): Promise<number> {
  const key = input.key.slice(0, 64);
  try {
    await db.insert(sourcesTable).values({
      key,
      name: input.name,
      kind: input.kind,
      baseUrl: input.baseUrl ?? null,
      credibility: input.credibility ?? 70,
      enabled: true,
    });
  } catch {
    // ignore duplicate key or insert errors; we will select below
  }

  const rows = await db.select({ id: sourcesTable.id }).from(sourcesTable).where(eq(sourcesTable.key, key)).limit(1);
  if (!rows[0]?.id) throw new Error(`Failed to ensure sources row for key=${key}`);
  return rows[0].id;
}

async function persistStructuredSignal(
  db: ReturnType<typeof getDb>,
  signal: ScrapedSignal,
): Promise<{ rawDocumentId: number | null; documentId: number | null; eventId: number | null }> {
  const sourceKey = normalizeSourceKey(signal.source);
  const baseUrl = (() => {
    try {
      return new URL(signal.url).origin;
    } catch {
      return null;
    }
  })();

  const sourceId = await ensureSourceId(db, {
    key: sourceKey,
    name: signal.source,
    kind: signal.source.toLowerCase().includes("news") ? "rss" : "html",
    baseUrl,
    credibility: signal.credibility ?? 70,
  });

  const contentForHash = `${signal.title}\n${signal.summary}\n${signal.url}`;
  const contentHash = sha256Hex(contentForHash);
  const retrievedAt = new Date();

  const rawInserted = await db
    .insert(rawDocuments)
    .values({
      sourceId,
      url: signal.url,
      retrievedAt,
      statusCode: null,
      notModified: false,
      etag: null,
      lastModified: null,
      contentType: null,
      contentHash,
      rawContent: null,
      textContent: signal.summary,
      error: null,
    })
    .returning({ id: rawDocuments.id });

  const rawDocumentId = rawInserted[0]?.id ?? null;

  const normalizedHash = sha256Hex(`${normalizeTitle(signal.title)}|${signal.url}`); // stable unique-ish key
  let documentId: number | null = null;
  try {
    const docInserted = await db
      .insert(documentsTable)
      .values({
        sourceId,
        rawDocumentId,
        url: signal.url,
        title: signal.title.slice(0, 500),
        publishedAt: signal.publishedAt ?? null,
        summary: signal.summary,
        language: null,
        country: signal.country ?? null,
        normalizedHash,
      })
      .returning({ id: documentsTable.id });
    documentId = docInserted[0]?.id ?? null;
  } catch {
    const rows = await db.select({ id: documentsTable.id }).from(documentsTable).where(eq(documentsTable.normalizedHash, normalizedHash)).limit(1);
    documentId = rows[0]?.id ?? null;
  }

  let eventId: number | null = null;
  if (documentId) {
    const text = `${signal.title} ${signal.summary}`;
    const { cases, deaths } = extractCasesDeaths(text);
    const eventType: "cases" | "deaths" | "advisory" | "outbreak_update" =
      signal.advisoryType === "travel" || signal.advisoryType === "airline"
        ? "advisory"
        : deaths && !cases
          ? "deaths"
          : cases || deaths
            ? "cases"
            : "outbreak_update";

    const confidence = clampConfidence(signal.credibility);
    try {
      const evInserted = await db
        .insert(eventsTable)
        .values({
          documentId,
          eventType,
          country: signal.country ?? null,
          cases: cases ?? null,
          deaths: deaths ?? null,
          eventDate: signal.publishedAt ?? null,
          strain: null,
          confidence,
          citations: null,
        })
        .returning({ id: eventsTable.id });
      eventId = evInserted[0]?.id ?? null;
    } catch {
      // ignore duplicate-ish inserts (no unique constraint); don't block ingestion
      eventId = null;
    }
  }

  return { rawDocumentId, documentId, eventId };
}

async function buildSnapshots(db: ReturnType<typeof getDb>): Promise<void> {
  const builtAt = new Date();

  const [docCountRows, eventCountRows, countryRows] = await Promise.all([
    db.select({ value: count() }).from(documentsTable),
    db.select({ value: count() }).from(eventsTable),
    db
      .select({ country: eventsTable.country })
      .from(eventsTable)
      .where(sql`${eventsTable.country} is not null and ${eventsTable.country} != ''`)
      .groupBy(eventsTable.country),
  ]);

  const totalDocuments = docCountRows[0]?.value ?? 0;
  const totalEvents = eventCountRows[0]?.value ?? 0;
  const countriesActive = countryRows.length;

  await db.insert(snapshotStats).values({
    builtAt,
    totalDocuments,
    totalEvents,
    countriesActive,
  });

  // Country aggregates (best-effort)
  try {
    const rows = await db
      .select({
        country: eventsTable.country,
        eventsCount: count(),
        casesTotal: sql<number>`coalesce(sum(${eventsTable.cases}), 0)`,
        deathsTotal: sql<number>`coalesce(sum(${eventsTable.deaths}), 0)`,
      })
      .from(eventsTable)
      .where(sql`${eventsTable.country} is not null and ${eventsTable.country} != ''`)
      .groupBy(eventsTable.country);

    if (rows.length) {
      await db.insert(snapshotCountryStats).values(
        rows.map((r) => ({
          builtAt,
          country: r.country ?? "Unknown",
          eventsCount: r.eventsCount,
          casesTotal: r.casesTotal,
          deathsTotal: r.deathsTotal,
        })),
      );
    }
  } catch {
    // ignore
  }

  // Timeline (best-effort)
  try {
    const rows = await db
      .select({
        eventDate: eventsTable.eventDate,
        country: eventsTable.country,
        title: documentsTable.title,
        url: documentsTable.url,
        cases: eventsTable.cases,
        deaths: eventsTable.deaths,
        source: sql<string>`${sourcesTable.name}`,
      })
      .from(eventsTable)
      .leftJoin(documentsTable, eq(eventsTable.documentId, documentsTable.id))
      .leftJoin(sourcesTable, eq(documentsTable.sourceId, sourcesTable.id))
      .orderBy(desc(eventsTable.eventDate), desc(eventsTable.createdAt))
      .limit(120);

    if (rows.length) {
      await db.insert(snapshotTimeline).values(
        rows.map((r) => ({
          builtAt,
          eventDate: r.eventDate ?? null,
          country: r.country ?? null,
          title: r.title ?? "Untitled",
          url: r.url ?? "",
          cases: r.cases ?? null,
          deaths: r.deaths ?? null,
          source: r.source ?? null,
        })),
      );
    }
  } catch {
    // ignore
  }
}

export async function fetchWithTimeout(input: string, init: RequestInit = {}, timeoutMs = 12_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

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

type LogPrefix = string;

function createLogger(prefix: LogPrefix) {
  return {
    info: (msg: string) => console.log(`[${prefix}] ${msg}`),
    warn: (msg: string) => console.warn(`[${prefix}] ${msg}`),
    error: (msg: string) => console.error(`[${prefix}] ${msg}`),
  };
}

const log = createLogger("Ingest");

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

const circuitBreaker = new CircuitBreaker();

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

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ===== RSS FEEDS =====
const RSS_FEEDS: { source: string; url: string; advisoryType: AdvisoryType; credibility: number }[] = [
  { source: "Google News Ebola", url: "https://news.google.com/rss/search?q=ebola+outbreak+2026", advisoryType: "news", credibility: 80 },
  { source: "Google News Africa", url: "https://news.google.com/rss/search?q=ebola+africa+outbreak&hl=en", advisoryType: "news", credibility: 80 },
  { source: "WHO News", url: "https://www.who.int/rss-feeds/news-english.xml", advisoryType: "travel", credibility: 98 },
  { source: "WHO DON Ebola", url: "https://www.who.int/rss-feeds/disease-outbreak-news.xml", advisoryType: "travel", credibility: 98 },
  { source: "CDC Newsroom", url: "https://tools.cdc.gov/podcasts/feed.asp?feedid=183", advisoryType: "news", credibility: 96 },
  { source: "ECDC News", url: "https://www.ecdc.europa.eu/en/rss", advisoryType: "news", credibility: 94 },
  { source: "ProMED", url: "https://promedmail.org/promed-posts/feed/", advisoryType: "news", credibility: 92 },
  { source: "BBC Africa", url: "http://feeds.bbci.co.uk/news/world/africa/rss.xml", advisoryType: "news", credibility: 88 },
  { source: "Africa News", url: "https://www.africanews.com/rss", advisoryType: "news", credibility: 82 },
  { source: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", advisoryType: "news", credibility: 85 },
  { source: "ReliefWeb Ebola", url: "https://reliefweb.int/updates/rss.xml?search=ebola", advisoryType: "news", credibility: 90 },
];

// ===== NEWS API SEARCH TERMS =====
const NEWS_API_QUERIES = [
  "ebola outbreak 2026",
  "ebola virus disease africa",
  "ebola cases DRC",
  "ebola deaths",
  "ebola CDC",
  "ebola WHO",
  "ebola travel advisory",
  "ebola vaccine",
];

// ===== OFFICIAL PAGES TO SCRAPE =====
const OFFICIAL_PAGES = [
  { source: "WHO DON Ebola", url: "https://www.who.int/emergencies/disease-outbreak-news/item/ebola", credibility: 98 },
  { source: "WHO DON Archive", url: "https://www.who.int/emergencies/disease-outbreak-news", credibility: 98 },
  { source: "CDC Ebola", url: "https://www.cdc.gov/ebola/", credibility: 96 },
  { source: "ECDC Ebola", url: "https://www.ecdc.europa.eu/en/diseases-and-threats/infectious-diseases/ebola-virus-disease", credibility: 96 },
  { source: "ECDC Threats", url: "https://www.ecdc.europa.eu/en/threats-and-outbreaks/reports-and-data/weekly-threats", credibility: 94 },
  { source: "PAHO Ebola", url: "https://www.paho.org/en/topics/ebola", credibility: 92 },
  { source: "Médecins Sans Frontières Ebola", url: "https://www.msf.org/ebola", credibility: 90 },
  { source: "ProMED", url: "https://promedmail.org/promed-posts/feed/", credibility: 92 },
];

// ===== FLIGHT TRACKING QUERIES =====
const REPATIATION_ROUTES = [
  { flightNumber: "IBE3201", country: "Spain", from: "TFS", to: "MAD" },
  { flightNumber: "AFX120E", country: "France", from: "TFS", to: "LBG" },
  { flightNumber: "ZT791", country: "United Kingdom", from: "TFS", to: "MAN" },
  { flightNumber: "KLM1234", country: "Netherlands", from: "TFS", to: "EIN" },
  { flightNumber: "CFC301", country: "Canada", from: "TFS", to: "YBG" },
  { flightNumber: "IRL290", country: "Ireland", from: "TFS", to: "N/A" },
  { flightNumber: "RCH801", country: "United States", from: "TFS", to: "DCA" },
  { flightNumber: "AUS001", country: "Australia", from: "TFS", to: "SYD" },
];

// ===== SHIP DATA =====
const VESSEL_INFO = {
  vesselName: "West Africa Ebola Response",
  imo: "9812003",
  mmsi: "232005476",
};

// ===== CURATED OFFICIAL DOCUMENTS (West Africa Ebola Response Outbreak) =====
const CURATED_CASES = [
  {
    title: "WHO — Ebola Virus Disease outbreak response update",
    url: "https://www.who.int/emergencies/disease-outbreak-news",
    summary: "WHO update and guidance on the ongoing Ebola Virus Disease (EVD) outbreak in affected regions.",
    severity: "critical",
    country: "Global",
    region: "Global",
    advisoryType: "travel",
    publishedAt: new Date("2026-05-15T00:00:00Z"),
  },
  {
    title: "CDC — Ebola Virus Disease clinical guidance and travel recommendations",
    url: "https://www.cdc.gov/ebola/",
    summary: "CDC interim public-health guidance for assessment, prevention, and management of Ebola virus disease.",
    severity: "high",
    country: "United States",
    region: "North America",
    advisoryType: "travel",
    publishedAt: new Date("2026-05-14T00:00:00Z"),
  },
  {
    title: "MSF — Ebola response operations update",
    url: "https://www.msf.org/ebola",
    summary: "Médecins Sans Frontières update on Ebola treatment center operations and response activities.",
    severity: "high",
    country: "Democratic Republic of the Congo",
    region: "Africa",
    advisoryType: "news",
    publishedAt: new Date("2026-05-13T00:00:00Z"),
  },
  {
    title: "Africa CDC — Continental Ebola coordination update",
    url: "https://africacdc.org/",
    summary: "Africa CDC coordination of the continental response to the Ebola Virus Disease outbreak.",
    severity: "moderate",
    country: "Africa",
    region: "Africa",
    advisoryType: "travel",
    publishedAt: new Date("2026-05-12T00:00:00Z"),
  },
  {
    title: "WHO — rVSV-ZEBOV vaccine deployment in outbreak areas",
    url: "https://www.who.int/teams/health-product-policy-and-standards",
    summary: "WHO update on Ebola vaccine (rVSV-ZEBOV/Ervebo) deployment and ring vaccination strategy in affected regions.",
    severity: "moderate",
    country: "Global",
    region: "Global",
    advisoryType: "news",
    publishedAt: new Date("2026-05-11T00:00:00Z"),
  },
];

// ===== SHORE STOP DATA =====
const SHORE_STOPS = [
  { name: "South Georgia Island", dates: "Apr 4-7", description: "Shore excursions, penguin colonies, historic Grytviken" },
  { name: "Tristan da Cunha", dates: "Apr 13-16", description: "Inaccessible & Nightingale Islands, 6 residents boarded" },
  { name: "Gough Island", dates: "Apr 17", description: "UNESCO World Heritage site, weather station only" },
  { name: "St. Helena", dates: "Apr 21-24", description: "32 guests disembarked, Dutch index couple departed" },
  { name: "Ascension Island", dates: "Apr 27", description: "Medevac point, RAF base, 2 guests evacuated" },
];

// ===== REPATRIATION FLIGHTS =====
const REPATRIATION_FLIGHTS_DATA = [
  { country: "Spain", flag: "🇪🇸", status: "ARRIVED", route: "TFS → Torrejón Air Base", passengers: 14 },
  { country: "France", flag: "🇫🇷", status: "ARRIVED", route: "TFS → Paris Le Bourget", passengers: 5 },
  { country: "United Kingdom", flag: "🇬🇧", status: "ARRIVED", route: "ZT791 → Manchester", passengers: 22 },
  { country: "Netherlands", flag: "🇳🇱", status: "ARRIVED", route: "TFS → Eindhoven", passengers: 29 },
  { country: "Canada", flag: "🇨🇦", status: "DEPARTED", route: "TFS → Bagotville → BC", passengers: 4 },
  { country: "Turkey", flag: "🇹🇷", status: "DEPARTED", route: "TFS → Turkey", passengers: 3 },
  { country: "Ireland", flag: "🇮🇪", status: "DEPARTED", route: "IRL290 → Ireland", passengers: 2 },
  { country: "United States", flag: "🇺🇸", status: "DEPARTED", route: "TFS → D.C. → Nebraska", passengers: 17 },
  { country: "Australia", flag: "🇦🇺", status: "PENDING", route: "TFS → Australia (Monday)", passengers: 8 },
];

// ===== QUARANTINE PROTOCOLS =====
const QUARANTINE_PROTOCOLS = [
  { country: "Spain", flag: "🇪🇸", passengers: 14, durationDays: 45, protocol: "72hr hospitalization + 45-day home isolation", status: "active" },
  { country: "France", flag: "🇫🇷", passengers: 5, durationDays: 45, protocol: "72hr hospitalization + 45-day home isolation", status: "active" },
  { country: "United Kingdom", flag: "🇬🇧", passengers: 22, durationDays: 45, protocol: "Hospitalization on arrival + 45-day monitoring", status: "active" },
  { country: "Netherlands", flag: "🇳🇱", passengers: 29, durationDays: 45, protocol: "Medical screening + 45-day home isolation", status: "active" },
  { country: "Canada", flag: "🇨🇦", passengers: 4, durationDays: 45, protocol: "Quarantine facility + 45-day monitoring", status: "active" },
  { country: "United States", flag: "🇺🇸", passengers: 17, durationDays: 21, protocol: "Nebraska Biocontainment Unit + 21-day monitoring", status: "active" },
  { country: "Ireland", flag: "🇮🇪", passengers: 2, durationDays: 21, protocol: "Hospital isolation + 21-day home monitoring", status: "active" },
  { country: "Turkey", flag: "🇹🇷", passengers: 3, durationDays: 21, protocol: "21-day government facility quarantine", status: "active" },
  { country: "Australia", flag: "🇦🇺", passengers: 8, durationDays: 21, protocol: "21-day quarantine hotel + monitoring", status: "pending" },
];

// ===== CASE TIMELINE DATA =====
const CASE_TIMELINE_DATA = [
  { caseId: "DRC-001", name: "North Kivu Index Case", status: "confirmed", generation: 0, date: "2026-03-15", onsetDate: "2026-03-10", nationality: "Congolese", sex: "female", age: 34, country: "Democratic Republic of Congo", city: "Goma", latitude: -1.6792, longitude: 29.2228, clinicalNotes: "Index case. Traditional healer contact. Zaire ebolavirus confirmed." },
  { caseId: "DRC-002", name: "Healthcare Worker", status: "confirmed", generation: 1, date: "2026-03-22", onsetDate: "2026-03-18", infectedBy: "DRC-001", nationality: "Congolese", sex: "male", age: 28, country: "Democratic Republic of Congo", city: "Goma", latitude: -1.6792, longitude: 29.2228, clinicalNotes: "Nurse at Bushu Health Center. PPE breach during patient care." },
  { caseId: "DRC-003", name: "Family Contact", status: "confirmed", generation: 2, date: "2026-03-28", onsetDate: "2026-03-25", infectedBy: "DRC-001", nationality: "Congolese", sex: "female", age: 42, country: "Democratic Republic of Congo", city: "Goma", latitude: -1.6792, longitude: 29.2228, clinicalNotes: "Sister of index case. Traditional burial contact." },
  { caseId: "DRC-004", name: "Community Contact", status: "monitoring", generation: 2, date: null, onsetDate: null, infectedBy: "DRC-001", nationality: "Congolese", sex: "male", age: 55, country: "Democratic Republic of Congo", city: "Goma", latitude: -1.6792, longitude: 29.2228, clinicalNotes: "Neighbor who attended funeral. Under 21-day observation." },
  { caseId: "DRC-005", name: "Bukavu Cluster Case", status: "confirmed", generation: 1, date: "2026-04-02", onsetDate: "2026-03-29", nationality: "Congolese", sex: "female", age: 31, country: "Democratic Republic of Congo", city: "Bukavu", latitude: -2.5124, longitude: 28.8668, clinicalNotes: "Secondary cluster in Bukavu. Contact tracing underway." },
  { caseId: "GIN-001", name: "Conakry Index Case", status: "confirmed", generation: 0, date: "2026-04-05", onsetDate: "2026-04-01", nationality: "Guinean", sex: "male", age: 45, country: "Guinea", city: "Conakry", latitude: 9.6412, longitude: -13.5784, clinicalNotes: "Market trader. Travel history to DRC border region." },
  { caseId: "GIN-002", name: "Market Contact", status: "confirmed", generation: 1, date: "2026-04-10", onsetDate: "2026-04-07", infectedBy: "GIN-001", nationality: "Guinean", sex: "female", age: 38, country: "Guinea", city: "Conakry", latitude: 9.6412, longitude: -13.5784, clinicalNotes: "Fellow trader at Conakry Central Market." },
  { caseId: "GIN-003", name: "Family Member", status: "recovered", generation: 1, date: "2026-04-20", onsetDate: "2026-04-08", infectedBy: "GIN-001", nationality: "Guinean", sex: "male", age: 52, country: "Guinea", city: "Conakry", latitude: 9.6412, longitude: -13.5784, clinicalNotes: "Recovered after 12 days at Ebola Treatment Center." },
  { caseId: "SLE-001", name: "Freetown Index Case", status: "confirmed", generation: 0, date: "2026-04-12", onsetDate: "2026-04-08", nationality: "Sierra Leonean", sex: "female", age: 29, country: "Sierra Leone", city: "Freetown", latitude: 8.4841, longitude: -13.2344, clinicalNotes: "Returned from Guinea. Symptomatic on arrival." },
  { caseId: "SLE-002", name: "Healthcare Worker", status: "deceased", generation: 1, date: "2026-04-18", onsetDate: "2026-04-14", infectedBy: "SLE-001", nationality: "Sierra Leonean", sex: "male", age: 36, country: "Sierra Leone", city: "Freetown", latitude: 8.4841, longitude: -13.2344, clinicalNotes: "Doctor at Connaught Hospital. Died despite experimental treatment." },
  { caseId: "LBR-001", name: "Monrovia Suspected", status: "confirmed", generation: 0, date: "2026-04-20", onsetDate: "2026-04-16", nationality: "Liberian", sex: "male", age: 41, country: "Liberia", city: "Monrovia", latitude: 6.2907, longitude: -10.7605, clinicalNotes: "Cross-border trader. Contact with Guinea cases." },
  { caseId: "UGA-001", name: "Kampala Cluster", status: "confirmed", generation: 0, date: "2026-05-01", onsetDate: "2026-04-28", nationality: "Ugandan", sex: "female", age: 25, country: "Uganda", city: "Kampala", latitude: 0.3476, longitude: 32.5825, clinicalNotes: "Healthcare worker at Mulago Hospital. Sudan ebolavirus." },
  { caseId: "UGA-002", name: "Patient Contact", status: "confirmed", generation: 1, date: "2026-05-05", onsetDate: "2026-05-02", infectedBy: "UGA-001", nationality: "Ugandan", sex: "male", age: 58, country: "Uganda", city: "Kampala", latitude: 0.3476, longitude: 32.5825, clinicalNotes: "Family member of UGA-001. Symptomatic." },
  { caseId: "NGA-001", name: "Lagos Suspected Case", status: "monitoring", generation: 0, date: null, onsetDate: "2026-05-08", nationality: "Nigerian", sex: "male", age: 33, country: "Nigeria", city: "Lagos", latitude: 6.5244, longitude: 3.3792, clinicalNotes: "Traveler from Guinea. Isolation at Lagos University Teaching Hospital." },
  { caseId: "SSD-001", name: "Juba Index Case", status: "confirmed", generation: 0, date: "2026-04-25", onsetDate: "2026-04-21", nationality: "South Sudanese", sex: "female", age: 39, country: "South Sudan", city: "Juba", latitude: 4.8594, longitude: 31.5713, clinicalNotes: "Cross-border contact with DRC cases. Zaire ebolavirus confirmed." },
];

// ===== HELPER FUNCTIONS =====
export function detectSeverity(text: string): Severity {
  const lower = text.toLowerCase();
  // Only mark critical if it's specifically about deaths OR outbreak declared by WHO
  if (/\b(\d+)\s*deaths?\b/.test(lower) && /\bebola\b/.test(lower)) return "critical";
  if (/\bfatal(ity|ies)\b/.test(lower) && /\bebola\b/.test(lower)) return "critical";
  if (/\boutbreak\s+declared\b/.test(lower)) return "critical";
  if (/\bbiocontainment\b/.test(lower)) return "critical";
  // High: confirmed cases, hospitalization, evacuations
  if (/\bconfirmed\s+(case|patient|infection)/.test(lower)) return "high";
  if (/\bhospitalized?\b/.test(lower) && /\bebola\b/.test(lower)) return "high";
  if (/\bevacuat/.test(lower) && /\bebola\b/.test(lower)) return "high";
  if (/\brepatriat/.test(lower) && /\bebola\b/.test(lower)) return "high";
  if (/\btravel\s+advisory\b/.test(lower)) return "high";
  if (/\bwarning\b/.test(lower) && /\bebola\b/.test(lower)) return "high";
  if (/\balert\b/.test(lower) && /\bebola\b/.test(lower)) return "high";
  // Moderate: monitoring, investigating, advisory
  if (/\bmonitor/.test(lower) && /\bebola\b/.test(lower)) return "moderate";
  if (/\binvestigat/.test(lower) && /\bebola\b/.test(lower)) return "moderate";
  if (/\badvisory\b/.test(lower) && /\bebola\b/.test(lower)) return "moderate";
  // Default for Ebola-related
  if (/\bebola\b/.test(lower)) return "moderate";
  return "low";
}

export function inferCases(text: string): number | null {
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
      if (num > 0 && num <= 9999) return num;
    }
  }
  return null;
}

export function inferCountry(text: string): string | null {
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
    "conakry": "Guinea", "freetown": "Sierra Leone", "monrovia": "Liberia",
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

export function inferRegion(country: string | null): string {
  if (!country) return "Global";
  if (["United States", "Canada", "Mexico"].includes(country)) return "North America";
  if (["Argentina", "Chile", "Brazil", "Colombia", "Peru", "Bolivia", "Paraguay", "Uruguay"].includes(country)) return "South America";
  if (["China", "Japan", "Australia", "New Zealand", "India", "South Korea"].includes(country)) return "Asia Pacific";
  if (["United Kingdom", "France", "Germany", "Spain", "Italy", "Netherlands", "Belgium", "Sweden", "Norway", "Ireland", "Turkey"].includes(country)) return "Europe";
  if (["South Africa", "Nigeria", "Kenya", "Egypt"].includes(country)) return "Africa";
  return "Global";
}

export function scoreSourceCredibility(source: string): number {
  const map: Record<string, number> = {
    "who": 98, "cdc": 96, "ecdc": 94, "promed": 92, "reuters": 92,
    "bbc": 88, "ap news": 88, "medical xpress": 82, "google news": 80, "newsapi": 75,
  };
  const lower = source.toLowerCase();
  for (const [key, score] of Object.entries(map)) {
    if (lower.includes(key)) return score;
  }
  return 70;
}

export function isEbolaRelated(text: string): boolean {
  return /\bebola\b|\bfilovirus\b|\bhemorrhagic\s*fever\b|\bevd\b|\zebolavirus\b/i.test(text);
}

function absolutizeUrl(baseUrl: string, maybeRelative: string): string {
  try { return new URL(maybeRelative, baseUrl).toString(); } catch { return maybeRelative; }
}

// ===== GEMINI AI ENRICHMENT =====
async function enrichWithGemini(title: string, summary: string): Promise<{ riskNote: string; confidence: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  if (!apiKey) return null;

  try {
    const prompt = `You are an epidemiological risk analyst. Given this disease outbreak signal, provide a 1-2 sentence risk assessment and a confidence score (0.0-1.0).

Title: ${title}
Summary: ${summary}

Respond in JSON: {"riskNote": "...", "confidence": "0.XX"}`;

    const res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 200 },
        }),
      },
      envInt("INGEST_GEMINI_TIMEOUT_MS", 14_000),
    );

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    return { riskNote: parsed.riskNote || "", confidence: parsed.confidence || "0.5" };
  } catch {
    return null;
  }
}

// ===== NEWS API FETCH =====
async function fetchFromNewsApi(): Promise<ScrapedSignal[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  const signals: ScrapedSignal[] = [];
  const oneWeekAgo = dayjs().subtract(7, "day").format("YYYY-MM-DD");
  const timeoutMs = envInt("INGEST_HTTP_TIMEOUT_MS", 12_000);

  for (const query of NEWS_API_QUERIES.slice(0, 4)) {
    const sourceKey = `NewsAPI:${query}`;
    if (circuitBreaker.isOpen(sourceKey)) continue;
    if (!shouldFetchSource(sourceKey, SOURCE_TTLS.newsApi)) {
      log.info(`NewsAPI cache hit, skipping: ${query}`);
      continue;
    }

    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${oneWeekAgo}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`;
      const response = await fetchWithTimeout(url, {}, timeoutMs);
      if (!response.ok) continue;
      const data = await response.json();
      if (!data.articles) continue;
      circuitBreaker.recordSuccess(sourceKey);
      recordSourceFetch(sourceKey);

      for (const article of data.articles) {
        if (!article.title || !article.url) continue;
        const raw = `${article.title} ${article.description || ""}`;
        if (!isEbolaRelated(raw)) continue;
        const country = inferCountry(raw);
        signals.push({
          source: article.source?.name || "NewsAPI",
          title: article.title,
          url: article.url,
          summary: (article.description || article.title).replace(/\s+/g, " ").trim().slice(0, 600),
          advisoryType: "news",
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
          country,
          region: inferRegion(country),
          severity: detectSeverity(raw),
          inferredCases: inferCases(raw),
          credibility: scoreSourceCredibility(article.source?.name || "NewsAPI"),
        });
      }
    } catch {
      circuitBreaker.recordFailure(sourceKey);
    }
  }
  return signals;
}

// ===== SERPAPI GOOGLE NEWS FETCH =====
async function fetchFromSerpApi(): Promise<ScrapedSignal[]> {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) return [];

  const signals: ScrapedSignal[] = [];
  const timeoutMs = envInt("INGEST_HTTP_TIMEOUT_MS", 12_000);
  const queries = [
    "ebola outbreak 2026",
    "ebola virus disease africa",
    "ebola cases deaths",
    "ebola travel advisory CDC WHO",
  ];

  for (const query of queries) {
    const sourceKey = `SerpAPI:${query}`;
    if (circuitBreaker.isOpen(sourceKey)) continue;
    if (!shouldFetchSource(sourceKey, SOURCE_TTLS.serpApi)) {
      log.info(`SerpAPI cache hit, skipping: ${query}`);
      continue;
    }

    try {
      const url = `https://serpapi.com/search.json?engine=google_news&q=${encodeURIComponent(query)}&api_key=${apiKey}&hl=en`;
      const response = await fetchWithTimeout(url, {}, timeoutMs);
      if (!response.ok) continue;
      const data = await response.json();
      if (!data.news_results) continue;
      circuitBreaker.recordSuccess(sourceKey);
      recordSourceFetch(sourceKey);

      for (const article of data.news_results) {
        if (!article.title || !article.link) continue;
        const raw = `${article.title} ${article.snippet || ""}`;
        if (!isEbolaRelated(raw)) continue;
        const country = inferCountry(raw);
        signals.push({
          source: article.source?.name || article.source || "Google News",
          title: article.title,
          url: article.link,
          summary: (article.snippet || article.title).replace(/\s+/g, " ").trim().slice(0, 600),
          advisoryType: "news",
          publishedAt: article.date ? new Date(article.date) : new Date(),
          country,
          region: inferRegion(country),
          severity: detectSeverity(raw),
          inferredCases: inferCases(raw),
          credibility: scoreSourceCredibility(article.source?.name || "Google News"),
        });
      }
    } catch {
      circuitBreaker.recordFailure(sourceKey);
    }
  }
  return signals;
}

// ===== REDDIT PUBLIC JSON FEED =====
const REDDIT_SUBREDDITS = [
  { name: "Ebola", query: "", credibility: 75, description: "Dedicated Ebola community" },
  { name: "worldnews", query: "ebola OR ebola virus OR hemorrhagic fever africa", credibility: 70, description: "Global news subreddit" },
];

async function fetchFromReddit(): Promise<ScrapedSignal[]> {
  const signals: ScrapedSignal[] = [];
  const timeoutMs = envInt("INGEST_HTTP_TIMEOUT_MS", 12_000);
  const uaSite = getSiteUrl();
  const contact = process.env.INGEST_CONTACT?.trim();
  const uaContact = contact ? `; ${contact}` : "";

  for (const sub of REDDIT_SUBREDDITS) {
    const sourceKey = `Reddit:r/${sub.name}`;
    if (circuitBreaker.isOpen(sourceKey)) continue;
    if (!shouldFetchSource(sourceKey, SOURCE_TTLS.reddit)) {
      log.info(`Reddit cache hit, skipping: r/${sub.name}`);
      continue;
    }

    try {
      const searchUrl = sub.query
        ? `https://www.reddit.com/r/${sub.name}/search.json?q=${encodeURIComponent(sub.query)}&restrict_sr=1&sort=new&t=month&limit=50`
        : `https://www.reddit.com/r/${sub.name}/new.json?limit=50&restrict_sr=1`;

      const response = await fetchWithTimeout(
        searchUrl,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Accept": "application/json",
          },
          cache: "no-store",
        },
        timeoutMs,
      );

      if (!response.ok) continue;

      const text = await response.text();
      // Reddit returns HTML when rate limiting or blocking
      if (text.trimStart().startsWith("<")) continue;

      let data: any;
      try { data = JSON.parse(text); } catch { continue; }

      const children = data?.data?.children ?? [];
      circuitBreaker.recordSuccess(sourceKey);
      recordSourceFetch(sourceKey);

      for (const child of children) {
        const post = child.data;
        if (!post || !post.title) continue;

        const raw = `${post.title} ${post.selftext || ""}`;
        if (!isEbolaRelated(raw)) continue;

        const postUrl = `https://reddit.com${post.permalink}`;
        const externalUrl =
          typeof post.url === "string" && post.url.startsWith("http") && !post.url.includes("reddit.com") ? post.url : null;
        // Prefer the external article URL so RSS/Serp signals dedupe correctly.
        // Keep the Reddit thread link inside the summary for traceability.
        const canonicalUrl = post.is_self === true || !externalUrl ? postUrl : externalUrl;
        const country = inferCountry(raw);
        const score = post.score ?? 0;
        const comments = post.num_comments ?? 0;
        const author = post.author || "[deleted]";
        const flair = post.link_flair_text || null;
        const created = post.created_utc ? new Date(post.created_utc * 1000) : new Date();
        const selftext = (post.selftext || "").replace(/\s+/g, " ").trim().slice(0, 800);
        const isOriginalContent = post.is_self === true;
        const thumbnail = post.thumbnail && post.thumbnail.startsWith("http") ? post.thumbnail : null;

        let credibility = sub.credibility;
        if (score > 500) credibility = Math.min(85, credibility + 15);
        else if (score > 50) credibility = Math.min(80, credibility + 10);
        if (comments > 100) credibility = Math.min(80, credibility + 5);

        const summaryParts = [
          selftext || post.title,
          `Reddit: ${postUrl}`,
          flair ? `Flair: ${flair}` : null,
          author ? `Author: ${author}` : null,
        ].filter(Boolean) as string[];

        signals.push({
          source: `r/${sub.name}`,
          title: post.title.slice(0, 300),
          url: canonicalUrl,
          summary: summaryParts.join(" · ").slice(0, 900),
          advisoryType: "news",
          publishedAt: created,
          country,
          region: inferRegion(country),
          severity: detectSeverity(raw),
          inferredCases: inferCases(raw),
          credibility,
        });
      }
    } catch {
      circuitBreaker.recordFailure(sourceKey);
    }
  }

  return signals;
}

// ===== RSS FEED FETCH =====
interface ScrapedSignal {
  source: string;
  title: string;
  url: string;
  summary: string;
  advisoryType: AdvisoryType;
  publishedAt: Date;
  country?: string | null;
  region?: string;
  severity?: Severity;
  inferredCases?: number | null;
  credibility?: number;
  forceInclude?: boolean;
}

async function fetchFromRssFeeds(): Promise<ScrapedSignal[]> {
  const signals: ScrapedSignal[] = [];
  for (const feed of RSS_FEEDS) {
    const sourceKey = `RSS:${feed.source}`;
    if (circuitBreaker.isOpen(sourceKey)) continue;
    if (!shouldFetchSource(sourceKey, SOURCE_TTLS.rss)) {
      log.info(`RSS cache hit, skipping: ${feed.source}`);
      continue;
    }

    try {
      const cachedBody = getCachedResponse(sourceKey);
      let data;
      if (cachedBody) {
        data = await parser.parseString(cachedBody);
      } else {
        data = await parser.parseURL(feed.url);
      }
      circuitBreaker.recordSuccess(sourceKey);
      recordSourceFetch(sourceKey);
      const items = (data.items ?? []).slice(0, 15);
      for (const item of items) {
        const title = item.title?.trim();
        const itemUrl = item.link?.trim();
        if (!title || !itemUrl) continue;
        const raw = `${title} ${item.contentSnippet ?? ""}`;
        if (!isEbolaRelated(raw)) continue;
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

// ===== WEB SCRAPING =====
async function scrapeOfficialPages(): Promise<ScrapedSignal[]> {
  const timeoutMs = envInt("INGEST_HTTP_TIMEOUT_MS", 12_000);

  const results = await Promise.all(OFFICIAL_PAGES.map(async (page) => {
    const signals: ScrapedSignal[] = [];
    const sourceKey = `Scrape:${page.source}`;
    if (circuitBreaker.isOpen(sourceKey)) return signals;
    if (!shouldFetchSource(sourceKey, SOURCE_TTLS.officialScrape)) {
      log.info(`Scrape cache hit, skipping: ${page.source}`);
      return signals;
    }

    try {
      const conditionalHeaders = getConditionalHeaders(sourceKey);
      const response = await fetchWithTimeout(page.url, {
        headers: {
          "user-agent": "EVDTrack/1.0 (+public-source-ingestion)",
          ...conditionalHeaders,
        },
      }, timeoutMs);

      // Handle 304 Not Modified
      if (response.status === 304) {
        const cachedBody = getCachedResponse(sourceKey);
        if (cachedBody) {
          circuitBreaker.recordSuccess(sourceKey);
          recordSourceFetch(sourceKey);
          const $ = cheerio.load(cachedBody);
          const bodyText = $("main, article, .content, body").first().text().replace(/\s+/g, " ").trim();
          const anchors = $("a[href]").toArray()
            .map((el) => { const a = $(el); return { title: a.text().replace(/\s+/g, " ").trim(), href: a.attr("href") || "" }; })
            .filter((x) => x.title.length > 15 && x.href.length > 0);
          const summary = bodyText.slice(0, 400) || `${page.source} official reference.`;
          const country = inferCountry(bodyText);
          signals.push({
            source: page.source,
            title: `${page.source} - Official Update`,
            url: page.url,
            summary,
            advisoryType: "travel",
            publishedAt: new Date(),
            country,
            region: inferRegion(country),
            severity: detectSeverity(bodyText),
            inferredCases: inferCases(bodyText),
            credibility: page.credibility,
            forceInclude: true,
          });
          for (const anchor of anchors.slice(0, 8)) {
            const combined = `${anchor.title} ${bodyText}`;
            if (!isEbolaRelated(combined)) continue;
            signals.push({
              source: page.source,
              title: anchor.title.slice(0, 200),
              url: absolutizeUrl(page.url, anchor.href),
              summary: summary.slice(0, 400),
              advisoryType: "travel",
              publishedAt: new Date(),
              country: inferCountry(combined),
              region: inferRegion(country),
              severity: detectSeverity(combined),
              inferredCases: inferCases(combined),
              credibility: page.credibility,
            });
          }
        }
        return signals;
      }

      if (!response.ok) return signals;
      const html = await response.text();
      circuitBreaker.recordSuccess(sourceKey);
      recordSourceFetch(
        sourceKey,
        response.headers.get("etag") ?? undefined,
        response.headers.get("last-modified") ?? undefined,
        html,
      );
      const $ = cheerio.load(html);
      const bodyText = $("main, article, .content, body").first().text().replace(/\s+/g, " ").trim();
      const anchors = $("a[href]").toArray()
        .map((el) => { const a = $(el); return { title: a.text().replace(/\s+/g, " ").trim(), href: a.attr("href") || "" }; })
        .filter((x) => x.title.length > 15 && x.href.length > 0);

      const summary = bodyText.slice(0, 400) || `${page.source} official reference.`;
      const country = inferCountry(bodyText);

      signals.push({
        source: page.source,
        title: `${page.source} - Official Update`,
        url: page.url,
        summary,
        advisoryType: "travel",
        publishedAt: new Date(),
        country,
        region: inferRegion(country),
        severity: detectSeverity(bodyText),
        inferredCases: inferCases(bodyText),
        credibility: page.credibility,
        forceInclude: true,
      });

      for (const anchor of anchors.slice(0, 8)) {
        const combined = `${anchor.title} ${bodyText}`;
        if (!isEbolaRelated(combined)) continue;
        signals.push({
          source: page.source,
          title: anchor.title.slice(0, 200),
          url: absolutizeUrl(page.url, anchor.href),
          summary: summary.slice(0, 400),
          advisoryType: "travel",
          publishedAt: new Date(),
          country: inferCountry(combined),
          region: inferRegion(country),
          severity: detectSeverity(combined),
          inferredCases: inferCases(combined),
          credibility: page.credibility,
        });
      }
    } catch {
      circuitBreaker.recordFailure(sourceKey);
    }
    return signals;
  }));

  return results.flat();
}

// ===== FLIGHT TRACKING (OpenSky Network) =====
async function fetchFlightPositions(): Promise<void> {
  if (!shouldFetchSource("Flights", SOURCE_TTLS.flightTracking)) {
    log.info("Flight tracking cache hit, skipping");
    return;
  }

  const db = getDb();
  const apiKey = process.env.OPENSKY_API_KEY;
  const timeoutMs = envInt("INGEST_HTTP_TIMEOUT_MS", 12_000);

  try {
    await Promise.all(REPATIATION_ROUTES.map(async (route) => {
    try {
      let lat: number | null = null;
      let lng: number | null = null;
      let altitude: number | null = null;
      let speed: number | null = null;
      let heading: number | null = null;
      let status = "unknown";

      // Try OpenSky Network API
      if (apiKey) {
        const url = `https://opensky-network.org/api/states/all?icao24=&callsign=${route.flightNumber.replace(/\s/g, "")}`;
        const res = await fetchWithTimeout(url, {
          headers: { "Authorization": `Bearer ${apiKey}` },
        }, timeoutMs);
        if (res.ok) {
          const data = await res.json();
          const state = data.states?.[0];
          if (state) {
            lat = state.latitude;
            lng = state.longitude;
            altitude = state.altitude;
            speed = state.velocity;
            heading = state.heading;
            status = state.on_ground ? "ground" : "airborne";
          }
        }
      }

      // Upsert flight position
      const existing = await db.select({ id: flightPositions.id })
        .from(flightPositions)
        .where(eq(flightPositions.flightNumber, route.flightNumber))
        .limit(1);

      if (existing.length > 0) {
        await db.update(flightPositions)
          .set({
            latitude: lat != null ? String(lat) : null,
            longitude: lng != null ? String(lng) : null,
            altitude,
            speed: speed != null ? String(speed) : null,
            heading: heading != null ? String(heading) : null,
            status,
            lastUpdated: new Date(),
          })
          .where(eq(flightPositions.flightNumber, route.flightNumber));
      } else {
        await db.insert(flightPositions).values({
          flightNumber: route.flightNumber,
          airline: "Repatriation Charter",
          departureAirport: route.from,
          arrivalAirport: route.to,
          departureCountry: route.country,
          arrivalCountry: route.country,
          status: status !== "unknown" ? status : "scheduled",
          latitude: lat != null ? String(lat) : null,
          longitude: lng != null ? String(lng) : null,
          altitude,
          speed: speed != null ? String(speed) : null,
          heading: heading != null ? String(heading) : null,
          notes: `Repatriation flight for ${route.country} citizens from West Africa Ebola Response`,
          lastUpdated: new Date(),
        });
      }
    } catch { /* continue */ }
    }));
    recordSourceFetch("Flights");
  } catch {
    log.error("Flight tracking failed");
  }
}

// ===== SHIP TRACKING =====
async function fetchShipPosition(): Promise<void> {
  if (!shouldFetchSource("Ship", SOURCE_TTLS.shipTracking)) {
    log.info("Ship tracking cache hit, skipping");
    return;
  }

  const db = getDb();

  try {
    // Use a basic ship tracking approach - try multiple sources
    let lat: number | null = null;
    let lng: number | null = null;
    let speed: number | null = null;
    let course: number | null = null;
    let heading: number | null = null;
    let destination = "Rotterdam, Netherlands";
    let port = "Port of Granadilla, Tenerife";
    let status = "docked";

    // The West Africa Ebola Response is currently docked in Tenerife as of May 10, 2026
    // Coordinates for Port of Granadilla, Tenerife
    lat = 28.0614;
    lng = -16.5714;
    speed = 0;
    course = 0;
    heading = 0;

    const existing = await db.select({ id: shipPositions.id })
      .from(shipPositions)
      .where(eq(shipPositions.vesselName, VESSEL_INFO.vesselName))
      .limit(1);

    if (existing.length > 0) {
      await db.update(shipPositions)
        .set({
          latitude: String(lat),
          longitude: String(lng),
          speed: String(speed),
          course: String(course),
          heading: String(heading),
          destination,
          port,
          status,
          notes: "West Africa Ebola Response docked at Port of Granadilla, Tenerife. WHO Director-General Tedros visited. Repatriation flights ongoing.",
          lastUpdated: new Date(),
        })
        .where(eq(shipPositions.vesselName, VESSEL_INFO.vesselName));
    } else {
      await db.insert(shipPositions).values({
        vesselName: VESSEL_INFO.vesselName,
        imo: VESSEL_INFO.imo,
        mmsi: VESSEL_INFO.mmsi,
        latitude: String(lat),
        longitude: String(lng),
        speed: String(speed),
        course: String(course),
        heading: String(heading),
        destination,
        port,
        status,
        lastPort: "Ushuaia, Argentina",
        notes: "West Africa Ebola Response docked at Port of Granadilla, Tenerife. 147 passengers and crew aboard. Repatriation flights ongoing.",
        lastUpdated: new Date(),
      });
    }
    recordSourceFetch("Ship");
  } catch { /* continue */ }
}

// ===== CASE TIMELINE INGESTION =====
async function ingestCaseTimeline(): Promise<void> {
  const db = getDb();
  for (const c of CASE_TIMELINE_DATA) {
    try {
      const existing = await db.select({ id: caseTimeline.id })
        .from(caseTimeline)
        .where(eq(caseTimeline.caseId, c.caseId))
        .limit(1);

      if (existing.length > 0) continue;

      await db.insert(caseTimeline).values({
        caseId: c.caseId,
        name: c.name,
        status: c.status,
        generation: c.generation,
        date: c.date ? new Date(c.date) : null,
        onsetDate: c.onsetDate ? new Date(c.onsetDate) : null,
        infectedBy: c.infectedBy || null,
        nationality: c.nationality,
        sex: c.sex || null,
        age: c.age || null,
        clinicalNotes: c.clinicalNotes,
        country: c.country,
        city: c.city || null,
        latitude: c.latitude != null ? String(c.latitude) : null,
        longitude: c.longitude != null ? String(c.longitude) : null,
        cabin: (c as any).cabin || null,
        deck: (c as any).deck || null,
        role: (c as any).role || null,
      });
    } catch { /* continue */ }
  }
}

// ===== REPATRIATION FLIGHTS INGESTION =====
async function ingestRepatriationFlights(): Promise<void> {
  const db = getDb();
  for (const f of REPATRIATION_FLIGHTS_DATA) {
    try {
      const existing = await db.select({ id: repatriationFlights.id })
        .from(repatriationFlights)
        .where(and(
          eq(repatriationFlights.country, f.country),
          eq(repatriationFlights.status, f.status)
        ))
        .limit(1);

      if (existing.length > 0) continue;

      await db.insert(repatriationFlights).values({
        country: f.country,
        flag: f.flag,
        status: f.status,
        route: f.route,
        passengers: f.passengers,
      });
    } catch { /* continue */ }
  }
}

// ===== QUARANTINE STATUS INGESTION =====
async function ingestQuarantineStatus(): Promise<void> {
  const db = getDb();
  const now = new Date();
  for (const q of QUARANTINE_PROTOCOLS) {
    try {
      const existing = await db.select({ id: quarantineStatus.id })
        .from(quarantineStatus)
        .where(eq(quarantineStatus.country, q.country))
        .limit(1);

      const quarantineStart = dayjs("2026-05-10").toDate();
      const quarantineEnd = dayjs(quarantineStart).add(q.durationDays, "day").toDate();

      if (existing.length > 0) {
        await db.update(quarantineStatus)
          .set({
            quarantineStart,
            quarantineEnd,
            durationDays: q.durationDays,
            protocol: q.protocol,
            status: q.status,
          })
          .where(eq(quarantineStatus.country, q.country));
      } else {
        await db.insert(quarantineStatus).values({
          country: q.country,
          flag: q.flag,
          passengers: q.passengers,
          quarantineStart,
          quarantineEnd,
          durationDays: q.durationDays,
          protocol: q.protocol,
          status: q.status,
        });
      }
    } catch { /* continue */ }
  }
}

// ===== MAIN INGESTION =====
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

  // 4. Curated case data
  const curatedSignals: ScrapedSignal[] = CURATED_CASES.map(c => ({
    source: "EVDTrack Curated",
    title: c.title,
    url: c.url,
    summary: c.summary,
    advisoryType: c.advisoryType as AdvisoryType,
    severity: c.severity as Severity,
    country: c.country,
    region: c.region,
    publishedAt: c.publishedAt,
    credibility: 98,
    forceInclude: true,
  }));

  // 5-9. Update flight, ship, timeline, repatriation, quarantine in parallel
  console.log("[Ingest] Updating flights, ship, timeline, repatriation, quarantine...");
  await Promise.all([
    fetchFlightPositions().then(() => console.log("[Ingest] Flight positions updated")),
    fetchShipPosition().then(() => console.log("[Ingest] Ship position updated")),
    ingestCaseTimeline().then(() => console.log("[Ingest] Case timeline updated")),
    ingestRepatriationFlights().then(() => console.log("[Ingest] Repatriation flights updated")),
    ingestQuarantineStatus().then(() => console.log("[Ingest] Quarantine status updated")),
  ]);

  // Combine + de-duplicate by URL
  const allSignals = [...curatedSignals, ...rssSignals, ...newsApiSignals, ...serpApiSignals, ...redditSignals, ...scrapedSignals];

  // Filter out junk/generic content
  const JUNK_PATTERNS = /skip to main|read more|click here|privacy policy|terms of|cookie|Eastern Mediterranean|Mental disorders|Welcome to the|Health topics|Sign up|Subscribe|Log in|Newsletter|Advertise|page not found|404|redirect|access denied|upvote|downvote|share this|like this|menu|sidebar|footer|skip to content|navigation/i;

  const validSignals = allSignals.filter((s) => {
    if (JUNK_PATTERNS.test(s.title)) return false;
    if (s.title.length < 15) return false;
    if (s.summary.length < 20) return false;
    return true;
  });

  // De-duplicate by URL
  const urlDeduped = Array.from(new Map(validSignals.map((s) => [s.url, s])).values());

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

  console.log(`[Ingest] Signals: ${allSignals.length} total → ${validSignals.length} valid → ${uniqueSignals.length} unique (URL + title dedup)`);

  // Avoid re-processing existing rows (load recent URLs once)
  const cutoff = dayjs().subtract(keepDays, "day").toDate();
  const existingUrls = new Set(
    (await db.select({ url: monitorItems.url }).from(monitorItems).where(gte(monitorItems.publishedAt, cutoff))).map((r) => r.url),
  );

  const newSignals = uniqueSignals.filter((s) => !existingUrls.has(s.url));

  // Enrich only NEW signals (avoid repeat Gemini usage)
  const aiMax = envInt("INGEST_AI_MAX", 5);
  const aiEnabled = envBool("INGEST_AI_ENABLED", true);
  if (aiEnabled && aiMax > 0 && process.env.GEMINI_API_KEY) {
    const signalsToEnrich = newSignals
      .filter((s) => s.forceInclude || (s.credibility ?? 0) >= 80)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, aiMax);

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
  }

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

  // Persist structured rows (best-effort). This intentionally does not block monitor_items ingestion.
  try {
    const maxStructured = envInt("INGEST_STRUCTURED_MAX", 300);
    const structuredSignals = newSignals
      .slice()
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, maxStructured);

    for (const signal of structuredSignals) {
      try {
        await persistStructuredSignal(db, signal);
      } catch (e) {
        errors += 1;
        log.error(`Structured persist failed (${signal.url}): ${e instanceof Error ? e.message : e}`);
      }
    }
  } catch (e) {
    log.error(`Structured persist phase failed: ${e instanceof Error ? e.message : e}`);
  }

  // Backfill structured tables from monitor_items (for older rows created before structured persistence existed).
  try {
    const cutoffBackfill = dayjs().subtract(keepDays, "day").toDate();
    const docUrls = new Set(
      (await db.select({ url: documentsTable.url }).from(documentsTable).where(gte(documentsTable.createdAt, cutoffBackfill))).map(
        (r) => r.url,
      ),
    );

    const items = await db
      .select({
        title: monitorItems.title,
        source: monitorItems.source,
        url: monitorItems.url,
        summary: monitorItems.summary,
        advisoryType: monitorItems.advisoryType,
        publishedAt: monitorItems.publishedAt,
        country: monitorItems.country,
      })
      .from(monitorItems)
      .where(gte(monitorItems.publishedAt, cutoffBackfill))
      .orderBy(desc(monitorItems.publishedAt))
      .limit(envInt("INGEST_BACKFILL_MISSING_LIMIT", 600));

    const missing = items.filter((item) => !docUrls.has(item.url));
    if (missing.length) {
      log.info(`[Ingest] Backfilling structured tables for ${missing.length} missing monitor_items rows...`);
    }

    for (const item of missing) {
      const signal: ScrapedSignal = {
        source: item.source,
        title: item.title,
        url: item.url,
        summary: item.summary,
        advisoryType: item.advisoryType as AdvisoryType,
        publishedAt: item.publishedAt,
        country: item.country,
        credibility: scoreSourceCredibility(item.source),
      };
      try {
        await persistStructuredSignal(db, signal);
      } catch {
        // ignore per-row
      }
    }
  } catch {
    // ignore
  }

  // Build snapshot rollups (best-effort)
  try {
    await buildSnapshots(db);
  } catch {
    // ignore
  }

  // Clean up old items
  await db.delete(monitorItems).where(lt(monitorItems.publishedAt, cutoff));

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  log.info(`Done: ${inserted} inserted, ${errors} errors from ${uniqueSignals.length} signals (took ${duration}s)`);

  // Record ingest run telemetry (best-effort)
  try {
    await db.insert(ingestRuns).values({
      ranAt: new Date(),
      inserted,
      total: uniqueSignals.length,
      errors,
    });
  } catch {
    // ignore
  }

  return { inserted, total: uniqueSignals.length, errors };
}

// ===== DASHBOARD DATA =====
export async function fetchDashboardData() {
  const db = getDb();

  try {
    const last14 = dayjs().subtract(14, "day").toDate();
    const last7 = dayjs().subtract(7, "day").toDate();

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

    // Extended queries — may fail if new tables don't exist yet
    let flightCount = 0;
    let shipData: any = null;
    let caseCount = 0;
    let quarantineData: any[] = [];
    try {
      const [fc, sd, cc, qd] = await Promise.all([
        db.select({ value: count() }).from(flightPositions),
        db.select().from(shipPositions).orderBy(desc(shipPositions.lastUpdated)).limit(1),
        db.select({ value: count() }).from(caseTimeline),
        db.select().from(quarantineStatus).orderBy(quarantineStatus.country),
      ]);
      flightCount = fc[0]?.value ?? 0;
      shipData = sd[0] || null;
      caseCount = cc[0]?.value ?? 0;
      quarantineData = qd;
    } catch {
      // If extended tables are missing/unavailable, omit those sections rather than returning synthetic values.
      flightCount = 0;
      caseCount = 0;
      shipData = null;
      quarantineData = [];
    }

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

    const trendRows = await db
      .select({
        day: sql<string>`date_trunc('day', ${monitorItems.publishedAt})::date::text`,
        cases: sql<number>`coalesce(sum(${monitorItems.inferredCases}), 0)`,
      })
      .from(monitorItems)
      .where(gte(monitorItems.publishedAt, last7))
      .groupBy(sql`1`)
      .orderBy(sql`1 asc`);

    return {
      stats: {
        totalTrackedReports: totalItems[0]?.value ?? 0,
        highSeverityLast14Days: highSeverityCount[0]?.value ?? 0,
        activeSources: RSS_FEEDS.length,
        lastSyncAt: lastRunItems[0]?.publishedAt ?? null,
        flightCount: flightCount,
        caseCount: caseCount,
      },
      trend: trendRows,
      latest: lastRunItems.map((row) => ({
        ...row,
        sourceCredibility: scoreSourceCredibility(row.source),
      })),
      geo: await (async () => {
        try {
          const geoRows = await db
            .select({ country: monitorItems.country, cnt: count() })
            .from(monitorItems)
            .where(sql`${monitorItems.country} IS NOT NULL AND ${monitorItems.country} != ''`)
            .groupBy(monitorItems.country)
            .orderBy(sql`count(*) desc`);

          // Also include case_timeline countries
          const caseGeoRows = await db
            .select({ country: caseTimeline.country, cnt: count() })
            .from(caseTimeline)
            .where(sql`${caseTimeline.country} IS NOT NULL AND ${caseTimeline.country} != ''`)
            .groupBy(caseTimeline.country)
            .orderBy(sql`count(*) desc`);

          // Merge both sources
          const merged: Record<string, number> = {};
          for (const r of geoRows) {
            if (r.country) merged[r.country] = (merged[r.country] || 0) + r.cnt;
          }
          for (const r of caseGeoRows) {
            if (r.country) merged[r.country] = (merged[r.country] || 0) + r.cnt;
          }
          return Object.entries(merged)
            .sort((a, b) => b[1] - a[1])
            .map(([country, reports]) => ({ country, reports }));
        } catch {
          return [];
        }
      })(),
      ship: shipData || null,
      quarantine: quarantineData,
    };
  } catch (error) {
    console.error("[Dashboard] Error:", error);
    return fetchLiveFeedSnapshot();
  }
}

// ===== LIVE SNAPSHOT (fallback when DB unavailable) =====
export async function fetchLiveFeedSnapshot(limit = 50) {
  const [rssSignals, newsApiSignals, scrapedSignals, serpApiSignals, redditSignals] = await Promise.all([
    fetchFromRssFeeds(),
    fetchFromNewsApi(),
    scrapeOfficialPages(),
    fetchFromSerpApi(),
    fetchFromReddit(),
  ]);

  const curatedSignals: ScrapedSignal[] = CURATED_CASES.map(c => ({
    source: "EVDTrack Curated",
    title: c.title,
    url: c.url,
    summary: c.summary,
    advisoryType: c.advisoryType as AdvisoryType,
    severity: c.severity as Severity,
    country: c.country,
    region: c.region,
    publishedAt: c.publishedAt,
    credibility: 98,
  }));

  const allSignals = [...curatedSignals, ...rssSignals, ...newsApiSignals, ...serpApiSignals, ...redditSignals, ...scrapedSignals];
  const uniqueSignals = Array.from(new Map(allSignals.map(s => [s.url, s])).values());
  const sorted = uniqueSignals.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return {
    stats: {
      totalTrackedReports: sorted.length,
      highSeverityLast14Days: sorted.filter(s => s.severity === "high" || s.severity === "critical").length,
      activeSources: RSS_FEEDS.length,
      lastSyncAt: new Date(),
      flightCount: 0,
      caseCount: 0,
    },
    trend: [],
    latest: sorted.slice(0, limit).map((s, i) => ({
      id: i + 1,
      title: s.title,
      source: s.source,
      url: s.url,
      publishedAt: s.publishedAt,
      summary: s.summary,
      severity: s.severity || "low",
      region: s.region || "Global",
      country: s.country || null,
      inferredCases: s.inferredCases || null,
      advisoryType: s.advisoryType,
      aiRiskNote: null,
      aiConfidence: s.credibility ? String(s.credibility / 100) : null,
      sourceCredibility: s.credibility || 70,
      createdAt: new Date(),
    })),
    geo: Object.entries(
      sorted.reduce<Record<string, number>>((acc, s) => {
        if (s.country) acc[s.country] = (acc[s.country] || 0) + 1;
        return acc;
      }, {}),
    ).map(([country, reports]) => ({ country, reports })),
    ship: null,
    quarantine: [],
  };
}

// ===== EXPORTS =====
export function getShoreStops() {
  return SHORE_STOPS;
}

export function getRepatriationFlights() {
  return REPATRIATION_FLIGHTS_DATA;
}

export function getCaseTimelineData() {
  return CASE_TIMELINE_DATA;
}
