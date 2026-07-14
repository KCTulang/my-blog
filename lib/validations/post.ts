import { z } from "zod";

export const CreatePostSchema = z.object({
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
