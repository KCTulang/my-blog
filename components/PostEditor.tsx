"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { autoSavePost, savePost } from "@/lib/actions";
import { CreatePostSchema } from "@/lib/validations/post";

type Post = {
	id: string;
	title: string;
	slug: string;
	body: string;
	tags: string[];
	published: boolean;
};

type PostFormValues = z.infer<typeof CreatePostSchema>;

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return (
		<p className="mt-1 text-xs text-red-400" role="alert">
			{message}
		</p>
	);
}

function buildFormData(values: PostFormValues): FormData {
	const formData = new FormData();
	if (values.id) formData.append("id", values.id);
	formData.append("title", values.title);
	formData.append("slug", values.slug);
	formData.append("body", values.body);
	if (values.tags) formData.append("tags", values.tags);
	return formData;
}

export default function PostEditor({ post }: { post?: Post }) {
	const [isAutoSaving, setIsAutoSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);

	const [submitAction, setSubmitAction] = useState<"publish" | "draft">(
		"draft",
	);
	const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
	const [pendingValues, setPendingValues] = useState<PostFormValues | null>(
		null,
	);

	const form = useForm<PostFormValues>({
		// biome-ignore lint/suspicious/noExplicitAny: Zod 4 type compatibility with hookform resolvers
		resolver: zodResolver(CreatePostSchema as any),
		defaultValues: {
			id: post?.id || "",
			title: post?.title || "",
			slug: post?.slug || "",
			body: post?.body || "",
			tags: post?.tags.join(", ") || "",
			published: post ? (post.published ? "true" : "false") : "false",
		},
		mode: "onChange",
	});

	const {
		register,
		watch,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting, isDirty },
	} = form;

	// Watch values for auto-save
	const watchedValues = watch();

	// Auto-generate slug from title
	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === "title" && !form.formState.dirtyFields.slug) {
				const title = value.title || "";
				const slug = title
					.toLowerCase()
					.trim()
					.replace(/[^a-z0-9\s-]/g, "")
					.replace(/\s+/g, "-")
					.replace(/-+/g, "-");
				setValue("slug", slug, { shouldValidate: true });
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, setValue, form.formState.dirtyFields.slug]);

	// Auto-save logic
	useEffect(() => {
		if (!isDirty) return;

		const doAutoSave = async () => {
			// Validate first before auto-saving
			const isValid = await form.trigger();
			if (!isValid) return;

			setIsAutoSaving(true);
			const values = form.getValues();
			const formData = buildFormData(values);

			// Auto-save uses the current published state, never publishes a draft implicitly
			if (values.published) formData.append("published", values.published);

			// Call server action directly for auto-save
			const result = await autoSavePost({ success: false }, formData);

			setIsAutoSaving(false);

			if (result.success && result.id) {
				setLastSaved(new Date());

				// If it's a new post, update the ID in the form and the URL without a hard refresh
				if (!values.id) {
					setValue("id", result.id);
					window.history.replaceState({}, "", `/admin/posts/${result.id}/edit`);
				}
			}
		};

		const timer = setTimeout(doAutoSave, 2000); // 2 second debounce

		return () => clearTimeout(timer);
	}, [isDirty, form, setValue]);

	const executeSave = async (values: PostFormValues, isPublishing: boolean) => {
		const formData = buildFormData(values);

		// Set published status explicitly based on action
		const publishedStatus = isPublishing ? "true" : "false";
		formData.append("published", publishedStatus);
		setValue("published", publishedStatus);

		const result = await savePost({ success: false }, formData);

		if (!result.success) {
			toast.error(result.errors?._form?.[0] || "Failed to save post");
		} else {
			toast.success(isPublishing ? "Post published!" : "Draft saved");
		}
	};

	const onSubmit = async (values: PostFormValues) => {
		if (submitAction === "publish") {
			setPendingValues(values);
			setIsPublishModalOpen(true);
		} else {
			await executeSave(values, false);
		}
	};

	const confirmPublish = async () => {
		if (pendingValues) {
			await executeSave(pendingValues, true);
		}
		setIsPublishModalOpen(false);
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
				<input type="hidden" {...register("id")} />
				<input type="hidden" {...register("published")} />

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
						type="text"
						{...register("title")}
						placeholder="My moonlit post"
						className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
					/>
					<FieldError message={errors.title?.message} />
				</div>

				{/* Slug */}
				<div>
					<label
						htmlFor="admin-slug"
						className="mb-1 block text-xs font-medium text-zinc-400"
					>
						Slug{" "}
						<span className="text-zinc-600">(auto-generated, editable)</span>
					</label>
					<input
						id="admin-slug"
						type="text"
						{...register("slug")}
						placeholder="my-moonlit-post"
						className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
					/>
					<FieldError message={errors.slug?.message} />
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
						rows={10}
						{...register("body")}
						placeholder="Write your post here…"
						className="min-h-50 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
					/>
					<FieldError message={errors.body?.message} />
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
						type="text"
						{...register("tags")}
						placeholder="tech, personal, nextjs"
						className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
					/>
					<p className="mt-1.5 text-xs text-zinc-500 sm:mt-1">
						Comma-separated, e.g. tech, personal
					</p>
					<FieldError message={errors.tags?.message} />
				</div>

				{/* Two Actions Workflow */}
				<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<button
							type="submit"
							onClick={() => setSubmitAction("publish")}
							disabled={isSubmitting}
							className="min-h-11 rounded-xl bg-white px-6 text-sm font-semibold text-black transition-all duration-200 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Publish
						</button>
						<button
							type="submit"
							onClick={() => setSubmitAction("draft")}
							disabled={isSubmitting}
							className="min-h-11 rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Save as Draft
						</button>
						{watchedValues.id && watchedValues.slug && (
							<a
								href={`/blog/${watchedValues.slug}`}
								target="_blank"
								rel="noreferrer"
								className="min-h-11 inline-flex items-center justify-center rounded-xl border border-white/15 bg-transparent px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
							>
								Preview
							</a>
						)}
					</div>
					<Link
						href="/admin/posts"
						className="text-center text-sm text-zinc-500 hover:text-white sm:text-right"
					>
						Cancel
					</Link>
				</div>

				{/* Autosave status */}
				<div
					className="h-4 text-center text-xs text-zinc-500"
					aria-live="polite"
				>
					{isAutoSaving
						? "Saving draft..."
						: lastSaved
							? `Draft saved at ${lastSaved.toLocaleTimeString()}`
							: null}
				</div>
			</form>

			<AlertDialog
				open={isPublishModalOpen}
				onOpenChange={setIsPublishModalOpen}
			>
				<AlertDialogContent className="border-white/10 bg-[#0d1526] text-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Ready to publish?</AlertDialogTitle>
						<AlertDialogDescription className="text-zinc-400">
							You are about to publish "{pendingValues?.title || "this post"}".
							Are you ready for this to go live?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/5">
							Review again
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmPublish}
							className="bg-white text-black hover:bg-zinc-200"
						>
							Yes, publish it
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
