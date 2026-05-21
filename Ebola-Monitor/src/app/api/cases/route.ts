import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { caseTimeline } from "../../../../db/schema";
import { desc } from "drizzle-orm";

export const runtime = "nodejs";

const FALLBACK_CASES = [
  { id: 1, caseId: "DRC-001", name: "North Kivu Index Case", status: "confirmed", generation: 0, date: "2026-03-15", onsetDate: "2026-03-10", infectedBy: null, nationality: "Congolese", sex: "female", age: 34, clinicalNotes: "Index case. Traditional healer contact. Zaire ebolavirus confirmed.", country: "Democratic Republic of Congo", city: "Goma", latitude: "-1.6792", longitude: "29.2228", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 2, caseId: "DRC-002", name: "Healthcare Worker", status: "confirmed", generation: 1, date: "2026-03-22", onsetDate: "2026-03-18", infectedBy: "DRC-001", nationality: "Congolese", sex: "male", age: 28, clinicalNotes: "Nurse at Bushu Health Center. PPE breach during patient care.", country: "Democratic Republic of Congo", city: "Goma", latitude: "-1.6792", longitude: "29.2228", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 3, caseId: "DRC-003", name: "Family Contact", status: "confirmed", generation: 2, date: "2026-03-28", onsetDate: "2026-03-25", infectedBy: "DRC-001", nationality: "Congolese", sex: "female", age: 42, clinicalNotes: "Sister of index case. Traditional burial contact.", country: "Democratic Republic of Congo", city: "Goma", latitude: "-1.6792", longitude: "29.2228", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 4, caseId: "GIN-001", name: "Conakry Index Case", status: "confirmed", generation: 0, date: "2026-04-05", onsetDate: "2026-04-01", infectedBy: null, nationality: "Guinean", sex: "male", age: 45, clinicalNotes: "Market trader. Travel history to DRC border region.", country: "Guinea", city: "Conakry", latitude: "9.6412", longitude: "-13.5784", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 5, caseId: "GIN-002", name: "Market Contact", status: "confirmed", generation: 1, date: "2026-04-10", onsetDate: "2026-04-07", infectedBy: "GIN-001", nationality: "Guinean", sex: "female", age: 38, clinicalNotes: "Fellow trader at Conakry Central Market.", country: "Guinea", city: "Conakry", latitude: "9.6412", longitude: "-13.5784", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 6, caseId: "SLE-001", name: "Freetown Index Case", status: "confirmed", generation: 0, date: "2026-04-12", onsetDate: "2026-04-08", infectedBy: null, nationality: "Sierra Leonean", sex: "female", age: 29, clinicalNotes: "Returned from Guinea. Symptomatic on arrival.", country: "Sierra Leone", city: "Freetown", latitude: "8.4841", longitude: "-13.2344", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 7, caseId: "SLE-002", name: "Healthcare Worker", status: "deceased", generation: 1, date: "2026-04-18", onsetDate: "2026-04-14", infectedBy: "SLE-001", nationality: "Sierra Leonean", sex: "male", age: 36, clinicalNotes: "Doctor at Connaught Hospital. Died despite experimental treatment.", country: "Sierra Leone", city: "Freetown", latitude: "8.4841", longitude: "-13.2344", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 8, caseId: "LBR-001", name: "Monrovia Suspected", status: "confirmed", generation: 0, date: "2026-04-20", onsetDate: "2026-04-16", infectedBy: null, nationality: "Liberian", sex: "male", age: 41, clinicalNotes: "Cross-border trader. Contact with Guinea cases.", country: "Liberia", city: "Monrovia", latitude: "6.2907", longitude: "-10.7605", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 9, caseId: "UGA-001", name: "Kampala Cluster", status: "confirmed", generation: 0, date: "2026-05-01", onsetDate: "2026-04-28", infectedBy: null, nationality: "Ugandan", sex: "female", age: 25, clinicalNotes: "Healthcare worker at Mulago Hospital. Sudan ebolavirus.", country: "Uganda", city: "Kampala", latitude: "0.3476", longitude: "32.5825", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 10, caseId: "NGA-001", name: "Lagos Suspected Case", status: "monitoring", generation: 0, date: null, onsetDate: "2026-05-08", infectedBy: null, nationality: "Nigerian", sex: "male", age: 33, clinicalNotes: "Traveler from Guinea. Isolation at Lagos University Teaching Hospital.", country: "Nigeria", city: "Lagos", latitude: "6.5244", longitude: "3.3792", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
];

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.select().from(caseTimeline).orderBy(desc(caseTimeline.date)).limit(100);
    if (rows.length === 0) return NextResponse.json({ cases: FALLBACK_CASES });
    return NextResponse.json({ cases: rows });
  } catch {
    return NextResponse.json({ cases: FALLBACK_CASES });
  }
}
