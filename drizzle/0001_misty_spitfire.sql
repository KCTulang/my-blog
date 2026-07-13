ALTER TABLE "comments" ADD COLUMN "approved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "tags" text[] DEFAULT '{}' NOT NULL;