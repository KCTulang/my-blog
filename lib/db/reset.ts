import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	const sql = neon(process.env.DATABASE_URL);

	console.log("⏳ Dropping all tables in the public schema...");
	await sql`DROP SCHEMA public CASCADE;`;

	console.log("⏳ Recreating public schema...");
	await sql`CREATE SCHEMA public;`;

	console.log("✅ Database successfully reset!");
}

main().catch((err) => {
	console.error("❌ Failed to reset database:");
	console.error(err);
	process.exit(1);
});
