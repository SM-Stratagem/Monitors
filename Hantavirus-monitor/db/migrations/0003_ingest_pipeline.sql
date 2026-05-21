CREATE TABLE IF NOT EXISTS "sources" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" varchar(64) NOT NULL,
  "name" text NOT NULL,
  "kind" varchar(32) NOT NULL,
  "base_url" text,
  "credibility" integer DEFAULT 70 NOT NULL,
  "enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "sources_key_idx" ON "sources" ("key");

CREATE TABLE IF NOT EXISTS "raw_documents" (
  "id" serial PRIMARY KEY NOT NULL,
  "source_id" integer NOT NULL REFERENCES "sources" ("id"),
  "url" text NOT NULL,
  "retrieved_at" timestamp with time zone DEFAULT now() NOT NULL,
  "status_code" integer,
  "not_modified" boolean DEFAULT false NOT NULL,
  "etag" text,
  "last_modified" text,
  "content_type" text,
  "content_hash" varchar(64),
  "raw_content" text,
  "text_content" text,
  "error" text
);

CREATE INDEX IF NOT EXISTS "raw_documents_source_url_idx" ON "raw_documents" ("source_id", "url");
CREATE INDEX IF NOT EXISTS "raw_documents_retrieved_at_idx" ON "raw_documents" ("retrieved_at");
CREATE INDEX IF NOT EXISTS "raw_documents_content_hash_idx" ON "raw_documents" ("content_hash");

CREATE TABLE IF NOT EXISTS "documents" (
  "id" serial PRIMARY KEY NOT NULL,
  "source_id" integer NOT NULL REFERENCES "sources" ("id"),
  "raw_document_id" integer REFERENCES "raw_documents" ("id"),
  "url" text NOT NULL,
  "title" text NOT NULL,
  "published_at" timestamp with time zone,
  "summary" text,
  "language" varchar(12),
  "country" text,
  "normalized_hash" varchar(64) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "documents_normalized_hash_idx" ON "documents" ("normalized_hash");

CREATE TABLE IF NOT EXISTS "events" (
  "id" serial PRIMARY KEY NOT NULL,
  "document_id" integer NOT NULL REFERENCES "documents" ("id"),
  "event_type" varchar(32) NOT NULL,
  "country" text,
  "cases" integer,
  "deaths" integer,
  "event_date" timestamp with time zone,
  "strain" text,
  "confidence" numeric(4,2),
  "citations" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "job_runs" (
  "id" serial PRIMARY KEY NOT NULL,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "ended_at" timestamp with time zone,
  "ok" boolean DEFAULT true NOT NULL,
  "error_count" integer DEFAULT 0 NOT NULL,
  "notes" text
);

CREATE TABLE IF NOT EXISTS "snapshot_stats" (
  "id" serial PRIMARY KEY NOT NULL,
  "built_at" timestamp with time zone DEFAULT now() NOT NULL,
  "total_documents" integer DEFAULT 0 NOT NULL,
  "total_events" integer DEFAULT 0 NOT NULL,
  "countries_active" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "snapshot_country_stats" (
  "id" serial PRIMARY KEY NOT NULL,
  "built_at" timestamp with time zone DEFAULT now() NOT NULL,
  "country" text NOT NULL,
  "events_count" integer DEFAULT 0 NOT NULL,
  "cases_total" integer DEFAULT 0 NOT NULL,
  "deaths_total" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "snapshot_timeline" (
  "id" serial PRIMARY KEY NOT NULL,
  "built_at" timestamp with time zone DEFAULT now() NOT NULL,
  "event_date" timestamp with time zone,
  "country" text,
  "title" text NOT NULL,
  "url" text NOT NULL,
  "cases" integer,
  "deaths" integer,
  "source" text
);

