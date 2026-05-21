import { desc, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { monitorItems } from "../../db/schema";

export type SeoContext = {
  lastIngestAt: Date | null;
  lastSnapshotAt: Date | null;
  totalDocuments: number | null;
  totalEvents: number | null;
  countriesActive: number | null;
};

export async function getSeoContext(): Promise<SeoContext> {
  try {
    const db = getDb();

    const [lastItem, countryCount] = await Promise.all([
      db.select({ publishedAt: monitorItems.publishedAt })
        .from(monitorItems)
        .orderBy(desc(monitorItems.publishedAt))
        .limit(1),
      db.select({ value: sql<number>`count(distinct ${monitorItems.country})` })
        .from(monitorItems)
        .where(sql`${monitorItems.country} IS NOT NULL AND ${monitorItems.country} != ''`),
    ]);

    return {
      lastIngestAt: lastItem[0]?.publishedAt ?? null,
      lastSnapshotAt: lastItem[0]?.publishedAt ?? null,
      totalDocuments: null,
      totalEvents: null,
      countriesActive: countryCount[0]?.value ?? null,
    };
  } catch {
    return {
      lastIngestAt: null,
      lastSnapshotAt: null,
      totalDocuments: null,
      totalEvents: null,
      countriesActive: null,
    };
  }
}
