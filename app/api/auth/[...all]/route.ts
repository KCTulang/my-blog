import { toNextJsHandler } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

const betterAuthHandler = toNextJsHandler(auth);

async function checkRateLimit(
	email: string,
): Promise<{ locked: boolean; secondsLeft: number }> {
	try {
		const attempt = await db.query.loginAttempts.findFirst({
			where: eq(schema.loginAttempts.email, email),
		});
		if (attempt?.lockoutUntil && new Date() < attempt.lockoutUntil) {
			const secondsLeft = Math.ceil(
				(attempt.lockoutUntil.getTime() - Date.now()) / 1000,
			);
			return { locked: true, secondsLeft };
		}
	} catch {
		// loginAttempts table may not exist yet — skip rate limit silently
	}
	return { locked: false, secondsLeft: 0 };
}

async function incrementFailedAttempt(email: string): Promise<void> {
	try {
		const attempt = await db.query.loginAttempts.findFirst({
			where: eq(schema.loginAttempts.email, email),
		});
		const failedCount = attempt ? attempt.failedCount + 1 : 1;
		let lockoutUntil: Date | null = null;
		if (failedCount >= 5) {
			const now = new Date();
			if (failedCount === 5) lockoutUntil = new Date(now.getTime() + 30 * 1000);
			else if (failedCount === 6)
				lockoutUntil = new Date(now.getTime() + 5 * 60 * 1000);
			else if (failedCount === 7)
				lockoutUntil = new Date(now.getTime() + 15 * 60 * 1000);
			else lockoutUntil = new Date(now.getTime() + 60 * 60 * 1000);
		}
		if (attempt) {
			await db
				.update(schema.loginAttempts)
				.set({ failedCount, lockoutUntil })
				.where(eq(schema.loginAttempts.email, email));
		} else {
			await db
				.insert(schema.loginAttempts)
				.values({ email, failedCount, lockoutUntil });
		}
	} catch {
		// loginAttempts table may not exist yet — skip silently
	}
}

async function resetFailedAttempts(email: string): Promise<void> {
	try {
		await db
			.delete(schema.loginAttempts)
			.where(eq(schema.loginAttempts.email, email));
	} catch {
		// loginAttempts table may not exist yet — skip silently
	}
}

export const GET = betterAuthHandler.GET;

export async function POST(req: Request) {
	const url = new URL(req.url);

	if (url.pathname === "/api/auth/sign-in/email") {
		let email: string | undefined;
		try {
			const body = (await req.clone().json()) as Record<string, unknown>;
			email = typeof body?.email === "string" ? body.email : undefined;
		} catch {
			// can't parse body — fall through to Better Auth
		}

		if (email) {
			const rateLimit = await checkRateLimit(email);
			if (rateLimit.locked) {
				return Response.json(
					{
						message: `Account temporarily locked. Try again in ${rateLimit.secondsLeft} seconds.`,
					},
					{ status: 429 },
				);
			}

			const response = await betterAuthHandler.POST(req);

			if (!response.ok) {
				await incrementFailedAttempt(email);
			} else {
				await resetFailedAttempts(email);
			}

			return response;
		}
	}

	return betterAuthHandler.POST(req);
}
