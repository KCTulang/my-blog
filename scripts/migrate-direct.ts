import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL as string);

async function runSql() {
	console.log("Running direct SQL...");
	await sql`
		CREATE TABLE IF NOT EXISTS "auth_attempts" (
			"ip" text PRIMARY KEY NOT NULL,
			"attempts" integer DEFAULT 0 NOT NULL,
			"lockout_until" timestamp,
			"last_attempt_at" timestamp DEFAULT now() NOT NULL
		);
	`;

	try {
		await sql`ALTER TABLE "posts" ADD COLUMN "published" boolean DEFAULT true NOT NULL;`;
		console.log("Added published column.");
	} catch (e: unknown) {
		if (e instanceof Error && e.message.includes("already exists")) {
			console.log("published column already exists.");
		} else {
			throw e;
		}
	}
	console.log("Complete!");
}

runSql().catch((err) => {
	console.error(err);
	process.exit(1);
});
