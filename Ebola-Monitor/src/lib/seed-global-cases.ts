import "dotenv/config";
import { getDb } from "./db";
import { caseTimeline } from "../../db/schema";
import { eq } from "drizzle-orm";

const db = getDb();

const GLOBAL_CASES = [
  // === EBOLA OUTBREAK - WEST AFRICA 2026 ===
  // DRC (Democratic Republic of Congo)
  { caseId: "DRC-001", name: "North Kivu Index Case", status: "confirmed", generation: 0, date: "2026-03-15", onsetDate: "2026-03-10", infectedBy: null, nationality: "Congolese", sex: "female", age: 34, clinicalNotes: "Index case. Traditional healer contact. Zaire ebolavirus confirmed.", country: "Democratic Republic of Congo", city: "Goma", latitude: -1.6792, longitude: 29.2228, cabin: null, deck: null, role: null },
  { caseId: "DRC-002", name: "Healthcare Worker", status: "confirmed", generation: 1, date: "2026-03-22", onsetDate: "2026-03-18", infectedBy: "DRC-001", nationality: "Congolese", sex: "male", age: 28, clinicalNotes: "Nurse at Bushu Health Center. PPE breach during patient care.", country: "Democratic Republic of Congo", city: "Goma", latitude: -1.6792, longitude: 29.2228, cabin: null, deck: null, role: null },
  { caseId: "DRC-003", name: "Family Contact", status: "confirmed", generation: 2, date: "2026-03-28", onsetDate: "2026-03-25", infectedBy: "DRC-001", nationality: "Congolese", sex: "female", age: 42, clinicalNotes: "Sister of index case. Traditional burial contact.", country: "Democratic Republic of Congo", city: "Goma", latitude: -1.6792, longitude: 29.2228, cabin: null, deck: null, role: null },
  { caseId: "DRC-004", name: "Community Contact", status: "monitoring", generation: 2, date: null, onsetDate: null, infectedBy: "DRC-001", nationality: "Congolese", sex: "male", age: 55, clinicalNotes: "Neighbor who attended funeral. Under observation.", country: "Democratic Republic of Congo", city: "Goma", latitude: -1.6792, longitude: 29.2228, cabin: null, deck: null, role: null },
  { caseId: "DRC-005", name: "Bukavu Cluster Case", status: "confirmed", generation: 1, date: "2026-04-02", onsetDate: "2026-03-29", infectedBy: null, nationality: "Congolese", sex: "female", age: 31, clinicalNotes: "Secondary cluster in Bukavu. Contact tracing underway.", country: "Democratic Republic of Congo", city: "Bukavu", latitude: -2.5124, longitude: 28.8668, cabin: null, deck: null, role: null },

  // Guinea
  { caseId: "GIN-001", name: "Conakry Index Case", status: "confirmed", generation: 0, date: "2026-04-05", onsetDate: "2026-04-01", infectedBy: null, nationality: "Guinean", sex: "male", age: 45, clinicalNotes: "Market trader. Travel history to DRC border region.", country: "Guinea", city: "Conakry", latitude: 9.6412, longitude: -13.5784, cabin: null, deck: null, role: null },
  { caseId: "GIN-002", name: "Market Contact", status: "confirmed", generation: 1, date: "2026-04-10", onsetDate: "2026-04-07", infectedBy: "GIN-001", nationality: "Guinean", sex: "female", age: 38, clinicalNotes: "Fellow trader at Conakry Central Market.", country: "Guinea", city: "Conakry", latitude: 9.6412, longitude: -13.5784, cabin: null, deck: null, role: null },
  { caseId: "GIN-003", name: "Family Member", status: "recovered", generation: 1, date: "2026-04-20", onsetDate: "2026-04-08", infectedBy: "GIN-001", nationality: "Guinean", sex: "male", age: 52, clinicalNotes: "Recovered after 12 days at Ebola Treatment Center.", country: "Guinea", city: "Conakry", latitude: 9.6412, longitude: -13.5784, cabin: null, deck: null, role: null },

  // Sierra Leone
  { caseId: "SLE-001", name: "Freetown Index Case", status: "confirmed", generation: 0, date: "2026-04-12", onsetDate: "2026-04-08", infectedBy: null, nationality: "Sierra Leonean", sex: "female", age: 29, clinicalNotes: "Returned from Guinea. Symptomatic on arrival.", country: "Sierra Leone", city: "Freetown", latitude: 8.4841, longitude: -13.2344, cabin: null, deck: null, role: null },
  { caseId: "SLE-002", name: "Healthcare Worker", status: "deceased", generation: 1, date: "2026-04-18", onsetDate: "2026-04-14", infectedBy: "SLE-001", nationality: "Sierra Leonean", sex: "male", age: 36, clinicalNotes: "Doctor at Connaught Hospital. Died despite experimental treatment.", country: "Sierra Leone", city: "Freetown", latitude: 8.4841, longitude: -13.2344, cabin: null, deck: null, role: null },

  // Liberia
  { caseId: "LBR-001", name: "Monrovia Suspected", status: "confirmed", generation: 0, date: "2026-04-20", onsetDate: "2026-04-16", infectedBy: null, nationality: "Liberian", sex: "male", age: 41, clinicalNotes: "Cross-border trader. Contact with Guinea cases.", country: "Liberia", city: "Monrovia", latitude: 6.2907, longitude: -10.7605, cabin: null, deck: null, role: null },

  // Uganda
  { caseId: "UGA-001", name: "Kampala Cluster", status: "confirmed", generation: 0, date: "2026-05-01", onsetDate: "2026-04-28", infectedBy: null, nationality: "Ugandan", sex: "female", age: 25, clinicalNotes: "Healthcare worker at Mulago Hospital. Sudan ebolavirus.", country: "Uganda", city: "Kampala", latitude: 0.3476, longitude: 32.5825, cabin: null, deck: null, role: null },
  { caseId: "UGA-002", name: "Patient Contact", status: "confirmed", generation: 1, date: "2026-05-05", onsetDate: "2026-05-02", infectedBy: "UGA-001", nationality: "Ugandan", sex: "male", age: 58, clinicalNotes: "Family member of UGA-001. Symptomatic.", country: "Uganda", city: "Kampala", latitude: 0.3476, longitude: 32.5825, cabin: null, deck: null, role: null },

  // Nigeria
  { caseId: "NGA-001", name: "Lagos Suspected Case", status: "monitoring", generation: 0, date: null, onsetDate: "2026-05-08", infectedBy: null, nationality: "Nigerian", sex: "male", age: 33, clinicalNotes: "Traveler from Guinea. Isolation at Lagos University Teaching Hospital.", country: "Nigeria", city: "Lagos", latitude: 6.5244, longitude: 3.3792, cabin: null, deck: null, role: null },

  // South Sudan
  { caseId: "SSD-001", name: "Juba Index Case", status: "confirmed", generation: 0, date: "2026-04-25", onsetDate: "2026-04-21", infectedBy: null, nationality: "South Sudanese", sex: "female", age: 39, clinicalNotes: "Cross-border contact with DRC cases. Zaire ebolavirus confirmed.", country: "South Sudan", city: "Juba", latitude: 4.8594, longitude: 31.5713, cabin: null, deck: null, role: null },

  // Cameroon
  { caseId: "CMR-001", name: "Yaoundé Contact", status: "monitoring", generation: 1, date: null, onsetDate: null, infectedBy: "DRC-001", nationality: "Cameroonian", sex: "male", age: 47, clinicalNotes: "Cross-border worker. Under 21-day observation.", country: "Cameroon", city: "Yaoundé", latitude: 3.8480, longitude: 11.5021, cabin: null, deck: null, role: null },
];

let inserted = 0;
for (const c of GLOBAL_CASES) {
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
    cabin: c.cabin || null,
    deck: c.deck || null,
    role: c.role || null,
  });
  inserted += 1;
}

console.log(`Seeded ${inserted} new global Ebola cases (total attempted: ${GLOBAL_CASES.length})`);
