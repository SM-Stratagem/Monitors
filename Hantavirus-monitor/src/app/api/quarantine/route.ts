import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { quarantineStatus } from "../../../../db/schema";
import dayjs from "dayjs";

export const runtime = "nodejs";

const FALLBACK_QUARANTINE = [
  { id: 1, country: "Spain", flag: "🇪🇸", passengers: 14, quarantineStart: "2026-05-10T00:00:00Z", quarantineEnd: "2026-06-24T00:00:00Z", durationDays: 45, protocol: "72hr hospitalization + 45-day home isolation", status: "active", notes: null, createdAt: new Date().toISOString() },
  { id: 2, country: "France", flag: "🇫🇷", passengers: 5, quarantineStart: "2026-05-10T00:00:00Z", quarantineEnd: "2026-06-24T00:00:00Z", durationDays: 45, protocol: "72hr hospitalization + 45-day home isolation", status: "active", notes: null, createdAt: new Date().toISOString() },
  { id: 3, country: "United Kingdom", flag: "🇬🇧", passengers: 22, quarantineStart: "2026-05-10T00:00:00Z", quarantineEnd: "2026-06-24T00:00:00Z", durationDays: 45, protocol: "Hospitalization on arrival + 45-day monitoring", status: "active", notes: null, createdAt: new Date().toISOString() },
  { id: 4, country: "Netherlands", flag: "🇳🇱", passengers: 29, quarantineStart: "2026-05-10T00:00:00Z", quarantineEnd: "2026-06-24T00:00:00Z", durationDays: 45, protocol: "Medical screening + 45-day home isolation", status: "active", notes: null, createdAt: new Date().toISOString() },
  { id: 5, country: "Canada", flag: "🇨🇦", passengers: 4, quarantineStart: "2026-05-10T00:00:00Z", quarantineEnd: "2026-06-24T00:00:00Z", durationDays: 45, protocol: "Quarantine facility + 45-day monitoring", status: "active", notes: null, createdAt: new Date().toISOString() },
  { id: 6, country: "United States", flag: "🇺🇸", passengers: 17, quarantineStart: "2026-05-10T00:00:00Z", quarantineEnd: "2026-06-24T00:00:00Z", durationDays: 45, protocol: "Nebraska Biocontainment Unit + 45-day monitoring", status: "active", notes: null, createdAt: new Date().toISOString() },
  { id: 7, country: "Ireland", flag: "🇮🇪", passengers: 2, quarantineStart: "2026-05-10T00:00:00Z", quarantineEnd: "2026-06-24T00:00:00Z", durationDays: 45, protocol: "Hospital isolation + 45-day home monitoring", status: "active", notes: null, createdAt: new Date().toISOString() },
  { id: 8, country: "Turkey", flag: "🇹🇷", passengers: 3, quarantineStart: "2026-05-10T00:00:00Z", quarantineEnd: "2026-05-24T00:00:00Z", durationDays: 14, protocol: "14-day government facility quarantine", status: "active", notes: null, createdAt: new Date().toISOString() },
  { id: 9, country: "Australia", flag: "🇦🇺", passengers: 8, quarantineStart: "2026-05-11T00:00:00Z", quarantineEnd: "2026-06-25T00:00:00Z", durationDays: 45, protocol: "Quarantine hotel + 45-day monitoring", status: "pending", notes: null, createdAt: new Date().toISOString() },
];

function enrich(rows: any[]) {
  const now = dayjs();
  return rows.map(row => {
    const end = row.quarantineEnd ? dayjs(row.quarantineEnd) : null;
    const start = row.quarantineStart ? dayjs(row.quarantineStart) : null;
    const daysRemaining = end ? Math.max(0, end.diff(now, "day")) : null;
    const daysElapsed = start ? Math.max(0, now.diff(start, "day")) : null;
    const progress = row.durationDays && daysElapsed != null
      ? Math.min(100, Math.round((daysElapsed / row.durationDays) * 100))
      : 0;
    return { ...row, daysRemaining, daysElapsed, progress, isComplete: daysRemaining !== null && daysRemaining <= 0 };
  });
}

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.select().from(quarantineStatus).orderBy(quarantineStatus.country);
    if (rows.length === 0) return NextResponse.json({ quarantine: enrich(FALLBACK_QUARANTINE) });
    return NextResponse.json({ quarantine: enrich(rows) });
  } catch {
    return NextResponse.json({ quarantine: enrich(FALLBACK_QUARANTINE) });
  }
}
