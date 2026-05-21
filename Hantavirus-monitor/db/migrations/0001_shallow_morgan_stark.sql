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
CREATE UNIQUE INDEX "case_id_idx" ON "case_timeline" USING btree ("case_id");--> statement-breakpoint
CREATE UNIQUE INDEX "flight_number_idx" ON "flight_positions" USING btree ("flight_number");