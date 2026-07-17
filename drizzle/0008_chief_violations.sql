CREATE TABLE "loginAttempts" (
	"email" text PRIMARY KEY NOT NULL,
	"failedCount" integer DEFAULT 0 NOT NULL,
	"lockoutUntil" timestamp
);
