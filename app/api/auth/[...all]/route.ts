import { toNextJsHandler } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
	if (req.nextUrl.pathname === "/api/auth/sign-in/email") {
		try {
			const body = await req.clone().json();
			const email = body?.email as string;

			if (email) {
				const attempt = await db.query.loginAttempts.findFirst({
					where: eq(schema.loginAttempts.email, email),
				});

				if (attempt?.lockoutUntil && new Date() < attempt.lockoutUntil) {
					const secondsLeft = Math.ceil(
						(attempt.lockoutUntil.getTime() - Date.now()) / 1000,
					);
					return NextResponse.json(
						{
							message: `Account temporarily locked due to too many failed attempts. Try again in ${secondsLeft} seconds.`,
						},
						{ status: 400 },
					);
				}

				const res = await handlers.POST(req);

				if (res.status >= 200 && res.status < 300) {
					// Success, clear attempts
					await db
						.delete(schema.loginAttempts)
						.where(eq(schema.loginAttempts.email, email));
				} else if (res.status === 401 || res.status === 400) {
					// Failed login
					let failedCount = 1;
					let lockoutUntil: Date | null = null;

					if (attempt) {
						failedCount = attempt.failedCount + 1;
					}

					if (failedCount >= 5) {
						const now = new Date();
						if (failedCount === 5) {
							lockoutUntil = new Date(now.getTime() + 30 * 1000);
						} else if (failedCount === 6) {
							lockoutUntil = new Date(now.getTime() + 5 * 60 * 1000);
						} else if (failedCount === 7) {
							lockoutUntil = new Date(now.getTime() + 15 * 60 * 1000);
						} else {
							lockoutUntil = new Date(now.getTime() + 60 * 60 * 1000);
						}
					}

					if (attempt) {
						await db
							.update(schema.loginAttempts)
							.set({ failedCount, lockoutUntil })
							.where(eq(schema.loginAttempts.email, email));
					} else {
						await db.insert(schema.loginAttempts).values({
							email,
							failedCount,
							lockoutUntil,
						});
					}
				}

				return res;
			}
		} catch (_e) {
			// ignore json parsing errors
		}
	}

	return handlers.POST(req);
}
