import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { eq } from "drizzle-orm";

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
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-in/email") {
				const body = ctx.body as Record<string, any>;
				const email = body?.email as string;
				if (email) {
					const attempt = await db.query.loginAttempts.findFirst({
						where: eq(schema.loginAttempts.email, email),
					});
					if (attempt?.lockoutUntil && new Date() < attempt.lockoutUntil) {
						const secondsLeft = Math.ceil(
							(attempt.lockoutUntil.getTime() - Date.now()) / 1000,
						);
						throw new APIError("BAD_REQUEST", {
							message: `Account temporarily locked due to too many failed attempts. Try again in ${secondsLeft} seconds.`,
						});
					}
				}
			}
		}),
	}
});
