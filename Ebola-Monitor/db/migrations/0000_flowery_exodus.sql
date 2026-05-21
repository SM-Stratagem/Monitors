CREATE TABLE "case_timeline" (
	"id" serial PRIMARY KEY NOT NULL,
	"case_id" varchar(20) NOT NULL,
	"name" text,
	"status" varchar(20),
	"generation" integer,
	"date" timestamp with time zone,
	"onset_date" timestamp with time zone,
	"incubation_start" timestamp with time zone,
	"infected_by" varchar(20),
	"nationality" text,
	"sex" varchar(10),
	"age" integer,
	"clinical_notes" text,
	"country" text,
	"city" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"cabin" varchar(10),
	"deck" integer,
	"role" varchar(20),
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer NOT NULL,
	"raw_document_id" integer,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"published_at" timestamp with time zone,
	"summary" text,
	"language" varchar(12),
	"country" text,
	"normalized_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"event_type" varchar(32) NOT NULL,
	"country" text,
	"cases" integer,
	"deaths" integer,
	"event_date" timestamp with time zone,
	"strain" text,
	"confidence" numeric(4, 2),
	"citations" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flight_positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"flight_number" varchar(20) NOT NULL,
	"airline" text,
	"aircraft_type" text,
	"departure_airport" varchar(10),
	"arrival_airport" varchar(10),
	"departure_city" text,
	"arrival_city" text,
	"departure_country" text,
	"arrival_country" text,
	"departure_time" timestamp with time zone,
	"arrival_time" timestamp with time zone,
	"status" varchar(30),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"altitude" integer,
	"speed" numeric(6, 1),
	"heading" numeric(5, 1),
	"total_passengers" integer,
	"total_crew" integer,
	"notes" text,
	"source_url" text,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingest_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"ran_at" timestamp with time zone DEFAULT now() NOT NULL,
	"inserted" integer DEFAULT 0 NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	"errors" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"ok" boolean DEFAULT true NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "monitor_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"source" text NOT NULL,
	"url" text NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"summary" text NOT NULL,
	"severity" text NOT NULL,
	"region" text NOT NULL,
	"country" text,
	"inferred_cases" integer,
	"advisory_type" text NOT NULL,
	"ai_risk_note" text,
	"ai_confidence" numeric(4, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quarantine_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"country" text NOT NULL,
	"flag" varchar(10),
	"passengers" integer,
	"quarantine_start" timestamp with time zone,
	"quarantine_end" timestamp with time zone,
	"duration_days" integer,
	"protocol" text,
	"status" varchar(20),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "raw_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "repatriation_flights" (
	"id" serial PRIMARY KEY NOT NULL,
	"flight_number" varchar(20),
	"country" text NOT NULL,
	"flag" varchar(10),
	"status" varchar(20),
	"route" text,
	"details" text,
	"passengers" integer,
	"departed_time" timestamp with time zone,
	"arrived_time" timestamp with time zone,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ship_positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"vessel_name" varchar(100) NOT NULL,
	"imo" varchar(10),
	"mmsi" varchar(15),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"speed" numeric(5, 1),
	"course" numeric(5, 1),
	"heading" numeric(5, 1),
	"destination" text,
	"port" text,
	"status" varchar(30),
	"last_port" text,
	"eta" timestamp with time zone,
	"notes" text,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snapshot_country_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"built_at" timestamp with time zone DEFAULT now() NOT NULL,
	"country" text NOT NULL,
	"events_count" integer DEFAULT 0 NOT NULL,
	"cases_total" integer DEFAULT 0 NOT NULL,
	"deaths_total" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snapshot_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"built_at" timestamp with time zone DEFAULT now() NOT NULL,
	"total_documents" integer DEFAULT 0 NOT NULL,
	"total_events" integer DEFAULT 0 NOT NULL,
	"countries_active" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snapshot_timeline" (
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
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(64) NOT NULL,
	"name" text NOT NULL,
	"kind" varchar(32) NOT NULL,
	"base_url" text,
	"credibility" integer DEFAULT 70 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_raw_document_id_raw_documents_id_fk" FOREIGN KEY ("raw_document_id") REFERENCES "public"."raw_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_documents" ADD CONSTRAINT "raw_documents_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "case_id_idx" ON "case_timeline" USING btree ("case_id");--> statement-breakpoint
CREATE UNIQUE INDEX "documents_normalized_hash_idx" ON "documents" USING btree ("normalized_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "flight_number_idx" ON "flight_positions" USING btree ("flight_number");--> statement-breakpoint
CREATE UNIQUE INDEX "monitor_items_url_idx" ON "monitor_items" USING btree ("url");--> statement-breakpoint
CREATE INDEX "raw_documents_source_url_idx" ON "raw_documents" USING btree ("source_id","url");--> statement-breakpoint
CREATE INDEX "raw_documents_retrieved_at_idx" ON "raw_documents" USING btree ("retrieved_at");--> statement-breakpoint
CREATE INDEX "raw_documents_content_hash_idx" ON "raw_documents" USING btree ("content_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "sources_key_idx" ON "sources" USING btree ("key");