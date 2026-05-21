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
CREATE UNIQUE INDEX "monitor_items_url_idx" ON "monitor_items" USING btree ("url");