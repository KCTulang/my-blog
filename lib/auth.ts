import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg", // neon uses postgres
		schema: schema,
	}),
	secret: process.env.SESSION_SECRET,
	emailAndPassword: {
		enabled: true,
	},
});
