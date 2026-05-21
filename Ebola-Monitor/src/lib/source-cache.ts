/**
 * Source-level TTL cache with HTTP ETag / If-Modified-Since conditional
 * request support for the ingestion pipeline.
 *
 * Pure in-memory — no external dependencies.
 */

export interface SourceCacheEntry {
  lastFetchAt: number;
  etag?: string;
  lastModified?: string;
  responseBody?: string;
}

const cache = new Map<string, SourceCacheEntry>();

export function shouldFetchSource(sourceKey: string, ttlMs: number): boolean {
  const entry = cache.get(sourceKey);
  if (!entry) return true;
  return Date.now() - entry.lastFetchAt > ttlMs;
}

export function recordSourceFetch(
  sourceKey: string,
  etag?: string,
  lastModified?: string,
  responseBody?: string,
): void {
  const existing = cache.get(sourceKey);
  cache.set(sourceKey, {
    lastFetchAt: Date.now(),
    etag: etag ?? existing?.etag,
    lastModified: lastModified ?? existing?.lastModified,
    responseBody: responseBody ?? existing?.responseBody,
  });
}

export function getCachedResponse(sourceKey: string): string | null {
  return cache.get(sourceKey)?.responseBody ?? null;
}

export function getConditionalHeaders(sourceKey: string): Record<string, string> {
  const entry = cache.get(sourceKey);
  if (!entry) return {};

  const headers: Record<string, string> = {};
  if (entry.etag) {
    headers["If-None-Match"] = entry.etag;
  }
  if (entry.lastModified) {
    headers["If-Modified-Since"] = entry.lastModified;
  }
  return headers;
}

export function clearCache(): void {
  cache.clear();
}

export function getCacheStats(): {
  sources: Array<{ key: string; lastFetchAt: number; age: string }>;
} {
  const now = Date.now();
  const sources: Array<{ key: string; lastFetchAt: number; age: string }> = [];

  for (const [key, entry] of cache) {
    const diffMs = now - entry.lastFetchAt;
    sources.push({
      key,
      lastFetchAt: entry.lastFetchAt,
      age: formatDuration(diffMs),
    });
  }

  return { sources };
}

function formatDuration(ms: number): string {
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h`;
  return `${Math.floor(ms / 86_400_000)}d`;
}

// Default TTLs by source type (milliseconds)
export const SOURCE_TTLS = {
  rss: 60 * 60 * 1000,               // 1 hour
  newsApi: 2 * 60 * 60 * 1000,       // 2 hours
  serpApi: 2 * 60 * 60 * 1000,       // 2 hours
  reddit: 30 * 60 * 1000,            // 30 minutes
  officialScrape: 6 * 60 * 60 * 1000, // 6 hours
  flightTracking: 30 * 60 * 1000,    // 30 minutes
  shipTracking: 2 * 60 * 60 * 1000,  // 2 hours
} as const;

export type SourceType = keyof typeof SOURCE_TTLS;

export function getSourceTTL(sourceType: SourceType): number {
  return SOURCE_TTLS[sourceType];
}
