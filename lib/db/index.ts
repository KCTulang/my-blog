import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env.local" });

// For biome, it is forbidden to have null values in the environment variables, so we need to check if the DATABASE_URL is defined
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL is not defined");
}

const sql = neon(databaseUrl);
export const db = drizzle({ client: sql });
