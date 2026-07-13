CREATE TABLE "auth_attempts" (
	"ip" text PRIMARY KEY NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"lockout_until" timestamp,
	"last_attempt_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "published" boolean DEFAULT true NOT NULL;