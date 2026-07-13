"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { type CreatePostState, savePost } from "@/lib/actions";

type Post = {
	id: string;
	title: string;
	slug: string;
	body: string;
	tags: string[];
	published: boolean;
};

// Submit button uses useFormStatus so it disables during the server round-trip
function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="mt-2 min-h-[44px] w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{pending ? "Saving…" : "Save post"}
		</button>
	);
}

function FieldError({ messages }: { messages?: string[] }) {
	if (!messages?.length) return null;
	return (
		<p className="mt-1 text-xs text-red-400" role="alert">
			{messages[0]}
		</p>
	);
}

const initialState: CreatePostState = { success: false };

export default function PostEditor({ post }: { post?: Post }) {
	const [state, formAction] = useActionState(savePost, initialState);

	// Auto-generate a URL-safe slug from the title
	function toSlug(value: string): string {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");
	}

	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const slugInput = document.getElementById(
			"admin-slug",
		) as HTMLInputElement | null;
		if (slugInput && !slugInput.dataset.edited) {
			slugInput.value = toSlug(e.target.value);
		}
	}

	function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
		e.currentTarget.dataset.edited = "true";
	}

	return (
		<form action={formAction} className="flex flex-col gap-5">
			{post && <input type="hidden" name="id" value={post.id} />}

			{/* Status */}
			<div>
				<label
					htmlFor="status"
					className="mb-1 block text-xs font-medium text-zinc-400"
				>
					Status
				</label>
				<select
					id="status"
					name="published"
					defaultValue={post ? (post.published ? "true" : "false") : "true"}
					className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
				>
					<option value="true" className="text-black">
						Published
					</option>
					<option value="false" className="text-black">
						Draft
					</option>
				</select>
			</div>

			{/* Title */}
			<div>
				<label
					htmlFor="admin-title"
					className="mb-1 block text-xs font-medium text-zinc-400"
				>
					Title
				</label>
				<input
					id="admin-title"
					name="title"
					type="text"
					required
					maxLength={200}
					defaultValue={post?.title}
					placeholder="My moonlit post"
					onChange={handleTitleChange}
					className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
				/>
				<FieldError messages={state.errors?.title} />
			</div>

			{/* Slug (auto-filled from title, editable) */}
			<div>
				<label
					htmlFor="admin-slug"
					className="mb-1 block text-xs font-medium text-zinc-400"
				>
					Slug <span className="text-zinc-600">(auto-generated, editable)</span>
				</label>
				<input
					id="admin-slug"
					name="slug"
					type="text"
					required
					defaultValue={post?.slug}
					data-edited={!!post}
					placeholder="my-moonlit-post"
					onChange={handleSlugChange}
					className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
				/>
				<FieldError messages={state.errors?.slug} />
			</div>

			{/* Body */}
			<div>
				<label
					htmlFor="admin-body"
					className="mb-1 block text-xs font-medium text-zinc-400"
				>
					Body
				</label>
				<textarea
					id="admin-body"
					name="body"
					required
					rows={10}
					defaultValue={post?.body}
					placeholder="Write your post here…"
					className="min-h-[200px] w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
				/>
				<FieldError messages={state.errors?.body} />
			</div>

			{/* Tags */}
			<div>
				<label
					htmlFor="admin-tags"
					className="mb-1 block text-xs font-medium text-zinc-400"
				>
					Tags
				</label>
				<input
					id="admin-tags"
					name="tags"
					type="text"
					defaultValue={post?.tags.join(", ")}
					placeholder="tech, personal, nextjs"
					className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
				/>
				<p className="mt-1.5 text-xs text-zinc-500 sm:mt-1">
					Comma-separated, e.g. tech, personal
				</p>
				<FieldError messages={state.errors?.tags} />
			</div>

			{/* Form-level error */}
			{state.errors?._form && (
				<p
					className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400"
					role="alert"
				>
					{state.errors._form[0]}
				</p>
			)}

			<SubmitButton />

			{/* Placeholder for future autosave status */}
			<p className="text-center text-xs text-zinc-500" aria-live="polite">
				Draft saved locally (placeholder)
			</p>
		</form>
	);
}
