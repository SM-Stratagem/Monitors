CREATE TABLE IF NOT EXISTS "ingest_runs" (
  "id" serial PRIMARY KEY NOT NULL,
  "ran_at" timestamp with time zone DEFAULT now() NOT NULL,
  "inserted" integer DEFAULT 0 NOT NULL,
  "total" integer DEFAULT 0 NOT NULL,
  "errors" integer DEFAULT 0 NOT NULL
);

