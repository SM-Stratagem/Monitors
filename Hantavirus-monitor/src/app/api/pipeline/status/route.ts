import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { ingestRuns, jobRuns, snapshotStats } from "../../../../../db/schema";

export const runtime = "nodejs";

export async function GET() {
  const db = getDb();
  try {
    const [lastSnapshot, lastJob, lastIngest] = await Promise.all([
      db.select().from(snapshotStats).orderBy(desc(snapshotStats.builtAt)).limit(1),
      db.select().from(jobRuns).orderBy(desc(jobRuns.startedAt)).limit(1),
      db.select().from(ingestRuns).orderBy(desc(ingestRuns.ranAt)).limit(1),
    ]);

    return NextResponse.json({
      ok: true,
      snapshot: lastSnapshot[0] ?? null,
      job: lastJob[0] ?? null,
      ingest: lastIngest[0] ?? null,
      at: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, error: message, at: new Date().toISOString() }, { status: 200 });
  }
}
