import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not defined");
	}
	const sql = neon(databaseUrl);

	console.log("Applying migration: adding tags and approved columns...");
	await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}'`;
	await sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false`;

	// Also mark the migration as applied in drizzle's journal table (if it exists)
	try {
		await sql`CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )`;
	} catch {
		// table may already exist
	}

	console.log(
		"✓ Migration applied: posts.tags (text[]) + comments.approved (boolean)",
	);
	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
