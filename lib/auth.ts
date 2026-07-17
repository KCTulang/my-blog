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
	baseURL:
		process.env.BETTER_AUTH_URL ||
		(process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: "http://localhost:3000"),
	trustedOrigins: process.env.VERCEL_URL
		? [
				`https://${process.env.VERCEL_URL}`,
				...(process.env.VERCEL_BRANCH_URL
					? [`https://${process.env.VERCEL_BRANCH_URL}`]
					: []),
				...(process.env.VERCEL_PROJECT_PRODUCTION_URL
					? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
					: []),
			]
		: [],
	emailAndPassword: {
		enabled: true,
	},
	rateLimit: {
		storage: "database",
	},
});
