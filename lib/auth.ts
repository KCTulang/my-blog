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
	baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
	emailAndPassword: {
		enabled: true,
	},
});
