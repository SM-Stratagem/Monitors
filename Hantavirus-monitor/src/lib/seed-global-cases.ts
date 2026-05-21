import "dotenv/config";
import { getDb } from "./db";
import { caseTimeline } from "../../db/schema";
import { eq } from "drizzle-orm";

const db = getDb();

const GLOBAL_CASES = [
  // === MV HONDIUS OUTBREAK (Gen 0-2) ===
  { caseId: "PEDB43", name: "Dutch Female Passenger (Index)", status: "deceased", generation: 0, date: "2026-04-26", onsetDate: "2026-04-24", infectedBy: null, nationality: "Dutch", sex: "female", age: 69, clinicalNotes: "Index case. Boarded SHN symptomatic, deteriorated in-flight, died at JNB ER. Andes strain confirmed.", country: "South Africa", city: "Johannesburg", latitude: -26.2041, longitude: 28.0473, cabin: null, deck: null, role: null },
  { caseId: "P002", name: "Dutch Male Passenger (Husband)", status: "deceased", generation: 1, date: "2026-04-11", onsetDate: "2026-04-06", infectedBy: "PEDB43", nationality: "Dutch", sex: "male", age: 70, clinicalNotes: "Husband of index. Onset Apr 6, died Apr 11 aboard ship.", country: "International Waters", city: null, latitude: -37.0, longitude: -15.0, cabin: "406", deck: 4, role: "passenger" },
  { caseId: "P003", name: "British Guest - Symptomatic", status: "confirmed", generation: 1, date: "2026-04-24", onsetDate: "2026-04-24", infectedBy: "PEDB43", nationality: "British", sex: "male", age: 55, clinicalNotes: "Provided care to index without PPE. Onset 9d post-exposure. Evacuated Apr 27.", country: "United Kingdom", city: "Manchester", latitude: 53.4808, longitude: -2.2426, cabin: "C12", deck: 2, role: "passenger" },
  { caseId: "P004", name: "Dutch Crew Member", status: "asymptomatic", generation: 1, date: null, onsetDate: "2026-04-18", infectedBy: "PEDB43", nationality: "Dutch", sex: "male", age: 35, clinicalNotes: "Shared workspace with P003. Serology pending.", country: "Netherlands", city: "Eindhoven", latitude: 51.4416, longitude: 5.4697, cabin: "C08", deck: 2, role: "crew" },
  { caseId: "PKLM01", name: "KLM Contact - Johannesburg", status: "monitoring", generation: 1, date: null, onsetDate: null, infectedBy: "PEDB43", nationality: "Unknown", sex: null, age: null, clinicalNotes: "Contact from KLM flight. Under monitoring.", country: "South Africa", city: "Johannesburg", latitude: -26.2041, longitude: 28.0473, cabin: null, deck: null, role: null },
  { caseId: "PFRCE01", name: "French Citizen - Evacuated", status: "confirmed", generation: 1, date: "2026-05-10", onsetDate: null, infectedBy: "PEDB43", nationality: "French", sex: "female", age: 45, clinicalNotes: "Evacuated via medical charter to Paris. 1 of 5 symptomatic.", country: "France", city: "Paris", latitude: 48.8566, longitude: 2.3522, cabin: null, deck: null, role: null },
  { caseId: "PESP02", name: "Spanish Passenger - Evacuated", status: "confirmed", generation: 1, date: "2026-05-10", onsetDate: null, infectedBy: "PEDB43", nationality: "Spanish", sex: "male", age: 62, clinicalNotes: "Evacuated via A310 to Torrejón Air Base.", country: "Spain", city: "Madrid", latitude: 40.4168, longitude: -3.7038, cabin: null, deck: null, role: null },
  { caseId: "PUSNJ01", name: "US Passenger - Nebraska", status: "confirmed", generation: 1, date: "2026-05-10", onsetDate: null, infectedBy: "PEDB43", nationality: "American", sex: "female", age: 58, clinicalNotes: "Biocontainment charter to Nebraska BCU at UNMC.", country: "United States", city: "Omaha", latitude: 41.2565, longitude: -95.9345, cabin: null, deck: null, role: null },
  { caseId: "PCAN01", name: "Canadian Passenger - Isolating", status: "monitoring", generation: 1, date: null, onsetDate: null, infectedBy: "PEDB43", nationality: "Canadian", sex: "male", age: 47, clinicalNotes: "Early returnee isolating in Quebec.", country: "Canada", city: "Saguenay", latitude: 48.4284, longitude: -71.0676, cabin: null, deck: null, role: null },
  { caseId: "PCAN02", name: "Canadian Passenger - Isolating", status: "monitoring", generation: 1, date: null, onsetDate: null, infectedBy: "PEDB43", nationality: "Canadian", sex: "female", age: 52, clinicalNotes: "Early returnee isolating in Quebec.", country: "Canada", city: "Saguenay", latitude: 48.4284, longitude: -71.0676, cabin: null, deck: null, role: null },
  { caseId: "PCAN03", name: "Canadian Passenger - Isolating", status: "monitoring", generation: 1, date: null, onsetDate: null, infectedBy: "PEDB43", nationality: "Canadian", sex: "male", age: 61, clinicalNotes: "Early returnee isolating in Quebec.", country: "Canada", city: "Saguenay", latitude: 48.4284, longitude: -71.0676, cabin: null, deck: null, role: null },
  { caseId: "PGRP01", name: "St Helena Departures - Untraced", status: "asymptomatic", generation: 1, date: null, onsetDate: "2026-04-24", infectedBy: null, nationality: "Various", sex: null, age: null, clinicalNotes: "30-40 passengers disembarked at St Helena. Tracing ongoing.", country: "Saint Helena", city: "Jamestown", latitude: -15.965, longitude: -5.7089, cabin: null, deck: null, role: null },
  { caseId: "PTRDC01", name: "British Man - Tristan da Cunha", status: "confirmed", generation: 2, date: "2026-05-09", onsetDate: "2026-05-07", infectedBy: null, nationality: "British", sex: "male", age: 40, clinicalNotes: "Contact with MV Hondius passengers. British paratroopers airdropped.", country: "United Kingdom", city: "Edinburgh", latitude: 55.9533, longitude: -3.1883, cabin: null, deck: null, role: null },

  // === GLOBAL ENDEMIC HANTAVIRUS CASES (2025-2026) ===
  // Argentina
  { caseId: "ARG-2025-001", name: "Buenos Aires Province Cluster", status: "confirmed", generation: null, date: "2025-08-15", onsetDate: "2025-08-10", infectedBy: null, nationality: "Argentine", sex: "male", age: 42, clinicalNotes: "Endemic Andes virus. Occupational exposure in agricultural zone.", country: "Argentina", city: "La Plata", latitude: -34.9214, longitude: -57.9545, cabin: null, deck: null, role: null },
  { caseId: "ARG-2025-002", name: "Patagonia Family Cluster", status: "recovered", generation: null, date: "2025-09-03", onsetDate: "2025-08-28", infectedBy: null, nationality: "Argentine", sex: "female", age: 38, clinicalNotes: "3-person family cluster in Ushuaia region. 2 recovered.", country: "Argentina", city: "Ushuaia", latitude: -54.8019, longitude: -68.3030, cabin: null, deck: null, role: null },
  { caseId: "ARG-2025-003", name: "Cordoba Province Case", status: "confirmed", generation: null, date: "2025-11-22", onsetDate: "2025-11-18", infectedBy: null, nationality: "Argentine", sex: "male", age: 55, clinicalNotes: "Hospitalized with HPS. Rodent exposure in rural dwelling.", country: "Argentina", city: "Córdoba", latitude: -31.4201, longitude: -64.1888, cabin: null, deck: null, role: null },
  { caseId: "ARG-2026-001", name: "Buenos Aires Metro Cluster", status: "confirmed", generation: null, date: "2026-01-14", onsetDate: "2026-01-10", infectedBy: null, nationality: "Argentine", sex: "female", age: 29, clinicalNotes: "Urban case linked to rodent infestation in apartment building.", country: "Argentina", city: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, cabin: null, deck: null, role: null },
  { caseId: "ARG-2026-002", name: "Mendoza Wine Country", status: "recovered", generation: null, date: "2026-02-08", onsetDate: "2026-02-02", infectedBy: null, nationality: "Argentine", sex: "male", age: 61, clinicalNotes: "Vineyard worker. Rodent exposure during harvest.", country: "Argentina", city: "Mendoza", latitude: -32.8895, longitude: -68.8458, cabin: null, deck: null, role: null },
  { caseId: "ARG-2026-003", name: "Tierra del Fuego Index", status: "confirmed", generation: null, date: "2026-04-01", onsetDate: "2026-03-28", infectedBy: null, nationality: "Argentine", sex: "male", age: 48, clinicalNotes: "Province's first case ever. Bird-watching outing near Ushuaia. Likely source of MV Hondius exposure.", country: "Argentina", city: "Ushuaia", latitude: -54.8019, longitude: -68.3030, cabin: null, deck: null, role: null },

  // Chile
  { caseId: "CHL-2025-001", name: "Araucania Region Outbreak", status: "confirmed", generation: null, date: "2025-10-12", onsetDate: "2025-10-08", infectedBy: null, nationality: "Chilean", sex: "female", age: 34, clinicalNotes: "Part of 5-case cluster in Mapuche territory. Andes virus.", country: "Chile", city: "Temuco", latitude: -38.7359, longitude: -72.5904, cabin: null, deck: null, role: null },
  { caseId: "CHL-2026-001", name: "Santiago Hospitalized Case", status: "confirmed", generation: null, date: "2026-03-18", onsetDate: "2026-03-14", infectedBy: null, nationality: "Chilean", sex: "male", age: 52, clinicalNotes: "Traveler from southern Chile. HPS with renal involvement.", country: "Chile", city: "Santiago", latitude: -33.4489, longitude: -70.6693, cabin: null, deck: null, role: null },

  // China
  { caseId: "CHN-2025-001", name: "Shandong Province Cluster", status: "confirmed", generation: null, date: "2025-10-01", onsetDate: "2025-09-27", infectedBy: null, nationality: "Chinese", sex: "male", age: 39, clinicalNotes: "Part of autumn HFRS peak. Hantaan virus from striped field mouse.", country: "China", city: "Jinan", latitude: 36.6512, longitude: 116.9972, cabin: null, deck: null, role: null },
  { caseId: "CHN-2025-002", name: "Jilin Province Outbreak", status: "confirmed", generation: null, date: "2025-11-15", onsetDate: "2025-11-10", infectedBy: null, nationality: "Chinese", sex: "male", age: 45, clinicalNotes: "Military training exercise in endemic area. 3 cases.", country: "China", city: "Changchun", latitude: 43.8171, longitude: 125.3235, cabin: null, deck: null, role: null },
  { caseId: "CHN-2025-003", name: "Heilongjiang Winter Case", status: "recovered", generation: null, date: "2025-12-20", onsetDate: "2025-12-15", infectedBy: null, nationality: "Chinese", sex: "female", age: 28, clinicalNotes: "Farmer. Seoul virus detected. Recovered after 3 weeks.", country: "China", city: "Harbin", latitude: 45.8038, longitude: 126.5350, cabin: null, deck: null, role: null },
  { caseId: "CHN-2026-001", name: "Inner Mongolia Cluster", status: "confirmed", generation: null, date: "2026-02-28", onsetDate: "2026-02-22", infectedBy: null, nationality: "Chinese", sex: "male", age: 50, clinicalNotes: "5-case cluster in herding communities. Hantaan virus.", country: "China", city: "Hohhot", latitude: 40.8424, longitude: 111.7500, cabin: null, deck: null, role: null },

  // South Korea
  { caseId: "KOR-2025-001", name: "Gyeonggi Province Case", status: "confirmed", generation: null, date: "2025-10-20", onsetDate: "2025-10-15", infectedBy: null, nationality: "South Korean", sex: "male", age: 42, clinicalNotes: "Military service member. Hantaan virus. HFRS with hemorrhagic manifestation.", country: "South Korea", city: "Seoul", latitude: 37.5665, longitude: 126.9780, cabin: null, deck: null, role: null },
  { caseId: "KOR-2026-001", name: "Gangwon Province Cluster", status: "confirmed", generation: null, date: "2026-04-05", onsetDate: "2026-04-01", infectedBy: null, nationality: "South Korean", sex: "male", age: 35, clinicalNotes: "4-case cluster near DMZ. Military exercise area. Hantaan virus.", country: "South Korea", city: "Chuncheon", latitude: 37.8813, longitude: 127.7298, cabin: null, deck: null, role: null },

  // Finland
  { caseId: "FIN-2025-001", name: "Kainuu Region Epidemic", status: "confirmed", generation: null, date: "2025-11-01", onsetDate: "2025-10-28", infectedBy: null, nationality: "Finnish", sex: "male", age: 48, clinicalNotes: "Annual Puumala epidemic. Bank vole reservoir.", country: "Finland", city: "Kajaani", latitude: 64.2275, longitude: 27.7284, cabin: null, deck: null, role: null },
  { caseId: "FIN-2025-002", name: "Kuopio University Hospital", status: "recovered", generation: null, date: "2025-12-10", onsetDate: "2025-12-05", infectedBy: null, nationality: "Finnish", sex: "female", age: 55, clinicalNotes: "Mild HFRS. Hospitalized 5 days. Full recovery.", country: "Finland", city: "Kuopio", latitude: 62.8924, longitude: 27.6770, cabin: null, deck: null, role: null },

  // Turkey
  { caseId: "TUR-2025-001", name: "Anatolia Endemic Cluster", status: "confirmed", generation: null, date: "2025-09-18", onsetDate: "2025-09-13", infectedBy: null, nationality: "Turkish", sex: "male", age: 36, clinicalNotes: "Rural farmer. Moderate HFRS. Apaturol virus.", country: "Turkey", city: "Ankara", latitude: 39.9334, longitude: 32.8597, cabin: null, deck: null, role: null },
  { caseId: "TUR-2026-001", name: "Central Anatolia Case", status: "confirmed", generation: null, date: "2026-03-02", onsetDate: "2026-02-26", infectedBy: null, nationality: "Turkish", sex: "female", age: 44, clinicalNotes: "Rodent exposure in grain storage facility.", country: "Turkey", city: "Konya", latitude: 37.8746, longitude: 32.4932, cabin: null, deck: null, role: null },

  // Russia
  { caseId: "RUS-2025-001", name: "Urals Outbreak", status: "confirmed", generation: null, date: "2025-11-20", onsetDate: "2025-11-14", infectedBy: null, nationality: "Russian", sex: "male", age: 32, clinicalNotes: "Military exercise in endemic forest. Puumala virus.", country: "Russia", city: "Yekaterinburg", latitude: 56.8389, longitude: 60.6057, cabin: null, deck: null, role: null },
  { caseId: "RUS-2026-001", name: "Moscow Oblast Case", status: "confirmed", generation: null, date: "2026-01-08", onsetDate: "2026-01-03", infectedBy: null, nationality: "Russian", sex: "male", age: 41, clinicalNotes: "Dacha exposure during winter. Hantaan virus.", country: "Russia", city: "Moscow", latitude: 55.7558, longitude: 37.6173, cabin: null, deck: null, role: null },

  // Japan
  { caseId: "JPN-2025-001", name: "Hokkaido Winter Case", status: "recovered", generation: null, date: "2026-01-20", onsetDate: "2026-01-15", infectedBy: null, nationality: "Japanese", sex: "male", age: 58, clinicalNotes: "Sapporo virus. Mild HFRS. Full recovery.", country: "Japan", city: "Sapporo", latitude: 43.0618, longitude: 141.3545, cabin: null, deck: null, role: null },

  // USA
  { caseId: "USA-2025-001", name: "Four Corners Region", status: "recovered", generation: null, date: "2025-09-10", onsetDate: "2025-09-05", infectedBy: null, nationality: "American", sex: "female", age: 31, clinicalNotes: "Sin Nombre virus. Deer mouse exposure in cabin.", country: "United States", city: "Albuquerque", latitude: 35.0844, longitude: -106.6504, cabin: null, deck: null, role: null },
  { caseId: "USA-2026-001", name: "Montana Cabin Case", status: "confirmed", generation: null, date: "2026-02-14", onsetDate: "2026-02-10", infectedBy: null, nationality: "American", sex: "male", age: 47, clinicalNotes: "Rodent infestation in remote cabin. Sin Nombre virus. HPS.", country: "United States", city: "Missoula", latitude: 46.8721, longitude: -113.9940, cabin: null, deck: null, role: null },

  // Mongolia
  { caseId: "MNG-2025-001", name: "Ulaanbaatar Surveilance Case", status: "confirmed", generation: null, date: "2025-12-05", onsetDate: "2025-11-30", infectedBy: null, nationality: "Mongolian", sex: "male", age: 29, clinicalNotes: "Urban case. Rodent exposure in ger district.", country: "Mongolia", city: "Ulaanbaatar", latitude: 47.8864, longitude: 106.9057, cabin: null, deck: null, role: null },

  // Colombia
  { caseId: "COL-2025-001", name: "Bogota Sporadic Case", status: "confirmed", generation: null, date: "2025-08-22", onsetDate: "2025-08-18", infectedBy: null, nationality: "Colombian", sex: "female", age: 37, clinicalNotes: "Andes virus. Occupational exposure in rural area.", country: "Colombia", city: "Bogota", latitude: 4.7110, longitude: -74.0721, cabin: null, deck: null, role: null },
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

console.log(`Seeded ${inserted} new global cases (total attempted: ${GLOBAL_CASES.length})`);
