"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { type AddCommentState, addComment } from "@/lib/actions";

// Submit button

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="mt-2 min-h-[44px] w-full rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200
				bg-white/10 text-white border border-white/15 hover:bg-white/20
				disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{pending ? "Posting…" : "Post comment"}
		</button>
	);
}

// Field error

function FieldError({ messages }: { messages?: string[] }) {
	if (!messages?.length) return null;
	return (
		<p className="mt-1 text-xs text-red-400" role="alert">
			{messages[0]}
		</p>
	);
}

// Main comment

const initialState: AddCommentState = { success: false };

interface CommentFormProps {
	postId: string;
	slug: string;
}

export default function CommentForm({ postId, slug }: CommentFormProps) {
	const [state, formAction] = useActionState(addComment, initialState);

	return (
		<section className="mt-10">
			<h3 className="mb-4 font-serif text-lg font-semibold text-white">
				Leave a comment
			</h3>

			{state.success ? (
				<p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-green-400">
					✓ Comment posted! Thanks for sharing.
				</p>
			) : (
				<form action={formAction} className="flex flex-col gap-4">
					{/* Hidden fields */}
					<input type="hidden" name="postId" value={postId} />
					<input type="hidden" name="slug" value={slug} />

					{/* Author name */}
					<div>
						<label
							htmlFor="authorName"
							className="mb-1 block text-xs font-medium text-zinc-400"
						>
							Your name
						</label>
						<input
							id="authorName"
							name="authorName"
							type="text"
							required
							maxLength={80}
							placeholder="Luna Stargazer"
							className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-500
								focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
						/>
						<FieldError messages={state.errors?.authorName} />
					</div>

					{/* Comment body */}
					<div>
						<label
							htmlFor="body"
							className="mb-1 block text-xs font-medium text-zinc-400"
						>
							Comment
						</label>
						<textarea
							id="body"
							name="body"
							required
							rows={4}
							minLength={10}
							maxLength={2000}
							placeholder="Share your thoughts…"
							className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-500
								focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
						/>
						<FieldError messages={state.errors?.body} />
					</div>

					{/* Form-level error */}
					{state.errors?._form && (
						<p className="text-xs text-red-400" role="alert">
							{state.errors._form[0]}
						</p>
					)}

					<SubmitButton />
				</form>
			)}
		</section>
	);
}
