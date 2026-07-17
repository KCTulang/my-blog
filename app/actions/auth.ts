"use server";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function incrementFailedAttempt(email: string) {
	const attempt = await db.query.loginAttempts.findFirst({
		where: eq(schema.loginAttempts.email, email),
	});

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

export async function resetFailedAttempts(email: string) {
	await db
		.delete(schema.loginAttempts)
		.where(eq(schema.loginAttempts.email, email));
}
