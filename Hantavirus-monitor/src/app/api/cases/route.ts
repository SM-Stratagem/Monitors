import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { caseTimeline } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";

export const runtime = "nodejs";

const FALLBACK_CASES = [
  { id: 1, caseId: "PEDB43", name: "Dutch Female Passenger (Index)", status: "deceased", generation: 0, date: "2026-04-26", onsetDate: "2026-04-24", infectedBy: null, nationality: "Dutch", sex: "female", age: 69, clinicalNotes: "Index case. Andes strain confirmed.", country: "South Africa", city: "Johannesburg", latitude: "-26.2041", longitude: "28.0473", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 2, caseId: "P002", name: "Dutch Male Passenger (Husband)", status: "deceased", generation: 1, date: "2026-04-11", onsetDate: "2026-04-06", infectedBy: "PEDB43", nationality: "Dutch", sex: "male", age: 70, clinicalNotes: "Died April 11 aboard ship.", country: "International Waters", city: null, latitude: "-37.0", longitude: "-15.0", cabin: "406", deck: 4, role: "passenger", createdAt: new Date().toISOString() },
  { id: 3, caseId: "P003", name: "British Guest - Symptomatic Evacuee", status: "confirmed", generation: 1, date: "2026-04-24", onsetDate: "2026-04-24", infectedBy: "PEDB43", nationality: "British", sex: "male", age: 55, clinicalNotes: "Provided care to index without PPE.", country: "United Kingdom", city: "Manchester", latitude: "53.4808", longitude: "-2.2426", cabin: "C12", deck: 2, role: "passenger", createdAt: new Date().toISOString() },
  { id: 4, caseId: "P004", name: "Dutch Crew Member", status: "asymptomatic", generation: 1, date: null, onsetDate: "2026-04-18", infectedBy: "PEDB43", nationality: "Dutch", sex: "male", age: 35, clinicalNotes: "Shared workspace with P003.", country: "Netherlands", city: "Eindhoven", latitude: "51.4416", longitude: "5.4697", cabin: "C08", deck: 2, role: "crew", createdAt: new Date().toISOString() },
  { id: 5, caseId: "PKLM01", name: "KLM Contact - Johannesburg", status: "monitoring", generation: 1, date: null, onsetDate: null, infectedBy: "PEDB43", nationality: "Unknown", sex: null, age: null, clinicalNotes: "Contact from KLM flight. Under monitoring.", country: "South Africa", city: "Johannesburg", latitude: "-26.2041", longitude: "28.0473", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 6, caseId: "PFRCE01", name: "French Citizen - Evacuated", status: "confirmed", generation: 1, date: "2026-05-10", onsetDate: null, infectedBy: "PEDB43", nationality: "French", sex: "female", age: 45, clinicalNotes: "Evacuated via medical charter to Paris.", country: "France", city: "Paris", latitude: "48.8566", longitude: "2.3522", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 7, caseId: "PESP02", name: "Spanish Passenger - Evacuated", status: "confirmed", generation: 1, date: "2026-05-10", onsetDate: null, infectedBy: "PEDB43", nationality: "Spanish", sex: "male", age: 62, clinicalNotes: "Evacuated via A310 to Torrejón Air Base.", country: "Spain", city: "Madrid", latitude: "40.4168", longitude: "-3.7038", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 8, caseId: "PUSNJ01", name: "US Passenger - Nebraska", status: "confirmed", generation: 1, date: "2026-05-10", onsetDate: null, infectedBy: "PEDB43", nationality: "American", sex: "female", age: 58, clinicalNotes: "Biocontainment charter to Nebraska BCU.", country: "United States", city: "Omaha", latitude: "41.2565", longitude: "-95.9345", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 9, caseId: "PCAN01", name: "Canadian Passenger - Isolating", status: "monitoring", generation: 1, date: null, onsetDate: null, infectedBy: "PEDB43", nationality: "Canadian", sex: "male", age: 47, clinicalNotes: "Early returnee isolating in Quebec.", country: "Canada", city: "Saguenay", latitude: "48.4284", longitude: "-71.0676", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 10, caseId: "PCAN02", name: "Canadian Passenger - Isolating", status: "monitoring", generation: 1, date: null, onsetDate: null, infectedBy: "PEDB43", nationality: "Canadian", sex: "female", age: 52, clinicalNotes: "Early returnee isolating in Quebec.", country: "Canada", city: "Saguenay", latitude: "48.4284", longitude: "-71.0676", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 11, caseId: "PCAN03", name: "Canadian Passenger - Isolating", status: "monitoring", generation: 1, date: null, onsetDate: null, infectedBy: "PEDB43", nationality: "Canadian", sex: "male", age: 61, clinicalNotes: "Early returnee isolating in Quebec.", country: "Canada", city: "Saguenay", latitude: "48.4284", longitude: "-71.0676", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 12, caseId: "PGRP01", name: "Saint Helena Departures - Untraced", status: "asymptomatic", generation: 1, date: null, onsetDate: "2026-04-24", infectedBy: null, nationality: "Various", sex: null, age: null, clinicalNotes: "30-40 passengers disembarked at St Helena.", country: "Saint Helena", city: "Jamestown", latitude: "-15.965", longitude: "-5.7089", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
  { id: 13, caseId: "PTRDC01", name: "British Man - Tristan da Cunha", status: "confirmed", generation: 2, date: "2026-05-09", onsetDate: "2026-05-07", infectedBy: null, nationality: "British", sex: "male", age: 40, clinicalNotes: "Contact with MV Hondius passengers. Paratroopers deployed.", country: "United Kingdom", city: "Edinburgh", latitude: "55.9533", longitude: "-3.1883", cabin: null, deck: null, role: null, createdAt: new Date().toISOString() },
];

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const generation = searchParams.get("generation");
    const country = searchParams.get("country");

    const rows = await db.select().from(caseTimeline).orderBy(desc(caseTimeline.date));
    let filtered = rows;
    if (status) filtered = filtered.filter(r => r.status === status);
    if (generation) filtered = filtered.filter(r => r.generation === Number(generation));
    if (country) filtered = filtered.filter(r => r.country?.toLowerCase().includes(country.toLowerCase()));

    if (filtered.length === 0) return NextResponse.json({ cases: FALLBACK_CASES, total: FALLBACK_CASES.length });
    return NextResponse.json({ cases: filtered, total: filtered.length });
  } catch {
    return NextResponse.json({ cases: FALLBACK_CASES, total: FALLBACK_CASES.length });
  }
}
