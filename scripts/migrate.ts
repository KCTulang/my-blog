import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local" });

// biome-ignore lint/style/noNonNullAssertion: guaranteed by environment
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function runMigrate() {
	console.log("Running migrations...");
	await migrate(db, { migrationsFolder: "./drizzle" });
	console.log("Migrations complete!");
}

runMigrate().catch((err) => {
	console.error("Migration failed:", err);
	process.exit(1);
});
