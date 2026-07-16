"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { comments, posts } from "@/lib/db/schema";
import { verifySession } from "@/lib/session";
import { CreatePostSchema } from "@/lib/validations/post";

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

export async function logoutAction() {
	await import("@/lib/auth").then(async ({ auth }) => {
		const { headers } = await import("next/headers");
		await auth.api.signOut({
			headers: await headers(),
		});
	});
	redirect("/");
}

export type CreatePostState = {
	success: boolean;
	id?: string;
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

export async function autoSavePost(
	_prevState: CreatePostState,
	formData: FormData,
): Promise<CreatePostState> {
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

	let postId = result.data.id;

	try {
		if (postId) {
			await db
				.update(posts)
				.set({
					title: result.data.title,
					slug: result.data.slug,
					body: result.data.body,
					tags: tagArray,
					published: isPublished,
				})
				.where(eq(posts.id, postId));
		} else {
			const inserted = await db
				.insert(posts)
				.values({
					title: result.data.title,
					slug: result.data.slug,
					body: result.data.body,
					tags: tagArray,
					published: isPublished,
				})
				.returning({ id: posts.id });

			postId = inserted[0].id;
		}
	} catch (_error) {
		return {
			success: false,
			errors: {
				_form: ["Failed to auto-save post. The slug may already be taken."],
			},
		};
	}

	return { success: true, id: postId ?? "" };
}

export async function deletePost(id: string) {
	const session = await verifySession();
	if (!session) throw new Error("Unauthorized");

	await db.update(posts).set({ deletedAt: new Date() }).where(eq(posts.id, id));
	revalidatePath("/blog");
	revalidatePath("/admin/posts");
}

export async function restorePost(id: string) {
	const session = await verifySession();
	if (!session) throw new Error("Unauthorized");

	await db.update(posts).set({ deletedAt: null }).where(eq(posts.id, id));
	revalidatePath("/blog");
	revalidatePath("/admin/posts");
}

export async function hardDeletePost(id: string) {
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
		await db
			.update(comments)
			.set({ deletedAt: new Date() })
			.where(eq(comments.id, id));
	}
	revalidatePath("/blog", "layout");
	revalidatePath("/admin/comments");
}

export async function bulkRestoreComments(ids: string[]) {
	const session = await verifySession();
	if (!session) throw new Error("Unauthorized");

	for (const id of ids) {
		await db
			.update(comments)
			.set({ deletedAt: null })
			.where(eq(comments.id, id));
	}
	revalidatePath("/blog", "layout");
	revalidatePath("/admin/comments");
}

export async function bulkHardDeleteComments(ids: string[]) {
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
