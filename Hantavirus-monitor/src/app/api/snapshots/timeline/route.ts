import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { snapshotStats, snapshotTimeline } from "../../../../../db/schema";

export const runtime = "nodejs";

export async function GET() {
  const db = getDb();
  try {
    const latest = await db.select().from(snapshotStats).orderBy(desc(snapshotStats.builtAt)).limit(1);
    const builtAt = latest[0]?.builtAt ?? null;
    if (!builtAt) return NextResponse.json({ ok: true, builtAt: null, timeline: [] });

    const timeline = await db
      .select()
      .from(snapshotTimeline)
      .where(eq(snapshotTimeline.builtAt, builtAt))
      .orderBy(desc(snapshotTimeline.id))
      .limit(200);

    return NextResponse.json({ ok: true, builtAt, timeline });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}

