"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";

// Zod schema

const AddCommentSchema = z.object({
	postId: z.string().uuid("Invalid post ID"),
	authorName: z
		.string()
		.min(1, "Name is required")
		.max(80, "Name must be 80 characters or fewer"),
	body: z
		.string()
		.min(10, "Comment must be at least 10 characters")
		.max(2000, "Comment must be 2000 characters or fewer"),
});

// Action return type

export type AddCommentState = {
	success: boolean;
	errors?: {
		postId?: string[];
		authorName?: string[];
		body?: string[];
		_form?: string[];
	};
};

// Server Action

export async function addComment(
	_prevState: AddCommentState,
	formData: FormData,
): Promise<AddCommentState> {
	const raw = {
		postId: formData.get("postId"),
		authorName: formData.get("authorName"),
		body: formData.get("body"),
	};

	// Zod safeParse
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
		});

		// Bust the cache for this post so the new comment is visible immediately
		revalidatePath(`/blog/${formData.get("slug")}`);

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
