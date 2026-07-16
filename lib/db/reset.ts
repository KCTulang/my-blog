import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	const sql = neon(process.env.DATABASE_URL);

	console.log(
		" Starting to drop all tables in the public and drizzle schemas...",
	);
	await sql`DROP SCHEMA IF EXISTS public CASCADE;`;
	await sql`DROP SCHEMA IF EXISTS drizzle CASCADE;`;

	console.log(" Recreating the public schema...");
	await sql`CREATE SCHEMA public;`;

	console.log(" Database reset completed successfully.");
}

main().catch((err) => {
	console.error("Error resetting database:");
	console.error(err);
	process.exit(1);
});
