"use client";

import Link from "next/link";
import { useState } from "react";
import {
	addComment,
	bulkApproveComments,
	bulkDeleteComments,
	toggleCommentApproval,
} from "@/lib/actions";

type CommentWithPost = {
	id: string;
	authorName: string;
	body: string;
	approved: boolean;
	createdAt: Date;
	post: { id: string; title: string; slug: string };
};

export default function AdminCommentList({
	initialComments,
}: {
	initialComments: CommentWithPost[];
}) {
	const [comments, setComments] = useState(initialComments);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [filterStatus, setFilterStatus] = useState<
		"all" | "pending" | "approved"
	>("all");
	const [filterPost, setFilterPost] = useState<string>("all");
	const [replyingTo, setReplyingTo] = useState<string | null>(null);

	// Get unique posts for filter dropdown
	const uniquePosts = Array.from(
		new Map(comments.map((c) => [c.post.slug, c.post])).values(),
	);

	const filteredComments = comments.filter((c) => {
		if (filterStatus === "pending" && c.approved) return false;
		if (filterStatus === "approved" && !c.approved) return false;
		if (filterPost !== "all" && c.post.slug !== filterPost) return false;
		return true;
	});

	const toggleSelection = (id: string) => {
		const newSet = new Set(selectedIds);
		if (newSet.has(id)) newSet.delete(id);
		else newSet.add(id);
		setSelectedIds(newSet);
	};

	const selectAll = () => {
		if (selectedIds.size === filteredComments.length) {
			setSelectedIds(new Set());
		} else {
			setSelectedIds(new Set(filteredComments.map((c) => c.id)));
		}
	};

	const handleBulkApprove = async () => {
		if (selectedIds.size === 0) return;
		const ids = Array.from(selectedIds);

		setComments(
			comments.map((c) => (ids.includes(c.id) ? { ...c, approved: true } : c)),
		);
		setSelectedIds(new Set());
		try {
			await bulkApproveComments(ids);
		} catch {
			alert("Bulk approve failed");
		}
	};

	const handleBulkDelete = async () => {
		if (
			selectedIds.size === 0 ||
			!confirm(`Delete ${selectedIds.size} comments?`)
		)
			return;
		const ids = Array.from(selectedIds);

		setComments(comments.filter((c) => !ids.includes(c.id)));
		setSelectedIds(new Set());
		try {
			await bulkDeleteComments(ids);
		} catch {
			alert("Bulk delete failed");
		}
	};

	const handleToggleApprove = async (id: string, current: boolean) => {
		setComments(
			comments.map((c) => (c.id === id ? { ...c, approved: !current } : c)),
		);
		try {
			await toggleCommentApproval(id, current);
		} catch {
			alert("Toggle failed");
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Delete this comment?")) return;
		setComments(comments.filter((c) => c.id !== id));
		try {
			await bulkDeleteComments([id]);
		} catch {
			alert("Delete failed");
		}
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Filters & Bulk Actions */}
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="flex flex-1 items-center gap-3">
					<select
						value={filterStatus}
						onChange={(e) =>
							setFilterStatus(e.target.value as "all" | "approved" | "pending")
						}
						className="rounded-xl border border-white/10 bg-[#0d1526] px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/20"
					>
						<option value="all">All Status</option>
						<option value="pending">Pending</option>
						<option value="approved">Approved</option>
					</select>
					<select
						value={filterPost}
						onChange={(e) => setFilterPost(e.target.value)}
						className="max-w-50 rounded-xl border border-white/10 bg-[#0d1526] px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/20"
					>
						<option value="all">All Posts</option>
						{uniquePosts.map((p) => (
							<option key={p.slug} value={p.slug}>
								{p.title}
							</option>
						))}
					</select>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-sm text-zinc-500">
						{selectedIds.size} selected
					</span>
					<button
						type="button"
						onClick={handleBulkApprove}
						disabled={selectedIds.size === 0}
						className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-white transition-colors hover:bg-white/15 disabled:opacity-50 sm:min-h-9"
					>
						Approve
					</button>
					<button
						type="button"
						onClick={handleBulkDelete}
						disabled={selectedIds.size === 0}
						className="min-h-11 rounded-lg border border-red-500/20 bg-red-500/10 px-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50 sm:min-h-9"
					>
						Delete
					</button>
				</div>
			</div>

			{/* Comments List */}
			{filteredComments.length === 0 ? (
				<p className="text-zinc-500">No comments found.</p>
			) : (
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-3 px-2">
						<input
							type="checkbox"
							checked={
								selectedIds.size === filteredComments.length &&
								filteredComments.length > 0
							}
							onChange={selectAll}
							className="h-4 w-4 rounded border-white/20 bg-white/10 accent-white"
						/>
						<span className="text-sm text-zinc-400">Select all</span>
					</div>

					<ul className="flex flex-col gap-4">
						{/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: UI component structure is complex */}
						{filteredComments.map((comment) => (
							<li
								key={comment.id}
								className={`card-glass flex flex-col gap-3 rounded-2xl border ${
									selectedIds.has(comment.id)
										? "border-white/30"
										: "border-white/10"
								} px-5 py-5 transition-colors`}
							>
								<div className="flex items-start gap-3">
									<input
										type="checkbox"
										checked={selectedIds.has(comment.id)}
										onChange={() => toggleSelection(comment.id)}
										className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-white/10 accent-white"
									/>
									<div className="flex w-full flex-col gap-3">
										{/* Meta Header */}
										<div className="flex flex-wrap items-center gap-x-4 gap-y-1">
											<span className="text-sm font-semibold text-white">
												{comment.authorName}
											</span>
											<span
												className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
													comment.approved
														? "bg-green-500/15 text-green-400"
														: "bg-amber-500/15 text-amber-400"
												}`}
											>
												{comment.approved ? "Approved" : "Pending"}
											</span>
											<Link
												href={`/blog/${comment.post.slug}`}
												className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
											>
												→ {comment.post.title}
											</Link>
											<time
												dateTime={comment.createdAt.toISOString()}
												className="ml-auto text-xs text-zinc-600"
											>
												{new Date(comment.createdAt).toLocaleDateString()}
											</time>
										</div>

										{/* Body */}
										<p className="wrap-break-word text-sm font-light leading-relaxed text-zinc-300">
											{comment.body}
										</p>

										{/* Actions & Reply Form */}
										<div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() =>
														handleToggleApprove(comment.id, comment.approved)
													}
													className="min-h-9 rounded border border-white/10 bg-white/5 px-3 text-xs font-medium text-white transition-colors hover:bg-white/15"
												>
													{comment.approved ? "Unapprove" : "Approve"}
												</button>
												<button
													type="button"
													onClick={() => handleDelete(comment.id)}
													className="min-h-9 rounded border border-white/10 bg-white/5 px-3 text-xs font-medium text-red-400 transition-colors hover:bg-white/15"
												>
													Delete
												</button>
												<button
													type="button"
													onClick={() =>
														setReplyingTo(
															replyingTo === comment.id ? null : comment.id,
														)
													}
													className="min-h-9 rounded border border-white/10 bg-white/5 px-3 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/15"
												>
													{replyingTo === comment.id ? "Cancel Reply" : "Reply"}
												</button>
											</div>
										</div>

										{/* Inline Reply Form */}
										{replyingTo === comment.id && (
											<form
												className="mt-3 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
												action={async (formData) => {
													const res = await addComment(
														{ success: false },
														formData,
													);
													if (res.success) {
														setReplyingTo(null);
														alert("Reply posted successfully.");
														// Force a refresh or optimism here, but reloading is simpler for now
														window.location.reload();
													} else {
														alert(
															res.errors?._form?.[0] || "Failed to post reply.",
														);
													}
												}}
											>
												<input
													type="hidden"
													name="postId"
													value={comment.post.id}
												/>
												<input
													type="hidden"
													name="slug"
													value={comment.post.slug}
												/>
												<input type="hidden" name="authorName" value="Admin" />
												<textarea
													name="body"
													required
													rows={3}
													placeholder="Write your reply as Admin..."
													className="w-full resize-y rounded border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
												/>
												<div className="flex justify-end">
													<button
														type="submit"
														className="min-h-9 rounded bg-white/15 px-4 text-xs font-medium text-white transition-colors hover:bg-white/25"
													>
														Post Reply
													</button>
												</div>
											</form>
										)}
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
