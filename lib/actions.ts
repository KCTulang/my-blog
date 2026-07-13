"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { authAttempts, comments, posts } from "@/lib/db/schema";
import { createSession, deleteSession, verifySession } from "@/lib/session";

// ─── addComment ─────────────────────────────────────────────────────────────

const AddCommentSchema = z.object({
	postId: z.string().uuid("Invalid post ID"),
	slug: z.string().min(1, "Slug is required"),
	authorName: z
		.string()
		.min(1, "Name is required")
		.max(80, "Name must be 80 characters or fewer"),
	body: z
		.string()
		.min(10, "Comment must be at least 10 characters")
		.max(2000, "Comment must be 2000 characters or fewer"),
});

export type AddCommentState = {
	success: boolean;
	errors?: {
		postId?: string[];
		slug?: string[];
		authorName?: string[];
		body?: string[];
		_form?: string[];
	};
};

export async function addComment(
	_prevState: AddCommentState,
	formData: FormData,
): Promise<AddCommentState> {
	const raw = {
		postId: formData.get("postId"),
		slug: formData.get("slug"),
		authorName: formData.get("authorName"),
		body: formData.get("body"),
	};

	const result = AddCommentSchema.safeParse(raw);

	if (!result.success) {
		return {
			success: false,
			errors: result.error.flatten().fieldErrors,
		};
	}

	try {
		await db.insert(comments).values({
			postId: result.data.postId,
			authorName: result.data.authorName,
			body: result.data.body,
			// If admin is adding a comment (e.g. reply), auto-approve it
			approved: result.data.authorName === "Admin",
		});

		revalidatePath(`/blog/${result.data.slug}`);

		return { success: true };
	} catch {
		return {
			success: false,
			errors: {
				_form: ["Something went wrong. Please try again."],
			},
		};
	}
}

// ─── Auth / Login ───────────────────────────────────────────────────────────

export type LoginState = {
	success: boolean;
	errors?: {
		password?: string[];
		_form?: string[];
	};
};

export async function loginAction(
	_prevState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const password = formData.get("password") as string;
	if (!password) {
		return { success: false, errors: { password: ["Password is required"] } };
	}

	// 1. Rate limiting check by IP
	const headersList = await headers();
	// Fallback to "unknown" if headers are missing
	const ip =
		headersList.get("x-forwarded-for") ||
		headersList.get("x-real-ip") ||
		"unknown";

	// Fetch existing attempts
	const attemptRecord = await db.query.authAttempts.findFirst({
		where: (a, { eq }) => eq(a.ip, ip),
	});

	if (attemptRecord?.lockoutUntil && attemptRecord.lockoutUntil > new Date()) {
		return {
			success: false,
			errors: { _form: ["Too many failed attempts. Try again in 15 minutes."] },
		};
	}

	// 2. Validate Password
	const hash = process.env.ADMIN_PASSWORD_HASH;
	const legacyPlaintext = process.env.ADMIN_PASSWORD;

	let isValid = false;
	if (hash) {
		isValid = bcrypt.compareSync(password, hash);
	} else if (legacyPlaintext) {
		isValid = password === legacyPlaintext;
	}

	if (!isValid) {
		// Log failed attempt
		const newAttempts = (attemptRecord?.attempts ?? 0) + 1;
		let lockout: Date | null = null;

		if (newAttempts >= 5) {
			lockout = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
		}

		await db
			.insert(authAttempts)
			.values({
				ip,
				attempts: newAttempts,
				lockoutUntil: lockout,
				lastAttemptAt: new Date(),
			})
			.onConflictDoUpdate({
				target: authAttempts.ip,
				set: {
					attempts: newAttempts,
					lockoutUntil: lockout,
					lastAttemptAt: new Date(),
				},
			});

		return { success: false, errors: { password: ["Incorrect password"] } };
	}

	// 3. Success — Reset attempts & Create Session
	if (attemptRecord) {
		await db
			.update(authAttempts)
			.set({ attempts: 0, lockoutUntil: null })
			.where(eq(authAttempts.ip, ip));
	}

	await createSession();
	redirect("/admin/posts");
}

export async function logoutAction() {
	await deleteSession();
	redirect("/");
}

// ─── Post Management ─────────────────────────────────────────────────────────

const CreatePostSchema = z.object({
	id: z.string().nullable().optional(), // For edits
	title: z
		.string()
		.min(1, "Title is required")
		.max(200, "Title must be 200 characters or fewer"),
	slug: z
		.string()
		.min(1, "Slug is required")
		.refine(
			(val) => /^[a-z0-9-]+$/.test(val),
			"Slug must only contain lowercase letters, numbers, and hyphens",
		),
	body: z.string().min(1, "Body is required"),
	tags: z.string().optional(),
	published: z.enum(["true", "false"]).optional(),
});

export type CreatePostState = {
	success: boolean;
	errors?: {
		title?: string[];
		slug?: string[];
		body?: string[];
		tags?: string[];
		_form?: string[];
	};
};

export async function savePost(
	_prevState: CreatePostState,
	formData: FormData,
): Promise<CreatePostState> {
	// Require Auth
	const session = await verifySession();
	if (!session) return { success: false, errors: { _form: ["Unauthorized"] } };

	const raw = {
		id: formData.get("id"),
		title: formData.get("title"),
		slug: formData.get("slug"),
		body: formData.get("body"),
		tags: formData.get("tags"),
		published: formData.get("published"),
	};

	const result = CreatePostSchema.safeParse(raw);
	if (!result.success) {
		return { success: false, errors: result.error.flatten().fieldErrors };
	}

	const tagArray = result.data.tags
		? result.data.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
		: [];
	const isPublished = result.data.published === "true";

	try {
		if (result.data.id) {
			await db
				.update(posts)
				.set({
					title: result.data.title,
					slug: result.data.slug,
					body: result.data.body,
					tags: tagArray,
					published: isPublished,
				})
				.where(eq(posts.id, result.data.id));
		} else {
			await db.insert(posts).values({
				title: result.data.title,
				slug: result.data.slug,
				body: result.data.body,
				tags: tagArray,
				published: isPublished,
			});
		}
	} catch (_error) {
		return {
			success: false,
			errors: {
				_form: ["Failed to save post. The slug may already be taken."],
			},
		};
	}

	revalidatePath("/blog");
	revalidatePath("/admin/posts");
	redirect("/admin/posts");
}

export async function deletePost(id: string) {
	const session = await verifySession();
	if (!session) throw new Error("Unauthorized");

	await db.delete(posts).where(eq(posts.id, id));
	revalidatePath("/blog");
	revalidatePath("/admin/posts");
}

export async function togglePostPublish(id: string, currentPublished: boolean) {
	const session = await verifySession();
	if (!session) throw new Error("Unauthorized");

	await db
		.update(posts)
		.set({ published: !currentPublished })
		.where(eq(posts.id, id));
	revalidatePath("/blog");
	revalidatePath("/admin/posts");
}

// ─── Comment Management ─────────────────────────────────────────────────────

export async function bulkApproveComments(ids: string[]) {
	const session = await verifySession();
	if (!session) throw new Error("Unauthorized");

	for (const id of ids) {
		await db
			.update(comments)
			.set({ approved: true })
			.where(eq(comments.id, id));
	}
	revalidatePath("/blog", "layout");
	revalidatePath("/admin/comments");
}

export async function bulkDeleteComments(ids: string[]) {
	const session = await verifySession();
	if (!session) throw new Error("Unauthorized");

	for (const id of ids) {
		await db.delete(comments).where(eq(comments.id, id));
	}
	revalidatePath("/blog", "layout");
	revalidatePath("/admin/comments");
}

export async function toggleCommentApproval(
	id: string,
	currentApproved: boolean,
) {
	const session = await verifySession();
	if (!session) throw new Error("Unauthorized");

	await db
		.update(comments)
		.set({ approved: !currentApproved })
		.where(eq(comments.id, id));
	revalidatePath("/blog", "layout");
	revalidatePath("/admin/comments");
}
