import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

// Safety check for biome
const databaseUrl = process.env.DATABASE_URL?.replace("-pooler", "").replace(
	"&channel_binding=require",
	"",
);
if (!databaseUrl) {
	throw new Error("DATABASE_URL is not defined");
}

// Drizzle configuration
export default defineConfig({
	schema: "./lib/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl,
	},
});
