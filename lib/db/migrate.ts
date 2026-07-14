import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

const runMigrate = async () => {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) throw new Error("DATABASE_URL is not defined");

	const sql = neon(databaseUrl);

	console.log("Running migrations...");
	const start = Date.now();

	try {
		await sql`ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;`;
		await sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;`;
		console.log(`Migrations completed in ${Date.now() - start}ms`);
		process.exit(0);
	} catch (error) {
		console.error("Migration failed:", error);
		process.exit(1);
	}
};

runMigrate();
