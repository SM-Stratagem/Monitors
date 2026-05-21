import { boolean, index, integer, jsonb, numeric, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const monitorItems = pgTable(
  "monitor_items",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    source: text("source").notNull(),
    url: text("url").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    summary: text("summary").notNull(),
    severity: text("severity").notNull(),
    region: text("region").notNull(),
    country: text("country"),
    inferredCases: integer("inferred_cases"),
    advisoryType: text("advisory_type").notNull(),
    aiRiskNote: text("ai_risk_note"),
    aiConfidence: numeric("ai_confidence", { precision: 4, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("monitor_items_url_idx").on(table.url)],
);

export const ingestRuns = pgTable("ingest_runs", {
  id: serial("id").primaryKey(),
  ranAt: timestamp("ran_at", { withTimezone: true }).defaultNow().notNull(),
  inserted: integer("inserted").notNull().default(0),
  total: integer("total").notNull().default(0),
  errors: integer("errors").notNull().default(0),
});

export const sources = pgTable(
  "sources",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 64 }).notNull(),
    name: text("name").notNull(),
    kind: varchar("kind", { length: 32 }).notNull(), // rss | html | api
    baseUrl: text("base_url"),
    credibility: integer("credibility").notNull().default(70),
    enabled: boolean("enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("sources_key_idx").on(table.key)],
);

export const rawDocuments = pgTable(
  "raw_documents",
  {
    id: serial("id").primaryKey(),
    sourceId: integer("source_id").notNull().references(() => sources.id),
    url: text("url").notNull(),
    retrievedAt: timestamp("retrieved_at", { withTimezone: true }).defaultNow().notNull(),
    statusCode: integer("status_code"),
    notModified: boolean("not_modified").notNull().default(false),
    etag: text("etag"),
    lastModified: text("last_modified"),
    contentType: text("content_type"),
    contentHash: varchar("content_hash", { length: 64 }),
    rawContent: text("raw_content"),
    textContent: text("text_content"),
    error: text("error"),
  },
  (table) => [
    index("raw_documents_source_url_idx").on(table.sourceId, table.url),
    index("raw_documents_retrieved_at_idx").on(table.retrievedAt),
    index("raw_documents_content_hash_idx").on(table.contentHash),
  ],
);

export const documents = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    sourceId: integer("source_id").notNull().references(() => sources.id),
    rawDocumentId: integer("raw_document_id").references(() => rawDocuments.id),
    url: text("url").notNull(),
    title: text("title").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    summary: text("summary"),
    language: varchar("language", { length: 12 }),
    country: text("country"),
    normalizedHash: varchar("normalized_hash", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("documents_normalized_hash_idx").on(table.normalizedHash)],
);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => documents.id),
  eventType: varchar("event_type", { length: 32 }).notNull(), // cases | deaths | advisory | outbreak_update
  country: text("country"),
  cases: integer("cases"),
  deaths: integer("deaths"),
  eventDate: timestamp("event_date", { withTimezone: true }),
  strain: text("strain"),
  confidence: numeric("confidence", { precision: 4, scale: 2 }),
  citations: jsonb("citations"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const jobRuns = pgTable("job_runs", {
  id: serial("id").primaryKey(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  ok: boolean("ok").notNull().default(true),
  errorCount: integer("error_count").notNull().default(0),
  notes: text("notes"),
});

export const snapshotStats = pgTable("snapshot_stats", {
  id: serial("id").primaryKey(),
  builtAt: timestamp("built_at", { withTimezone: true }).defaultNow().notNull(),
  totalDocuments: integer("total_documents").notNull().default(0),
  totalEvents: integer("total_events").notNull().default(0),
  countriesActive: integer("countries_active").notNull().default(0),
});

export const snapshotCountryStats = pgTable("snapshot_country_stats", {
  id: serial("id").primaryKey(),
  builtAt: timestamp("built_at", { withTimezone: true }).defaultNow().notNull(),
  country: text("country").notNull(),
  eventsCount: integer("events_count").notNull().default(0),
  casesTotal: integer("cases_total").notNull().default(0),
  deathsTotal: integer("deaths_total").notNull().default(0),
});

export const snapshotTimeline = pgTable("snapshot_timeline", {
  id: serial("id").primaryKey(),
  builtAt: timestamp("built_at", { withTimezone: true }).defaultNow().notNull(),
  eventDate: timestamp("event_date", { withTimezone: true }),
  country: text("country"),
  title: text("title").notNull(),
  url: text("url").notNull(),
  cases: integer("cases"),
  deaths: integer("deaths"),
  source: text("source"),
});

export const flightPositions = pgTable("flight_positions", {
  id: serial("id").primaryKey(),
  flightNumber: varchar("flight_number", { length: 20 }).notNull(),
  airline: text("airline"),
  aircraftType: text("aircraft_type"),
  departureAirport: varchar("departure_airport", { length: 10 }),
  arrivalAirport: varchar("arrival_airport", { length: 10 }),
  departureCity: text("departure_city"),
  arrivalCity: text("arrival_city"),
  departureCountry: text("departure_country"),
  arrivalCountry: text("arrival_country"),
  departureTime: timestamp("departure_time", { withTimezone: true }),
  arrivalTime: timestamp("arrival_time", { withTimezone: true }),
  status: varchar("status", { length: 30 }),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  altitude: integer("altitude"),
  speed: numeric("speed", { precision: 6, scale: 1 }),
  heading: numeric("heading", { precision: 5, scale: 1 }),
  totalPassengers: integer("total_passengers"),
  totalCrew: integer("total_crew"),
  notes: text("notes"),
  sourceUrl: text("source_url"),
  lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("flight_number_idx").on(table.flightNumber)]);

export const shipPositions = pgTable("ship_positions", {
  id: serial("id").primaryKey(),
  vesselName: varchar("vessel_name", { length: 100 }).notNull(),
  imo: varchar("imo", { length: 10 }),
  mmsi: varchar("mmsi", { length: 15 }),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  speed: numeric("speed", { precision: 5, scale: 1 }),
  course: numeric("course", { precision: 5, scale: 1 }),
  heading: numeric("heading", { precision: 5, scale: 1 }),
  destination: text("destination"),
  port: text("port"),
  status: varchar("status", { length: 30 }),
  lastPort: text("last_port"),
  eta: timestamp("eta", { withTimezone: true }),
  notes: text("notes"),
  lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const caseTimeline = pgTable("case_timeline", {
  id: serial("id").primaryKey(),
  caseId: varchar("case_id", { length: 20 }).notNull(),
  name: text("name"),
  status: varchar("status", { length: 20 }),
  generation: integer("generation"),
  date: timestamp("date", { withTimezone: true }),
  onsetDate: timestamp("onset_date", { withTimezone: true }),
  incubationStart: timestamp("incubation_start", { withTimezone: true }),
  infectedBy: varchar("infected_by", { length: 20 }),
  nationality: text("nationality"),
  sex: varchar("sex", { length: 10 }),
  age: integer("age"),
  clinicalNotes: text("clinical_notes"),
  country: text("country"),
  city: text("city"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  cabin: varchar("cabin", { length: 10 }),
  deck: integer("deck"),
  role: varchar("role", { length: 20 }),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("case_id_idx").on(table.caseId)]);

export const repatriationFlights = pgTable("repatriation_flights", {
  id: serial("id").primaryKey(),
  flightNumber: varchar("flight_number", { length: 20 }),
  country: text("country").notNull(),
  flag: varchar("flag", { length: 10 }),
  status: varchar("status", { length: 20 }),
  route: text("route"),
  details: text("details"),
  passengers: integer("passengers"),
  departedTime: timestamp("departed_time", { withTimezone: true }),
  arrivedTime: timestamp("arrived_time", { withTimezone: true }),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const quarantineStatus = pgTable("quarantine_status", {
  id: serial("id").primaryKey(),
  country: text("country").notNull(),
  flag: varchar("flag", { length: 10 }),
  passengers: integer("passengers"),
  quarantineStart: timestamp("quarantine_start", { withTimezone: true }),
  quarantineEnd: timestamp("quarantine_end", { withTimezone: true }),
  durationDays: integer("duration_days"),
  protocol: text("protocol"),
  status: varchar("status", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
